import type { ButtonHTMLAttributes } from "react";

type P = ButtonHTMLAttributes<HTMLButtonElement> & { on?: boolean };

export function Chip({ on, className = "", type = "button", ...rest }: P) {
  return <button type={type} className={`chip${on ? " chip--on" : ""}${className ? " " + className : ""}`} {...rest} />;
}
