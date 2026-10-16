import clsx from "clsx";
import { ReactNode } from "react";
import PhoneMockup from "../../_components/PhoneMockup";
import p from "../../_components/PhoneMockup.module.css";
import Logo from "@/components/layout/Logo";
import type { CustomerContent } from "../_content";
import local from "./CustomerPage.module.css";

type Props = { c: CustomerContent };

function PhoneNav({ c, active }: Props & { active: number }) {
  const items = [
    { icon: "🏠", label: c.common.navHome },
    { icon: "📅", label: c.common.navBook },
    { icon: "📍", label: c.common.navTrack },
    { icon: "📋", label: c.common.navHistory },
    { icon: "👤", label: c.common.navProfile },
  ];
  return (
    <div className={local.phoneNav}>
      {items.map((item, index) => (
        <div
          key={item.label}
          className={clsx(local.phoneNavItem, index === active && local.phoneNavActive)}
        >
          <div className={local.phoneNavIcon}>{item.icon}</div>
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
}

function AuthPhone({ c }: Props) {
  const g = c.gallery.auth;
  return (
    <PhoneMockup duration={5} delay={0}>
      <div className={local.gAuth}>
        <div className={local.gAuthBrand}>
          <Logo className={local.appLogoSm} />
          <div className={local.gTagline}>{g.tagline}</div>
        </div>
        <div className={local.fullWidth}>
          <div className={p.kicker}>{g.phoneLabel}</div>
          <div className={local.gPhoneInputs}>
            <div className={local.gInput}>+966</div>
            <div className={clsx(local.gInput, local.gInputGrow)}>XX XXX XXX</div>
          </div>
          <div className={p.btn}>{g.sendOtp}</div>
          <div className={local.gOr}>{g.orContinue}</div>
          <div className={local.gSocials}>
            <div className={local.gSocial}>G</div>
            <div className={local.gSocial}>⌘</div>
          </div>
        </div>
        <div className={local.gTerms}>{g.terms}</div>
      </div>
    </PhoneMockup>
  );
}

function HomePhone({ c }: Props) {
  const g = c.gallery.home;
  const currency = c.common.currency;
  return (
    <PhoneMockup duration={5} delay={0.6}>
      <div className={p.greeting}>{g.greeting}</div>
      <div className={p.title}>{g.name}</div>
      <div className={p.search}>
        <span>🔍</span>
        <span>{g.search}</span>
      </div>
      <div className={clsx(p.card, p.cardHighlight)}>
        <div className={p.eyebrow}>{g.offerKicker}</div>
        <div className={p.itemTitleLg}>{g.offerTitle}</div>
        <div className={p.meta}>{g.offerCode}</div>
      </div>
      <div className={clsx(p.chips, local.wrap)}>
        {g.chips.map((chip) => (
          <span key={chip} className={p.chip}>
            {chip}
          </span>
        ))}
      </div>
      {[
        { title: g.premium, sub: g.premiumSub, price: 35 },
        { title: g.express, sub: g.expressSub, price: 15 },
      ].map((service) => (
        <div key={service.title} className={p.card}>
          <div className={p.row}>
            <div>
              <div className={p.itemTitle}>{service.title}</div>
              <div className={p.meta}>{service.sub}</div>
            </div>
            <span className={p.price}>
              {service.price} <span className={p.priceUnit}>{currency}</span>
            </span>
          </div>
        </div>
      ))}
      <div className={clsx(p.kicker, p.kickerSpaced)}>{g.recent}</div>
      <div className={p.listItem}>
        <div className={p.avatar}>P</div>
        <div className={p.grow}>
          <div className={p.itemTitle}>{g.premium}</div>
          <div className={p.meta}>May 15 · 35 {currency}</div>
        </div>
        <div className={p.stars}>★★★★★</div>
      </div>
      <PhoneNav c={c} active={0} />
    </PhoneMockup>
  );
}

function BookPhone({ c }: Props) {
  const g = c.gallery.book;
  const days = [
    { day: "MON", date: 19 },
    { day: "TUE", date: 20, active: true },
    { day: "WED", date: 21 },
    { day: "THU", date: 22 },
  ];
  return (
    <PhoneMockup duration={5} delay={1.2}>
      <div className={clsx(p.title, p.titleSm)}>{g.title}</div>
      <div className={clsx(p.map, local.mapShort)}>
        <div className={p.mapGrid} />
        <div className={p.mapPin} style={{ insetBlockStart: "50%", insetInlineStart: "50%" }} />
      </div>
      <div className={clsx(p.card, local.compactCard)}>
        <div className={local.inlineRow}>
          <span>📍</span>
          <div>
            <div className={local.text11}>{g.area}</div>
            <div className={local.text9}>{g.street}</div>
          </div>
        </div>
      </div>
      <div className={p.kicker}>{g.selectDate}</div>
      <div className={local.dayPills}>
        {days.map((day) => (
          <div key={day.date} className={clsx(local.dayPill, day.active && local.dayPillActive)}>
            <div className={local.dayName}>{day.day}</div>
            <div className={local.dayDate}>{day.date}</div>
          </div>
        ))}
      </div>
      <div className={p.kicker}>{g.selectTime}</div>
      <div className={clsx(p.chips, local.wrap, local.mb14)}>
        {["09:00", "10:30", "12:00", "14:00", "16:00"].map((time) => (
          <span key={time} className={clsx(p.chip, time === "10:30" && local.chipSolid)}>
            {time}
          </span>
        ))}
      </div>
      <div className={p.kicker}>{g.yourVehicle}</div>
      <div className={clsx(p.card, p.cardSelected, local.compactCard)}>
        <div className={local.inlineRow}>
          <div className={local.carEmoji}>🚗</div>
          <div>
            <div className={p.itemTitle}>Toyota Corolla</div>
            <div className={local.text9}>RUH 4521</div>
          </div>
        </div>
      </div>
      <div className={p.btn}>{g.confirm}</div>
    </PhoneMockup>
  );
}

function TrackPhone({ c }: Props) {
  const g = c.gallery.track;
  return (
    <PhoneMockup duration={5} delay={0.3}>
      <div className={clsx(p.map, local.mapBleed)}>
        <div className={p.mapGrid} />
        <div className={p.mapPin} style={{ insetBlockStart: "35%", insetInlineStart: "60%" }} />
        <div
          className={clsx(p.mapPin, local.pinSuccess)}
          style={{ insetBlockStart: "65%", insetInlineStart: "40%" }}
        />
        <div className={local.mapRoute} />
      </div>
      <div className={clsx(p.card, p.cardSelected)}>
        <div className={clsx(p.row, local.mb8)}>
          <div>
            <div className={p.eyebrow}>{g.arrivingIn}</div>
            <div className={local.etaLarge}>
              8 <span className={local.etaUnit}>{g.min}</span>
            </div>
          </div>
          <div className={clsx(p.avatar, local.avatar40)}>K</div>
        </div>
        <div className={clsx(p.row, local.text10muted)}>
          <span>{g.driver}</span>
          <span>{g.service}</span>
        </div>
        <div className={local.progress}>
          <div className={local.progressFill} />
        </div>
      </div>
      <div className={p.kicker}>{g.progress}</div>
      {g.steps.map((step, index) => {
        const state = index < 2 ? "done" : index === 2 ? "current" : "pending";
        return (
          <div key={step} className={local.gStep}>
            <div
              className={clsx(
                local.gStepDot,
                state === "done" && local.gStepDone,
                state === "current" && local.gStepCurrent,
              )}
            >
              {state === "done" ? "✓" : state === "current" ? "•" : index + 1}
            </div>
            <span
              className={clsx(
                local.gStepText,
                state === "current" && local.gStepTextCurrent,
                state === "pending" && local.mutedText,
              )}
            >
              {step}
            </span>
          </div>
        );
      })}
      <div className={local.gActions}>
        <div className={clsx(p.btn, p.btnHalf, p.btnGhost)}>{g.message}</div>
        <div className={clsx(p.btn, p.btnHalf)}>{g.call}</div>
      </div>
    </PhoneMockup>
  );
}

function HistoryPhone({ c }: Props) {
  const g = c.gallery.history;
  const currency = c.common.currency;
  const items = [
    { date: "May 15, 2026 · 10:30", price: 35, stars: "★★★★★" },
    { date: "May 10, 2026 · 14:00", price: 15, stars: "★★★★☆" },
    { date: "May 3, 2026 · 09:00", price: 65, stars: "★★★★★" },
  ];
  return (
    <PhoneMockup duration={5} delay={0.9}>
      <div className={clsx(p.title, p.titleSm, local.mb4)}>{g.title}</div>
      <div className={clsx(p.meta, local.mb14)}>{g.total}</div>
      <div className={p.statGrid}>
        {[
          { value: "12", className: "" },
          { value: "420", className: p.success },
          { value: "4.8", className: p.warning },
        ].map((stat, index) => (
          <div key={stat.value} className={clsx(p.card, p.statCard)}>
            <div className={clsx(p.statValue, stat.className)}>{stat.value}</div>
            <div className={p.statLabel}>{g.stats[index]}</div>
          </div>
        ))}
      </div>
      <div className={clsx(p.chips, local.mb14)}>
        {g.filters.map((filter, index) => (
          <span key={filter} className={clsx(p.chip, index === 0 && local.chipSolid)}>
            {filter}
          </span>
        ))}
      </div>
      {items.map((item, index) => (
        <div key={item.date} className={p.card}>
          <div className={clsx(p.row, local.alignStart)}>
            <div>
              <div className={p.itemTitle}>{g.items[index]}</div>
              <div className={p.meta}>{item.date}</div>
              <div className={clsx(p.stars, local.mt4)}>{item.stars}</div>
            </div>
            <div className={local.alignEnd}>
              <div className={local.historyPrice}>
                {item.price} {currency}
              </div>
              <div className={local.gStatus}>{c.common.completed}</div>
            </div>
          </div>
        </div>
      ))}
      <PhoneNav c={c} active={3} />
    </PhoneMockup>
  );
}

function ProfilePhone({ c }: Props) {
  const g = c.gallery.profile;
  const menu: { icon: string; trailing: ReactNode; danger?: boolean }[] = [
    { icon: "🚗", trailing: <span className={local.chevronGlyph}>›</span> },
    { icon: "💳", trailing: <span className={local.chevronGlyph}>›</span> },
    { icon: "🔔", trailing: <div className={local.toggleOn} /> },
    { icon: "🌐", trailing: <span className={local.langValue}>{g.languageValue}</span> },
    { icon: "❓", trailing: <span className={local.chevronGlyph}>›</span> },
    { icon: "🚪", trailing: null, danger: true },
  ];
  return (
    <PhoneMockup duration={5} delay={1.5}>
      <div className={local.gProfileHead}>
        <div className={clsx(p.avatar, local.avatar56)}>A</div>
        <div className={local.gProfileName}>{g.name}</div>
        <div className={local.text11muted} dir="ltr">
          +966 XX XXX XXX
        </div>
        <div className={local.text11muted}>ahmed@email.com</div>
      </div>
      <div className={local.gProfileStats}>
        {[
          { value: "12", className: local.accentText },
          { value: "4.8", className: p.warning },
          { value: "2", className: p.success },
        ].map((stat, index) => (
          <div key={stat.value} className={local.centerText}>
            <div className={clsx(p.statValue, stat.className)}>{stat.value}</div>
            <div className={p.statLabel}>{g.stats[index]}</div>
          </div>
        ))}
      </div>
      {menu.map((row, index) => (
        <div key={row.icon} className={clsx(p.listItem, local.gMenuRow)}>
          <span className={local.gMenuIcon}>{row.icon}</span>
          <span className={clsx(local.gMenuLabel, row.danger && local.dangerText)}>
            {g.menu[index]}
          </span>
          {row.trailing}
        </div>
      ))}
      <PhoneNav c={c} active={4} />
    </PhoneMockup>
  );
}

export default function GallerySection({ c }: Props) {
  const phones = [AuthPhone, HomePhone, BookPhone, TrackPhone, HistoryPhone, ProfilePhone];

  return (
    <section className={local.gallery}>
      <div className="container">
        {c.gallery.pairs.map((pair, index) => {
          const Phone = phones[index];
          return (
            <div key={pair.label} className={local.pair}>
              <div className={local.pairInfo}>
                <span className={`label ${local.pairLabel}`}>{pair.label}</span>
                <h3 className={`heading-3 ${local.pairTitle}`}>{pair.title}</h3>
                <p className={`body-md ${local.pairText}`}>{pair.text}</p>
                <ul className={local.pairPoints}>
                  {pair.points.map((point) => (
                    <li key={point}>
                      <span className={local.dot} />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className={local.pairVisual}>
                <Phone c={c} />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
