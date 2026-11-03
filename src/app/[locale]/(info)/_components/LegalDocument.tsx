import { IconMail } from "@tabler/icons-react";
import type { CSSProperties } from "react";
import { InfoHero } from "./InfoPage";
import LegalToc from "./LegalToc";
import type { LegalContent } from "./legal.types";
import styles from "./LegalDocument.module.css";

export default function LegalDocument({ content }: { content: LegalContent }) {
  const { label, title, lead, tocLabel, sections, questions } = content;

  return (
    <>
      <InfoHero label={label} title={title} lead={lead} />

      <section className={`section ${styles.body}`}>
        <div className={styles.progress} aria-hidden="true" />

        <div className={`container ${styles.layout}`}>
          <LegalToc label={tocLabel} items={sections.map(({ id, title: sectionTitle }) => ({ id, title: sectionTitle }))} />

          <article className={styles.article}>
            {sections.map((section, i) => (
              <section key={section.id} id={section.id} className={styles.part} style={{ "--i": i } as CSSProperties}>
                <header className={styles.partHead}>
                  <span className={styles.number}>{String(i + 1).padStart(2, "0")}</span>
                  <h2 className={styles.partTitle}>{section.title}</h2>
                </header>

                {section.body.map((block, j) =>
                  typeof block === "string" ? (
                    <p key={j} className={styles.text}>
                      {block}
                    </p>
                  ) : (
                    <ul key={j} className={styles.list}>
                      {block.list.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  ),
                )}
              </section>
            ))}

            <aside className={styles.questions}>
              <span className={styles.questionsIcon} aria-hidden="true">
                <IconMail size={22} stroke={1.75} />
              </span>
              <div className={styles.questionsCopy}>
                <h2 className={styles.questionsTitle}>{questions.title}</h2>
                <p className={styles.text}>{questions.text}</p>
                <div className={styles.questionsLinks}>
                  <a href={`mailto:${questions.email}`} className={styles.email}>
                    {questions.email}
                  </a>
                </div>
              </div>
            </aside>
          </article>
        </div>
      </section>
    </>
  );
}
