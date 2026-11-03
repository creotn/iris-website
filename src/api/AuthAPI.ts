import { apiRequest, clearAccessToken, setAccessToken, type ApiResult } from "@/lib/api/client";

export type RegisterInput = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
};

export async function signIn(identifier: string, password: string): Promise<ApiResult> {
  const trimmed = identifier.replaceAll(" ", "");
  if (!trimmed) return { ok: false, error: "invalid_email" };
  if (!password.trim()) return { ok: false, error: "invalid_password" };

  const result = await apiRequest<AuthSignInResponse>("/auth/customer-signin", {
    method: "POST",
    body: { identifier: trimmed, password: password.trim() },
    credentials: true,
  });
  if (!result.ok) return result;

  setAccessToken(result.data.access_token);
  return { ok: true, data: null };
}

export async function register(input: RegisterInput): Promise<ApiResult> {
  const result = await apiRequest("/auth/customer-register", { method: "POST", body: input });
  if (!result.ok) return result;

  await sendOtp(input.email);
  return result;
}

export const sendOtp = (identifier: string) =>
  apiRequest("/auth/send-otp", { method: "POST", body: { identifier: identifier.trim() } });

export function verifyPhone(identifier: string, otp: string): Promise<ApiResult> {
  if (!/^\d{4}$/.test(otp)) return Promise.resolve({ ok: false, error: "invalid_otp" });
  return apiRequest("/auth/verify-phone", { method: "POST", body: { identifier: identifier.trim(), otp } });
}

export const requestPasswordReset = (identifier: string) =>
  apiRequest("/auth/forgot-password", { method: "POST", body: { identifier: identifier.trim().toLowerCase() } });

export const validateResetCode = (identifier: string, otp: string) =>
  apiRequest("/auth/validate-otp", {
    method: "POST",
    body: { identifier: identifier.trim().toLowerCase(), otp },
  });

export const resetPassword = (identifier: string, newPassword: string) =>
  apiRequest("/auth/reset-password", {
    method: "POST",
    body: { identifier: identifier.trim().toLowerCase(), newPassword },
  });

export async function signOut(): Promise<void> {
  await apiRequest("/auth/signout", { method: "POST", auth: true, credentials: true });
  clearAccessToken();
}

export type CustomerProfile = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: { address: string; latitude: number; longitude: number } | null;
};

export async function fetchProfile(): Promise<ApiResult<CustomerProfile>> {
  const result = await apiRequest<CustomerProfile | { user: CustomerProfile }>("/customers/me", {
    auth: true,
  });
  if (!result.ok) return result;
  const data = result.data;
  return { ok: true, data: "user" in data ? data.user : data };
}
