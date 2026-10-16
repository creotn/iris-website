// Next requires this file directly at runtime (dynamic import of a file:// URL) and calls `new` on
// `mod.default || mod`, so it is CommonJS at the repo root rather than TypeScript under src/ — the
// app build never processes it. A named-only export makes every request 500.
//
// Next constructs a handler PER REQUEST, so everything long-lived is module scope. A client built
// in the constructor would open one connection per request.
//
// Design notes that are not obvious from the code:
//   - No in-process cache of entry values. A local LRU in front of the store would serve entries
//     another replica already purged, which is the exact bug this file exists to remove.
//   - `get`/`set` never reject; `revalidateTag` does. A read that cannot reach the store must
//     degrade silently or an outage becomes a site outage, but a purge that was not recorded must
//     not be reported as successful.

const fs = require("node:fs");
const path = require("node:path");
const Redis = require("ioredis");

const OP_TIMEOUT_MS = 250;
const GRACE_SECONDS = 86_400;
const MAX_REVALIDATE_SECONDS = 86_400;
const TAG_MARKER_TTL_SECONDS = 30 * 86_400;
const MAX_ENTRY_BYTES = 1_048_576;
const LOCAL_MAX_ENTRIES = 500;

const status = {
  mode: "local",
  connected: false,
  primary: null,
  lastTransitionAt: null,
  lastErrorCode: null,
};
globalThis.__irisCacheStatus = status;

function log(level, message) {
  const line = `[${new Date().toISOString()}] [CACHE] [${level.toUpperCase()}] ${message}`;
  if (level === "error") process.stderr.write(`${line}\n`);
  else process.stdout.write(`${line}\n`);
}

function transition(connected, errorCode) {
  if (status.connected !== connected) {
    status.lastTransitionAt = new Date().toISOString();
    log(connected ? "info" : "warn", connected ? "store connected" : "store connection lost");
  }
  status.connected = connected;
  // Keep the last known code while disconnected — `end` fires after `error` and would otherwise
  // erase the only clue an operator has.
  status.lastErrorCode = connected ? null : errorCode || status.lastErrorCode;
}

function errorCodeOf(err) {
  return (err && (err.code || err.name)) || "EUNKNOWN";
}

function parseSentinels(raw) {
  return String(raw || "")
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => {
      const [host, port] = entry.split(":");
      return { host, port: Number(port) || 26379 };
    });
}

function buildClient() {
  const sentinels = parseSentinels(process.env.REDIS_SENTINELS);
  if (sentinels.length === 0) return null;

  // The API accepts either spelling and its production config sets both; reading only one would
  // find no master on a deployment that set the other.
  const name = process.env.REDIS_SENTINEL_NAME || process.env.REDIS_MASTER_NAME;
  if (!name) {
    log("warn", "REDIS_SENTINELS set but no master-set name; caching locally");
    return null;
  }

  const client = new Redis({
    sentinels,
    name,
    ...(process.env.REDIS_PASSWORD ? { password: process.env.REDIS_PASSWORD } : {}),
    // Authenticates against the sentinels, not the master — a separate credential.
    ...(process.env.REDIS_SENTINEL_PASSWORD
      ? { sentinelPassword: process.env.REDIS_SENTINEL_PASSWORD }
      : {}),
    // Without this, commands queue while disconnected and OP_TIMEOUT_MS becomes the only thing
    // bounding a render; with it a disconnected client rejects at once and we fall through.
    enableOfflineQueue: false,
    lazyConnect: true,
    maxRetriesPerRequest: 1,
  });

  client.on("ready", () => {
    // The resolved peer, not `options.host` — under Sentinel that stays at its default and would
    // report a node we are not talking to. This updates on the reconnect that follows a failover.
    const socket = client.stream;
    status.primary = socket ? `${socket.remoteAddress}:${socket.remotePort}` : null;
    transition(true, null);
  });
  client.on("error", (err) => transition(false, errorCodeOf(err)));
  client.on("end", () => transition(false, status.lastErrorCode));
  client.on("+failover-end", () => log("warn", "store failover completed"));

  // Never awaited: a replica must become ready even when the store is unreachable at start-up.
  client.connect().catch((err) => transition(false, errorCodeOf(err)));

  status.mode = "shared";
  return client;
}

const client = buildClient();

const localEntries = new Map();

function localGet(key) {
  const hit = localEntries.get(key);
  if (!hit) return null;
  if (hit.expiresAt <= Date.now()) {
    localEntries.delete(key);
    return null;
  }
  return { lastModified: hit.lastModified, value: hit.value };
}

function localSet(key, value, tags, ttlSeconds) {
  if (localEntries.size >= LOCAL_MAX_ENTRIES) {
    localEntries.delete(localEntries.keys().next().value);
  }
  localEntries.set(key, {
    value,
    tags,
    lastModified: Date.now(),
    expiresAt: Date.now() + ttlSeconds * 1000,
  });
}

function siteSegment() {
  return "iris";
}

let cachedBuildId = null;

function buildId(serverDistDir) {
  if (cachedBuildId) return cachedBuildId;
  if (serverDistDir) {
    try {
      cachedBuildId = fs
        .readFileSync(path.join(serverDistDir, "..", "BUILD_ID"), "utf8")
        .trim();
    } catch {
      cachedBuildId = null;
    }
  }
  cachedBuildId = cachedBuildId || process.env.CACHE_BUILD_ID || "dev";
  return cachedBuildId;
}

// The prefix is built into the key rather than handed to ioredis's `keyPrefix`, which is invisible
// to SCAN and so would make keyspace verification lie. The API hit the same option's sharp edge
// with BullMQ and had to strip it back out.
function namespace(serverDistDir) {
  return `${process.env.REDIS_KEY_PREFIX || ""}${siteSegment()}:${buildId(serverDistDir)}`;
}

function withTimeout(promise) {
  let timer;
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      timer = setTimeout(() => reject(new Error("cache_timeout")), OP_TIMEOUT_MS);
    }),
  ]).finally(() => clearTimeout(timer));
}

// `revalidate: false` means "cache indefinitely" and Next treats it as cacheable, so it must not be
// refused — but FR-005 requires every entry to expire, so it is capped like any other.
function ttlFor(revalidate) {
  if (revalidate === false) return MAX_REVALIDATE_SECONDS + GRACE_SECONDS;
  if (typeof revalidate !== "number" || !(revalidate > 0)) return null;
  return Math.min(revalidate, MAX_REVALIDATE_SECONDS) + GRACE_SECONDS;
}

let fileSystemCache;

// A custom handler replaces Next's on-disk read, so without this the prerendered HTML produced at
// build time is never served and every deploy re-renders those routes on demand.
function getFileSystemCache(ctx) {
  if (fileSystemCache !== undefined) return fileSystemCache;
  try {
    const FileSystemCache = require("next/dist/server/lib/incremental-cache/file-system-cache")
      .default;
    fileSystemCache = new FileSystemCache({ ...ctx, maxMemoryCacheSize: 0 });
  } catch {
    log("warn", "prerender seed unavailable: FileSystemCache could not be loaded");
    fileSystemCache = null;
  }
  return fileSystemCache;
}

module.exports = class CacheHandler {
  constructor(ctx) {
    this.ctx = ctx || {};
    this.ns = namespace(this.ctx.serverDistDir);
  }

  entryKey(cacheKey) {
    return `${this.ns}:e:${cacheKey}`;
  }

  tagKey(tag) {
    return `${this.ns}:t:${tag}`;
  }

  async get(cacheKey, ctx) {
    const entry = client ? await this.sharedGet(cacheKey, ctx) : localGet(this.entryKey(cacheKey));
    if (entry) return entry;

    const seed = getFileSystemCache(this.ctx);
    if (!seed) return null;
    try {
      return await seed.get(cacheKey, ctx);
    } catch {
      return null;
    }
  }

  async sharedGet(cacheKey, ctx) {
    try {
      const raw = await withTimeout(client.get(this.entryKey(cacheKey)));
      if (!raw) return null;

      const entry = JSON.parse(raw);
      // softTags arrive on the read and are not on the entry, which is why invalidation is a
      // timestamp comparison rather than a delete-by-index.
      const tags = [
        ...new Set([...(entry.tags || []), ...((ctx && ctx.tags) || []), ...((ctx && ctx.softTags) || [])]),
      ];
      if (tags.length > 0) {
        const markers = await withTimeout(client.mget(tags.map((tag) => this.tagKey(tag))));
        const invalidated = markers.some(
          (marker) => marker && Number(marker) >= (entry.lastModified || Date.now()),
        );
        if (invalidated) return null;
      }
      return { lastModified: entry.lastModified, value: entry.value };
    } catch {
      return null;
    }
  }

  async set(cacheKey, data, ctx) {
    const revalidate = ctx && ctx.revalidate;
    const ttl = ttlFor(revalidate);
    // Per-visitor reads carry revalidate 0 and Next never offers them here; this is the last of
    // three independent layers keeping them out of a store shared across replicas.
    if (ttl === null) return;

    const tags = (ctx && ctx.tags) || [];
    const payload = JSON.stringify({ value: data, lastModified: Date.now(), tags });
    if (Buffer.byteLength(payload) > MAX_ENTRY_BYTES) return;

    if (!client) {
      localSet(this.entryKey(cacheKey), data, tags, ttl);
      return;
    }
    try {
      await withTimeout(client.set(this.entryKey(cacheKey), payload, "EX", ttl));
    } catch {
      // Swallowed on purpose: a write that cannot reach the store is a missed optimisation, and
      // failing the render instead would turn a store outage into a site outage.
    }
  }

  async revalidateTag(tags) {
    const list = (Array.isArray(tags) ? tags : [tags]).filter(Boolean);
    if (list.length === 0) return;

    if (!client) {
      for (const [key, entry] of localEntries) {
        if ((entry.tags || []).some((tag) => list.includes(tag))) localEntries.delete(key);
      }
      return;
    }

    // Alone among the three methods this rethrows: the platform must not be told a purge succeeded
    // when it was never recorded. The marker outlives every entry it governs by design.
    try {
      const now = Date.now();
      const pipeline = client.pipeline();
      for (const tag of list) {
        pipeline.set(this.tagKey(tag), String(now), "EX", TAG_MARKER_TTL_SECONDS);
      }
      // `exec` resolves with per-command [error, result] tuples rather than rejecting, so a purge
      // against a disconnected store would otherwise look like a success.
      const results = await withTimeout(pipeline.exec());
      if (!results) throw new Error("purge_not_recorded");
      const failure = results.find(([commandError]) => commandError);
      if (failure) throw failure[0];
      log("info", `purged tags=[${list.join(", ")}]`);
    } catch (err) {
      log("error", `purge FAILED tags=[${list.join(", ")}] reason=${err && err.message}`);
      throw err;
    }
  }

  resetRequestCache() {}
};
