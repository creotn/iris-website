import Link from "next/link";
import { getCurrentLocale, getScopedI18n } from "@/locales/server";
import styles from "./status.module.css";

export default async function NotFound() {
  const t = await getScopedI18n("errors");
  const locale = getCurrentLocale();

  return (
    <div className={styles.status}>
      <h1>{t("notFound")}</h1>
      <Link href={`/${locale}`} className={styles.button}>
        {t("backHome")}
      </Link>
    </div>
  );
}
