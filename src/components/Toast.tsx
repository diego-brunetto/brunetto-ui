import { useSyncExternalStore } from "react";
import { getMotion } from "../lib/motion";
import { Icon, type IconName } from "./Icon";

interface ToastItem {
  id: number;
  message: string;
  icon: IconName;
  leaving: boolean;
}

const VISIBLE_MS = 2600;
const MAX = 3;
let items: ToastItem[] = [];
let nextId = 1;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

function remove(id: number) {
  items = items.filter((t) => t.id !== id);
  emit();
}

/**
 * Muestra un aviso que confirma algo que acaba de pasar, en pasado y con el dato:
 * toast("Gasto guardado · $ 12.500"), toast("Serie borrada", "trash").
 * Necesita un <Toaster /> montado una vez en la app.
 */
export function toast(message: string, icon: IconName = "check"): number {
  const id = nextId++;
  items = [...items, { id, message, icon, leaving: false }].slice(-MAX);
  emit();
  setTimeout(() => {
    items = items.map((t) => (t.id === id ? { ...t, leaving: true } : t));
    emit();
    setTimeout(() => remove(id), 160 * getMotion() + 40);
  }, VISIBLE_MS);
  return id;
}

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};
const snapshot = () => items;
const empty: ToastItem[] = [];

/** Región de avisos, abajo y al centro. Montala una sola vez. */
export function Toaster() {
  const list = useSyncExternalStore(subscribe, snapshot, () => empty);
  return (
    <div className="toasts" aria-live="polite">
      {list.map((t) => (
        <div key={t.id} className={t.leaving ? "toast out" : "toast"} role="status">
          <Icon name={t.icon} />
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
}
