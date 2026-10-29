import {
  Children,
  cloneElement,
  isValidElement,
  useId,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
} from "react";
import { cx } from "../lib/cx";

export interface ChipProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  /** Activado: `aria-pressed`. Controlado con `onPressedChange`. */
  pressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  children: ReactNode;
  /** Segunda línea más chica: categoría, "Hoy", segundos. */
  description?: ReactNode;
}

/**
 * Opción rápida tocable (día de rutina, tipo de cardio, gasto frecuente).
 * Mínimo 48px de alto táctil; usa `aria-pressed`.
 */
export function Chip({
  pressed = false,
  onPressedChange,
  children,
  description,
  className,
  type = "button",
  onClick,
  disabled,
  ...rest
}: ChipProps) {
  return (
    <button
      type={type}
      aria-pressed={pressed}
      disabled={disabled}
      className={cx("chip", pressed && "is-pressed", className)}
      onClick={(e) => {
        onClick?.(e);
        if (!e.defaultPrevented && !disabled) onPressedChange?.(!pressed);
      }}
      {...rest}
    >
      <span className="chip-label">{children}</span>
      {description != null && <span className="chip-desc">{description}</span>}
    </button>
  );
}

export interface ChipGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** `single`: una sola activa (como radio). `multiple`: varias (como checkbox). Solo filtra el scroll; el estado vive en cada Chip. */
  mode?: "single" | "multiple";
  /** Con `mode="single"`, valor de la chip activa (via `value` en cada Chip hijo). */
  value?: string;
  onValueChange?: (value: string) => void;
  children: ReactNode;
  "aria-label": string;
}

/**
 * Fila horizontal con scroll sin barra. Envuelve `Chip`s.
 * En `mode="single"`, pasá `value`/`onValueChange` y `value` en cada Chip.
 */
export function ChipGroup({
  mode = "multiple",
  value,
  onValueChange,
  children,
  className,
  ...rest
}: ChipGroupProps) {
  const groupId = useId();
  const items = Children.map(children, (child) => {
    if (!isValidElement(child) || child.type !== Chip) return child;
    const chip = child as ReactElement<ChipProps & { value?: string }>;
    if (mode !== "single" || chip.props.value == null) return chip;
    const chipValue = chip.props.value;
    return cloneElement(chip, {
      pressed: value === chipValue,
      onPressedChange: () => onValueChange?.(chipValue),
      "aria-controls": groupId,
    });
  });

  return (
    <div
      id={groupId}
      role="group"
      className={cx("chip-group", className)}
      {...rest}
    >
      {items}
    </div>
  );
}
