import clsx from "clsx";
import { getScopedI18n } from "@/locales/server";
import QrCode from "./QrCode";
import styles from "./DownloadSection.module.css";

const APP_STORE_URL = "https://apps.apple.com/tn/app/iris/id6809477836";

const APPLE_PATH =
  "M18.71,19.5C17.88,20.74 17,21.95 15.66,21.97C14.32,22 13.89,21.18 12.37,21.18C10.84,21.18 10.37,21.95 9.1,22C7.79,22.05 6.8,20.68 5.96,19.47C4.25,17 2.94,12.45 4.7,9.39C5.57,7.87 7.13,6.91 8.82,6.88C10.1,6.86 11.32,7.75 12.11,7.75C12.89,7.75 14.37,6.68 15.92,6.84C16.57,6.87 18.39,7.1 19.56,8.82C19.47,8.88 17.39,10.1 17.41,12.63C17.44,15.65 20.06,16.66 20.09,16.67C20.06,16.74 19.67,18.11 18.71,19.5M13,3.5C13.73,2.67 14.94,2.04 15.94,2C16.07,3.17 15.6,4.35 14.9,5.19C14.21,6.04 13.07,6.7 11.95,6.61C11.8,5.46 12.36,4.26 13,3.5Z";
const PLAY_PATH =
  "M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z";

function StoreIcon({ path }: { path: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.storeIcon}>
      <path d={path} fill="currentColor" />
    </svg>
  );
}

export default async function DownloadSection() {
  const t = await getScopedI18n("download");

  return (
    <section className="section" id="download">
      <div className="container">
        <div className={clsx(styles.panel, "animate-in")}>
          <div className={styles.content}>
            <span className="label">{t("label")}</span>
            <h2 className={clsx("heading-2", styles.title)}>{t("title")}</h2>
            <p className="body-lg">{t("description")}</p>

            <div className={styles.buttons}>
              <a
                href={APP_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.storeBtn}
              >
                <StoreIcon path={APPLE_PATH} />
                <span className={styles.storeText}>
                  <small>{t("iosStore")}</small>
                  <strong>{t("iosStoreName")}</strong>
                </span>
              </a>

              <span
                className={clsx(styles.storeBtn, styles.storeBtnSoon)}
                aria-disabled="true"
              >
                <StoreIcon path={PLAY_PATH} />
                <span className={styles.storeText}>
                  <small>{t("androidSoon")}</small>
                  <strong>{t("androidStoreName")}</strong>
                </span>
              </span>
            </div>
          </div>

          <div className={styles.qrSide}>
            <a
              href={APP_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.qr}
            >
              <QrCode value={APP_STORE_URL} label={t("qrAlt")} />
              <span className={styles.scanLine} aria-hidden="true" />
            </a>
            <p className={clsx("body-sm", styles.caption)}>{t("iosScan")}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
