import {
  cloneElement,
  forwardRef,
  isValidElement,
  useId,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type LabelHTMLAttributes,
  type ReactElement,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";
import { cx } from "../lib/cx";
import { Icon } from "./Icon";

export interface FieldProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  label: ReactNode;
  /** Explica el formato antes de que haya error: "En pesos." */
  hint?: ReactNode;
  /** Qué falta y cómo arreglarlo: "Falta el dominio, por ejemplo gmail.com." Reemplaza al hint. */
  error?: ReactNode;
  /** Sacude el campo una vez. Cambiá el número para repetir. */
  shakeKey?: number;
  /** Un solo control: Input, Select o un input propio. Recibe id y aria-describedby. */
  children: ReactElement<{ id?: string; "aria-describedby"?: string; "aria-invalid"?: boolean }>;
}

export function Field({ label, hint, error, shakeKey, className, children, ...rest }: FieldProps) {
  const id = useId();
  const controlId = (isValidElement(children) && children.props.id) || `${id}-control`;
  const hintId = `${id}-hint`;
  const message = error ?? hint;

  return (
    <div
      key={shakeKey}
      className={cx("field", error != null && "is-invalid", error != null && shakeKey != null && "shake", className)}
      {...rest}
    >
      <Label htmlFor={controlId}>{label}</Label>
      {cloneElement(children, {
        id: controlId,
        "aria-describedby": message != null ? hintId : undefined,
        "aria-invalid": error != null || undefined,
      })}
      {message != null && (
        <span id={hintId} className={cx("hint", error != null && "err")}>
          {error != null && <Icon name="x" />}
          {message}
        </span>
      )}
    </div>
  );
}

export function Label({ className, ...rest }: LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={cx("label", className)} {...rest} />;
}

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Números en mono y tabulares. */
  numeric?: boolean;
  /** Prefijo dentro del campo, como "$". */
  prefix?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input({ numeric, prefix, className, ...rest }, ref) {
  const input = (
    <input
      ref={ref}
      className={cx("input", numeric && "num", className)}
      inputMode={numeric ? "decimal" : undefined}
      {...rest}
    />
  );
  if (!prefix) return input;
  return (
    <div className="affix-wrap">
      <span className="affix" aria-hidden="true">
        {prefix}
      </span>
      {input}
    </div>
  );
});

export type SelectProps = SelectHTMLAttributes<HTMLSelectElement>;

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select({ className, children, ...rest }, ref) {
  return (
    <div className="select">
      <select ref={ref} className={cx("input", className)} {...rest}>
        {children}
      </select>
      <Icon name="chevron" />
    </div>
  );
});

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Crece con el contenido hasta `maxRows` (si el navegador soporta `field-sizing`). */
  autoSize?: boolean;
}

/** Texto de varias líneas. Usa la clase `.input` (16px en táctil, `min-width: 0`). */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { autoSize, className, rows = 3, ...rest },
  ref,
) {
  return (
    <textarea
      ref={ref}
      rows={rows}
      className={cx("input", "textarea", autoSize && "textarea-auto", className)}
      {...rest}
    />
  );
});
