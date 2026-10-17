import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cx } from "../lib/cx";
import { Icon, type IconName } from "./Icon";

export type AlertTone = "info" | "success" | "warning" | "danger";

/** Mismo criterio que Field y Badge: "x" para error, "alert" para advertencia. */
const defaultIcons: Record<AlertTone, IconName> = { info: "info", success: "check-circle", warning: "alert", danger: "alert" };

export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  tone?: AlertTone;
  /** Qué pasa, corto: "No se pudo cargar". */
  title?: ReactNode;
  /** Qué hacer o por qué: "Revisá la conexión y probá de nuevo." */
  children?: ReactNode;
  /** Por defecto, el del tono. false lo saca. */
  icon?: IconName | false;
  /** Un botón chico: "Reintentar", "Cargar datos". */
  action?: ReactNode;
}

/** Aviso dentro de la pantalla. danger se anuncia ya (role="alert"); el resto, sin interrumpir (role="status"). */
export const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  { tone = "info", title, children, icon, action, className, ...rest },
  ref,
) {
  const name = icon ?? defaultIcons[tone];
  return (
    <div ref={ref} role={tone === "danger" ? "alert" : "status"} className={cx("alert", `alert-${tone}`, className)} {...rest}>
      {name && <Icon name={name} />}
      <div className="alert-body">
        {title != null && <b className="alert-title">{title}</b>}
        {children != null && <div>{children}</div>}
      </div>
      {action != null && <div className="alert-action">{action}</div>}
    </div>
  );
});
