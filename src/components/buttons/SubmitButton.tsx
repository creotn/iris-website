"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton(
  props: React.ButtonHTMLAttributes<HTMLButtonElement> & {
    children?: React.ReactNode;
  }
) {
  const { pending, data } = useFormStatus();

  const { children, ...rest } = props;

  return (
    <button
      type="submit"
      disabled={pending || props.disabled}
      {...rest}
      style={{
        ...rest.style,
        opacity: pending || props.disabled ? 0.5 : 1,
        transition: "opacity 0.2s, background-color 0.2s, color 0.2s",
      }}
    >
      {children}
    </button>
  );
}
