"use client";

import { useCallback, useState, type ReactNode } from "react";
import { IconCash, IconCreditCard, IconLock, IconWallet } from "@tabler/icons-react";
import {
  initiateCardPayment,
  payWithBalance,
  payWithCash,
  verifyCardPayment,
  type CardPayment,
  type PaymentSummary,
} from "@/api/BookingAPI";
import { useCurrentLocale, useScopedI18n } from "@/locales/client";
import { translateError } from "@/utils/error";
import { formatMoney } from "./draft";
import MoyasarForm from "./MoyasarForm";
import { Banner, Cta, Ghost, Heading, Line } from "./ui";
import styles from "./Wash.module.css";

type Method = "card" | "balance" | "cash";

export default function PayStep({
  bookingPubkey,
  summary,
  onPaid,
  onCancel,
}: {
  bookingPubkey: string;
  summary: PaymentSummary;
  onPaid: () => void;
  onCancel: () => void;
}) {
  const t = useScopedI18n("wash");
  const locale = useCurrentLocale();
  const [method, setMethod] = useState<Method>("card");
  const [useBalance, setUseBalance] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [card, setCard] = useState<CardPayment | null>(null);
  const [verifying, setVerifying] = useState(false);

  const online = summary.online;
  const payNow = online?.amountDue ?? summary.amountDue;
  const payNowMinor = online?.amountDueMinor ?? summary.amountDueMinor;
  const balanceEnough = summary.balanceMinor != null && summary.balanceMinor >= payNowMinor;
  const split = summary.split?.available ? summary.split : null;

  const callbackUrl = `${location.origin}/${locale}/book/wash?booking=${bookingPubkey}${card ? `&tx=${card.payment.transactionPubkey}` : ""}`;

  const pay = async () => {
    setBusy(true);
    setError("");
    const result =
      method === "card"
        ? await initiateCardPayment(bookingPubkey, useBalance && split !== null)
        : method === "balance"
          ? await payWithBalance(bookingPubkey)
          : await payWithCash(bookingPubkey);
    setBusy(false);

    if (!result.ok) return setError(translateError(result.error, locale));
    if (method === "card") setCard(result.data as CardPayment);
    else onPaid();
  };

  const onCompleted = useCallback(
    async (moyasarPaymentId: string) => {
      if (!card) return;
      setVerifying(true);
      const result = await verifyCardPayment(bookingPubkey, card.payment.transactionPubkey, moyasarPaymentId);
      setVerifying(false);
      if (result.ok) onPaid();
      else {
        setError(translateError(result.error, locale));
        setCard(null);
      }
    },
    [bookingPubkey, card, locale, onPaid],
  );

  const onLoadFailed = useCallback(() => {
    setError(t("cardFormFailed"));
    setCard(null);
  }, [t]);

  if (verifying) {
    return (
      <div className={styles.hero} role="status">
        <div className={styles.spinner} />
        <h1 className={styles.groupLabel}>{t("confirmingPayment")}</h1>
        <p className={styles.hint}>{t("keepOpen")}</p>
      </div>
    );
  }

  if (card) {
    return (
      <div className={styles.stack}>
        <Heading title={t("cardTitle")} subtitle={t("cardSubtitle", { amount: formatMoney(card.moyasar.amount / 100, locale) })} />
        {useBalance && split && <Banner icon={<IconWallet size={18} stroke={1.75} aria-hidden />}>{t("balanceHeld", { amount: formatMoney(split.balancePart, locale) })}</Banner>}
        <MoyasarForm payment={card} callbackUrl={callbackUrl} onCompleted={onCompleted} onLoadFailed={onLoadFailed} />
        <Ghost onClick={() => setCard(null)}>{t("otherMethod")}</Ghost>
      </div>
    );
  }

  const methods: { id: Method; icon: ReactNode; title: string; detail: string; disabled?: boolean }[] = [
    { id: "card", icon: <IconCreditCard size={20} stroke={1.75} />, title: t("methodCard"), detail: t("methodCardDetail") },
    {
      id: "balance",
      icon: <IconWallet size={20} stroke={1.75} />,
      title: t("methodBalance"),
      detail:
        summary.balanceMinor == null
          ? t("balanceUnavailable")
          : balanceEnough
            ? t("balanceHave", { amount: formatMoney(summary.balanceMinor / 100, locale) })
            : t("balanceShort", { amount: formatMoney(summary.balanceMinor / 100, locale) }),
      disabled: !balanceEnough,
    },
    ...(summary.cashAvailable
      ? [{ id: "cash" as const, icon: <IconCash size={20} stroke={1.75} />, title: t("methodCash"), detail: t("methodCashDetail", { amount: formatMoney(summary.amountDue, locale) }) }]
      : []),
  ];

  const label =
    method === "card"
      ? t("payByCard", { amount: formatMoney(useBalance && split ? split.cardPart : payNow, locale) })
      : method === "balance"
        ? t("payFromBalance", { amount: formatMoney(payNow, locale) })
        : t("confirmBooking");

  return (
    <div className={styles.stack}>
      <Heading title={t("payTitle")} subtitle={t("paySubtitle")} />

      <div className={styles.card}>
        <Line label={t("subtotal")} value={formatMoney(summary.price, locale)} />
        {online && Number(online.discount) > 0 && <Line tone="negative" label={t("onlineDiscount")} value={`−${formatMoney(online.discount, locale)}`} />}
        <Line label={t("vat")} value={formatMoney(online?.taxAmount ?? summary.taxAmount, locale)} />
        <Line strong label={t("toPay")} value={formatMoney(method === "cash" ? summary.amountDue : payNow, locale)} />
      </div>

      <div className={styles.group} role="radiogroup" aria-label={t("method")}>
        {methods.map((item) => (
          <button
            key={item.id}
            type="button"
            role="radio"
            aria-checked={method === item.id}
            disabled={item.disabled}
            className={`${styles.option} ${method === item.id ? styles.optionOn : ""} ${item.disabled ? styles.optionOff : ""}`}
            onClick={() => {
              setMethod(item.id);
              if (item.id !== "card") setUseBalance(false);
            }}
          >
            <span className={styles.icon} aria-hidden>
              {item.icon}
            </span>
            <span className={styles.text}>
              <b>{item.title}</b>
              <small>{item.detail}</small>
            </span>
          </button>
        ))}
      </div>

      {method === "card" && split && (
        <div className={`${styles.card} ${styles.switchRow}`}>
          <span id="split-label">
            {t("useBalance", { amount: formatMoney(split.balancePart, locale) })}
            <br />
            <small className={styles.hint}>{t("cardPaysRest", { amount: formatMoney(split.cardPart, locale) })}</small>
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={useBalance}
            aria-labelledby="split-label"
            className={`${styles.switch} ${useBalance ? styles.switchOn : ""}`}
            onClick={() => setUseBalance((value) => !value)}
          />
        </div>
      )}

      <span className={styles.hint}>
        <IconLock size={12} stroke={1.75} aria-hidden /> {t("secureNote")}
      </span>

      <p className="errorMessage" role="alert">
        {error}
      </p>

      <Cta disabled={busy} onClick={pay}>
        {busy ? t("processing") : label}
      </Cta>
      <Ghost onClick={onCancel}>{t("cancelBooking")}</Ghost>
    </div>
  );
}
