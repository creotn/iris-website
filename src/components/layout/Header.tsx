import Link from "next/link";
import AuthButton from "./AuthButton";
import { getScopedI18n } from "@/locales/server";
import LanguageSwitcher from "./LanguageSwitcher";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";
import styles from "./Header.module.css";

export default async function Header({ locale }: { locale: Locale }) {
  const t = await getScopedI18n("header");

  const links = [
    { href: `/${locale}#features`, label: t("features") },
    { href: `/${locale}#how-it-works`, label: t("howItWorks") },
    { href: `/${locale}#apps`, label: t("apps") },
    { href: `/${locale}/customer`, label: t("customerApp") },
    { href: `/${locale}/brand`, label: t("brand") },
  ];

  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Link href={`/${locale}`} aria-label={t("home")}>
          <Logo className={styles.logo} priority />
        </Link>

        <nav aria-label={t("home")}>
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
          <AuthButton
            locale={locale}
            labels={{ signIn: t("signIn"), book: t("book"), account: t("account"), signOut: t("signOut") }}
          />
          <ThemeToggle label={t("toggleTheme")} />
          <LanguageSwitcher
            labels={{ en: t("switchToEnglish"), ar: t("switchToArabic") }}
          />
        </div>
      </div>
    </header>
  );
}
