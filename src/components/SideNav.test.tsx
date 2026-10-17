import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { SideNav, type LinkRenderProps } from "../index";

const groups = [
  { items: [{ href: "/", label: "Resumen", icon: "chart" as const, active: true }] },
  { title: "Dinero", items: [{ href: "/movimientos", label: "Movimientos", icon: "list" as const }, { href: "/cuentas", label: "Cuentas", aside: 3 }] },
];

describe("SideNav", () => {
  it("dibuja links agrupados y marca el activo con aria-current", () => {
    render(<SideNav brand="Finanzas" groups={groups} />);
    const nav = screen.getByRole("navigation", { name: "Secciones" });
    expect(within(nav).getByRole("link", { name: "Resumen" })).toHaveAttribute("aria-current", "page");
    expect(within(nav).getByRole("link", { name: "Movimientos" })).not.toHaveAttribute("aria-current");
    expect(within(nav).getByRole("link", { name: "Movimientos" })).toHaveAttribute("href", "/movimientos");
    expect(screen.getByRole("list", { name: "Dinero" })).toContainElement(screen.getByRole("link", { name: /Cuentas/ }));
  });

  it("usa renderLink para el router de la app", () => {
    const Link = (p: LinkRenderProps) => <a data-to={p.href} {...p} />;
    render(<SideNav groups={groups} renderLink={(p) => <Link {...p} />} />);
    const link = screen.getByRole("link", { name: "Resumen" });
    expect(link).toHaveAttribute("data-to", "/");
    expect(link).toHaveClass("snav-item");
    expect(link).toHaveAttribute("aria-current", "page");
  });

  it("con value y onValueChange los items son botones", async () => {
    function Demo() {
      const [v, setV] = useState<"a" | "b">("a");
      return <SideNav value={v} onValueChange={setV} groups={[{ items: [{ value: "a", label: "Uno" }, { value: "b", label: "Dos" }] }]} />;
    }
    render(<Demo />);
    const dos = screen.getByRole("button", { name: "Dos" });
    expect(screen.getByRole("button", { name: "Uno" })).toHaveAttribute("aria-current", "page");
    await userEvent.click(dos);
    expect(dos).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("button", { name: "Uno" })).not.toHaveAttribute("aria-current");
  });

  it("acción principal y pie", async () => {
    const onClick = vi.fn();
    render(<SideNav groups={groups} primaryAction={{ label: "Cargar gasto", onClick }} footer={<button type="button">Salir</button>} />);
    await userEvent.click(screen.getByRole("button", { name: "Cargar gasto" }));
    expect(onClick).toHaveBeenCalledOnce();
    expect(screen.getByRole("button", { name: "Salir" })).toBeInTheDocument();
  });
});
