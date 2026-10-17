import { useId, type CSSProperties, type ReactNode } from "react";
import { cx } from "../lib/cx";
import { defaultRenderLink, type RenderLink } from "../lib/link";
import { Icon, type IconName } from "./Icon";

export interface SideNavItem<V extends string = string> {
  label: string;
  icon?: IconName;
  /** Destino de router: se dibuja con `renderLink`. */
  href?: string;
  /** Sin `href`: botón que llama a `onValueChange`. */
  value?: V;
  /** Fuerza el estado activo. Si falta, se compara `value` con el `value` del SideNav. */
  active?: boolean;
  /** Algo chico a la derecha: un número, una Badge. */
  aside?: ReactNode;
}

export interface SideNavGroup<V extends string = string> {
  /** Rótulo del grupo, en mayúsculas mono. */
  title?: string;
  items: SideNavItem<V>[];
}

export interface SideNavAction {
  label: string;
  icon?: IconName;
  onClick?: () => void;
  /** Con `href` se dibuja como link, con `renderLink`. */
  href?: string;
}

export interface SideNavProps<V extends string = string> {
  groups: SideNavGroup<V>[];
  /** Logo o nombre de la app, arriba de todo. */
  brand?: ReactNode;
  /** El botón principal, debajo de la marca. Por ejemplo "Cargar gasto". */
  primaryAction?: SideNavAction;
  /** Pegado abajo: selector de tema, "Salir". */
  footer?: ReactNode;
  /** Para items con `value`: el activo y el cambio. */
  value?: V;
  onValueChange?: (value: V) => void;
  /** Cómo dibujar los links. Pasá el `NavLink` de react-router o el `Link` de Next. Por defecto, <a>. */
  renderLink?: RenderLink;
  "aria-label"?: string;
  className?: string;
  style?: CSSProperties;
}

/**
 * Navegación lateral de escritorio: un aside sticky de alto completo, con grupos rotulados,
 * una acción principal arriba y un pie. No sabe de routers: los links salen de `renderLink`.
 */
export function SideNav<V extends string = string>({
  groups,
  brand,
  primaryAction,
  footer,
  value,
  onValueChange,
  renderLink = defaultRenderLink,
  className,
  style,
  ...rest
}: SideNavProps<V>) {
  const id = useId();

  const item = (it: SideNavItem<V>, key: number) => {
    const active = it.active ?? (it.value !== undefined && it.value === value);
    const content = (
      <>
        {it.icon && <Icon name={it.icon} />}
        <span className="snav-label">{it.label}</span>
        {it.aside != null && <span className="snav-aside">{it.aside}</span>}
      </>
    );
    return (
      <li key={it.href ?? it.value ?? key}>
        {it.href !== undefined ? (
          renderLink({ href: it.href, className: "snav-item", "aria-current": active ? "page" : undefined, children: content })
        ) : (
          <button
            type="button"
            className="snav-item"
            aria-current={active ? "page" : undefined}
            onClick={() => it.value !== undefined && onValueChange?.(it.value)}
          >
            {content}
          </button>
        )}
      </li>
    );
  };

  let action: ReactNode = null;
  if (primaryAction) {
    const { label, icon = "plus", onClick, href } = primaryAction;
    const inner = (<><Icon name={icon} />{label}</>);
    const cls = "btn btn-primary btn-block snav-action";
    action = href !== undefined
      ? renderLink({ href, className: cls, onClick, children: inner })
      : <button type="button" className={cls} onClick={onClick}>{inner}</button>;
  }

  return (
    <aside className={cx("snav", className)} style={style}>
      {brand && <div className="snav-brand">{brand}</div>}
      {action}
      <nav className="snav-groups" aria-label={rest["aria-label"] ?? "Secciones"}>
        {groups.map((g, i) => (
          <div key={g.title ?? i} className="snav-group">
            {g.title && <p id={`${id}-g${i}`} className="eyebrow">{g.title}</p>}
            <ul aria-labelledby={g.title ? `${id}-g${i}` : undefined}>{g.items.map(item)}</ul>
          </div>
        ))}
      </nav>
      {footer && <div className="snav-footer">{footer}</div>}
    </aside>
  );
}
