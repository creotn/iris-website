import clsx from "clsx";
import AppConfig from "@/config/Base";
import { getStoreUrls } from "@/lib/downloadLink";
import { getScopedI18n } from "@/locales/server";
import DeviceQrCode, { type QrVariant } from "./DeviceQrCode";
import QrCode from "./QrCode";
import StoreButton from "./StoreButton";
import styles from "./DownloadSection.module.css";

export default async function DownloadSection() {
  const t = await getScopedI18n("download");
  const stores = getStoreUrls();
  // Desktops, and any device whose store isn't configured, get the permanent /download code, which
  // sends the phone that scans it to its own store.
  const downloadUrl = `${AppConfig.baseUrl}/download`;
  const storeVariant = (url: string | null, caption: string): QrVariant | undefined =>
    url ? { code: <QrCode value={url} label={t("qrAlt")} />, caption, href: url } : undefined;

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
            <DeviceQrCode
              fallback={{
                code: <QrCode value={downloadUrl} label={t("qrAlt")} />,
                caption: t("scan"),
              }}
              stores={{
                ios: storeVariant(stores.ios, t("iosScan")),
                android: storeVariant(stores.android, t("androidScan")),
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
