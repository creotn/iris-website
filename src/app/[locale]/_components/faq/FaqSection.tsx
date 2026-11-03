import { IconHeadset, IconMail, IconMessageCircle } from "@tabler/icons-react";
import { faqContent } from "./faq.content";
import FaqList from "./FaqList";
import { CONTACT } from "../../(info)/_components/contact.config";
import SectionHeader from "../shared/SectionHeader";
import styles from "./FaqSection.module.css";

export default function FaqSection({ locale }: { locale: Locale }) {
  const { title, description, items, stillAsking, panelText, contact } = faqContent[locale];

  return (
    <section className={`section ${styles.section}`} id="faq">
      <div className="container">
        <SectionHeader title={title} description={description} />
        <div className={styles.wrap}>
          <FaqList items={items} />
        </div>

        {/* <aside className={styles.support} aria-labelledby="faq-support-title">
          
            <h3 id="faq-support-title" className={styles.supportTitle}>
              {stillAsking}
            </h3>
            <p className={styles.supportText}>{panelText}</p>
            <a href={`mailto:${CONTACT.email}`} className={`btn btn-primary ${styles.supportCta}`}>
              {contact}
            </a>
        </aside> */}
      </div>
    </section>
  );
}
