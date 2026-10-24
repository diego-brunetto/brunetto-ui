import { Alert, Button, Card, type AlertTone } from "../../src";

const examples: { tone: AlertTone; title: string; body: string; action?: string }[] = [
  { tone: "info", title: "Todavía no hay datos del crédito", body: "Cargá la primera cuota para ver el saldo y las fechas de vencimiento.", action: "Cargar cuota" },
  { tone: "success", title: "Resumen importado", body: "Sumamos 42 movimientos de la tarjeta de octubre." },
  { tone: "warning", title: "La cotización tiene más de un día", body: "Usamos el dólar MEP de ayer hasta que se actualice." },
  { tone: "danger", title: "No se pudo cargar", body: "Revisá la conexión y probá de nuevo.", action: "Reintentar" },
];

/** Los cuatro tonos con título y acción, sin título y con texto largo que hace wrap. */
export function AlertSection() {
  return (
    <Card style={{ display: "grid", gap: "1rem", alignContent: "start", gridColumn: "1 / -1" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: "0.75rem", alignItems: "center" }}>
        <span className="eyebrow">Aviso</span>
        <code className="num muted" style={{ fontSize: "0.6875rem" }}>{"<Alert tone title action>"}</code>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 21rem), 1fr))", gap: "0.75rem", alignItems: "start" }}>
        {examples.map((e) => (
          <Alert key={e.tone} tone={e.tone} title={e.title} action={e.action && <Button size="sm" variant="outline">{e.action}</Button>}>
            {e.body}
          </Alert>
        ))}
        {examples.map((e) => (
          <Alert key={`${e.tone}-bare`} tone={e.tone}>{e.body}</Alert>
        ))}
        <Alert tone="warning" title="Texto largo">
          El vencimiento de la tarjeta Visa cae el sábado 25 de octubre; si pagás el mínimo, el resto genera intereses a una TNA de 112 %. Referencia: https://home.banco.example/resumenes/2026/10/visa-terminada-en-4821.pdf
        </Alert>
      </div>
    </Card>
  );
}
