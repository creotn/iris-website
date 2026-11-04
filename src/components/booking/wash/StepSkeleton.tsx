"use client";

import { useSyncExternalStore } from "react";
import { Skeleton } from "@/components/skeleton/Skeleton";
import table from "@/components/table/DataTable.module.css";
import shellStyles from "../StepShell.module.css";
import { readFlow, urlPhase, type Phase } from "./draft";
import { STEP_TOTAL } from "./ui";
import sk from "./StepSkeleton.module.css";
import styles from "./Wash.module.css";

// Label widths for the five steps: car, location, service, review & pay, confirmation.
const STEP_LABELS = [36, 64, 52, 92, 96];
const STEP_INDEX: Record<Phase, number> = { car: 1, address: 2, service: 3, checkout: 4, done: 5 };

const noSubscribe = () => () => {};
// The step in the address bar, else the one a refresh will return to; unknown on the server.
const currentStep = (): Phase => urlPhase() ?? readFlow()?.phase ?? "car";

/**
 * The booking's loading screen, shaped like the step being opened: the stepper with that step lit,
 * its heading, and its own content. Built from the real step classes so nothing moves once it loads.
 */
export default function StepSkeleton() {
  const phase = useSyncExternalStore(noSubscribe, currentStep, () => null);
  const step = phase ? STEP_INDEX[phase] : 1;

  return (
    <div className={styles.flow} aria-busy="true">
      <aside className={styles.flowSide}>
        <div className={styles.sideRail}>
          {STEP_LABELS.map((_, index) => (
            <span key={index} className={styles.sideItem}>
              <Skeleton width="38px" height="38px" radius="circle" />
              {index < STEP_LABELS.length - 1 && <span style={{ blockSize: 30 }} />}
            </span>
          ))}
        </div>
      </aside>

      <div className={`${shellStyles.shell} ${styles.flowMain}`}>
        <div className={shellStyles.bar}>{step > 1 && step < STEP_TOTAL && <Skeleton width="72px" height="20px" />}</div>

        <ol className={`${styles.stepper6} ${styles.flowMobile}`}>
          {STEP_LABELS.map((width, index) => (
            <li key={index} className={`${styles.stepItem} ${index + 1 === step ? sk.now : ""}`}>
              <Skeleton width="var(--dot)" height="var(--dot)" radius="circle" className={sk.dot} />
              <Skeleton width={`${width}px`} height="12px" className={sk.label} />
            </li>
          ))}
        </ol>

        <div className={styles.stack}>
          {phase === "done" ? <DoneHead /> : <Heading />}
          {phase === "car" && <CarBody />}
          {phase === "address" && <AddressBody />}
          {phase === "service" && <ServiceBody />}
          {phase === "checkout" && <CheckoutBody />}
          {phase === "done" && <DoneBody />}
          {phase === null && <Skeleton height="320px" radius="lg" />}
        </div>
      </div>
    </div>
  );
}

function Heading() {
  return (
    <div className={sk.heading}>
      <Skeleton width="80px" height="14px" />
      <Skeleton width="min(520px, 80%)" height="calc(clamp(2rem, 5vw, 3rem) * 1.15)" />
      <Skeleton width="min(420px, 70%)" height="16px" />
    </div>
  );
}

function Footer() {
  return (
    <div className={styles.stepFooter}>
      <span className={sk.summary}>
        <Skeleton width="56px" height="12px" />
        <Skeleton width="180px" height="18px" />
      </span>
      <Skeleton width="200px" height="58px" radius="md" className={sk.cta} />
    </div>
  );
}

function CarBody() {
  return (
    <>
      <div>
        <div className={styles.carBar}>
          <Skeleton width="96px" height="16px" />
          <Skeleton width="118px" height="40px" radius="sm" />
        </div>
        <table className={`${table.table} ${table.roomy}`}>
          <thead>
            <tr>
              {[40, 64, 44, 36, 88].map((width, index) => (
                <th key={index} className={index > 0 && index < 4 ? table.hideMd : index === 4 ? table.hideSm : undefined}>
                  <Skeleton width={`${width}px`} height="12px" />
                </th>
              ))}
              <th className={table.actions} />
            </tr>
          </thead>
          <tbody>
            {[46, 38, 52].map((width) => (
              <tr key={width}>
                <td className={table.grow}>
                  <span className={table.cell}>
                    <Skeleton width="40px" height="40px" radius="sm" />
                    <Skeleton width={`${width * 3}px`} height="16px" />
                  </span>
                </td>
                <td className={table.hideMd}>
                  <Skeleton width="64px" height="14px" />
                </td>
                <td className={table.hideMd}>
                  <Skeleton width="56px" height="14px" />
                </td>
                <td className={table.hideMd}>
                  <Skeleton width="40px" height="14px" />
                </td>
                <td className={table.hideSm}>
                  <Skeleton width="96px" height="26px" radius="sm" />
                </td>
                <td className={table.actions}>
                  <Skeleton width="34px" height="34px" radius="sm" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Footer />
    </>
  );
}

function AddressBody() {
  return (
    <>
      <div className={styles.locToolbar}>
        <Skeleton width="220px" height="56px" radius="md" />
        <Skeleton width="auto" height="56px" radius="md" className={sk.grow} />
        <Skeleton width="56px" height="56px" radius="md" />
      </div>
      <Skeleton height="clamp(300px, 46vh, 460px)" radius="lg" />
      <Footer />
    </>
  );
}

function ServiceBody() {
  return (
    <>
      <Skeleton width="90px" height="14px" />
      <div className={sk.tabs}>
        {[28, 96, 92, 52, 64].map((width) => (
          <Skeleton key={width} width={`${width}px`} height="16px" />
        ))}
      </div>
      <div className={styles.serviceGrid}>
        {Array.from({ length: 6 }, (_, index) => (
          <div key={index} className={`${styles.svcCard} ${sk.card}`}>
            <span className={sk.row}>
              <Skeleton width="96px" height="12px" />
              <Skeleton width="52px" height="12px" />
            </span>
            <Skeleton width="70%" height="22px" />
            <Skeleton width="92%" height="14px" />
            <Skeleton width="64%" height="14px" />
            <span className={sk.row}>
              <Skeleton width="104px" height="28px" />
              <Skeleton width="42px" height="42px" radius="sm" />
            </span>
          </div>
        ))}
      </div>
      <Footer />
    </>
  );
}

function CheckoutBody() {
  return (
    <div className={styles.checkout}>
      <div className={styles.coPay}>
        <Skeleton width="110px" height="22px" />
        <div className={styles.coMethods}>
          {[0, 1, 2].map((index) => (
            <Skeleton key={index} height="64px" radius="md" />
          ))}
        </div>
        <Skeleton width="min(380px, 80%)" height="14px" />
      </div>

      <div className={`${styles.coSummary} ${sk.static}`}>
        <span className={sk.row}>
          <Skeleton width="96px" height="18px" />
          <Skeleton width="44px" height="14px" />
        </span>
        <span className={sk.row}>
          <Skeleton width="44px" height="44px" radius="sm" />
          <Skeleton width="60%" height="16px" />
        </span>
        {[0, 1, 2, 3].map((index) => (
          <span key={index} className={sk.row}>
            <Skeleton width="72px" height="13px" />
            <Skeleton width={`${40 + index * 8}%`} height="13px" />
          </span>
        ))}
        <Skeleton height="44px" radius="sm" />
        {[0, 1, 2].map((index) => (
          <span key={index} className={sk.row}>
            <Skeleton width="64px" height="14px" />
            <Skeleton width="72px" height="14px" />
          </span>
        ))}
        <Skeleton height="58px" radius="md" />
      </div>
    </div>
  );
}

function DoneHead() {
  return (
    <div className={sk.heading}>
      <Skeleton width="80px" height="14px" />
      <Skeleton width="min(460px, 70%)" height="calc(clamp(2.2rem, 5vw, 3.6rem) * 1.1)" />
      <Skeleton width="min(360px, 70%)" height="16px" />
    </div>
  );
}

function DoneBody() {
  return (
    <div className={styles.doneColumns}>
      <div className={sk.lines}>
        {[0, 1, 2, 3].map((index) => (
          <span key={index} className={sk.row}>
            <Skeleton width="72px" height="14px" />
            <Skeleton width={index === 3 ? "160px" : "120px"} height={index === 3 ? "36px" : "18px"} />
          </span>
        ))}
      </div>
      <div className={sk.lines}>
        {[0, 1, 2, 3, 4].map((index) => (
          <span key={index} className={sk.row}>
            <Skeleton width={`${120 + index * 16}px`} height="16px" />
            <Skeleton width="24px" height="24px" radius="circle" />
          </span>
        ))}
        <Skeleton height="64px" radius="md" />
      </div>
    </div>
  );
}
