"use server";

import { z } from "zod";
import type { RequestError } from "@/types/global";
import { cookies } from "next/headers";
import { httpClientPost } from "@/lib/fetch/httpClient";
import {
  apiSessionCookieHeader,
  clearSessionCookie,
  relayApiSessionCookie,
} from "@/lib/fetch/sessionCookie";
import {
  LEGACY_REFRESH_COOKIE,
  sessionCookieName,
} from "@/lib/fetch/sessionCookieName";

const signInSchema = z.object({
  identifier: z
    .string()
    .trim()
    .min(1, { error: "invalid_email" })
    .transform((value) => value.replaceAll(" ", "")),
  password: z.string().trim().min(1, { error: "invalid_password" }),
});

// Network/timeout failures (or a malformed error body) carry no parsed errorBody — reconstruct the
// same generic shape a thrown request would have produced.
function toRequestError(response: ApiResponse): RequestError {
  return (
    (response.errorBody as RequestError) ?? {
      statusCode: response.statusCode ?? 500,
      message: response.errorCode ?? "general_error",
      error: "Internal Server Error",
    }
  );
}

export async function SignInAction(
  previousState: unknown,
  formData: FormData,
): Promise<AuthSignInResponse | RequestError | null> {
  const parsed = signInSchema.safeParse({
    identifier: formData.get("identifier"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      statusCode: 400,
      message: parsed.error.issues[0]?.message ?? "invalid_input",
      error: "Bad Request",
    };
  }

  let apiSetCookie: string[] = [];
  const response = await httpClientPost<AuthSignInResponse>(
    `${process.env.API_URL}/v1/api/auth/customer-signin`,
    parsed.data,
    { onSetCookie: (lines) => (apiSetCookie = lines) },
  );

  if (!response.success || !response.data) return toRequestError(response);

  const data = response.data;
  const cookieStore = await cookies();

  cookieStore.set("access_token", data.access_token, {
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    path: "/",
    httpOnly: true,
  });

  // The body's `refresh_token` is deliberately ignored — the session is relayed from the
  // API's own Set-Cookie instead, so the credential never passes through the browser.
  await relayApiSessionCookie(apiSetCookie);
  cookieStore.delete(LEGACY_REFRESH_COOKIE);

  cookieStore.set("user", JSON.stringify(data.user), {
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
    path: "/",
    httpOnly: true,
  });

  return data;
}

export async function SignOutAction() {
  const cookieStore = await cookies();
  const session = cookieStore.get(sessionCookieName())?.value;
  const legacy = cookieStore.get(LEGACY_REFRESH_COOKIE)?.value;

  if (session || legacy) {
    // Not `requiresAuth`: that would 401 without calling the API once the access token is gone,
    // skipping the revocation this action exists for. The bearer is attached by hand instead.
    const accessToken = cookieStore.get("access_token")?.value;
    await httpClientPost(
      `${process.env.API_URL}/v1/api/auth/signout`,
      legacy ? { refresh_token: legacy } : {},
      {
        headers: {
          ...(session ? { Cookie: apiSessionCookieHeader(session) } : {}),
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
      },
    );
  }

  // Unconditional: the visitor asked to leave, so an unreachable API must not leave them signed in.
  await clearSessionCookie();
  cookieStore.delete("access_token");
  cookieStore.delete(LEGACY_REFRESH_COOKIE);
  cookieStore.delete("user");
}
