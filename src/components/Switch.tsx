import { forwardRef, useId, useState, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cx } from "../lib/cx";

export interface SwitchProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onChange" | "children"> {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

/** Interruptor para ajustes que actúan al instante. */
export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(function Switch(
  { checked, defaultChecked = false, onCheckedChange, className, onClick, ...rest },
  ref,
) {
  const [inner, setInner] = useState(defaultChecked);
  const on = checked ?? inner;
  return (
    <button
      ref={ref}
      type="button"
      role="switch"
      aria-checked={on}
      className={cx("switch", className)}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented) return;
        if (checked === undefined) setInner(!on);
        onCheckedChange?.(!on);
      }}
      {...rest}
    />
  );
});

export interface SwitchRowProps extends SwitchProps {
  label: ReactNode;
}

/** Fila con el texto a la izquierda y el switch a la derecha. */
export function SwitchRow({ label, id, ...rest }: SwitchRowProps) {
  const labelId = `${useId()}-label`;
  return (
    <div className="row-label">
      <span id={labelId}>{label}</span>
      <Switch id={id} aria-labelledby={labelId} {...rest} />
    </div>
  );
}
