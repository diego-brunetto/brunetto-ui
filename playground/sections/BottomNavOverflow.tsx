import { useEffect, useState } from "react";
import { BottomNav, Button, Card, SegmentedControl, SheetClose, toast, type BottomNavItem } from "../../src";

type Mode = "auto" | "light" | "dark";

// Links de verdad: el hash hace de router, así se ve el ítem activo seguir a la URL.
const useHash = () => {
  const read = () => location.hash.slice(1) || "/";
  const [hash, setHash] = useState(read);
  useEffect(() => {
    const on = () => setHash(read());
    addEventListener("hashchange", on);
    return () => removeEventListener("hashchange", on);
  }, []);
  return hash;
};

const items: BottomNavItem<string>[] = [
  { href: "#/", label: "Resumen", icon: "chart" },
  { href: "#/gastos", label: "Gastos", icon: "list" },
  { href: "#/cuentas", label: "Cuentas", icon: "wallet" },
  { href: "#/agenda", label: "Agenda", icon: "calendar" },
];
const more: BottomNavItem<string>[] = [
  { href: "#/metas", label: "Metas", icon: "trophy" },
  { href: "#/historial", label: "Historial", icon: "history" },
  { href: "#/avisos", label: "Avisos", icon: "bell" },
  { href: "#/importar", label: "Importar", icon: "inbox" },
  { href: "#/perfil", label: "Perfil", icon: "user" },
];

export function BottomNavOverflow({ mode, onModeChange }: { mode: Mode; onModeChange: (m: Mode) => void }) {
  const path = useHash();
  const current = [...items, ...more].find((it) => it.href === `#${path}`);
  return (
    <Card style={{ display: "grid", gap: "1rem", alignContent: "start", gridColumn: "1 / -1" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: "0.75rem", alignItems: "center" }}>
        <span className="eyebrow">Navegación inferior con "Más"</span>
        <code className="num muted" style={{ fontSize: "0.6875rem" }}>{"<BottomNav overflow renderLink>"}</code>
      </div>
      <div style={{ position: "relative", height: "12rem", maxWidth: "26rem", width: "100%", margin: "0 auto", border: "1px solid var(--border)", background: "var(--background)" }}>
        <p className="muted" style={{ padding: "1rem", fontSize: "var(--text-sm)" }}>
          Sección actual: <strong style={{ color: "var(--foreground)" }}>{current?.label ?? "Resumen"}</strong>
        </p>
        <BottomNav
          value={`#${path}`}
          items={items}
          fab={{ label: "Cargar", onClick: () => toast("Cargar gasto") }}
          overflow={{
            items: more,
            footer: (
              <>
                <SegmentedControl
                  aria-label="Tema"
                  size="sm"
                  value={mode}
                  onValueChange={onModeChange}
                  options={[{ value: "auto", label: "Auto" }, { value: "light", label: "Claro" }, { value: "dark", label: "Oscuro" }]}
                />
                <SheetClose asChild>
                  <Button variant="ghost" onClick={() => toast("Sesión cerrada")}>Salir</Button>
                </SheetClose>
              </>
            ),
          }}
        />
      </div>
    </Card>
  );
}
