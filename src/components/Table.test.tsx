import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Button, Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from "../index";

describe("Table", () => {
  it("arma una tabla semántica con columnas numéricas, fila destacada y acciones", () => {
    render(
      <Table aria-label="Movimientos" minWidth={560}>
        <TableHead>
          <TableRow>
            <TableHeaderCell>Concepto</TableHeaderCell>
            <TableHeaderCell numeric>Monto</TableHeaderCell>
            <TableHeaderCell actions><span className="sr-only">Acciones</span></TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow highlight>
            <TableCell secondary="compra 12/10">Supermercado</TableCell>
            <TableCell numeric>-$ 42.300</TableCell>
            <TableCell actions><Button iconOnly size="sm" aria-label="Borrar">x</Button></TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );
    const table = screen.getByRole("table", { name: "Movimientos" });
    expect(table).toHaveClass("table");
    expect(table).toHaveStyle({ minWidth: "560px" });
    expect(table.parentElement).toHaveClass("table-wrap");

    expect(screen.getByRole("columnheader", { name: "Monto" })).toHaveClass("cell-num");
    expect(screen.getByRole("columnheader", { name: "Concepto" })).toHaveAttribute("scope", "col");

    const [, row] = screen.getAllByRole("row");
    expect(row).toHaveClass("is-highlight");
    expect(within(row!).getByRole("cell", { name: "-$ 42.300" })).toHaveClass("cell-num");
    expect(within(row!).getByText("compra 12/10")).toHaveClass("cell-sub");
    expect(within(row!).getByRole("button", { name: "Borrar" }).closest("td")).toHaveClass("cell-actions");
  });
});
