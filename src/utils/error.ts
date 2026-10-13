export const errorsMap = {
  // The abort fired but the request may have already landed — distinct from network_error (which
  // never reached the API at all) so the copy doesn't tell a user "nothing happened" when it might have.
  request_timeout: {
    en: "The request took too long — please check before trying again",
    ar: "استغرق الطلب وقتًا طويلاً — يرجى التحقق قبل المحاولة مرة أخرى",
  },
  network_error: {
    en: "Couldn't reach the server — check your connection and try again",
    ar: "تعذّر الوصول إلى الخادم — تحقق من اتصالك وحاول مرة أخرى",
  },
  user_not_found: {
    en: "User not found",
    ar: "المستخدم غير موجود",
  },
  invalid_credentials: {
    en: "Email or password is incorrect",
    ar: "البريد الإلكتروني أو كلمة المرور غير صحيحة",
  },
  user_not_authenticated: {
    en: "Access denied, please login",
    ar: "الوصول مرفوض، يرجى تسجيل الدخول",
  },
  permission_denied: {
    en: "You do not have permission to perform this action",
    ar: "ليس لديك الإذن لأداء هذا الإجراء",
  },
  invalid_refresh_token: {
    en: "Invalid refresh token",
    ar: "رمز التحديث غير صالح",
  },
  invalid_email: {
    en: "The email is invalid",
    ar: "البريد الإلكتروني غير صالح",
  },
  invalid_password: {
    en: "The password is invalid",
    ar: "كلمة المرور غير صالحة",
  },
  session_expired: {
    en: "Session expired, please login again",
    ar: "انتهت الجلسة، يرجى تسجيل الدخول مرة أخرى",
  },
  session_revoked: {
    en: "Your session ended, please sign in again",
    ar: "انتهت جلستك، يرجى تسجيل الدخول مرة أخرى",
  },
  session_refresh_unavailable: {
    en: "Something went wrong, please try again",
    ar: "حدث خطأ ما، الرجاء المحاولة مرة أخرى",
  },
  csrf_token_invalid: {
    en: "Your session ended, please sign in again",
    ar: "انتهت جلستك، يرجى تسجيل الدخول مرة أخرى",
  },
  internal_server_error: {
    en: "An error occurred, please try again later",
    ar: "حدث خطأ، يرجى المحاولة مرة أخرى لاحقاً",
  },
  bad_request: {
    en: "Bad request",
    ar: "طلب غير صالح",
  },
  not_found: {
    en: "The requested resource was not found",
    ar: "لم يتم العثور على المورد المطلوب",
  },
  invalid_input: {
    en: "Invalid input",
    ar: "إدخال غير صالح",
  },
} satisfies Record<string, { en: string; ar: string }>;

export const translateError = (error: string, locale: Locale): string => {
  if (Object.hasOwn(errorsMap, error))
    return errorsMap[error as keyof typeof errorsMap][locale];

  return locale === "en"
    ? "Something went wrong, please try again"
    : "حدث خطأ ما، الرجاء المحاولة مرة أخرى";
};
