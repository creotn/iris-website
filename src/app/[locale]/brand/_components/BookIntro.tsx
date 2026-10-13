import Image from "next/image";
import Logo from "@/components/layout/Logo";
import type { BrandBookContent } from "../_content";
import styles from "./BrandBook.module.css";

const CHAPTER_IDS = [
  "idea",
  "character",
  "moods",
  "logo",
  "color",
  "type",
  "pattern",
  "voice",
  "market",
  "platform",
  "services",
  "app",
  "tech",
  "b2b",
  "ai",
  "arch",
  "roadmap",
  "edge",
  "applications",
  "close",
];

export default function BookIntro({ c }: { c: BrandBookContent }) {
  return (
    <>
      <header className={styles.cover}>
        <div className="grid-bg" />
        <div className="iris-pattern" />
        <div className={`glow-orb ${styles.coverOrb}`} />
        <Image
          src="/brand/iris-mascot.png"
          alt={c.cover.mascotAlt}
          width={490}
          height={895}
          priority
          sizes="300px"
          className={styles.coverMascot}
        />

        <div className={`${styles.wrap} ${styles.coverInner}`}>
          <Logo className={`${styles.coverLogo} animate-in`} priority />
          <span className={`${styles.pill} animate-in animate-delay-1`}>{c.cover.pill}</span>
          <h1 className={`${styles.coverTitle} animate-in animate-delay-2`}>
            {c.cover.line1}
            <br />
            {c.cover.line2Before}
            <span className={styles.accent}>{c.cover.line2Accent}</span>
            {c.cover.line2After}
          </h1>
          <p className={`mono ${styles.slogan} animate-in animate-delay-3`}>{c.cover.slogan}</p>
          <p className={`${styles.coverSub} animate-in animate-delay-4`}>{c.cover.sub}</p>
          <div className={`mono ${styles.coverMeta} ${styles.coverMetaIn}`}>
            <span>{c.cover.metaWash}</span>
            <span>
              <b>KSA</b> {c.cover.metaKsa}
            </span>
            <span>
              <b>June 2026</b>
            </span>
            <span>www.irismcw.com</span>
          </div>
        </div>
      </header>

      <section className={styles.section}>
        <div className={styles.wrap}>
          <div className={styles.kicker}>
            <span>{c.contents.kicker}</span>
          </div>
          <h2 className={styles.title}>{c.contents.title}</h2>
          <nav className={styles.toc}>
            {CHAPTER_IDS.map((id, index) => (
              <a key={id} href={`#${id}`}>
                <span className={`mono ${styles.tocNum}`}>
                  {id === "close" ? "★" : String(index + 1).padStart(2, "0")}
                </span>
                <span className={styles.tocTitle}>{c.contents.items[index]}</span>
              </a>
            ))}
          </nav>
        </div>
      </section>
    </>
  );
}
