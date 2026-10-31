import { APP_STORE_URL, PRO_APP_STORE_URL } from "@/config/stores";
import { getScopedI18n } from "@/locales/server";
import Logo from "./Logo";
import styles from "./Footer.module.css";

type FooterLink = { label: string; href: string };

export default async function Footer({ locale }: { locale: Locale }) {
  const t = await getScopedI18n("footer");

  const columns: { heading: string; links: FooterLink[] }[] = [
    {
      heading: t("product"),
      links: [
        { label: t("customerApp"), href: `${APP_STORE_URL}?l=${locale}` },
        { label: t("proApp"), href: `${PRO_APP_STORE_URL}?l=${locale}` },
      ],
    },
    {
      heading: t("company"),
      links: [{ label: t("contact"), href: "https://admin.iris.reup.sa/contact" }],
    },
    {
      heading: t("legal"),
      links: [{ label: t("privacy"), href: "https://admin.iris.reup.sa/privacy" }],
    },
  ];

  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.grid}>
          <div>
            <Logo className={styles.logo} />
            <p className={styles.description}>{t("description")}</p>
          </div>

          {columns.map((column) => (
            <div key={column.heading}>
              <h2 className={styles.heading}>{column.heading}</h2>
              <ul className={styles.links}>
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} target="_blank" rel="noopener noreferrer">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className={styles.bottom}>
          <span>
            © {new Date().getFullYear()} {t("legalName")}. {t("rights")}
          </span>
          <span>{t("builtBy")}</span>
        </div>
      </div>
    </footer>
  );
}
