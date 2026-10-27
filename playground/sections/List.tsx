import { useState } from "react";
import { Badge, Card, CardHeader, Icon, Input, List, ListHeader, ListItem, Switch } from "../../src";

const catalogo = [
  { grupo: "Pecho", ejercicios: [{ id: "banca", nombre: "Press banca", detalle: "Barra · 4 × 8-10" }, { id: "aperturas", nombre: "Aperturas", detalle: "Mancuernas · 3 × 12" }] },
  { grupo: "Espalda", ejercicios: [{ id: "remo", nombre: "Remo con barra", detalle: "Barra · 4 × 8" }, { id: "jalon", nombre: "Jalón al pecho", detalle: "Polea · 3 × 10-12" }] },
];
const enElDia = new Set(["aperturas"]);

const tag = (text: string) => <code className="num muted" style={{ fontSize: "0.6875rem" }}>{text}</code>;

/** Selector de ejercicios con búsqueda y una lista de días con switch, como en Gym. */
export function ListSection() {
  const [q, setQ] = useState("");
  const [elegido, setElegido] = useState("banca");
  const [activos, setActivos] = useState<Record<string, boolean>>({ a: true, b: true, c: false });
  const filtro = q.trim().toLowerCase();
  const grupos = catalogo
    .map((g) => ({ ...g, ejercicios: g.ejercicios.filter((e) => e.nombre.toLowerCase().includes(filtro)) }))
    .filter((g) => g.ejercicios.length > 0);

  return (
    <>
      <Card style={{ display: "grid", gap: "0.75rem" }}>
        <CardHeader title="Elegir ejercicio" aside={tag("<List> <ListHeader> <ListItem>")} />
        <div className="affix-wrap">
          <span className="affix"><Icon name="search" /></span>
          <Input type="search" placeholder="Buscar ejercicio" aria-label="Buscar ejercicio" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <List aria-label="Catálogo de ejercicios">
          {grupos.map((g) => (
            <ListGroup key={g.grupo} title={g.grupo}>
              {g.ejercicios.map((e) => (
                <ListItem
                  key={e.id}
                  title={e.nombre}
                  description={e.detalle}
                  leading={<Icon name="dumbbell" />}
                  selected={elegido === e.id}
                  disabled={enElDia.has(e.id)}
                  disabledReason="Ya está en el día"
                  onClick={() => setElegido(e.id)}
                />
              ))}
            </ListGroup>
          ))}
          {grupos.length === 0 && <ListItem title="Sin resultados" description={`Nada coincide con «${q}».`} />}
        </List>
      </Card>

      <Card style={{ display: "grid", gap: "0.75rem" }}>
        <CardHeader title="Días de la rutina" aside={tag("<List inset> trailing chevron")} />
        <List inset aria-label="Días">
          <ListItem title="Día A · Empuje" description="6 ejercicios" trailing={<Badge tone="brand">Hoy</Badge>} chevron onClick={() => {}} />
          <ListItem title="Día B · Tirón" description="5 ejercicios" chevron onClick={() => {}} />
          {(["a", "b", "c"] as const).map((d) => (
            <ListItem
              key={d}
              title={`Recordatorio día ${d.toUpperCase()}`}
              description={activos[d] ? "Activo" : "Apagado"}
              trailing={<Switch aria-label={`Recordatorio día ${d.toUpperCase()}`} checked={activos[d]} onCheckedChange={(v) => setActivos((s) => ({ ...s, [d]: v }))} />}
            />
          ))}
        </List>
      </Card>
    </>
  );
}

function ListGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <>
      <ListHeader>{title}</ListHeader>
      {children}
    </>
  );
}
