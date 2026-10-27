import Link from "next/link";
import AuthButton from "./AuthButton";
import { getScopedI18n } from "@/locales/server";
import LanguageSwitcher from "./LanguageSwitcher";
import Logo from "./Logo";
import MobileMenu from "./MobileMenu";
import ThemeToggle from "./ThemeToggle";
import styles from "./Header.module.css";

export default async function Header({ locale }: { locale: Locale }) {
  const t = await getScopedI18n("header");

  const links = [
    { href: `/${locale}#features`, label: t("services") },
    { href: `/${locale}#how-it-works`, label: t("howItWorks") },
    { href: `/${locale}#pricing`, label: t("pricing") },
    { href: `/${locale}#coverage`, label: t("coverage") },
    { href: `/${locale}#faq`, label: t("faq") },
  ];

  const downloadHref = `/${locale}#get-started`;

  const authLabels = {
    signIn: t("signIn"),
    menu: t("accountMenu"),
    book: t("book"),
    account: t("account"),
    signOut: t("signOut"),
  };
  const languageLabels = { en: t("switchToEnglish"), ar: t("switchToArabic") };

  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Link href={`/${locale}`} aria-label={t("home")} className={styles.brand}>
          <Logo className={styles.logo} priority />
        </Link>

        <nav aria-label={t("menu")} className={styles.desktopOnly}>
          <ul className={styles.links}>
            {links.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={styles.link}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.actions}>
          <div className={styles.desktopOnly}>
            <ThemeToggle label={t("toggleTheme")} />
          </div>
          <AuthButton locale={locale} labels={authLabels} />
          <div className={styles.desktopOnly}>
            <LanguageSwitcher labels={languageLabels} />
          </div>
          <Link href={downloadHref} className={`${styles.download} ${styles.desktopOnly}`}>
            {t("downloadApp")}
          </Link>

          <div className={styles.mobileOnly}>
            <ThemeToggle label={t("toggleTheme")} />
            <MobileMenu labels={{ open: t("openMenu"), close: t("closeMenu"), menu: t("menu") }}>
              <nav aria-label={t("menu")}>
                <ul className={styles.drawerLinks}>
                  {links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className={styles.drawerLink}>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
              <Link href={downloadHref} className={styles.drawerDownload}>
                {t("downloadApp")}
              </Link>
              <div className={styles.drawerLanguage}>
                <LanguageSwitcher labels={languageLabels} />
              </div>
            </MobileMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
