"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Item = { href: string; label: string };

/** The desktop nav: marks the link of the section that currently holds the middle of the viewport. */
export default function SectionNav({
  links,
  className,
  linkClassName,
}: {
  links: Item[];
  className: string;
  linkClassName: string;
}) {
  const [active, setActive] = useState("");
  const key = links.map((link) => link.href).join();

  // Sections stream in (the hero and pricing wait on the API), so they are looked up on each scroll
  // frame rather than observed once at mount, when some of them don't exist yet.
  useEffect(() => {
    const ids = key.split(",").map((href) => href.split("#")[1]);
    let frame = 0;

    const update = () => {
      frame = 0;
      const middle = window.innerHeight / 2;
      const current = ids.find((id) => {
        const rect = document.getElementById(id)?.getBoundingClientRect();
        return rect && rect.top <= middle && rect.bottom > middle;
      });
      setActive(current ?? "");
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [key]);

  return (
    <ul className={className}>
      {links.map((link) => (
        <li key={link.href}>
          <Link
            href={link.href}
            className={linkClassName}
            aria-current={active && link.href.endsWith(`#${active}`) ? "true" : undefined}
          >
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}
