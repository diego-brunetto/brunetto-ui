import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { cx } from "../lib/cx";

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  children?: ReactNode;
  /** Tacha el texto al marcar. Para listas de pendientes. */
  strikeWhenDone?: boolean;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { children, strikeWhenDone, className, style, ...rest },
  ref,
) {
  return (
    <label className={cx("check", strikeWhenDone && "done-strike", className)} style={style}>
      <input ref={ref} type="checkbox" {...rest} />
      <span className="box" aria-hidden="true">
        <svg viewBox="0 0 24 24">
          <path d="M20 6 9 17l-5-5" />
        </svg>
      </span>
      {children != null && (strikeWhenDone ? <span className="txt">{children}</span> : children)}
    </label>
  );
});
