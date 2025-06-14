export interface PagoAsignado {
  id: number;
  clienteId: number;
  pagoId: number;
  tareaId: number;
  tipo: "trabajo" | "material";
  usado: number;
  fecha_pago: string;
  fecha_tarea: string;
  cuadrado?: number; // opcional, solo para mostrar estado actual
}

// Obtener asignaciones actuales de un cliente
export async function getAsignacionesCliente(
  clienteId: number
): Promise<PagoAsignado[]> {
  const API_BASE = import.meta.env.VITE_API_URL;
  const res = await fetch(`${API_BASE}/api/asignaciones/${clienteId}`);
  if (!res.ok) throw new Error("Error al obtener asignaciones");
  return await res.json();
}
// api/asignacionesApi.ts

export async function guardarAsignaciones(
  pagoId: number,
  asignaciones: {
    tareaId: number;
    tipo: "trabajo" | "material";
    usado: number;
  }[]
): Promise<void> {
  const API_BASE = import.meta.env.VITE_API_URL;
  const res = await fetch(`${API_BASE}/api/asignaciones`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pagoId, asignaciones }),
  });

  if (!res.ok) {
    throw new Error("Error al guardar las asignaciones");
  }
}
