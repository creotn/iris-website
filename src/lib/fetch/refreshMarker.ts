/**
 * Set for one hop when a refresh fails transiently (5xx, timeout) so the proxy doesn't redirect
 * straight back and loop. Shared by the refresh route handler and the proxy.
 */
export const REFRESH_ATTEMPTED_COOKIE = "ehy_rt_tried";

/** Long enough for one render, short enough that the next navigation retries. */
export const REFRESH_ATTEMPTED_MAX_AGE = 10;
