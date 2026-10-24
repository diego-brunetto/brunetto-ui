import { useState } from "react";
import { Button, Card, Icon, SegmentedControl, SideNav, type RenderLink, type SideNavGroup } from "../../src";

const pages: Record<string, string> = {
  "/": "Resumen", "/movimientos": "Movimientos", "/cuentas": "Cuentas", "/tarjetas": "Tarjetas",
  "/presupuestos": "Presupuestos", "/metas": "Metas", "/agenda": "Vencimientos", "/perfil": "Perfil",
};

/** SideNav con un router de mentira: renderLink corta el clic y cambia la ruta, como haría NavLink o Link. */
export function SideNavSection() {
  const [path, setPath] = useState("/");
  const [theme, setTheme] = useState<"claro" | "oscuro">("claro");

  const renderLink: RenderLink = (p) => <a {...p} onClick={(e) => { e.preventDefault(); p.onClick?.(e); setPath(p.href); }} />;
  const at = (href: string, label: string, icon: Parameters<typeof Icon>[0]["name"], aside?: number) => ({ href, label, icon, aside, active: path === href });
  const groups: SideNavGroup[] = [
    { items: [at("/", "Resumen", "chart"), at("/movimientos", "Movimientos", "list", 12)] },
    { title: "Dinero", items: [at("/cuentas", "Cuentas", "wallet"), at("/tarjetas", "Tarjetas", "copy"), at("/presupuestos", "Presupuestos", "inbox")] },
    { title: "Planificar", items: [at("/metas", "Metas", "trophy"), at("/agenda", "Vencimientos", "calendar", 3)] },
    { title: "Cuenta", items: [at("/perfil", "Perfil", "user")] },
  ];

  return (
    <Card style={{ display: "grid", gap: "1rem", gridColumn: "1 / -1" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: "0.75rem", alignItems: "center" }}>
        <span className="eyebrow">Navegación lateral</span>
        <code className="num muted" style={{ fontSize: "0.6875rem" }}>{"<SideNav groups renderLink>"}</code>
      </div>
      <div style={{ display: "flex", height: "34rem", border: "1px solid var(--border)", background: "var(--background)", overflow: "hidden" }}>
        <SideNav
          style={{ height: "100%" }}
          brand="Finanzas"
          groups={groups}
          renderLink={renderLink}
          primaryAction={{ label: "Cargar gasto", onClick: () => setPath("/movimientos") }}
          footer={
            <>
              <SegmentedControl aria-label="Tema" size="sm" block value={theme} onValueChange={setTheme}
                options={[{ value: "claro", label: "Claro" }, { value: "oscuro", label: "Oscuro" }]} />
              <Button variant="ghost" size="sm" block style={{ justifyContent: "flex-start" }}><Icon name="x" />Salir</Button>
            </>
          }
        />
        <main style={{ flex: 1, minWidth: 0, padding: "1.5rem", display: "grid", gap: "0.5rem", alignContent: "start" }}>
          <p className="eyebrow">Ruta {path}</p>
          <h2 className="display" style={{ fontSize: "var(--text-2xl)" }}>{pages[path]}</h2>
        </main>
      </div>
    </Card>
  );
}
