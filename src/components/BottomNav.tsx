import type { ReactNode } from "react";
import { cx } from "../lib/cx";
import { useIndicator } from "../lib/useIndicator";
import { Icon, type IconName } from "./Icon";

export interface BottomNavItem<V extends string> {
  value: V;
  label: string;
  icon: IconName;
}

export interface BottomNavProps<V extends string> {
  items: BottomNavItem<V>[];
  value: V;
  onValueChange: (value: V) => void;
  /** Botón de crear en el medio de la barra. */
  fab?: { label: string; icon?: IconName; onClick: () => void; index?: number };
  "aria-label"?: string;
  className?: string;
}

/**
 * Navegación inferior: de tres a cinco destinos. Se posiciona en absoluto al fondo de su contenedor,
 * que tiene que tener position: relative y dejar 6,5 rem libres abajo.
 */
export function BottomNav<V extends string>({ items, value, onValueChange, fab, className, ...rest }: BottomNavProps<V>) {
  const { groupRef, indRef } = useIndicator<HTMLElement>([value, items.length]);
  const buttons: ReactNode[] = items.map((it) => (
    <button
      key={it.value}
      type="button"
      aria-pressed={it.value === value}
      aria-current={it.value === value ? "page" : undefined}
      onClick={() => onValueChange(it.value)}
    >
      <Icon name={it.icon} />
      {it.label}
    </button>
  ));
  if (fab) {
    buttons.splice(fab.index ?? Math.floor(items.length / 2), 0, (
      <button key="__fab" type="button" aria-label={fab.label} onClick={fab.onClick}>
        <span className="fab">
          <Icon name={fab.icon ?? "plus"} />
        </span>
      </button>
    ));
  }
  return (
    <nav ref={groupRef} className={cx("bnav", className)} aria-label={rest["aria-label"] ?? "Secciones"}>
      <span ref={indRef} className="ind" aria-hidden="true" />
      {buttons}
    </nav>
  );
}
