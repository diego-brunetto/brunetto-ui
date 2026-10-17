import { Badge, Button, Card, CardHeader, Icon, Money, Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow, formatARS } from "../../src";

const movimientos = [
  { id: 1, concepto: "Sueldo octubre", detalle: "acreditado 01/10", categoria: "Ingresos", monto: 1_665_650, nuevo: false },
  { id: 2, concepto: "Supermercado Coto", detalle: "compra 12/10", categoria: "Comida", monto: -42_300, nuevo: true },
  { id: 3, concepto: "Expensas", detalle: "vence 15/10", categoria: "Casa", monto: -118_900, nuevo: false },
  { id: 4, concepto: "Reintegro tarjeta", detalle: "Visa · 3 de 6", categoria: "Tarjetas", monto: 8_450, nuevo: false },
  { id: 5, concepto: "Cena con amigos", detalle: "compra 10/10", categoria: "Salidas", monto: -27_600, nuevo: false },
];

/** Movimientos de ejemplo: montos ARS a favor y en contra, una fila recién cargada y acciones por fila. */
export function TableSection() {
  return (
    <Card style={{ gridColumn: "1 / -1", display: "grid", gap: "0.75rem" }}>
      <CardHeader title="Movimientos" aside={<code className="num muted" style={{ fontSize: "0.6875rem" }}>{"<Table> <TableCell numeric>"}</code>} />
      <Table aria-label="Movimientos de octubre" minWidth={640}>
        <TableHead>
          <TableRow>
            <TableHeaderCell>Concepto</TableHeaderCell>
            <TableHeaderCell>Categoría</TableHeaderCell>
            <TableHeaderCell numeric>Monto</TableHeaderCell>
            <TableHeaderCell actions><span className="sr-only">Acciones</span></TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {movimientos.map((m) => (
            <TableRow key={m.id} highlight={m.nuevo}>
              <TableCell secondary={m.detalle}>
                {m.concepto} {m.nuevo && <Badge tone="brand">Desde el teléfono</Badge>}
              </TableCell>
              <TableCell>{m.categoria}</TableCell>
              <TableCell numeric>
                <Money trend={m.monto < 0 ? "negative" : "positive"}>{m.monto < 0 ? `−${formatARS(-m.monto)}` : formatARS(m.monto)}</Money>
              </TableCell>
              <TableCell actions>
                <Button variant="ghost" size="sm" iconOnly aria-label={`Duplicar ${m.concepto}`}><Icon name="copy" /></Button>
                <Button variant="ghost" size="sm" iconOnly aria-label={`Borrar ${m.concepto}`}><Icon name="trash" /></Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
