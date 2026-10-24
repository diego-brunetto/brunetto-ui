import {
  Badge,
  Button,
  Card,
  CardHeader,
  EmptyState,
  Icon,
  Money,
  Table,
  TableBody,
  TableCell,
  TableEmpty,
  TableFoot,
  TableHead,
  TableHeaderCell,
  TableRow,
  formatARS,
  formatUSD,
} from "../../src";

const movimientos = [
  { id: 1, concepto: "Sueldo octubre", detalle: "acreditado 01/10", categoria: "Ingresos", monto: 1_665_650, nuevo: false },
  { id: 2, concepto: "Supermercado Coto", detalle: "compra 12/10", categoria: "Comida", monto: -42_300, nuevo: true },
  { id: 3, concepto: "Expensas", detalle: "vence 15/10", categoria: "Casa", monto: -118_900, nuevo: false },
  { id: 4, concepto: "Reintegro tarjeta", detalle: "Visa · 3 de 6", categoria: "Tarjetas", monto: 8_450, nuevo: false },
  { id: 5, concepto: "Cena con amigos", detalle: "compra 10/10", categoria: "Salidas", monto: -27_600, nuevo: false },
];

const resumen = [
  { id: 1, fecha: "02/10", comercio: "Mercado Libre", cuota: "3/6", ars: 48_200, usd: 0, categoria: "Casa", conciliado: true },
  { id: 2, fecha: "05/10", comercio: "Spotify", cuota: "—", ars: 0, usd: 12, categoria: "Suscripciones", conciliado: true },
  { id: 3, fecha: "08/10", comercio: "YPF Libertador", cuota: "—", ars: 61_750, usd: 0, categoria: "Auto", conciliado: false },
  { id: 4, fecha: "11/10", comercio: "Frávega", cuota: "1/12", ars: 89_990, usd: 0, categoria: "Casa", conciliado: false },
  { id: 5, fecha: "14/10", comercio: "Amazon Web Services", cuota: "—", ars: 0, usd: 23, categoria: "Trabajo", conciliado: true },
];

const signed = (n: number) => (n < 0 ? `−${formatARS(-n)}` : formatARS(n));
const sum = (ns: number[]) => ns.reduce((a, n) => a + n, 0);
const tag = (text: string) => <code className="num muted" style={{ fontSize: "0.6875rem" }}>{text}</code>;

/** Tres usos: movimientos con totales, una tabla vacía y un resumen de tarjeta ancho que scrollea. */
export function TableSection() {
  const saldo = sum(movimientos.map((m) => m.monto));
  return (
    <>
      <Card style={{ gridColumn: "1 / -1", display: "grid", gap: "0.75rem" }}>
        <CardHeader title="Movimientos" aside={tag("<Table> <TableCell numeric> <TableFoot>")} />
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
                  <Money trend={m.monto < 0 ? "negative" : "positive"}>{signed(m.monto)}</Money>
                </TableCell>
                <TableCell actions>
                  <Button variant="ghost" size="sm" iconOnly aria-label={`Editar ${m.concepto}`}><Icon name="edit" /></Button>
                  <Button variant="ghost" size="sm" iconOnly aria-label={`Borrar ${m.concepto}`}><Icon name="trash" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFoot>
            <TableRow>
              <TableCell colSpan={2}>Saldo del mes</TableCell>
              <TableCell numeric>
                <Money trend={saldo < 0 ? "negative" : "positive"}>{signed(saldo)}</Money>
              </TableCell>
              <TableCell />
            </TableRow>
          </TableFoot>
        </Table>
      </Card>

      <Card style={{ gridColumn: "1 / -1", display: "grid", gap: "0.75rem" }}>
        <CardHeader title="Sin pagos" aside={tag("<TableEmpty colSpan>")} />
        <Table aria-label="Pagos de noviembre" minWidth={480}>
          <TableHead>
            <TableRow>
              <TableHeaderCell>Concepto</TableHeaderCell>
              <TableHeaderCell>Vence</TableHeaderCell>
              <TableHeaderCell numeric>Monto</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableEmpty colSpan={3}>
              <EmptyState
                title="Todavía no hay pagos en noviembre"
                action={<Button size="sm" variant="outline"><Icon name="plus" /> Cargar pago</Button>}
              >
                Los fijos aparecen solos cuando arranca el mes.
              </EmptyState>
            </TableEmpty>
          </TableBody>
        </Table>
      </Card>

      <Card style={{ gridColumn: "1 / -1", display: "grid", gap: "0.75rem" }}>
        <CardHeader title="Resumen Visa · octubre" aside={tag("<Table minWidth={1000}>")} />
        <Table aria-label="Resumen de la tarjeta Visa" minWidth={1000}>
          <TableHead>
            <TableRow>
              <TableHeaderCell>Fecha</TableHeaderCell>
              <TableHeaderCell>Comercio</TableHeaderCell>
              <TableHeaderCell>Cuota</TableHeaderCell>
              <TableHeaderCell>Categoría</TableHeaderCell>
              <TableHeaderCell numeric>Pesos</TableHeaderCell>
              <TableHeaderCell numeric>Dólares</TableHeaderCell>
              <TableHeaderCell>Estado</TableHeaderCell>
              <TableHeaderCell actions><span className="sr-only">Acciones</span></TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {resumen.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="num">{r.fecha}</TableCell>
                <TableCell>{r.comercio}</TableCell>
                <TableCell className="num">{r.cuota}</TableCell>
                <TableCell>{r.categoria}</TableCell>
                <TableCell numeric>{r.ars ? formatARS(r.ars) : "—"}</TableCell>
                <TableCell numeric>{r.usd ? formatUSD(r.usd) : "—"}</TableCell>
                <TableCell>
                  {r.conciliado ? <Badge tone="success" dot>Conciliado</Badge> : <Badge tone="warning" dot>Sin conciliar</Badge>}
                </TableCell>
                <TableCell actions>
                  <Button variant="ghost" size="sm" iconOnly aria-label={`Editar ${r.comercio}`}><Icon name="edit" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFoot>
            <TableRow>
              <TableCell colSpan={4}>Total del resumen</TableCell>
              <TableCell numeric>{formatARS(sum(resumen.map((r) => r.ars)))}</TableCell>
              <TableCell numeric>{formatUSD(sum(resumen.map((r) => r.usd)))}</TableCell>
              <TableCell colSpan={2} />
            </TableRow>
          </TableFoot>
        </Table>
      </Card>
    </>
  );
}
