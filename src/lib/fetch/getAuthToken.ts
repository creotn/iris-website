import { cookies } from "next/headers";
import { sessionCookieName } from "./sessionCookie";

export async function getAuthToken(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("iris_token");

    if (!token?.value) {
      return null;
    }

    if (token.value.trim().length === 0) {
      return null;
    }

    return token.value;
  } catch (error) {
    console.debug(
      "Error retrieving auth token:",
      error instanceof Error ? error.message : "Unknown error",
    );
    return null;
  }
}

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
