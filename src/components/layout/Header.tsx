import Link from "next/link";
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
          <Link href={`/${locale}/sign-in`} className="btn btn-primary btn-sm">
            {t("signIn")}
          </Link>
          <ThemeToggle label={t("toggleTheme")} />
          <LanguageSwitcher
            labels={{ en: t("switchToEnglish"), ar: t("switchToArabic") }}
          />
        </div>
      </div>
    </header>
  );
}
