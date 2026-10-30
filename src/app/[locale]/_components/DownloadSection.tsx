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
  // One permanent code for both stores: /download picks the store per device, so it never changes.
  const downloadUrl = `${AppConfig.baseUrl}/download`;

  return (
    <section className="section" id="download">
      <div className="container">
        <div className={clsx(styles.panel, "animate-in")}>
          <div className={styles.content}>
            <span className="label">{t("label")}</span>
            <h2 className={clsx("heading-2", styles.title)}>{t("title")}</h2>
            <p className="body-lg">{t("description")}</p>

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
            <a href={downloadUrl} className={styles.qr}>
              <QrCode value={downloadUrl} label={t("qrAlt")} />
              <span className={styles.scanLine} aria-hidden="true" />
            </a>
            <p className={clsx("body-sm", styles.caption)}>{t("scan")}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
