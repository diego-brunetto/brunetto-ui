import { Fragment, useState, type ReactNode } from "react";
import { cx } from "../lib/cx";
import { defaultRenderLink, type RenderLink } from "../lib/link";
import { useIndicator } from "../lib/useIndicator";
import { Icon, type IconName } from "./Icon";
import { Sheet } from "./Sheet";

/** Con `href` se dibuja como link (vía `renderLink`); con `value` solo, como botón que llama a `onValueChange`. */
export type BottomNavItem<V extends string> = { label: string; icon: IconName } & (
  | { value: V; href?: string }
  | { href: string; value?: V }
);

export interface BottomNavOverflow<V extends string> {
  /** Secciones que no entran en la barra: se muestran en grilla dentro de la hoja. */
  items: BottomNavItem<V>[];
  label?: string;
  icon?: IconName;
  /** Título de la hoja. Por defecto, `label`. */
  title?: ReactNode;
  /** Pie de la hoja: selector de tema, "Salir"… `SheetClose` la cierra. */
  footer?: ReactNode;
}

export interface BottomNavProps<V extends string> {
  items: BottomNavItem<V>[];
  /** Destino actual: el `value` del ítem o, si no tiene, su `href` (por ejemplo el pathname). */
  value: V;
  onValueChange?: (value: V) => void;
  /** Botón de crear en el medio de la barra. */
  fab?: { label: string; icon?: IconName; onClick: () => void; index?: number };
  /** Ítem "Más" al final: abre una hoja con el resto de las secciones. */
  overflow?: BottomNavOverflow<V>;
  /** Cómo dibujar los ítems con `href`. Por defecto, un `<a>`. */
  renderLink?: RenderLink;
  "aria-label"?: string;
  className?: string;
}

const idOf = <V extends string>(it: BottomNavItem<V>) => (it.value ?? it.href) as V;

/**
 * Navegación inferior: de tres a cinco destinos. Se posiciona en absoluto al fondo de su contenedor,
 * que tiene que tener position: relative y dejar 6,5 rem libres abajo (más el safe-area del teléfono).
 */
export function BottomNav<V extends string>({ items, value, onValueChange, fab, overflow, renderLink, className, ...rest }: BottomNavProps<V>) {
  const [open, setOpen] = useState(false);
  const { groupRef, indRef } = useIndicator<HTMLElement>([value, items.length, !!overflow]);
  const link = renderLink ?? defaultRenderLink;

  // El mismo ítem sirve para la barra y para la grilla de la hoja: cambia solo lo que pasa al tocarlo.
  const renderItem = (it: BottomNavItem<V>, after?: () => void) => {
    const id = idOf(it);
    const active = id === value;
    const select = () => {
      onValueChange?.(id);
      after?.();
    };
    const body = (<><Icon name={it.icon} />{it.label}</>);
    if (it.href) return <Fragment key={id}>{link({ href: it.href, "aria-current": active ? "page" : undefined, onClick: select, children: body })}</Fragment>;
    return (
      <button key={id} type="button" aria-pressed={active} aria-current={active ? "page" : undefined} onClick={select}>
        {body}
      </button>
    );
  };

  const buttons: ReactNode[] = items.map((it) => renderItem(it));
  if (fab) {
    buttons.splice(fab.index ?? Math.floor(items.length / 2), 0, (
      <button key="__fab" type="button" aria-label={fab.label} onClick={fab.onClick}>
        <span className="fab">
          <Icon name={fab.icon ?? "plus"} />
        </span>
      </button>
    ));
  }
  if (overflow) {
    // "Más" queda activo cuando la sección actual vive en la hoja.
    const inside = overflow.items.some((it) => idOf(it) === value);
    buttons.push(
      <button key="__more" type="button" aria-haspopup="dialog" aria-expanded={open} data-state={inside ? "active" : undefined} onClick={() => setOpen(true)}>
        <Icon name={overflow.icon ?? "more"} />
        {overflow.label ?? "Más"}
      </button>,
    );
  }

  return (
    <nav ref={groupRef} className={cx("bnav", overflow && "has-more", className)} aria-label={rest["aria-label"] ?? "Secciones"}>
      <span ref={indRef} className="ind" aria-hidden="true" />
      {buttons}
      {overflow ? (
        <Sheet open={open} onOpenChange={setOpen} title={overflow.title ?? overflow.label ?? "Más"} className="bnav-sheet">
          <div className="bnav-grid">{overflow.items.map((it) => renderItem(it, () => setOpen(false)))}</div>
          {overflow.footer ? <div className="bnav-foot">{overflow.footer}</div> : null}
        </Sheet>
      ) : null}
    </nav>
  );
}
