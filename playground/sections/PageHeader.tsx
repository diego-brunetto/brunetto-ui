import { useState, type CSSProperties } from "react";
import { Button, Card, Icon, PageHeader, SegmentedControl } from "../../src";

const months = ["Agosto", "Septiembre", "Octubre"];

export function PageHeaderSection() {
  const [range, setRange] = useState<"mes" | "trimestre" | "anio">("mes");
  const [month, setMonth] = useState(2);

  return (
    <Card style={{ display: "grid", gap: "1.5rem", alignContent: "start", gridColumn: "1 / -1" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: "0.75rem", alignItems: "center" }}>
        <span className="eyebrow">Encabezado de pantalla</span>
        <code className="num muted" style={{ fontSize: "0.6875rem" }}>{"<PageHeader eyebrow title description actions>"}</code>
      </div>

      <PageHeader
        eyebrow="Finanzas · Octubre 2026"
        title="Resumen"
        description="Lo que entró, lo que salió y cuánto te queda para el resto del mes."
        actions={
          <SegmentedControl
            aria-label="Período"
            size="sm"
            value={range}
            onValueChange={setRange}
            options={[{ value: "mes", label: "Mes" }, { value: "trimestre", label: "Trimestre" }, { value: "anio", label: "Año" }]}
          />
        }
      />

      <PageHeader
        eyebrow="Finanzas"
        title="Movimientos"
        actions={
          <>
            <Button variant="outline" size="sm" iconOnly aria-label="Mes anterior" disabled={month === 0} onClick={() => setMonth((m) => m - 1)}>
              <Icon name="chevron-left" />
            </Button>
            <span className="num" style={{ fontSize: "var(--text-sm)", minWidth: "6.5rem", textAlign: "center" }}>{months[month]} 2026</span>
            <Button variant="outline" size="sm" iconOnly aria-label="Mes siguiente" disabled={month === months.length - 1} onClick={() => setMonth((m) => m + 1)}>
              <Icon name="chevron-right" />
            </Button>
          </>
        }
      />

      <div style={{ "--page-pad": "1rem" } as CSSProperties}>
        <p className="muted" style={{ fontSize: "var(--text-sm)", margin: "0 0 0.5rem" }}>Sticky (barra de Gym)</p>
        <div style={{ height: "11rem", overflow: "auto", border: "1px solid var(--border)", borderRadius: "var(--radius)", background: "var(--background)" }}>
          <PageHeader
            sticky
            title="Rutina"
            eyebrow="Push / Pull / Legs"
            actions={<Button variant="ghost" size="sm" iconOnly aria-label="Editar rutina"><Icon name="edit" /></Button>}
          />
          <div style={{ padding: "1rem", display: "grid", gap: "0.75rem" }}>
            {["Día A · Pecho", "Día B · Espalda", "Día C · Piernas", "Día D · Hombros", "Día E · Brazos"].map((d) => (
              <p key={d} style={{ margin: 0, padding: "0.75rem", background: "var(--surface)", border: "1px solid var(--border)" }}>{d}</p>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
