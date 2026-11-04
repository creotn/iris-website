import type { ReactNode } from "react";
import { mascotPoses } from "./footer.content";
import styles from "./AuthLayout.module.css";

// Centred auth card with the IRIS mascot peeking over its top edge.
// All mascot motion is CSS (AuthLayout.module.css): it pops up on load, sways,
// ducks behind the card while a password field has focus, and shakes on an error.
export default function AuthLayout({ children }: { children: ReactNode }) {
  const { src, w, h } = mascotPoses.peek;

  return (
    <main className={`container ${styles.main}`}>
      <div className={styles.shell}>
        <div className={styles.stage} aria-hidden="true">
          <div className={styles.peek}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} width={w} height={h} alt="" className={styles.mascot} draggable={false} />
          </div>
        </div>
        <div className={styles.card}>{children}</div>
      </div>
    </main>
  );
}
