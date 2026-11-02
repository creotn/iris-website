import Link from "next/link";
import { getScopedI18n } from "@/locales/server";
import FooterBackToTop from "./FooterBackToTop";
import FooterMascot from "./FooterMascot";
import { CONTACT } from "@/app/[locale]/(info)/_components/contact.config";
import Logo from "./Logo";
import styles from "./Footer.module.css";

type FooterLink = { label: string; href: string };

export default async function Footer({ locale }: { locale: Locale }) {
  const t = await getScopedI18n("footer");
  const year = new Date().getFullYear();

  const columns: { heading: string; links: FooterLink[] }[] = [
    {
      heading: t("explore"),
      links: [
        { label: t("services"), href: `/${locale}#features` },
        { label: t("howItWorks"), href: `/${locale}#how-it-works` },
        { label: t("pricing"), href: `/${locale}#pricing` },
        { label: t("coverage"), href: `/${locale}#coverage` },
        { label: t("faq"), href: `/${locale}#faq` },
      ],
    },
    {
      heading: t("legal"),
      links: [
        { label: t("privacy"), href: `/${locale}/privacy` },
        { label: t("terms"), href: `/${locale}/terms` },
      ],
    },
    {
      heading: t("contact"),
      links: [{ label: CONTACT.email, href: `mailto:${CONTACT.email}` }],
    },
  ];

  return (
    <footer className={styles.footer}>
      <FooterMascot />

      <div className="container">
        <div className={styles.grid}>
          <div className={styles.brand}>
            <Link href={`/${locale}`} aria-label="IRIS" className={styles.logoLink}>
              <Logo className={styles.logo} />
            </Link>
            <p className={styles.description}>{t("description")}</p>
            <Link href={`/${locale}/book/wash`} className={styles.cta}>
              {t("book")}
            </Link>
          </div>

          {columns.map((column) => (
            <nav key={column.heading} aria-label={column.heading}>
              <div className={styles.heading}>{column.heading}</div>
              <ul className={styles.links}>
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className={styles.link}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className={styles.bottom}>
          <span>
            <bdi dir="ltr">© {year} IRIS, reup.sa.</bdi> {t("rights")}
          </span>
          <FooterBackToTop label={t("backToTop")} />
        </div>
      </div>
    </footer>
  );
}
