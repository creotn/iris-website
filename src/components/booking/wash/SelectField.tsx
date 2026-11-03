"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { IconCheck, IconChevronDown } from "@tabler/icons-react";
import styles from "./Wash.module.css";

export type SelectOption = { value: string; label: string; meta?: string; disabled?: boolean };

const LIST_MAX_HEIGHT = 280;
const GAP = 6;

/**
 * A themed dropdown for the booking popups. The list opens in the top layer (Popover API), so the
 * popup's scroll area can't clip it, and it flips above the field when there's no room below.
 * Focus stays on the trigger; the arrows move the highlighted option, Enter picks it, Escape closes.
 */
export default function SelectField({
  label,
  hint,
  full,
  value,
  onChange,
  options,
  placeholder,
  disabled,
}: {
  label: string;
  hint?: string;
  full?: boolean;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
}) {
  const id = useId();
  const labelId = `${id}-label`;
  const listId = `${id}-list`;
  const trigger = useRef<HTMLButtonElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);

  const selected = options.findIndex((option) => option.value === value);
  const current = options[selected];
  const enabled = (index: number) => Boolean(options[index] && !options[index].disabled);
  // The next enabled option from `from` in direction `dir`, or `from` itself when there is none.
  const step = (from: number, dir: 1 | -1) => {
    for (let index = from + dir; index >= 0 && index < options.length; index += dir) if (enabled(index)) return index;
    return from;
  };

  const show = () => {
    if (disabled) return;
    setActive(enabled(selected) ? selected : step(-1, 1));
    setOpen(true);
  };
  const hide = () => {
    setOpen(false);
    trigger.current?.focus();
  };
  const choose = (index: number) => {
    if (!enabled(index)) return;
    onChange(options[index].value);
    hide();
  };

  useLayoutEffect(() => {
    const listEl = list.current;
    const button = trigger.current;
    if (!open || !listEl || !button) return;
    listEl.showPopover();

    const place = () => {
      const rect = button.getBoundingClientRect();
      const height = Math.min(listEl.scrollHeight, LIST_MAX_HEIGHT);
      const below = window.innerHeight - rect.bottom - GAP;
      const up = below < height && rect.top > below;
      listEl.style.left = `${rect.left}px`;
      listEl.style.width = `${rect.width}px`;
      listEl.style.top = `${up ? rect.top - height - GAP : rect.bottom + GAP}px`;
      listEl.dataset.side = up ? "top" : "bottom";
    };
    place();

    const onScroll = (event: Event) => !listEl.contains(event.target as Node) && place();
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!listEl.contains(target) && !button.contains(target)) setOpen(false);
    };
    window.addEventListener("resize", place);
    document.addEventListener("scroll", onScroll, true);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.removeEventListener("resize", place);
      document.removeEventListener("scroll", onScroll, true);
      document.removeEventListener("pointerdown", onPointerDown);
      if (listEl.matches(":popover-open")) listEl.hidePopover();
    };
  }, [open]);

  useEffect(() => {
    if (open && active >= 0) list.current?.children[active]?.scrollIntoView({ block: "nearest" });
  }, [open, active]);

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (!open) {
      if (["ArrowDown", "ArrowUp", "Enter", " "].includes(event.key)) {
        event.preventDefault();
        show();
      }
      return;
    }
    const keys: Record<string, () => void> = {
      ArrowDown: () => setActive((index) => step(index, 1)),
      ArrowUp: () => setActive((index) => step(index, -1)),
      Home: () => setActive(step(-1, 1)),
      End: () => setActive(step(options.length, -1)),
      Enter: () => choose(active),
      " ": () => choose(active),
      // Stop here, so Escape closes the list and not the popup around it.
      Escape: () => {
        event.stopPropagation();
        hide();
      },
    };
    if (event.key === "Tab") return setOpen(false);
    if (!keys[event.key]) return;
    event.preventDefault();
    keys[event.key]();
  };

  return (
    <div className={`${styles.popField} ${full ? styles.popFull : ""}`}>
      <label id={labelId} htmlFor={id}>
        {label}
        {hint && <span className={styles.popOptional}>{hint}</span>}
      </label>
      <button
        ref={trigger}
        id={id}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-labelledby={`${labelId} ${id}`}
        aria-activedescendant={open && active >= 0 ? `${listId}-${active}` : undefined}
        disabled={disabled}
        className={`${styles.popInput} ${styles.selectTrigger}`}
        onClick={() => (open ? hide() : show())}
        onKeyDown={onKeyDown}
      >
        <span className={current ? styles.selectValue : `${styles.selectValue} ${styles.selectPlaceholder}`}>
          {current?.label ?? placeholder}
        </span>
        {current?.meta && <span className={styles.selectMeta}>{current.meta}</span>}
        <IconChevronDown className={styles.selectChevron} size={18} stroke={2} aria-hidden />
      </button>

      <ul ref={list} id={listId} role="listbox" popover="manual" aria-labelledby={labelId} className={styles.selectList}>
        {options.map((option, index) => (
          <li
            key={option.value}
            id={`${listId}-${index}`}
            role="option"
            aria-selected={option.value === value}
            aria-disabled={option.disabled || undefined}
            data-active={index === active || undefined}
            className={styles.selectOption}
            onPointerEnter={() => enabled(index) && setActive(index)}
            onClick={() => choose(index)}
          >
            <span className={styles.selectValue}>{option.label}</span>
            {option.meta && <span className={styles.selectMeta}>{option.meta}</span>}
            <IconCheck className={styles.selectCheck} size={16} stroke={2.5} aria-hidden />
          </li>
        ))}
      </ul>
    </div>
  );
}
