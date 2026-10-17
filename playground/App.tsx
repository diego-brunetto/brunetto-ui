import { useEffect, useState, type ReactNode } from "react";
import {
  Achievement,
  Badge,
  BottomNav,
  Button,
  Card,
  CardHeader,
  Checkbox,
  ConfirmDialog,
  CountUp,
  EmptyState,
  Field,
  Icon,
  Input,
  Money,
  Progress,
  SegmentedControl,
  Select,
  Sheet,
  SkeletonRow,
  Sparkline,
  StackBar,
  Stat,
  Stepper,
  SwitchRow,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Toaster,
  formatARS,
  toast,
} from "../src";
import { IconsSection } from "./sections/Icons";
import { TableSection } from "./sections/Table";

type Mode = "auto" | "light" | "dark";

function useMode(mode: Mode) {
  useEffect(() => {
    const mq = matchMedia("(prefers-color-scheme: dark)");
    const apply = () => document.documentElement.classList.toggle("dark", mode === "dark" || (mode === "auto" && mq.matches));
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [mode]);
}

function Spec({ title, api, children, wide }: { title: string; api: string; children: ReactNode; wide?: boolean }) {
  return (
    <Card style={{ display: "grid", gap: "1rem", alignContent: "start", gridColumn: wide ? "1 / -1" : undefined }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: "0.75rem", alignItems: "center" }}>
        <span className="eyebrow">{title}</span>
        <code className="num muted" style={{ fontSize: "0.6875rem" }}>{api}</code>
      </div>
      {children}
    </Card>
  );
}

const row = { display: "flex", flexWrap: "wrap", gap: "0.5rem", alignItems: "center" } as const;

export function App() {
  const [mode, setMode] = useState<Mode>("auto");
  useMode(mode);

  const [range, setRange] = useState<"hoy" | "semana" | "mes">("hoy");
  const tasks = { hoy: 8, semana: 37, mes: 142 }[range];
  const [tab, setTab] = useState("semana");
  const [unit, setUnit] = useState<"kg" | "lb">("kg");
  const [nav, setNav] = useState<"resumen" | "movimientos" | "cuentas" | "perfil">("resumen");
  const [sheet, setSheet] = useState(false);
  const [dialog, setDialog] = useState(false);
  const [amount, setAmount] = useState("");
  const [amountError, setAmountError] = useState<string>();
  const [shake, setShake] = useState(0);
  const [saving, setSaving] = useState(false);
  const [kg, setKg] = useState(80);
  const [loading, setLoading] = useState(false);

  const save = () => {
    const v = Number(amount.replace(/\./g, "").replace(",", "."));
    if (!amount.trim() || Number.isNaN(v)) {
      setAmountError("Ingresá un monto, por ejemplo 12.500.");
      setShake((n) => n + 1);
      return;
    }
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSheet(false);
      setAmount("");
      toast(`Gasto guardado · ${formatARS(v)}`);
    }, 800);
  };

  return (
    <div style={{ maxWidth: "76rem", margin: "0 auto", paddingInline: "clamp(1rem, 3.5vw, 2rem)", paddingBlock: "2rem 4rem", display: "grid", gap: "2rem" }}>
      <header style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "1rem", alignItems: "end" }}>
        <div style={{ display: "grid", gap: "0.5rem" }}>
          <p className="eyebrow">@diego-brunetto/ui · playground</p>
          <h1 className="display" style={{ fontSize: "calc(3rem * var(--display-scale))" }}>Brunetto UI</h1>
        </div>
        <SegmentedControl
          aria-label="Modo de color"
          size="sm"
          value={mode}
          onValueChange={setMode}
          options={[{ value: "auto", label: "Auto" }, { value: "light", label: "Claro" }, { value: "dark", label: "Oscuro" }]}
        />
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 21rem), 1fr))", gap: "1rem", alignItems: "start" }}>
        <Spec title="Botón" api="<Button variant size>">
          <div style={row}>
            <Button variant="primary">Guardar</Button>
            <Button>Secundario</Button>
            <Button variant="outline">Contorno</Button>
            <Button variant="ghost">Fantasma</Button>
          </div>
          <div style={row}>
            <Button variant="danger" size="sm" onClick={() => setDialog(true)}><Icon name="trash" />Borrar</Button>
            <Button variant="primary" size="sm" loading={loading} onClick={() => { setLoading(true); setTimeout(() => setLoading(false), 1400); }}>Con carga</Button>
            <Button variant="outline" size="sm" iconOnly aria-label="Agregar"><Icon name="plus" /></Button>
            <Button variant="primary" size="sm" disabled>Deshabilitado</Button>
          </div>
        </Spec>

        <Spec title="Campo" api="<Field> <Input> <Select>">
          <Field label="Monto" hint="En pesos. Lo pasamos a dólares con el MEP del día.">
            <Input numeric prefix="$" placeholder="0,00" defaultValue="42.300" />
          </Field>
          <Field label="Email" error="Falta el dominio, por ejemplo gmail.com.">
            <Input defaultValue="diego@gmail" />
          </Field>
          <Field label="Categoría">
            <Select defaultValue="Comida"><option>Casa</option><option>Comida</option><option>Impuestos</option></Select>
          </Field>
        </Spec>

        <Spec title="Selección" api="Checkbox · Switch">
          <Checkbox defaultChecked>Recordarme en este dispositivo</Checkbox>
          <Checkbox strikeWhenDone defaultChecked>Llamar al contador</Checkbox>
          <Checkbox strikeWhenDone>Subir fotos del departamento</Checkbox>
          <SwitchRow label="Sonido al terminar el descanso" defaultChecked />
          <SwitchRow label="Vibrar" />
        </Spec>

        <Spec title="Pestañas y segmentado" api="<Tabs> <SegmentedControl>">
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList value={tab} aria-label="Período">
              <TabsTrigger value="semana">Semana</TabsTrigger>
              <TabsTrigger value="mes">Mes</TabsTrigger>
              <TabsTrigger value="anio">Año</TabsTrigger>
            </TabsList>
            <TabsContent value="semana">4 sesiones · 18.450 kg levantados</TabsContent>
            <TabsContent value="mes">17 sesiones · 76.120 kg levantados</TabsContent>
            <TabsContent value="anio">182 sesiones · 801.900 kg levantados</TabsContent>
          </Tabs>
          <SegmentedControl aria-label="Unidad" value={unit} onValueChange={setUnit} options={[{ value: "kg", label: "kg" }, { value: "lb", label: "lb" }]} />
        </Spec>

        <Spec title="Insignias" api="<Badge tone>">
          <div style={row}>
            <Badge>Neutral</Badge>
            <Badge tone="brand">Marca</Badge>
            <Badge tone="success" dot>Pagado</Badge>
            <Badge tone="warning" icon="alert">Vence pronto</Badge>
            <Badge tone="danger" icon="x">Vencido</Badge>
            <Badge tone="info">Nuevo</Badge>
            <Badge tone="solid">Nivel 1</Badge>
          </div>
        </Spec>

        <Spec title="Dato" api="<Stat> <Money> <Sparkline>">
          <SegmentedControl
            aria-label="Período"
            block
            value={range}
            onValueChange={setRange}
            options={[{ value: "hoy", label: "Hoy" }, { value: "semana", label: "Semana" }, { value: "mes", label: "Mes" }]}
          />
          <Stat label="Tareas hechas" value={<CountUp value={tasks} />} footer={<Badge tone="success" icon="up" style={{ justifySelf: "start" }}>3 más que ayer</Badge>} />
          <Stat label="Gastos" value={<Money trend="negative">{formatARS(1665650)}</Money>} />
          <Sparkline aria-label="Gasto de los últimos 12 meses" data={[34, 30, 32, 26, 28, 22, 24, 18, 20, 14, 16, 9].map((v) => 48 - v)} />
        </Spec>

        <Spec title="Progreso" api="<Progress> <StackBar>">
          <Progress value={72} aria-label="Presupuesto de comida" />
          <Progress value={108} bar="danger" aria-label="Salidas" />
          <StackBar parts={[
            { label: "Casa", value: 34 },
            { label: "Comida", value: 22 },
            { label: "Impuestos", value: 18 },
            { label: "Salidas", value: 14 },
            { label: "Otros", value: 12, color: "var(--chart-8)" },
          ]} />
        </Spec>

        <Spec title="Stepper y logro" api="<Stepper> <Achievement>">
          <div className="row-label">
            <span className="muted">Peso serie 3</span>
            <Stepper aria-label="Peso serie 3" value={kg} onValueChange={setKg} min={0} step={2.5} unit="kg" />
          </div>
          <div style={{ minHeight: "3rem", display: "grid", placeItems: "center" }}>
            <Achievement trigger={kg > 80} color="var(--warning)">Nuevo récord: {kg.toLocaleString("es-AR")} kg</Achievement>
          </div>
        </Spec>

        <Spec title="Vacío y carga" api="<EmptyState> <Skeleton>">
          <EmptyState title="Todavía no cargaste gastos" action={<Button variant="primary" size="sm" onClick={() => setSheet(true)}>Cargar gasto</Button>}>
            Cargá el primero o importá el resumen de la tarjeta.
          </EmptyState>
          <SkeletonRow />
        </Spec>

        <Spec title="Capas" api="<Sheet> <ConfirmDialog> toast()">
          <div style={row}>
            <Button variant="primary" onClick={() => setSheet(true)}>Abrir hoja</Button>
            <Button variant="outline" onClick={() => setDialog(true)}>Abrir diálogo</Button>
            <Button variant="ghost" onClick={() => toast("Cambios guardados")}>Mostrar aviso</Button>
          </div>
        </Spec>

        <Spec title="Navegación inferior" api="<BottomNav>" wide>
          <div style={{ position: "relative", height: "6rem", border: "1px solid var(--border)", background: "var(--background)" }}>
            <BottomNav
              value={nav}
              onValueChange={setNav}
              fab={{ label: "Cargar gasto", onClick: () => setSheet(true) }}
              items={[
                { value: "resumen", label: "Resumen", icon: "chart" },
                { value: "movimientos", label: "Movimientos", icon: "list" },
                { value: "cuentas", label: "Cuentas", icon: "wallet" },
                { value: "perfil", label: "Perfil", icon: "user" },
              ]}
            />
          </div>
        </Spec>

        <IconsSection />
        <TableSection />

        <Card soft style={{ gridColumn: "1 / -1" }}>
          <CardHeader title="Disponible" aside={<Badge tone="warning">3 pendientes</Badge>} />
          <Stat label="Octubre 2026" value={formatARS(1284350)} large footer={<span className="muted" style={{ fontSize: "var(--text-xs)" }}>≈ <span className="num">US$ 912</span> · dólar MEP $ 1.408</span>} />
        </Card>
      </div>

      <Sheet open={sheet} onOpenChange={setSheet} title="Cargar gasto" onSubmit={save}>
        <Field label="Monto" hint="En pesos." error={amountError} shakeKey={shake}>
          <Input numeric prefix="$" placeholder="0" autoComplete="off" value={amount} onChange={(e) => { setAmount(e.target.value); setAmountError(undefined); }} />
        </Field>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
          <Field label="Categoría"><Select><option>Comida</option><option>Casa</option><option>Salidas</option></Select></Field>
          <Field label="Fecha"><Input defaultValue="06/10/2026" /></Field>
        </div>
        <div className="actions">
          <Button variant="ghost" onClick={() => setSheet(false)}>Cancelar</Button>
          <Button variant="primary" type="submit" loading={saving}>Guardar</Button>
        </div>
      </Sheet>

      <ConfirmDialog
        open={dialog}
        onOpenChange={setDialog}
        danger
        title="¿Borrar la serie 3?"
        description="Se pierde el peso y las repeticiones que cargaste. No se puede deshacer."
        confirmLabel="Borrar serie"
        onConfirm={() => toast("Serie borrada", "trash")}
      />
      <Toaster />
    </div>
  );
}
