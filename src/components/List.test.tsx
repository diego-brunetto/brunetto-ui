import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Badge, List, ListHeader, ListItem, Switch } from "../index";

describe("List", () => {
  it("arma una lista semántica con grupos, filas botón y filas deshabilitadas con motivo", async () => {
    const onPick = vi.fn();
    render(
      <List aria-label="Ejercicios">
        <ListHeader>Pecho</ListHeader>
        <ListItem title="Press banca" description="4 × 8-10" onClick={onPick} chevron />
        <ListItem title="Aperturas" description="3 × 12" onClick={onPick} disabled disabledReason="Ya está en el día" />
      </List>,
    );
    const list = screen.getByRole("list", { name: "Ejercicios" });
    // El rótulo es presentación: solo cuentan las dos filas.
    expect(within(list).getAllByRole("listitem")).toHaveLength(2);

    await userEvent.click(screen.getByRole("button", { name: /Press banca/ }));
    expect(onPick).toHaveBeenCalledTimes(1);

    const disabled = screen.getByRole("button", { name: /Aperturas/ });
    expect(disabled).toBeDisabled();
    expect(within(disabled).getByText("Ya está en el día")).toBeInTheDocument();
    expect(within(disabled).queryByText("3 × 12")).toBeNull();
  });

  it("dibuja las filas con href usando el renderLink de la lista y marca la elegida", () => {
    render(
      <List renderLink={({ href, children, ...p }) => <a data-router href={`/app${href}`} {...p}>{children}</a>}>
        <ListItem title="Día A" href="/rutina/a" selected />
        <ListItem title="Día B" href="/rutina/b" />
      </List>,
    );
    const a = screen.getByRole("link", { name: "Día A" });
    expect(a).toHaveAttribute("href", "/app/rutina/a");
    expect(a).toHaveAttribute("data-router");
    expect(a).toHaveAttribute("aria-current", "page");
    expect(a).toHaveClass("list-item", "is-selected");
    expect(screen.getByRole("link", { name: "Día B" })).not.toHaveAttribute("aria-current");
  });

  it("una fila estática deja usable el control del lado derecho", async () => {
    const onCheckedChange = vi.fn();
    render(
      <List>
        <ListItem title="Sentadilla" trailing={<><Badge>Piernas</Badge><Switch aria-label="Activo" checked onCheckedChange={onCheckedChange} /></>} />
      </List>,
    );
    expect(screen.queryByRole("button", { name: /Sentadilla/ })).toBeNull();
    await userEvent.click(screen.getByRole("switch", { name: "Activo" }));
    expect(onCheckedChange).toHaveBeenCalledWith(false);
  });
});
