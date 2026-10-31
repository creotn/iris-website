import { APP_STORE_URL, PLAY_STORE_URL } from "@/config/stores";
import { getScopedI18n } from "@/locales/server";
import StoreButton from "./StoreButton";
import styles from "./StoreBadges.module.css";

export default async function StoreBadges({ locale }: { locale: Locale }) {
  const t = await getScopedI18n("download");

  return (
    <div className={styles.stores}>
      <StoreButton
        platform="ios"
        href={`${APP_STORE_URL}?l=${locale}`}
        caption={t("iosStore")}
        name={t("iosStoreName")}
        className={styles.storeIos}
      />
      <StoreButton
        platform="android"
        href={PLAY_STORE_URL}
        caption={t("androidStore")}
        name={t("androidStoreName")}
        className={styles.storeAndroid}
      />
    </div>
  );
}
