import clsx from "clsx";
import {
  IconBriefcase,
  IconCar,
  IconCheck,
  IconChevronLeft,
  IconChevronRight,
  IconHelpCircle,
  IconHome,
  IconMail,
  IconMessage,
  IconPhone,
  IconShield,
} from "@tabler/icons-react";
import s from "@/components/app-prototype/AppPrototype.module.css";
import type { CustomerContent } from "../_content";
import { MenuIcon } from "./MainScreens";
import local from "./CustomerPage.module.css";

type Props = { c: CustomerContent };

function SubHeader({ title }: { title: string }) {
  return (
    <div className={s.headerBar}>
      <button type="button" className={s.iconBtn} data-goto="profile" aria-label="back">
        <IconChevronLeft className={s.backIcon} />
      </button>
      <h3>{title}</h3>
      <div className={s.headerSpacer} />
    </div>
  );
}

function DefaultPill({ label }: { label: string }) {
  return <div className={clsx(s.pill, s.pillGreen)}>{label}</div>;
}

export function VehiclesScreen({ c }: Props) {
  const tints = ["var(--accent)", "var(--iris-deep)"];
  return (
    <>
      <SubHeader title={c.vehicles.title} />
      {c.vehicles.items.map((vehicle, index) => (
        <div key={vehicle.name} className={clsx(s.card, s.cardRow)}>
          <div
            className={s.tile}
            style={{ color: tints[index], background: "rgba(106, 79, 182, 0.1)" }}
          >
            <IconCar size={22} stroke={1.5} />
          </div>
          <div className={s.grow}>
            <div className={s.title}>{vehicle.name}</div>
            <div className={s.sub}>{vehicle.detail}</div>
          </div>
          {index === 0 && <DefaultPill label={c.common.defaultF} />}
        </div>
      ))}
      <div className={s.padded}>
        <button type="button" className={clsx(s.btn, s.btnDashed)}>
          {c.vehicles.add}
        </button>
      </div>
    </>
  );
}

export function AddressesScreen({ c }: Props) {
  const { addresses } = c;
  return (
    <>
      <SubHeader title={addresses.title} />
      <div className={clsx(s.card, s.cardRow, s.cardRowTop)}>
        <div
          className={clsx(s.tile, s.tileSm)}
          style={{ color: "var(--app-green)", background: "rgba(31, 138, 91, 0.1)" }}
        >
          <IconHome size={18} stroke={1.5} />
        </div>
        <div className={s.grow}>
          <div className={s.title}>{addresses.home}</div>
          <div className={s.sub}>{addresses.homeAddress}</div>
        </div>
        <DefaultPill label={c.common.defaultM} />
      </div>
      <div className={clsx(s.card, s.cardRow, s.cardRowTop)}>
        <div
          className={clsx(s.tile, s.tileSm)}
          style={{ color: "var(--accent)", background: "rgba(106, 79, 182, 0.1)" }}
        >
          <IconBriefcase size={18} stroke={1.5} />
        </div>
        <div className={s.grow}>
          <div className={s.title}>{addresses.work}</div>
          <div className={s.sub}>{addresses.workAddress}</div>
        </div>
      </div>
      <div className={s.padded}>
        <button type="button" className={clsx(s.btn, s.btnDashed)}>
          {addresses.add}
        </button>
      </div>
    </>
  );
}

export function PaymentScreen({ c }: Props) {
  const { payment } = c;
  const cards = [
    { brand: "VISA", name: "Visa **** 4521", expiry: "08/27", className: local.visa },
    { brand: "MC", name: "Mastercard **** 8903", expiry: "03/26", className: local.mastercard },
  ];
  return (
    <>
      <SubHeader title={payment.title} />
      <div className={s.card}>
        {cards.map((card, index) => (
          <div key={card.name}>
            {index > 0 && <div className={s.divider} />}
            <div className={clsx(s.cardRow, local.paymentRow)}>
              <div className={clsx(local.cardBrand, card.className)}>{card.brand}</div>
              <div className={s.grow}>
                <div className={s.title}>{card.name}</div>
                <div className={s.sub}>
                  {payment.expires} {card.expiry}
                </div>
              </div>
              {index === 0 && <DefaultPill label={c.common.defaultF} />}
            </div>
          </div>
        ))}
      </div>
      <div className={clsx(s.card, s.cardRow, s.cardTint)}>
        <IconShield size={18} color="var(--accent)" stroke={1.5} />
        <span className={local.secureText}>{payment.secure}</span>
      </div>
      <div className={s.padded}>
        <button type="button" className={clsx(s.btn, s.btnDashed)}>
          {payment.add}
        </button>
      </div>
    </>
  );
}

export function NotificationsScreen({ c }: Props) {
  const enabled = [true, true, false];
  return (
    <>
      <SubHeader title={c.notifications.title} />
      <div className={s.card}>
        {c.notifications.rows.map((row, index) => (
          <div key={row.title}>
            {index > 0 && <div className={s.divider} />}
            <div className={clsx(s.spread, local.notifRow)}>
              <div>
                <div className={s.title}>{row.title}</div>
                <div className={s.sub}>{row.sub}</div>
              </div>
              <div className={clsx(s.switch, enabled[index] && s.switchOn)} />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export function LanguageScreen({ c }: Props) {
  const languages = [
    { flag: "🇸🇦", name: "العربية", sub: "Arabic", selected: true },
    { flag: "🇬🇧", name: "English", sub: c.language.englishSub, selected: false },
    { flag: "🇫🇷", name: "Français", sub: c.language.frenchSub, selected: false },
  ];
  return (
    <>
      <SubHeader title={c.language.title} />
      {languages.map((language) => (
        <div
          key={language.name}
          className={clsx(s.card, s.cardRow, language.selected && s.cardSelected)}
        >
          <div className={local.flag}>{language.flag}</div>
          <div className={s.grow}>
            <div className={s.title}>{language.name}</div>
            <div className={s.sub}>{language.sub}</div>
          </div>
          {language.selected && <IconCheck size={18} color="var(--accent)" />}
        </div>
      ))}
    </>
  );
}

export function SupportScreen({ c }: Props) {
  const { support } = c;
  return (
    <>
      <SubHeader title={support.title} />
      <div className={s.menu}>
        <div className={s.menuRow}>
          <MenuIcon tint="accent">
            <IconMessage />
          </MenuIcon>
          <div className={s.grow}>
            <div className={s.menuTitle}>{support.chat}</div>
            <div className={s.menuSub}>{support.chatSub}</div>
          </div>
          <DefaultPill label={support.online} />
        </div>
        <div className={s.menuRow}>
          <MenuIcon tint="green">
            <IconPhone />
          </MenuIcon>
          <div className={s.grow}>
            <div className={s.menuTitle}>{support.call}</div>
            <div className={s.menuSub}>
              <span dir="ltr">+966 11 XXX XXXX</span>
            </div>
          </div>
        </div>
        <div className={s.menuRow}>
          <MenuIcon tint="amber">
            <IconHelpCircle />
          </MenuIcon>
          <div className={s.grow}>
            <div className={s.menuTitle}>{support.faq}</div>
          </div>
          <IconChevronRight className={s.chevron} />
        </div>
        <div className={s.menuRow}>
          <MenuIcon tint="purple">
            <IconMail />
          </MenuIcon>
          <div className={s.grow}>
            <div className={s.menuTitle}>{support.email}</div>
            <div className={s.menuSub}>support@iris.sa</div>
          </div>
        </div>
      </div>
      <div className={local.version}>{support.version}</div>
    </>
  );
}
