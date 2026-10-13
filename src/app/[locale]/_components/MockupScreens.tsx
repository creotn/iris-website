import clsx from "clsx";
import { getScopedI18n } from "@/locales/server";
import PhoneMockup from "./PhoneMockup";
import styles from "./PhoneMockup.module.css";

type Motion = { delay?: number; duration?: number };

function Chart({
  heights,
  activeIndex,
  labels,
  small = false,
}: {
  heights: number[];
  activeIndex: number;
  labels: string[];
  small?: boolean;
}) {
  return (
    <>
      <div className={clsx(styles.chart, small && styles.chartSm)}>
        {heights.map((height, index) => (
          <div
            key={index}
            className={clsx(
              styles.chartBar,
              index === activeIndex && styles.chartBarActive,
            )}
            style={{ height: `${height}%` }}
          />
        ))}
      </div>
      <div className={styles.chartLabel}>
        {labels.map((label, index) => (
          <span key={index}>{label}</span>
        ))}
      </div>
    </>
  );
}

export async function CustomerHomeScreen(motion: Motion) {
  const t = await getScopedI18n("mockup");

  return (
    <PhoneMockup {...motion}>
      <div className={styles.greeting}>{t("goodMorning")}</div>
      <div className={styles.title}>{t("customerName")}</div>

      <div className={styles.search}>
        <span>🔍</span>
        <span>{t("searchServices")}</span>
      </div>

      <div className={styles.chips}>
        <span className={styles.chip}>{t("expressWash")}</span>
        <span className={styles.chip}>{t("fullDetail")}</span>
        <span className={styles.chip}>{t("interior")}</span>
      </div>

      <div className={clsx(styles.card, styles.cardHighlight)}>
        <div className={styles.row} style={{ marginBlockEnd: 10 }}>
          <span className={styles.eyebrow}>{t("premiumWash")}</span>
          <span className={clsx("badge badge-success", styles.badgeSm)}>
            {t("popular")}
          </span>
        </div>
        <div className={styles.itemTitleLg}>{t("premiumWashTitle")}</div>
        <div className={styles.meta}>{t("premiumWashDesc")}</div>
        <div className={styles.row} style={{ marginBlockStart: 12 }}>
          <span className={styles.priceLg}>
            35 <span className={styles.priceUnit}>{t("currency")}</span>
          </span>
          <div className={clsx(styles.btn, styles.btnInline)}>
            {t("bookNow")}
          </div>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.kicker}>{t("recent")}</div>
        <div className={styles.listItem}>
          <div className={styles.avatar}>A</div>
          <div className={styles.grow}>
            <div className={styles.itemTitle}>{t("expressWash")}</div>
            <div className={styles.meta}>{t("yesterday")}</div>
          </div>
          <div className={styles.stars}>★★★★★</div>
        </div>
      </div>
    </PhoneMockup>
  );
}

export async function ProDashboardScreen(motion: Motion) {
  const t = await getScopedI18n("mockup");

  return (
    <PhoneMockup {...motion}>
      <div className={styles.row} style={{ marginBlockEnd: 14 }}>
        <div>
          <div className={styles.greeting}>{t("proDashboard")}</div>
          <div className={styles.title} style={{ marginBlockEnd: 0 }}>
            {t("proName")}
          </div>
        </div>
        <div className={clsx(styles.avatar, styles.avatarSuccess)}>K</div>
      </div>

      <div className={styles.statGrid}>
        <div className={clsx(styles.card, styles.statCard)}>
          <div className={styles.statValue}>12</div>
          <div className={styles.statLabel}>{t("today")}</div>
        </div>
        <div className={clsx(styles.card, styles.statCard)}>
          <div className={clsx(styles.statValue, styles.success)}>280</div>
          <div className={styles.statLabel}>{t("earned")}</div>
        </div>
        <div className={clsx(styles.card, styles.statCard)}>
          <div className={clsx(styles.statValue, styles.warning)}>4.9</div>
          <div className={styles.statLabel}>{t("rating")}</div>
        </div>
      </div>

      <div className={clsx(styles.card, styles.cardAccent)}>
        <div className={styles.row} style={{ marginBlockEnd: 8 }}>
          <span className={styles.eyebrow}>{t("newJob")}</span>
          <span className={clsx("badge badge-warning", styles.badgeSm)}>
            {t("minutesAgo")}
          </span>
        </div>
        <div className={styles.itemTitle}>{t("jobTitle")}</div>
        <div className={styles.meta} style={{ marginBlockEnd: 8 }}>
          {t("jobLocation")}
        </div>
        <div className={styles.row} style={{ gap: 8 }}>
          <div className={clsx(styles.btn, styles.btnHalf)}>{t("accept")}</div>
          <div className={clsx(styles.btn, styles.btnHalf, styles.btnGhost)}>
            {t("decline")}
          </div>
        </div>
      </div>

      <div className={clsx(styles.kicker, styles.kickerSpaced)}>
        {t("weeklyEarnings")}
      </div>
      <Chart
        heights={[35, 55, 45, 70, 85, 60, 40]}
        activeIndex={4}
        labels={t("days").split(",")}
      />
    </PhoneMockup>
  );
}

export async function BookWashScreen(motion: Motion) {
  const t = await getScopedI18n("mockup");

  const services = [
    { name: t("expressWash"), detail: t("expressDetail"), price: 15 },
    { name: t("premiumWash"), detail: t("premiumDetail"), price: 35 },
    { name: t("fullDetail"), detail: t("fullDetailDetail"), price: 65 },
  ];

  return (
    <PhoneMockup {...motion}>
      <div className={clsx(styles.title, styles.titleSm)}>{t("bookAWash")}</div>

      <div className={styles.map}>
        <div className={styles.mapGrid} />
        <div className={styles.mapPin} />
      </div>

      <div className={styles.kicker}>{t("selectService")}</div>
      {services.map((service, index) => (
        <div
          key={service.name}
          className={clsx(styles.card, index === 0 && styles.cardSelected)}
          style={{ marginBlockEnd: 8 }}
        >
          <div className={styles.row}>
            <div>
              <div className={styles.itemTitle}>{service.name}</div>
              <div className={styles.meta}>{service.detail}</div>
            </div>
            <span className={styles.price}>
              {service.price}{" "}
              <span className={styles.priceUnit}>{t("currency")}</span>
            </span>
          </div>
        </div>
      ))}

      <div className={styles.btn}>{t("continue")}</div>
    </PhoneMockup>
  );
}

export async function EarningsScreen(motion: Motion) {
  const t = await getScopedI18n("mockup");

  const payouts = [
    { date: t("payoutDate1"), amount: "+1,280" },
    { date: t("payoutDate2"), amount: "+1,150" },
  ];

  return (
    <PhoneMockup {...motion}>
      <div className={styles.row} style={{ marginBlockEnd: 14 }}>
        <div className={clsx(styles.title, styles.titleSm)} style={{ margin: 0 }}>
          {t("myEarnings")}
        </div>
        <span className={styles.chip}>{t("thisWeek")}</span>
      </div>

      <div className={clsx(styles.card, styles.cardCenter)}>
        <div className={styles.statLabel}>{t("totalEarnings")}</div>
        <div className={styles.statValueLg}>1,450</div>
        <div className={styles.meta}>{t("earnedThisWeek")}</div>
        <div className={styles.trend}>
          <span className={styles.success}>▲ 12%</span>
          <span>{t("vsLastWeek")}</span>
        </div>
      </div>

      <Chart
        heights={[40, 60, 50, 75, 90, 65, 45]}
        activeIndex={4}
        labels={t("days").split(",")}
        small
      />

      <div className={clsx(styles.kicker, styles.kickerSpaced)}>
        {t("recentPayouts")}
      </div>
      {payouts.map((payout) => (
        <div key={payout.date} className={styles.listItem}>
          <div className={styles.payoutIcon}>✓</div>
          <div className={styles.grow}>
            <div className={styles.itemTitle}>{t("weeklyPayout")}</div>
            <div className={styles.meta}>{payout.date}</div>
          </div>
          <span className={styles.payoutAmount}>
            {payout.amount} {t("currency")}
          </span>
        </div>
      ))}
    </PhoneMockup>
  );
}
