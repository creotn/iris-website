import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Image from "next/image";
import { setStaticParamsLocale } from "next-international/server";
import SignInForm from "@/components/forms/SignInForm";
import Logo from "@/components/layout/Logo";
import { resolveLocale } from "@/locales/resolveLocale";
import { getScopedI18n } from "@/locales/server";
import styles from "./page.module.css";

export const revalidate = false;

const MOODS = [
  { src: "mood-0-focused.png", width: 496, height: 238, label: "moodFocused" },
  { src: "mood-1-ontheway.png", width: 552, height: 253, label: "moodOnTheWay" },
  { src: "mood-2-details.png", width: 558, height: 253, label: "moodDetails" },
  { src: "mood-3-clean.png", width: 546, height: 253, label: "moodClean" },
  { src: "mood-4-finished.png", width: 552, height: 288, label: "moodFinished" },
  { src: "mood-5-relax.png", width: 552, height: 288, label: "moodRelax" },
] as const;

export async function generateMetadata(): Promise<Metadata> {
  const t = await getScopedI18n("signIn");
  return { title: t("title") };
}

export default async function SignIn({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  setStaticParamsLocale(resolveLocale((await params).locale));
  const [t, moods] = await Promise.all([
    getScopedI18n("signIn"),
    getScopedI18n("brandBook"),
  ]);

  return (
    <main className={`container ${styles.main}`}>
      <div className={styles.card}>
        <aside className={styles.visual}>
          <div className="iris-pattern-strong" />
          <div className={`glow-orb ${styles.orb}`} />
          <div className={styles.visualInner}>
            <span className={`mono ${styles.kicker}`}>{t("kicker")}</span>
            <h2 className={styles.welcome}>{t("welcomeTitle")}</h2>
            <p className={styles.welcomeText}>{t("welcomeText")}</p>
            <div className={styles.moods}>
              {MOODS.map((mood, index) => (
                <Image
                  key={mood.src}
                  src={`/brand/moods/${mood.src}`}
                  alt={moods(mood.label)}
                  title={moods(mood.label)}
                  width={mood.width}
                  height={mood.height}
                  sizes="(max-width: 900px) 30vw, 150px"
                  className={styles.mood}
                  style={{ "--i": index } as CSSProperties}
                />
              ))}
            </div>
          </div>
        </aside>

        <div className={styles.formPanel}>
          <Logo className={styles.logo} />
          <SignInForm />
        </div>
      </div>
    </main>
  );
}
