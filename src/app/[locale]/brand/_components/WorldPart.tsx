import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";
import { BRAND_BOOK_PDF } from "@/config/brand";
import type { BrandBookContent } from "../_content";
import { Chapter, PartDivider } from "./Chapter";
import styles from "./BrandBook.module.css";

const CLOSE_STATS = ["18", "3", "4", "6"];
const CLOSE_STACK = ["React Native", "ReactJS", "Next.js", "NestJS", "PostgreSQL"];

export default function WorldPart({
  c,
  locale,
}: {
  c: BrandBookContent;
  locale: Locale;
}) {
  const applicationChips: { background: string; pattern?: string; content: ReactNode }[] = [
    {
      background: "var(--iris-ink)",
      pattern: "iris-pattern-strong",
      content: (
        <span className={clsx(styles.chipLabel, styles.latin)} style={{ color: "var(--iris-paper)", fontWeight: 800, fontSize: "1.4rem" }}>
          IRIS
        </span>
      ),
    },
    {
      background: "var(--iris-violet)",
      pattern: "iris-pattern-sun",
      content: (
        <span className={styles.chipLabel} style={{ color: "var(--text-on-accent)", fontWeight: 700 }}>
          {c.applications.uniformChip}
        </span>
      ),
    },
    {
      background: "var(--iris-paper)",
      content: (
        <span className={styles.chipLabel} style={{ color: "var(--iris-deep)", fontWeight: 700 }}>
          IRIS™ microfiber
        </span>
      ),
    },
    {
      background: "#161619",
      pattern: "iris-pattern",
      content: (
        <span className={clsx("mono", styles.chipLabel)} style={{ color: "var(--iris-light)", fontSize: "0.8rem" }}>
          NANO · WAX · SCENT
        </span>
      ),
    },
    {
      background: "var(--iris-deep)",
      content: (
        <span className={styles.chipLabel} style={{ color: "var(--iris-light)", fontWeight: 800 }}>
          ✦
        </span>
      ),
    },
    {
      background: "var(--iris-ink)",
      content: (
        <span className={styles.stickers}>
          <Image src="/brand/moods/mood-3-clean.png" alt="" width={546} height={253} sizes="130px" className={styles.sticker} />
          <Image src="/brand/moods/mood-4-finished.png" alt="" width={552} height={288} sizes="130px" className={styles.sticker} />
        </span>
      ),
    },
  ];

  return (
    <>
      <PartDivider id="part3" number="PART III" {...c.parts.world} />

      <Chapter
        id="applications"
        num="19"
        kicker={c.applications.kicker}
        title={c.applications.title}
      >
        <div className={clsx(styles.grid, styles.g3)}>
          {c.applications.items.map((item, index) => {
            const chip = applicationChips[index];
            return (
              <div key={item.name} className={styles.swatch}>
                <div
                  className={clsx(styles.chip, styles.chipTall)}
                  style={{ background: chip.background }}
                >
                  {chip.pattern && <div className={chip.pattern} />}
                  {chip.content}
                </div>
                <div className={styles.swatchMeta}>
                  <div className={styles.swatchName}>{item.name}</div>
                  <div className={`mono ${styles.swatchEn}`}>{item.detail}</div>
                </div>
              </div>
            );
          })}
        </div>
      </Chapter>

      <section id="close" className={clsx(styles.section, styles.close)}>
        <div className="iris-pattern" />
        <div className={`glow-orb ${styles.closeOrb}`} />
        <div className={styles.wrap}>
          <Image
            src="/brand/iris-mascot.png"
            alt={c.cover.mascotAlt}
            width={490}
            height={895}
            sizes="170px"
            className={styles.closeMascot}
          />
          <span className={styles.pill}>{c.close.pill}</span>
          <h2 className={clsx(styles.title, styles.closeTitle)}>{c.close.title}</h2>
          <p className={clsx(styles.lead, styles.closeLead)}>{c.close.lead}</p>

          <div className={clsx(styles.grid, styles.g4, styles.closeStats)}>
            {CLOSE_STATS.map((stat, index) => (
              <div key={c.close.stats[index]}>
                <div className={styles.statNum}>{stat}</div>
                <div className={styles.statLbl}>{c.close.stats[index]}</div>
              </div>
            ))}
          </div>

          <div className={clsx(styles.nodes, styles.nodesCenter)}>
            {CLOSE_STACK.map((tech) => (
              <span key={tech} className={`mono ${styles.node}`}>
                {tech}
              </span>
            ))}
          </div>

          <p className={styles.closeSlogan}>نحن لا نغسل فقط. نحن IRIS.</p>
          <p className={`mono ${styles.closeMono}`}>
            We don&apos;t just wash. We IRIS. · www.irismcw.com · June 2026
          </p>

          <div className={styles.actions}>
            <a href={BRAND_BOOK_PDF} download className="btn btn-primary btn-lg">
              {c.close.download}
            </a>
            <Link href={`/${locale}`} className="btn btn-secondary btn-lg">
              {c.close.back}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
