"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { IconCash, IconCreditCard, IconLock, IconWallet } from "@tabler/icons-react";
import { fetchBalance } from "@/api/AccountAPI";
import {
  initiateCardPayment,
  payWithBalance,
  payWithCash,
  verifyCardPayment,
  type CardPayment,
  type PaymentSummary,
  type Vehicle,
} from "@/api/BookingAPI";
import { useCurrentLocale, useScopedI18n } from "@/locales/client";
import { translateError } from "@/utils/error";
import type { Place } from "./AddressStep";
import { buildItems, formatMoney, type Draft } from "./draft";
import MoyasarForm from "./MoyasarForm";
import OrderSummary, { type Totals } from "./OrderSummary";
import { Cta, Ghost, StepHeading } from "./ui";
import { useQuote } from "./useQuote";
import styles from "./Wash.module.css";

export type Method = "card" | "balance" | "cash";
export type Created = { pubkey: string; summary: PaymentSummary };

/**
 * Summary and payment on one page. Until the user pays, prices come from the live quote; paying
 * creates the booking, and from then on the server's payment summary (with any online discount) is shown.
 */
export default function CheckoutStep({
  draft,
  setDraft,
  vehicle,
  place,
  bookingPubkey,
  summary,
  onCreate,
  onPaid,
  onCancel,
  onEdit,
}: {
  draft: Draft;
  setDraft: (update: (draft: Draft) => Draft) => void;
  vehicle: Vehicle;
  place: Place;
  bookingPubkey: string | null;
  summary: PaymentSummary | null;
  onCreate: () => Promise<Created | string>;
  onPaid: (pubkey: string) => void;
  onCancel: () => void;
  onEdit: () => void;
}) {
  const t = useScopedI18n("wash");
  const locale = useCurrentLocale();
  const { quote } = useQuote(buildItems(draft));
  const [method, setMethod] = useState<Method>("card");
  const [useBalance, setUseBalance] = useState(false);
  const [wallet, setWallet] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [card, setCard] = useState<CardPayment | null>(null);
  const [verifying, setVerifying] = useState(false);

  // Before the booking exists the balance comes from the wallet; after, from the payment summary.
  useEffect(() => {
    if (summary) return;
    let active = true;
    fetchBalance().then((result) => active && result.ok && setWallet(Number(result.data.balance)));
    return () => {
      active = false;
    };
  }, [summary]);

  const online = summary?.online ?? null;
  const cashDue = summary ? Number(summary.amountDue) : quote ? Number(quote.tax.amountDue) : null;
  const payNow = summary ? Number(online?.amountDue ?? summary.amountDue) : cashDue;
  const balance = summary ? (summary.balanceMinor == null ? null : summary.balanceMinor / 100) : wallet;
  const balanceEnough = balance !== null && payNow !== null && balance >= payNow;
  const split = method === "card" && summary?.split?.available ? summary.split : null;
  const money = (amount: string | number) => formatMoney(amount, locale);

  const totals: Totals | null = summary
    ? {
        subtotal: summary.price,
        onlineDiscount: method !== "cash" && online && Number(online.discount) > 0 ? online.discount : null,
        vat: method !== "cash" && online ? online.taxAmount : summary.taxAmount,
        total: String(method === "cash" ? cashDue : payNow),
        estimated: false,
      }
    : quote
      ? { subtotal: quote.total, onlineDiscount: null, vat: quote.tax.taxAmount, total: quote.tax.amountDue, estimated: true }
      : null;

  const pay = async () => {
    setBusy(true);
    setError("");
    const created = await onCreate();
    if (typeof created === "string") {
      setBusy(false);
      return setError(created);
    }
    // A booking with nothing to pay is finished by the flow itself.
    if (!created.summary.requiresPayment) return;

    const { pubkey } = created;
    const result =
      method === "card"
        ? await initiateCardPayment(pubkey, useBalance && Boolean(created.summary.split?.available))
        : method === "balance"
          ? await payWithBalance(pubkey)
          : await payWithCash(pubkey);
    setBusy(false);
    if (!result.ok) return setError(translateError(result.error, locale));
    if (method === "card") setCard(result.data as CardPayment);
    else onPaid(pubkey);
  };

  const onCompleted = useCallback(
    async (moyasarPaymentId: string) => {
      if (!card || !bookingPubkey) return;
      setVerifying(true);
      const result = await verifyCardPayment(bookingPubkey, card.payment.transactionPubkey, moyasarPaymentId);
      setVerifying(false);
      if (result.ok) return onPaid(bookingPubkey);
      setError(translateError(result.error, locale));
      setCard(null);
    },
    [bookingPubkey, card, locale, onPaid],
  );

  const onLoadFailed = useCallback(() => {
    setError(t("cardFormFailed"));
    setCard(null);
  }, [t]);

  const methods: { id: Method; icon: ReactNode; title: string; detail: string; disabled?: boolean }[] = [
    { id: "card", icon: <IconCreditCard size={20} stroke={1.75} />, title: t("methodCard"), detail: t("methodCardDetail") },
    {
      id: "balance",
      icon: <IconWallet size={20} stroke={1.75} />,
      title: t("methodBalance"),
      detail:
        balance === null
          ? t("balanceUnavailable")
          : t(balanceEnough ? "balanceHave" : "balanceShort", { amount: money(balance) }),
      disabled: !balanceEnough,
    },
    // Before the booking exists cash is offered; the server confirms it is available when paying.
    ...(!summary || summary.cashAvailable
      ? [{ id: "cash" as const, icon: <IconCash size={20} stroke={1.75} />, title: t("methodCash"), detail: t("methodCashDetail", { amount: cashDue === null ? "—" : money(cashDue) }) }]
      : []),
  ];

  const payLabel =
    method === "card"
      ? t("payByCard", { amount: payNow === null ? "—" : money(split && useBalance ? split.cardPart : payNow) })
      : method === "balance"
        ? t("payFromBalance", { amount: payNow === null ? "—" : money(payNow) })
        : t("confirmBooking");

  let payment: ReactNode;
  if (verifying) {
    payment = (
      <div className={styles.coStatus} role="status">
        <div className={styles.spinner} />
        <b>{t("confirmingPayment")}</b>
        <span className={styles.hint}>{t("keepOpen")}</span>
      </div>
    );
  } else if (card && bookingPubkey) {
    const callbackUrl = `${location.origin}/${locale}/book/wash?booking=${bookingPubkey}&tx=${card.payment.transactionPubkey}`;
    payment = (
      <>
        <div className={styles.coHead}>
          <h2>{t("cardTitle")}</h2>
          <p>{t("cardSubtitle", { amount: money(card.moyasar.amount / 100) })}</p>
        </div>
        {useBalance && split && <p className={styles.coNote}>{t("balanceHeld", { amount: money(split.balancePart) })}</p>}
        <MoyasarForm payment={card} callbackUrl={callbackUrl} onCompleted={onCompleted} onLoadFailed={onLoadFailed} />
        <Ghost onClick={() => setCard(null)}>{t("otherMethod")}</Ghost>
      </>
    );
  } else {
    payment = (
      <>
        <div className={styles.coHead}>
          <h2>{t("payTitle")}</h2>
        </div>

        <div className={styles.coMethods} role="radiogroup" aria-label={t("method")}>
          {methods.map((item) => (
            <button
              key={item.id}
              type="button"
              role="radio"
              aria-checked={method === item.id}
              disabled={item.disabled}
              className={styles.coMethod}
              onClick={() => {
                setMethod(item.id);
                if (item.id !== "card") setUseBalance(false);
              }}
            >
              <span className={styles.coMethodIcon} aria-hidden>
                {item.icon}
              </span>
              <span className={styles.coMethodText}>
                <b>{item.title}</b>
                <small>{item.detail}</small>
              </span>
              <span className={styles.coRadio} aria-hidden />
            </button>
          ))}
        </div>

        {split && (
          <div className={styles.coSplit}>
            <span id="split-label">
              {t("useBalance", { amount: money(split.balancePart) })}
              <small>{t("cardPaysRest", { amount: money(split.cardPart) })}</small>
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

        <p className={styles.coNote}>
          <IconLock size={14} stroke={1.75} aria-hidden /> {t("secureNote")}
        </p>
      </>
    );
  }

  return (
    <div className={styles.stack}>
      <StepHeading step={4} title={t("reviewTitle")} subtitle={t("paySubtitle")} />
      <div className={styles.checkout}>
        <section className={styles.coPay} aria-label={t("payTitle")}>
          {payment}
          {error && (
            <p className="errorMessage" role="alert">
              {error}
            </p>
          )}
        </section>

        <OrderSummary draft={draft} setDraft={setDraft} vehicle={vehicle} place={place} quote={quote} totals={totals} locked={bookingPubkey !== null} onEdit={onEdit}>
          {!card && !verifying && (
            <>
              <Cta disabled={busy || !totals} onClick={pay}>
                {busy ? t("processing") : payLabel}
              </Cta>
              {bookingPubkey && <Ghost onClick={onCancel}>{t("cancelBooking")}</Ghost>}
            </>
          )}
        </OrderSummary>
      </div>
    </div>
  );
}
