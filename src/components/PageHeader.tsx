import type { HTMLAttributes, ReactNode } from "react";
import { cx } from "../lib/cx";

export interface PageHeaderProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  /** Rótulo chico arriba del título: "Finanzas · Octubre". */
  eyebrow?: ReactNode;
  /** El nombre de la pantalla. Va como h1. */
  title: ReactNode;
  /** Una línea que explica qué se ve. */
  description?: ReactNode;
  /** A la derecha: lo que cambia lo que se ve (selector de mes, filtros). En teléfono baja debajo del título. */
  actions?: ReactNode;
}

/** Cabecera de pantalla. Una por pantalla. */
export function PageHeader({ eyebrow, title, description, actions, className, ...rest }: PageHeaderProps) {
  return (
    <header className={cx("page-header", className)} {...rest}>
      <div className="page-header-text">
        {eyebrow != null && <p className="eyebrow">{eyebrow}</p>}
        <h1 className="display page-title">{title}</h1>
        {description != null && <p className="page-desc">{description}</p>}
      </div>
      {actions != null && <div className="page-actions">{actions}</div>}
    </header>
  );
}
