import axios from "axios";
import type { ResumenDeuda } from "./deudaApi";

const API_BASE = import.meta.env.VITE_API_URL;
const API_URL = `${API_BASE}/api/pagos`;

export interface Pago {
  id: number;
  clienteId: number;
  cantidad: number;
  fecha: string;
  observaciones?: string;
}

export type NuevoPago = Omit<Pago, "id">;

export interface RespuestaPago {
  message: string;
  resumen: ResumenDeuda;
  pago: Pago;
}

// ✅ Obtener todos los pagos
export const getPagos = async (): Promise<Pago[]> => {
  const res = await axios.get<{ data: Pago[] }>(API_URL);
  return res.data.data;
};

// ✅ Añadir un nuevo pago
export async function addPago(pago: NuevoPago): Promise<RespuestaPago> {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(pago),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Error al añadir el pago");
  }

  return await res.json();
}

// ✅ Actualizar un pago
export const updatePago = async (
  id: number,
  datos: Partial<NuevoPago>
): Promise<RespuestaPago> => {
  const res = await axios.put<RespuestaPago>(`${API_URL}/${id}`, datos);
  return res.data;
};

// ✅ Eliminar un pago
export const deletePago = async (id: number): Promise<RespuestaPago> => {
  const res = await axios.delete<RespuestaPago>(`${API_URL}/${id}`);
  return res.data;
};
