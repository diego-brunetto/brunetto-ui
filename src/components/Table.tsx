import { forwardRef, type HTMLAttributes, type ReactNode, type TableHTMLAttributes, type TdHTMLAttributes, type ThHTMLAttributes } from "react";
import { cx } from "../lib/cx";

export interface TableProps extends TableHTMLAttributes<HTMLTableElement> {
  /** Ancho mínimo de la tabla: "640px" o 640. Por debajo, el contenedor scrollea en horizontal sin estirar la Card. */
  minWidth?: number | string;
}

/** `<table>` dentro de un contenedor con scroll horizontal propio. */
export const Table = forwardRef<HTMLTableElement, TableProps>(function Table({ minWidth, className, style, ...rest }, ref) {
  return (
    // Enfocable para poder scrollear con teclado cuando no entra.
    <div className="table-wrap" tabIndex={0}>
      <table ref={ref} className={cx("table", className)} style={{ minWidth, ...style }} {...rest} />
    </div>
  );
});

export function TableHead(props: HTMLAttributes<HTMLTableSectionElement>) {
  return <thead {...props} />;
}

export function TableBody(props: HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody {...props} />;
}

export interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  /** Fila a destacar: por ejemplo, recién cargada desde el teléfono. */
  highlight?: boolean;
}

export function TableRow({ highlight, className, ...rest }: TableRowProps) {
  return <tr className={cx(highlight && "is-highlight", className)} {...rest} />;
}

interface CellAlign {
  /** Montos y cantidades: a la derecha, mono y con números tabulares. */
  numeric?: boolean;
  /** Botones iconOnly a la derecha, en una columna que ocupa lo justo. */
  actions?: boolean;
}

export interface TableHeaderCellProps extends ThHTMLAttributes<HTMLTableCellElement>, CellAlign {}

/** Cabecera de columna. En la de acciones, poné un texto con className="sr-only". */
export function TableHeaderCell({ numeric, actions, className, scope = "col", ...rest }: TableHeaderCellProps) {
  return <th scope={scope} className={cx(numeric && "cell-num", actions && "cell-actions", className)} {...rest} />;
}

export interface TableCellProps extends TdHTMLAttributes<HTMLTableCellElement>, CellAlign {
  /** Línea secundaria, más chica y apagada: "compra 12/10". */
  secondary?: ReactNode;
}

export function TableCell({ numeric, actions, secondary, className, children, ...rest }: TableCellProps) {
  return (
    <td className={cx(numeric && "cell-num", actions && "cell-actions", className)} {...rest}>
      {actions ? <div className="cell-actions-in">{children}</div> : children}
      {secondary != null && <span className="cell-sub">{secondary}</span>}
    </td>
  );
}
