import { useState } from "react";
import { Button, Card, Dialog, DialogClose, Field, Input, Select, formatARS, toast } from "../../src";

// ?dialog=open abre el diálogo al cargar; ?dialog=long además lo llena para probar el scroll interno.
const forced = typeof location !== "undefined" ? new URLSearchParams(location.search).get("dialog") : null;

const notes = [
  "Compra semanal en el chino de la esquina.",
  "Incluye artículos de limpieza y la garrafa.",
  "Se pagó con la tarjeta de débito de la cuenta sueldo.",
  "Pedir factura A la próxima para deducir.",
  "Revisar si el descuento del 20 % de los miércoles se aplicó.",
  "Separar en el resumen lo que es de la casa y lo que es personal.",
];

export function DialogSection() {
  const [open, setOpen] = useState(forced != null);
  const [long, setLong] = useState(forced === "long");
  const [detail, setDetail] = useState("Supermercado");
  const [amount, setAmount] = useState("42.300");
  const [error, setError] = useState<string>();
  const [shake, setShake] = useState(0);
  const [saving, setSaving] = useState(false);

  const save = () => {
    const v = Number(amount.replace(/\./g, "").replace(",", "."));
    if (!amount.trim() || Number.isNaN(v)) {
      setError("Ingresá un monto, por ejemplo 12.500.");
      setShake((n) => n + 1);
      return;
    }
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setOpen(false);
      toast(`Movimiento guardado · ${formatARS(v)}`);
    }, 800);
  };

  return (
    <Card style={{ display: "grid", gap: "1rem", alignContent: "start" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: "0.75rem", alignItems: "center" }}>
        <span className="eyebrow">Diálogo</span>
        <code className="num muted" style={{ fontSize: "0.6875rem" }}>{"<Dialog actions onSubmit>"}</code>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
        <Button variant="primary" onClick={() => { setLong(false); setOpen(true); }}>Editar movimiento</Button>
        <Button variant="outline" onClick={() => { setLong(true); setOpen(true); }}>Con contenido largo</Button>
      </div>

      <Dialog
        open={open}
        onOpenChange={setOpen}
        title="Editar movimiento"
        description="Cambia solo este movimiento, no los que se repiten."
        onSubmit={save}
        actions={
          <>
            <DialogClose asChild><Button variant="ghost">Cancelar</Button></DialogClose>
            <Button variant="primary" type="submit" loading={saving}>Guardar cambios</Button>
          </>
        }
      >
        <Field label="Detalle">
          <Input value={detail} onChange={(e) => setDetail(e.target.value)} />
        </Field>
        <Field label="Monto" hint="En pesos." error={error} shakeKey={shake}>
          <Input numeric prefix="$" autoComplete="off" value={amount} onChange={(e) => { setAmount(e.target.value); setError(undefined); }} />
        </Field>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
          <Field label="Categoría">
            <Select defaultValue="Comida"><option>Casa</option><option>Comida</option><option>Salidas</option><option>Impuestos</option></Select>
          </Field>
          <Field label="Cuenta">
            <Select defaultValue="Débito"><option>Débito</option><option>Crédito</option><option>Efectivo</option></Select>
          </Field>
        </div>
        <Field label="Fecha"><Input defaultValue="06/10/2026" /></Field>
        {long ? notes.map((n, i) => (
          <Field key={i} label={`Nota ${i + 1}`}><Input defaultValue={n} /></Field>
        )) : null}
      </Dialog>
    </Card>
  );
}
