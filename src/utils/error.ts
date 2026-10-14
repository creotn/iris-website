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
  slot_not_available: {
    en: "That time was just taken — pick another",
    ar: "هذا الوقت حُجز للتو — اختر وقتًا آخر",
  },
  area_not_found: {
    en: "Your address is outside our coverage",
    ar: "عنوانك خارج نطاق التغطية",
  },
  vehicle_not_found: {
    en: "Car not found — add it again",
    ar: "لم يتم العثور على السيارة — أضفها من جديد",
  },
  variable_not_found: {
    en: "That option is no longer available",
    ar: "هذا الخيار لم يعد متاحًا",
  },
  variable_not_selectable: {
    en: "That option is no longer available",
    ar: "هذا الخيار لم يعد متاحًا",
  },
  service_not_found: {
    en: "That service is no longer available",
    ar: "هذه الخدمة لم تعد متاحة",
  },
  service_requires_variable_selection: {
    en: "Choose an option for this service",
    ar: "اختر أحد خيارات هذه الخدمة",
  },
  service_not_priced: {
    en: "This service has no price yet",
    ar: "هذه الخدمة بلا سعر حاليًا",
  },
  booking_line_invalid_reference: {
    en: "The selection is invalid — try again",
    ar: "الاختيار غير صالح — حاول مرة أخرى",
  },
  discount_not_found: {
    en: "This code is not valid",
    ar: "هذا الرمز غير صالح",
  },
  discount_inactive: {
    en: "This code is no longer active",
    ar: "هذا الرمز لم يعد فعّالًا",
  },
  discount_expired: {
    en: "This code has expired",
    ar: "انتهت صلاحية هذا الرمز",
  },
  discount_scope_not_applicable: {
    en: "This code doesn't apply to this booking",
    ar: "هذا الرمز لا ينطبق على هذا الحجز",
  },
  discount_total_uses_exhausted: {
    en: "This code has reached its usage limit",
    ar: "استُنفد الحد الأقصى لاستخدام هذا الرمز",
  },
  discount_per_user_limit_reached: {
    en: "You've already used this code the maximum number of times",
    ar: "لقد استخدمت هذا الرمز الحد الأقصى المسموح",
  },
  booking_not_found: {
    en: "Booking not found",
    ar: "لم يتم العثور على الحجز",
  },
  booking_already_paid: {
    en: "This booking is already paid",
    ar: "تم دفع هذا الحجز بالفعل",
  },
  booking_cannot_be_paid: {
    en: "This booking can't be paid right now",
    ar: "لا يمكن دفع هذا الحجز حاليًا",
  },
  booking_nothing_to_pay: {
    en: "Nothing is due on this booking",
    ar: "لا يوجد مبلغ مستحق على هذا الحجز",
  },
  booking_split_not_available: {
    en: "Splitting with your balance isn't available",
    ar: "الدفع المقسّم مع الرصيد غير متاح",
  },
  booking_cannot_be_cancelled: {
    en: "This booking can't be cancelled now",
    ar: "لا يمكن إلغاء هذا الحجز الآن",
  },
  balance_insufficient: {
    en: "Your balance is not enough",
    ar: "رصيدك غير كافٍ",
  },
  cash_payment_not_available: {
    en: "Cash payment is not available",
    ar: "الدفع نقدًا غير متاح",
  },
  payment_not_for_this_booking: {
    en: "This payment doesn't match the booking — try again",
    ar: "هذه الدفعة لا تخص هذا الحجز — حاول مرة أخرى",
  },
  payment_provider_not_configured: {
    en: "Card payments are unavailable right now",
    ar: "الدفع بالبطاقة غير متاح حاليًا",
  },
  customer_profile_not_found: {
    en: "Complete your profile first",
    ar: "أكمل ملفك الشخصي أولًا",
  },
  too_many_requests: {
    en: "Too many attempts — please wait a minute and try again",
    ar: "محاولات كثيرة — انتظر دقيقة ثم حاول مرة أخرى",
  },
  account_phone_not_verified: {
    en: "Verify your phone number first — we sent you a code",
    ar: "يرجى توثيق رقم جوالك أولاً — أرسلنا لك رمزاً",
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
  invalid_phone_number: {
    en: "The mobile number is invalid",
    ar: "رقم الجوال غير صالح",
  },
  registration_details_unavailable: {
    en: "These details can't be used — try a different email or phone number",
    ar: "لا يمكن استخدام هذه البيانات — جرّب بريدًا إلكترونيًا أو رقم جوال آخر",
  },
  invalid_name: {
    en: "Enter your first and last name",
    ar: "أدخل الاسم الأول واسم العائلة",
  },
  password_too_short: {
    en: "The password must be at least 6 characters",
    ar: "يجب أن تتكون كلمة المرور من 6 أحرف على الأقل",
  },
  invalid_otp_code: {
    en: "The code is wrong or expired",
    ar: "الرمز خاطئ أو منتهي الصلاحية",
  },
  invalid_or_expired_token: {
    en: "The reset session expired — start again",
    ar: "انتهت جلسة الاستعادة — ابدأ من جديد",
  },
  invalid_otp: {
    en: "The code is wrong or expired",
    ar: "الرمز خاطئ أو منتهي الصلاحية",
  },
  invalid_coordinates: {
    en: "The coordinates are out of range",
    ar: "الإحداثيات خارج النطاق المسموح",
  },
  customer_address_requires_coordinates: {
    en: "Add the coordinates of the address",
    ar: "أضف إحداثيات العنوان",
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
