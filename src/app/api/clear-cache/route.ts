import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

const PROJECT_PATHS: [string, "page" | "layout"][] = [["/[locale]", "page"]];

export async function POST(request: NextRequest) {
  const secret = process.env.CACHE_REVALIDATE_SECRET;
  if (secret && request.headers.get("x-cache-secret") !== secret) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid JSON body" }, { status: 400 });
  }

  const { tag, tags } = (body ?? {}) as { tag?: unknown; tags?: unknown };
  const requested = [
    ...(typeof tag === "string" ? [tag] : []),
    ...(Array.isArray(tags) ? tags.filter((t): t is string => typeof t === "string") : []),
  ].filter(Boolean);

  if (requested.length === 0) {
    return NextResponse.json(
      { error: "expected a `tag` string or a `tags` string array" },
      { status: 400 },
    );
  }

  for (const t of requested) revalidateTag(t, "max");

  const revalidatedPaths: string[] = [];
  if (requested.includes("projects-public")) {
    for (const [path, type] of PROJECT_PATHS) {
      revalidatePath(path, type);
      revalidatedPaths.push(`${path} (${type})`);
    }
  }

  console.log(
    `[clear-cache] revalidated tags=[${requested.join(", ")}] paths=[${revalidatedPaths.join(", ")}]`,
  );

  return NextResponse.json({
    success: true,
    revalidated: { tags: requested, paths: revalidatedPaths },
  });
}
