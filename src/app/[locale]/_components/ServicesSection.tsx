import Link from "next/link";
import { fetchServicePrices } from "@/api/CatalogAPI";
import { formatMoney } from "@/components/booking/wash/draft";
import type { HomeContent } from "../(home)/_content";
import SectionHeader from "./SectionHeader";
import styles from "./ServicesSection.module.css";

export default async function ServicesSection({
  locale,
  c,
}: {
  locale: Locale;
  c: HomeContent["services"];
}) {
  const prices = await fetchServicePrices();

  return (
    <section className="section" id="services">
      <div className="container">
        <SectionHeader title={c.title} description={c.lead} />

        <ul className={styles.list}>
          {c.items.map((item) => {
            const live = prices.find((price) => price.pubkey === item.pubkey);
            // An empty list means the API is down; a list without this service means it was withdrawn.
            if (prices.length > 0 && !live) return null;

            return (
              <li key={item.pubkey} className={styles.item}>
                <div>
                  <h3 className={styles.name}>{item.title}</h3>
                  <p className={styles.includes}>{item.includes}</p>
                  <p className={styles.duration}>{item.duration}</p>
                </div>

                <div className={styles.buy}>
                  {live?.comingSoon ? (
                    <p className={styles.soon}>{c.comingSoon}</p>
                  ) : (
                    <>
                      {live?.indicativePriceAfterTax ? (
                        <p className={styles.price}>
                          <span className={styles.from}>{c.from}</span>
                          <b className={styles.amount}>
                            {formatMoney(live.indicativePriceAfterTax, locale)}
                          </b>
                          <span className={styles.from}>{c.vat}</span>
                        </p>
                      ) : (
                        <p className={styles.noPrice}>{c.noPrice}</p>
                      )}
                      <Link href={`/${locale}/book/wash`} className="btn btn-primary">
                        {c.book}
                      </Link>
                    </>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
