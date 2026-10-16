"use client";

import { useCallback, useState } from "react";
import { IconWallet } from "@tabler/icons-react";
import { initiateTopUp, verifyTopUp, type Balance } from "@/api/AccountAPI";
import type { CardPayment } from "@/api/BookingAPI";
import AuthField from "@/components/forms/AuthField";
import formStyles from "@/components/forms/SignInForm.module.css";
import MoyasarForm from "@/components/booking/wash/MoyasarForm";
import { formatMoney } from "@/components/booking/wash/draft";
import { useCurrentLocale, useScopedI18n } from "@/locales/client";
import { translateError } from "@/utils/error";
import styles from "./Account.module.css";

const QUICK_AMOUNTS = [50, 100, 200, 500];

/** Riyals with at most two decimals, inside the API's limits. */
function validAmount(value: string, balance: Balance) {
  if (!/^\d+(\.\d{1,2})?$/.test(value.trim())) return false;
  const amount = Number(value);
  return amount >= Number(balance.topUpMin) && amount <= Number(balance.topUpMax);
}

/** Where Moyasar sends the customer back after a 3-D Secure challenge; the account page verifies it. */
export const topUpCallbackUrl = (locale: string, topUpPubkey: string, transactionPubkey: string) =>
  `${location.origin}/${locale}/account?topup=${topUpPubkey}&tx=${transactionPubkey}`;

export default function TopUp({ balance, onDone }: { balance: Balance; onDone: (amount: string) => void }) {
  const t = useScopedI18n("account");
  const locale = useCurrentLocale();
  const [amount, setAmount] = useState("");
  const [touched, setTouched] = useState(false);
  const [card, setCard] = useState<(CardPayment & { topUpPubkey: string }) | null>(null);
  const [busy, setBusy] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState("");

  const min = formatMoney(balance.topUpMin, locale);
  const max = formatMoney(balance.topUpMax, locale);
  const valid = validAmount(amount, balance);

  const start = async () => {
    setBusy(true);
    setError("");
    const result = await initiateTopUp(amount.trim());
    setBusy(false);
    if (result.ok) setCard(result.data);
    else setError(translateError(result.error, locale));
  };

  const onCompleted = useCallback(
    async (moyasarPaymentId: string) => {
      if (!card) return;
      setVerifying(true);
      const result = await verifyTopUp(card.topUpPubkey, card.payment.transactionPubkey, moyasarPaymentId);
      setVerifying(false);
      if (result.ok) onDone(formatMoney(card.moyasar.amount / 100, locale));
      else {
        setError(translateError(result.error, locale));
        setCard(null);
      }
    },
    [card, locale, onDone],
  );

  const onLoadFailed = useCallback(() => {
    setError(t("cardFormFailed"));
    setCard(null);
  }, [t]);

  if (verifying) {
    return (
      <div role="status">
        <div className={styles.spinner} />
        <p className={`${styles.dialogText} ${styles.center}`}>
          {t("topUpVerifying")}
        </p>
      </div>
    );
  }

  if (card) {
    return (
      <>
        <p className={styles.dialogText}>{t("topUpCard", { amount: formatMoney(card.moyasar.amount / 100, locale) })}</p>
        <MoyasarForm
          payment={card}
          callbackUrl={topUpCallbackUrl(locale, card.topUpPubkey, card.payment.transactionPubkey)}
          onCompleted={onCompleted}
          onLoadFailed={onLoadFailed}
        />
      </>
    );
  }

  return (
    <form className={formStyles.fields} action={start}>
      <p className={styles.dialogText}>{t("topUpSubtitle", { min, max })}</p>
      <div className={styles.amountChips}>
        {QUICK_AMOUNTS.filter((value) => validAmount(String(value), balance)).map((value) => (
          <button
            key={value}
            type="button"
            className={`${styles.chip} ${amount === String(value) ? styles.chipOn : ""}`}
            aria-pressed={amount === String(value)}
            onClick={() => setAmount(String(value))}
          >
            {formatMoney(value, locale)}
          </button>
        ))}
      </div>
      <AuthField
        label={t("topUpAmount")}
        icon={<IconWallet size={18} stroke={1.75} />}
        inputMode="decimal"
        value={amount}
        onChange={(event) => setAmount(event.target.value)}
        onBlur={() => setTouched(true)}
        error={touched && amount && !valid ? t("topUpInvalid", { min, max }) : undefined}
      />
      {error && (
        <p className="errorMessage" role="alert">
          {error}
        </p>
      )}
      <div className={styles.dialogActions}>
        <button type="submit" className={`${styles.button} ${styles.primary}`} disabled={!valid || busy}>
          {t("topUpContinue")}
        </button>
      </div>
    </form>
  );
}
