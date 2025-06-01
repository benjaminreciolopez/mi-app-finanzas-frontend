export interface PagoAsignado {
  id: number;
  clienteId: number;
  pagoId: number;
  tareaId: number;
  tipo: "trabajo" | "material";
  usado: number;
  fecha_pago: string;
  fecha_tarea: string;
  cuadrado?: number; // ← Añadido: puede ser 1 o 0 (opcional para compatibilidad)
}

export async function getAsignacionesCliente(
  clienteId: number
): Promise<PagoAsignado[]> {
  const API_BASE = import.meta.env.VITE_API_URL;
  const res = await fetch(`${API_BASE}/api/asignaciones/${clienteId}`);
  if (!res.ok) throw new Error("Error al obtener asignaciones");
  return await res.json();
}
