import type { CSSProperties } from "react";
import styles from "./HeroSection.module.css";

type Props = { start: string; end: string };

const words = (text: string) => text.split(/\s+/).filter(Boolean);

/**
 * The headline rises in one word at a time. Whole words keep Arabic letters joined, and it is
 * pure CSS, so it plays from the first paint with no hydration flash. Screen readers get the
 * plain sentence.
 */
export default function HeroTitle({ start, end }: Props) {
  const startWords = words(start);
  const endWords = words(end);

  const word = (text: string, i: number) => (
    <span key={i} className={styles.word} style={{ "--i": i } as CSSProperties}>
      {text}
    </span>
  );

  // Words are joined with plain spaces so the line still breaks (and balances) like normal text.
  const join = (list: string[], offset: number) =>
    list.flatMap((text, i) => (i === 0 ? [word(text, offset + i)] : [" ", word(text, offset + i)]));

  return (
    <h1 className={styles.title}>
      <span className={styles.srOnly}>
        {start} {end}
      </span>
      <span aria-hidden="true">
        {join(startWords, 0)} <span className={styles.titleEnd}>{join(endWords, startWords.length)}</span>
      </span>
    </h1>
  );
}
