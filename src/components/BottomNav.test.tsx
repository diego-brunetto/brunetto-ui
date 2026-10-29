import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { BottomNav, SheetClose, type BottomNavItem, type RenderLink } from "../index";

const bar: BottomNavItem<string>[] = [
  { value: "resumen", label: "Resumen", icon: "chart" },
  { value: "movimientos", label: "Movimientos", icon: "list" },
];
const more: BottomNavItem<string>[] = [
  { value: "metas", label: "Metas", icon: "trophy" },
  { value: "agenda", label: "Agenda", icon: "calendar" },
];

describe("BottomNav", () => {
  it("sigue funcionando con value y onValueChange", async () => {
    const onChange = vi.fn();
    render(<BottomNav items={bar} value="resumen" onValueChange={onChange} />);
    expect(screen.getByRole("button", { name: "Resumen" })).toHaveAttribute("aria-current", "page");
    await userEvent.click(screen.getByRole("button", { name: "Movimientos" }));
    expect(onChange).toHaveBeenCalledWith("movimientos");
  });

  it("por defecto es fixed al viewport; absolute queda para el playground", () => {
    const { rerender } = render(<BottomNav items={bar} value="resumen" aria-label="Nav" />);
    expect(screen.getByRole("navigation", { name: "Nav" })).toHaveClass("bnav");
    expect(screen.getByRole("navigation", { name: "Nav" })).not.toHaveClass("bnav-absolute");
    rerender(<BottomNav position="absolute" items={bar} value="resumen" aria-label="Nav" />);
    expect(screen.getByRole("navigation", { name: "Nav" })).toHaveClass("bnav-absolute");
  });

  it("dibuja ítems con href como links, con renderLink propio", () => {
    const renderLink: RenderLink = ({ href, ...p }) => <a data-router="" href={`#${href}`} {...p} />;
    render(
      <BottomNav
        value="/gastos"
        renderLink={renderLink}
        items={[{ href: "/", label: "Inicio", icon: "home" }, { href: "/gastos", label: "Gastos", icon: "wallet" }]}
      />,
    );
    const link = screen.getByRole("link", { name: "Gastos" });
    expect(link).toHaveAttribute("href", "#/gastos");
    expect(link).toHaveAttribute("data-router");
    expect(link).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Inicio" })).not.toHaveAttribute("aria-current");
  });

  it("'Más' abre la hoja, elige una sección y se cierra", async () => {
    function Demo() {
      const [v, setV] = useState("resumen");
      return (
        <BottomNav
          items={bar}
          value={v}
          onValueChange={setV}
          overflow={{ items: more, footer: <SheetClose type="button">Salir</SheetClose> }}
        />
      );
    }
    render(<Demo />);
    const btn = screen.getByRole("button", { name: "Más" });
    expect(btn).not.toHaveAttribute("data-state");
    await userEvent.click(btn);
    expect(screen.getByRole("dialog", { name: "Más" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Salir" })).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Metas" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    // La sección actual vive en el desborde: "Más" queda activo y ninguna pestaña de la barra.
    expect(screen.getByRole("button", { name: "Más" })).toHaveAttribute("data-state", "active");
    expect(screen.getByRole("button", { name: "Resumen" })).toHaveAttribute("aria-pressed", "false");
  });

  it("marca la sección actual dentro de la hoja", async () => {
    render(<BottomNav items={bar} value="agenda" overflow={{ items: more, title: "Más secciones" }} />);
    await userEvent.click(screen.getByRole("button", { name: "Más" }));
    expect(screen.getByRole("dialog", { name: "Más secciones" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Agenda" })).toHaveAttribute("aria-current", "page");
  });
});
