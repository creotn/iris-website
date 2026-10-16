import clsx from "clsx";
import {
  IconBell,
  IconCar,
  IconCheck,
  IconChevronRight,
  IconCreditCard,
  IconHelpCircle,
  IconMapPin,
  IconMapPinFilled,
  IconMessage,
  IconPhone,
  IconSearch,
  IconSun,
  IconWorld,
} from "@tabler/icons-react";
import ChipGroup from "@/components/app-prototype/ChipGroup";
import Logo from "@/components/layout/Logo";
import s from "@/components/app-prototype/AppPrototype.module.css";
import type { CustomerContent } from "../_content";
import local from "./CustomerPage.module.css";

type Props = { c: CustomerContent };

export function AuthScreen({ c }: Props) {
  return (
    <div className={local.authScreen}>
      <div className={local.authBrand}>
        <Logo className={local.appLogo} />
        <div className={local.authTagline}>{c.auth.tagline}</div>
      </div>
      <div className={local.authForm}>
        <div className={s.kicker}>{c.auth.phoneLabel}</div>
        <div className={local.phoneInputs}>
          <div className={local.dialCode}>+966</div>
          <div className={local.phoneField}>5X XXX XXXX</div>
        </div>
        <button type="button" className={clsx(s.btn, s.btnFull, local.mb20)}>
          {c.auth.sendOtp}
        </button>
        <div className={local.orDivider}>
          <span />
          {c.auth.or}
          <span />
        </div>
        <div className={local.socials}>
          <div className={local.social}>
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
          </div>
          <div className={local.social}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="var(--text-primary)">
              <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
            </svg>
          </div>
        </div>
      </div>
      <div className={local.authTerms}>{c.auth.terms}</div>
    </div>
  );
}

export function HomeScreen({ c }: Props) {
  const { home, common } = c;
  return (
    <>
      <div className={local.homeHeader}>
        <div>
          <div className={s.sub}>{home.greeting}</div>
          <div className={local.homeName}>{home.name}</div>
        </div>
        <div className={s.iconBtn}>
          <IconBell />
          <div className={s.badge}>3</div>
        </div>
      </div>
      <div className={local.search}>
        <IconSearch size={14} />
        <span>{home.search}</span>
      </div>
      <div className={clsx(s.card, s.cardPromo)}>
        <div className={s.eyebrow}>{home.offerKicker}</div>
        <div className={local.promoTitle}>{home.offerTitle}</div>
        <div className={s.sub}>{home.offerCode}</div>
      </div>
      <div className={s.block}>
        <ChipGroup options={home.chips} />
      </div>
      <div className={s.card}>
        <div className={clsx(s.spread, s.spreadTop, local.mb10)}>
          <div>
            <div className={s.title}>{home.expressTitle}</div>
            <div className={s.sub}>{home.expressSub}</div>
          </div>
          <div className={s.endAligned}>
            <div className={s.price}>
              59 <span className={s.priceUnit}>{common.currency}</span>
            </div>
            <div className={s.sub}>★ 4.8</div>
          </div>
        </div>
        <button type="button" className={clsx(s.btn, s.btnFull)}>
          {home.bookNow}
        </button>
      </div>
      <div className={s.block}>
        <div className={s.kicker}>{home.mostRequested}</div>
      </div>
      <div className={local.miniCards}>
        {[
          { title: home.fullWash, sub: home.fullWashSub, price: 89 },
          { title: home.polish, sub: home.polishSub, price: 129 },
        ].map((item) => (
          <div key={item.title} className={local.miniCard}>
            <div className={s.title}>{item.title}</div>
            <div className={s.sub}>{item.sub}</div>
            <div className={clsx(s.price, local.miniPrice)}>
              {item.price} <span className={s.priceUnit}>{common.currency}</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export function BookScreen({ c }: Props) {
  const { book, common } = c;
  return (
    <>
      <div className={s.headerBar}>
        <h3>{book.title}</h3>
      </div>
      <div className={s.map}>
        <IconMapPinFilled
          size={28}
          className={s.mapMarker}
          style={{ insetBlockStart: "50%", insetInlineStart: "50%", color: "var(--accent)" }}
        />
      </div>
      <div className={clsx(s.card, s.cardRow)}>
        <IconMapPin size={18} color="var(--accent)" />
        <div>
          <div className={clsx(s.title, s.titleSm)}>{book.area}</div>
          <div className={s.sub}>{book.street}</div>
        </div>
      </div>
      <div className={s.block}>
        <div className={s.kicker}>{book.selectDate}</div>
        <ChipGroup options={book.dates} />
      </div>
      <div className={s.block}>
        <div className={s.kicker}>{book.selectTime}</div>
        <ChipGroup options={["09:00", "10:30", "14:00", "16:00"]} initial={1} grid />
      </div>
      <div className={s.block}>
        <div className={s.kicker}>{book.vehicleType}</div>
        <ChipGroup options={book.vehicleTypes} />
      </div>
      <div className={clsx(s.card, s.cardSoft)}>
        <div className={s.spread}>
          <div>
            <div className={s.eyebrow}>{book.recommended}</div>
            <div className={s.title}>{book.premiumPackage}</div>
          </div>
          <div className={s.price}>
            149 <span className={s.priceUnit}>{common.currency}</span>
          </div>
        </div>
      </div>
      <button type="button" className={s.btn}>
        {book.confirm}
      </button>
    </>
  );
}

export function TrackScreen({ c }: Props) {
  const { track } = c;
  return (
    <>
      <div className={s.headerBar}>
        <h3>{track.title}</h3>
      </div>
      <div className={clsx(s.map, s.mapTall)}>
        <IconMapPinFilled
          size={24}
          className={s.mapMarker}
          style={{ insetBlockStart: "35%", insetInlineStart: "55%", color: "var(--accent)" }}
        />
        <div
          className={clsx(s.mapMarker, s.mapVehicle)}
          style={{ insetBlockStart: "60%", insetInlineStart: "40%" }}
        >
          <IconCar size={16} color="#ffffff" />
        </div>
      </div>
      <div className={clsx(s.card, s.cardAccent)}>
        <div className={clsx(s.spread, local.mb10)}>
          <div>
            <div className={s.eyebrow}>{track.eta}</div>
            <div className={local.eta}>
              12 <span className={s.priceUnit}>{track.min}</span>
            </div>
          </div>
          <div className={clsx(s.avatar, local.avatar44)}>A</div>
        </div>
        <div className={clsx(s.spread, local.trackMeta)}>
          <div>
            <b>{track.driver}</b> · <span className={local.accentText}>★ 4.9</span>
          </div>
          <div className={s.sub}>{track.vehicle}</div>
        </div>
      </div>
      <div className={s.steps}>
        {track.steps.map((step, index) => {
          const state = index === 0 ? "done" : index === 1 ? "current" : "pending";
          return (
            <div key={step.title} className={s.step}>
              <div
                className={clsx(
                  s.stepDot,
                  state === "done" && s.stepDone,
                  state === "current" && s.stepCurrent,
                  state === "pending" && s.stepPending,
                )}
              >
                {state === "done" && <IconCheck size={10} stroke={3} />}
                {state === "current" && <span className={local.dotCore} />}
                {state === "pending" && index + 1}
              </div>
              {index < track.steps.length - 1 && (
                <div className={clsx(s.stepLine, state === "done" && s.stepLineDone)} />
              )}
              <div>
                <div
                  className={clsx(
                    s.stepTitle,
                    state === "current" && local.accentText,
                    state === "pending" && local.mutedText,
                  )}
                >
                  {step.title}
                </div>
                {step.sub && <div className={s.stepSub}>{step.sub}</div>}
              </div>
            </div>
          );
        })}
      </div>
      <div className={local.actionRow}>
        <button type="button" className={local.ghostAction}>
          <IconPhone size={16} />
          <span>{track.call}</span>
        </button>
        <button type="button" className={local.primaryAction}>
          <IconMessage size={16} />
          <span>{track.message}</span>
        </button>
      </div>
    </>
  );
}

const HISTORY = [
  { date: "May 15, 2026 · 10:30", price: 89, done: true },
  { date: "May 10, 2026 · 14:00", price: 59, done: true },
  { date: "May 3, 2026 · 09:00", price: 149, done: false },
];

export function HistoryScreen({ c }: Props) {
  const { history, common } = c;
  return (
    <>
      <div className={s.headerBar}>
        <h3>{history.title}</h3>
      </div>
      <div className={s.stats}>
        {["12", "420", "4.8"].map((value, index) => (
          <div key={value} className={s.stat}>
            <span
              className={s.statNum}
              style={
                index === 1
                  ? { color: "var(--text-primary)" }
                  : index === 2
                    ? { color: "var(--app-amber)" }
                    : undefined
              }
            >
              {value}
            </span>
            <span className={s.statLabel}>{history.stats[index]}</span>
          </div>
        ))}
      </div>
      <div className={clsx(s.block, local.mb14)}>
        <ChipGroup options={history.filters} />
      </div>
      {history.items.map((item, index) => {
        const meta = HISTORY[index];
        return (
          <div key={meta.date} className={s.card}>
            <div className={clsx(s.spread, s.spreadTop)}>
              <div>
                <div className={clsx(s.title, s.titleSm)}>{item.title}</div>
                <div className={s.sub}>{meta.date}</div>
                <div className={s.sub}>{item.car}</div>
              </div>
              <div className={s.endAligned}>
                <div className={s.price}>
                  {meta.price} {common.currency}
                </div>
                <div
                  className={clsx(
                    s.statusPill,
                    meta.done ? s.statusDone : s.statusCancelled,
                  )}
                >
                  {meta.done ? common.completed : common.cancelled}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}

export function ProfileScreen({ c }: Props) {
  const { profile } = c;
  const rows = [
    { goto: "vehicles", icon: <IconCar />, tint: "accent", title: profile.vehicles, sub: profile.vehiclesSub },
    { goto: "addresses", icon: <IconMapPin />, tint: "green", title: profile.addresses, sub: profile.addressesSub },
    { goto: "payment", icon: <IconCreditCard />, tint: "amber", title: profile.payment, sub: profile.paymentSub },
    { goto: "notifications", icon: <IconBell />, tint: "purple", title: profile.notifications },
    { goto: "language", icon: <IconWorld />, tint: "blue", title: profile.language, sub: profile.languageSub },
  ];

  return (
    <>
      <div className={local.profileHero}>
        <div className={clsx(s.avatar, local.profileAvatar)}>{profile.initial}</div>
        <div className={local.homeName}>{profile.name}</div>
        <div className={s.sub}>maamoun@email.com</div>
      </div>
      <div className={clsx(s.stats, local.profileStats)}>
        {[
          { value: "24" },
          { value: "5", color: "var(--app-red)" },
          { value: "820", color: "var(--app-green)" },
        ].map((stat, index) => (
          <div key={stat.value} className={s.stat}>
            <span className={s.statNum} style={stat.color ? { color: stat.color } : undefined}>
              {stat.value}
            </span>
            <span className={s.statLabel}>{profile.stats[index]}</span>
          </div>
        ))}
      </div>
      <div className={s.menu}>
        {rows.map((row) => (
          <button key={row.goto} type="button" className={s.menuRow} data-goto={row.goto}>
            <MenuIcon tint={row.tint}>{row.icon}</MenuIcon>
            <div className={s.grow}>
              <div className={s.menuTitle}>{row.title}</div>
              {row.sub && <div className={s.menuSub}>{row.sub}</div>}
            </div>
            <IconChevronRight className={s.chevron} />
          </button>
        ))}
        <button type="button" className={s.menuRow} data-app-theme>
          <MenuIcon tint="yellow">
            <IconSun />
          </MenuIcon>
          <div className={s.grow}>
            <div className={s.menuTitle}>{profile.appearance}</div>
            <div className={s.menuSub}>
              <span className={s.whenDark}>{profile.dark}</span>
              <span className={s.whenLight}>{profile.light}</span>
            </div>
          </div>
          <div className={clsx(s.switch, s.themeSwitch)} />
        </button>
        <button type="button" className={s.menuRow} data-goto="support">
          <MenuIcon tint="slate">
            <IconHelpCircle />
          </MenuIcon>
          <div className={s.grow}>
            <div className={s.menuTitle}>{profile.support}</div>
          </div>
          <IconChevronRight className={s.chevron} />
        </button>
      </div>
      <div className={local.logoutWrap}>
        <button type="button" className={local.logout}>
          {profile.logout}
        </button>
      </div>
    </>
  );
}

const TINTS: Record<string, string> = {
  accent: "var(--accent)",
  green: "var(--app-green)",
  amber: "var(--app-amber)",
  purple: "var(--app-purple)",
  blue: "var(--app-blue)",
  yellow: "var(--app-yellow)",
  slate: "var(--app-slate)",
};

export function MenuIcon({ tint, children }: { tint: string; children: React.ReactNode }) {
  const color = TINTS[tint];
  return (
    <div
      className={s.menuIcon}
      style={{ color, background: `color-mix(in srgb, ${color} 10%, transparent)` }}
    >
      {children}
    </div>
  );
}
