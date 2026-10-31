import clsx from "clsx";
import AppConfig from "@/config/Base";
import { getStoreUrls } from "@/lib/downloadLink";
import { getScopedI18n } from "@/locales/server";
import QrCode from "./QrCode";
import StoreButton from "./StoreButton";
import styles from "./DownloadSection.module.css";

export default async function DownloadSection() {
  const t = await getScopedI18n("download");
  const stores = getStoreUrls();
  // One permanent code for both stores: it opens the /download page, so it never changes.
  const downloadUrl = `${AppConfig.baseUrl}/download`;

  return (
    <section className={clsx("section", styles.section)} id="download">
      <div className="container">
        <div className={styles.panel}>
          <div className={styles.content}>
            <span className="label">{t("label")}</span>
            {/* The page is static, so the "scan" and phone wording both ship and CSS picks one. */}
            <h1 className={clsx("heading-2", styles.title)}>
              <span className={styles.desktopCopy}>{t("title")}</span>
              <span className={styles.mobileCopy}>{t("mobileTitle")}</span>
            </h1>
            <p className={clsx("body-lg", styles.desktopCopy)}>{t("description")}</p>
            <p className={clsx("body-md", styles.mobileCopy)}>{t("mobileDescription")}</p>

            <div className={styles.buttons}>
              <StoreButton
                platform="ios"
                href={stores.ios}
                caption={stores.ios ? t("iosStore") : t("soon")}
                name={t("iosStoreName")}
              />
              <StoreButton
                platform="android"
                href={stores.android}
                caption={stores.android ? t("androidStore") : t("soon")}
                name={t("androidStoreName")}
              />
            </div>
          </div>

          <div className={styles.qrSide}>
            <div className={styles.qr}>
              <QrCode value={downloadUrl} label={t("qrAlt")} />
              <span className={styles.scanLine} aria-hidden="true" />
            </div>
            <p className={clsx("body-sm", styles.caption)}>{t("scan")}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
