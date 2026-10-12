import type { HTMLAttributes, ReactNode } from "react";
import { cx } from "../lib/cx";
import { Icon, type IconName } from "./Icon";

export interface EmptyStateProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  icon?: IconName;
  /** Qué falta: "Todavía no cargaste gastos". */
  title: ReactNode;
  /** Cómo seguir: "Cargá el primero o importá el resumen de la tarjeta." */
  children?: ReactNode;
  /** Un botón chico. */
  action?: ReactNode;
}

export function EmptyState({ icon = "inbox", title, children, action, className, ...rest }: EmptyStateProps) {
  return (
    <div className={cx("empty", className)} {...rest}>
      <div className="ic-wrap">
        <Icon name={icon} />
      </div>
      <b style={{ fontSize: "var(--text-sm)" }}>{title}</b>
      {children != null && <p>{children}</p>}
      {action}
    </div>
  );
}
