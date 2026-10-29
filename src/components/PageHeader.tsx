import type { HTMLAttributes, ReactNode } from "react";
import { cx } from "../lib/cx";

export interface PageHeaderProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  /** Rótulo chico arriba del título: "Finanzas · Octubre". En `sticky`, el dato chico a la izquierda del título (nombre de la rutina). */
  eyebrow?: ReactNode;
  /** El nombre de la pantalla. Va como h1. */
  title: ReactNode;
  /** Una línea que explica qué se ve. En `sticky` no se muestra (la barra es compacta). */
  description?: ReactNode;
  /** A la derecha: lo que cambia lo que se ve (selector de mes, filtros). En teléfono baja debajo del título. */
  actions?: ReactNode;
  /**
   * Barra superior fija: fondo surface translúcido con blur, borde inferior y safe-area.
   * Título compacto; pensada para las pestañas de Gym.
   */
  sticky?: boolean;
}

/** Cabecera de pantalla. Una por pantalla. Con `sticky` queda fija al scrollear. */
export function PageHeader({ eyebrow, title, description, actions, sticky, className, ...rest }: PageHeaderProps) {
  return (
    <header className={cx("page-header", sticky && "page-header-sticky", className)} {...rest}>
      <div className="page-header-text">
        {eyebrow != null && <p className="eyebrow">{eyebrow}</p>}
        <h1 className="display page-title">{title}</h1>
        {!sticky && description != null && <p className="page-desc">{description}</p>}
      </div>
      {actions != null && <div className="page-actions">{actions}</div>}
    </header>
  );
}
