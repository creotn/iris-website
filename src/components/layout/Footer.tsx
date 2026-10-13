import { BRAND_BOOK_PDF } from "@/config/brand";
import { getScopedI18n } from "@/locales/server";
import Logo from "./Logo";
import styles from "./Footer.module.css";

type FooterLink = { label: string; href: string; download?: boolean };

export default async function Footer({ locale }: { locale: Locale }) {
  const t = await getScopedI18n("footer");

  const columns: { heading: string; links: FooterLink[] }[] = [
    {
      heading: t("product"),
      links: [
        { label: t("brandBook"), href: `/${locale}/brand` },
        { label: t("downloadBook"), href: BRAND_BOOK_PDF, download: true },
        { label: t("customerApp"), href: `/${locale}/customer` },
        { label: t("proApp"), href: `/${locale}#apps` },
      ],
    },
    {
      heading: t("company"),
      links: [
        { label: t("about"), href: "#" },
        { label: t("careers"), href: "#" },
        { label: t("contact"), href: "#" },
      ],
    },
    {
      heading: t("legal"),
      links: [
        { label: t("privacy"), href: "#" },
        { label: t("terms"), href: "#" },
      ],
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
              <div className={styles.heading}>{column.heading}</div>
              <ul className={styles.links}>
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} download={link.download}>
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
            © {new Date().getFullYear()} IRIS Mobile Car Wash. {t("rights")}
          </span>
          <span>{t("builtBy")}</span>
        </div>
      </div>
    </footer>
  );
}
