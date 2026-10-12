import { forwardRef, type HTMLAttributes } from "react";
import { cx } from "../lib/cx";
import { Icon, type IconName } from "./Icon";

export type BadgeTone = "neutral" | "brand" | "success" | "warning" | "danger" | "info" | "solid";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
  /** Ícono antes del texto. Todo estado lleva ícono o punto además del color. */
  icon?: IconName;
  /** Punto del color del texto, para estados vivos: "En vivo", "Pagado". */
  dot?: boolean;
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { tone = "neutral", icon, dot, className, children, ...rest },
  ref,
) {
  return (
    <span ref={ref} className={cx("badge", tone !== "neutral" && `badge-${tone}`, className)} {...rest}>
      {dot && <span className="dot" aria-hidden="true" />}
      {icon && <Icon name={icon} />}
      {children}
    </span>
  );
});
