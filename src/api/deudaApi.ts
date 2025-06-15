const API_BASE = import.meta.env.VITE_API_URL;
const API_URL = `${API_BASE}/api/deuda-real`;

export interface PagoUsado {
  id: number;
  fecha?: string;
  cantidad?: number;
  usado: number;
  cuadrado?: number;
}

export interface ResumenDeuda {
  clienteId: number;
  nombre: string;
  totalHorasPendientes: number;
  totalMaterialesPendientes: number;
  totalPagado: number;
  totalDeuda: number;
  totalTareasPendientes: number;
  saldoACuenta: number; // ✅ requerido (el backend lo devuelve siempre)
  pagosUsados: PagoUsado[];
}

export interface TrabajoOMaterial {
  id: number;
  tipo: "trabajo" | "material";
  fecha: string;
  coste: number;
  pagado?: number; // Puede no estar presente
  pendiente?: number;
  horas?: number; // Solo para trabajos
  precioHora?: number; // Solo si quieres mostrarlo también
}

export async function getPendientes(
  clienteId: number
): Promise<{ trabajos: TrabajoOMaterial[]; materiales: TrabajoOMaterial[] }> {
  try {
    const res = await fetch(`${API_BASE}/api/deuda/${clienteId}/pendientes`);
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Error al obtener pendientes: ${errorText}`);
    }

    const json = await res.json();

    if (
      !json ||
      !Array.isArray(json.trabajos) ||
      !Array.isArray(json.materiales)
    ) {
      throw new Error("Respuesta inesperada del servidor");
    }

    return json;
  } catch (error) {
    console.error("Error al obtener pendientes:", error);
    return { trabajos: [], materiales: [] };
  }
}

export async function getDeudaReal(): Promise<ResumenDeuda[]> {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Error al obtener la deuda real: ${errorText}`);
    }

    const json = await res.json();
    if (!Array.isArray(json)) throw new Error("Respuesta no válida");

    return json;
  } catch (error) {
    console.error("Error al obtener deudas:", error);
    return [];
  }
}
