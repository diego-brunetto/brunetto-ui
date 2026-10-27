import { createContext, useContext, type HTMLAttributes, type MouseEventHandler, type ReactNode } from "react";
import { cx } from "../lib/cx";
import { defaultRenderLink, type RenderLink } from "../lib/link";
import { Icon } from "./Icon";

const LinkContext = createContext<RenderLink>(defaultRenderLink);

export interface ListProps extends HTMLAttributes<HTMLUListElement> {
  /** Con borde y fondo propio, como una Card. Sin esto, las filas van a ras del contenedor. */
  inset?: boolean;
  /** Cómo se dibujan las filas con `href`: el Link de Next, React Router, etc. */
  renderLink?: RenderLink;
}

/** Lista de filas con divisores. Adentro van `ListItem` y, para agrupar, `ListHeader`. */
export function List({ inset, renderLink = defaultRenderLink, className, ...rest }: ListProps) {
  return (
    <LinkContext.Provider value={renderLink}>
      <ul className={cx("list", inset && "list-inset", className)} {...rest} />
    </LinkContext.Provider>
  );
}

/** Rótulo de un grupo de filas: "Pecho", "Espalda". */
export function ListHeader({ className, children, ...rest }: HTMLAttributes<HTMLLIElement>) {
  return (
    <li role="presentation" className={cx("list-header", className)} {...rest}>
      {children}
    </li>
  );
}

export interface ListItemProps {
  title: ReactNode;
  /** Segunda línea, más chica: "4 series · 8-10 reps". */
  description?: ReactNode;
  /** Ícono o avatar a la izquierda. */
  leading?: ReactNode;
  /** A la derecha: un valor, un Badge, un Switch. */
  trailing?: ReactNode;
  /** Flecha a la derecha, para filas que llevan a otra pantalla. */
  chevron?: boolean;
  /** Con `href` la fila es un link (se dibuja con `renderLink` de la List). */
  href?: string;
  /** Con `onClick` (y sin `href`) la fila es un botón. */
  onClick?: MouseEventHandler<HTMLElement>;
  disabled?: boolean;
  /** Por qué no se puede elegir: reemplaza la descripción mientras está deshabilitada. */
  disabledReason?: ReactNode;
  /** Elegida: fondo de marca suave. */
  selected?: boolean;
  className?: string;
}

/**
 * Fila tocable o estática. Si `trailing` tiene un control propio (un Switch),
 * dejá la fila sin `href` ni `onClick` para no anidar elementos interactivos.
 */
export function ListItem({
  title,
  description,
  leading,
  trailing,
  chevron,
  href,
  onClick,
  disabled,
  disabledReason,
  selected,
  className,
}: ListItemProps) {
  const renderLink = useContext(LinkContext);
  const cls = cx("list-item", selected && "is-selected", disabled && "is-disabled", className);
  const secondary = disabled && disabledReason != null ? disabledReason : description;

  const content = (
    <>
      {leading != null && <span className="list-leading">{leading}</span>}
      <span className="list-text">
        <span className="list-title">{title}</span>
        {secondary != null && <span className="list-desc">{secondary}</span>}
      </span>
      {trailing != null && <span className="list-trailing">{trailing}</span>}
      {chevron && <Icon name="chevron-right" className="list-chevron" />}
    </>
  );

  let row: ReactNode;
  if (href && !disabled) {
    row = renderLink({ href, className: cls, onClick, "aria-current": selected ? "page" : undefined, children: content });
  } else if (onClick || (href && disabled)) {
    row = (
      <button type="button" className={cls} onClick={onClick} disabled={disabled} aria-pressed={selected || undefined}>
        {content}
      </button>
    );
  } else {
    row = (
      <div className={cls} aria-disabled={disabled || undefined}>
        {content}
      </div>
    );
  }

  return <li>{row}</li>;
}
