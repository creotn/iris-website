import type { ReactNode } from "react";
import Image from "next/image";
import { IconDroplets, IconShieldCheck } from "@tabler/icons-react";
import { getScopedI18n } from "@/locales/server";
import styles from "./SplitLayout.module.css";

export default async function SplitLayout({ children }: { children: ReactNode }) {
  const t = await getScopedI18n("signIn");

  return (
    <main className={`container ${styles.main}`}>
      <aside className={styles.panel}>
        <Image
          src="/images/features/eco-friendly.jpg"
          alt=""
          fill
          priority
          sizes="(min-width: 960px) 40vw, 0px"
          className={styles.panelImage}
        />
        <div className={styles.panelShade} />
        <div className={styles.panelCopy}>
          <h2 className={styles.headline}>
            {t("headlineLead")} <span className={styles.headlineAccent}>{t("headlineAccent")}</span>
          </h2>
          <p className={styles.lead}>{t("lead")}</p>
          <ul className={styles.perks}>
            <li>
              <IconShieldCheck size={18} stroke={1.75} aria-hidden />
              {t("perkOne")}
            </li>
            <li>
              <IconDroplets size={18} stroke={1.75} aria-hidden />
              {t("perkTwo")}
            </li>
          </ul>
        </div>
      </aside>
      <div className={styles.formSide}>{children}</div>
    </main>
  );
}
