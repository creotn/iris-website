/**
 * Server-side token extraction from httpOnly cookies
 * Safe for use in Server Actions and API routes only
 */

import { cookies } from "next/headers";
import { sessionCookieName } from "./sessionCookie";

/**
 * Get the access token from httpOnly cookies
 * Safe to use only in server-side contexts (Server Actions, Route Handlers, etc.)
 *
 * @throws {Error} If called outside server context
 * @returns {Promise<string | null>} Access token or null if not found/expired
 *
 * @example
 * const token = await getAuthToken();
 * if (!token) {
 *   // User not authenticated
 *   return null;
 * }
 */
export async function getAuthToken(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token");

    if (!token?.value) {
      return null;
    }

    // Basic validation: token should not be empty
    if (token.value.trim().length === 0) {
      return null;
    }

    return token.value;
  } catch (error) {
    // If cookies() is called outside server context, it will throw
    // Return null gracefully instead of propagating error
    console.debug(
      "Error retrieving auth token:",
      error instanceof Error ? error.message : "Unknown error",
    );
    return null;
  }
}

/**
 * Get the refresh token from httpOnly cookies
 * Used for token refresh operations by Server Actions
 *
 * Reads the website's own relayed session cookie (the API's refresh token, re-issued under
 * `sessionCookieName()` since the API's cookie is scoped to a different host).
 *
 * @throws {Error} If called outside server context
 * @returns {Promise<string | null>} Refresh token or null if not found
 */
export async function getRefreshToken(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(sessionCookieName());

    if (!token?.value) {
      return null;
    }

    if (token.value.trim().length === 0) {
      return null;
    }

    return token.value;
  } catch (error) {
    console.debug(
      "Error retrieving refresh token:",
      error instanceof Error ? error.message : "Unknown error",
    );
    return null;
  }
}
