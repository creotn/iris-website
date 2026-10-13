import type { Metadata } from "next";
import { setStaticParamsLocale } from "next-international/server";
import { IconCalendar, IconClock, IconHome, IconUser } from "@tabler/icons-react";
import PhoneDemo from "@/components/app-prototype/PhoneDemo";
import { resolveLocale } from "@/locales/resolveLocale";
import { getCustomerContent } from "./_content";
import GallerySection from "./_components/GallerySection";
import {
  AuthScreen,
  BookScreen,
  HistoryScreen,
  HomeScreen,
  ProfileScreen,
  TrackScreen,
} from "./_components/MainScreens";
import {
  AddressesScreen,
  LanguageScreen,
  NotificationsScreen,
  PaymentScreen,
  SupportScreen,
  VehiclesScreen,
} from "./_components/SubScreens";
import styles from "./_components/CustomerPage.module.css";

export const revalidate = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { meta } = getCustomerContent(resolveLocale((await params).locale));
  return {
    title: meta.title,
    description: meta.description,
    robots: { index: false, follow: false },
  };
}

export default async function CustomerAppPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = resolveLocale((await params).locale);
  setStaticParamsLocale(locale);
  const c = getCustomerContent(locale);

  const screens = [
    { id: "auth", node: <AuthScreen c={c} /> },
    { id: "home", node: <HomeScreen c={c} /> },
    { id: "book", node: <BookScreen c={c} /> },
    { id: "track", node: <TrackScreen c={c} /> },
    { id: "history", node: <HistoryScreen c={c} /> },
    { id: "profile", node: <ProfileScreen c={c} /> },
    { id: "vehicles", node: <VehiclesScreen c={c} /> },
    { id: "addresses", node: <AddressesScreen c={c} /> },
    { id: "payment", node: <PaymentScreen c={c} /> },
    { id: "notifications", node: <NotificationsScreen c={c} /> },
    { id: "language", node: <LanguageScreen c={c} /> },
    { id: "support", node: <SupportScreen c={c} /> },
  ];

  const tabs = (["auth", "home", "book", "track", "history", "profile"] as const).map(
    (screen) => ({ screen, label: c.demo.tabs[screen] }),
  );

  const tabBar = [
    { screen: "home", label: c.common.navHome, icon: <IconHome /> },
    { screen: "book", label: c.common.navBook, icon: <IconCalendar /> },
    { screen: "history", label: c.common.navHistory, icon: <IconClock /> },
    { screen: "profile", label: c.common.navProfile, icon: <IconUser /> },
  ];

  return (
    <main>
      <section className={styles.hero}>
        <div className="grid-bg" />
        <div className={`glow-orb ${styles.heroOrb}`} />
        <div className={`container ${styles.heroInner}`}>
          <div className={styles.heroCopy}>
            <h1 className="heading-2 animate-in">{c.hero.title}</h1>
            <p className={`body-lg ${styles.heroLead} animate-in animate-delay-1`}>
              {c.hero.lead}
            </p>
            <div className={`${styles.tryCard} animate-in animate-delay-2`}>
              <span className={styles.livePulse} aria-hidden />
              <div>
                <h2 className={styles.tryTitle}>{c.demo.title}</h2>
                <p className={styles.tryLead}>{c.demo.lead}</p>
              </div>
            </div>
          </div>
          <div className={`${styles.heroDemo} animate-in animate-delay-2`}>
            <PhoneDemo
              screens={screens}
              tabs={tabs}
              tabBar={tabBar}
              initialScreen="home"
              accentStatusScreens={["profile"]}
              autoPlayMs={4000}
              compact
            />
          </div>
        </div>
      </section>

      <GallerySection c={c} />
    </main>
  );
}
