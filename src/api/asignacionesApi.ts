// api/asignacionesApi.ts

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

export async function guardarAsignaciones(
  pagoId: number,
  asignaciones: {
    tareaId: number;
    tipo: "trabajo" | "material";
    usado: number;
    fechaTarea: string;
  }[]
): Promise<void> {
  const API_BASE = import.meta.env.VITE_API_URL;

  const cuerpo = asignaciones.map((a) => ({
    trabajoid: a.tipo === "trabajo" ? a.tareaId : null,
    materialid: a.tipo === "material" ? a.tareaId : null,
    usado: a.usado,
    fecha_tarea: a.fechaTarea,
  }));

  const res = await fetch(`${API_BASE}/api/asignaciones`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      pagoId,
      asignaciones: cuerpo,
      fechaPago: new Date().toISOString(), // ¡Correcto!
    }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Error al guardar las asignaciones");
  }
}
