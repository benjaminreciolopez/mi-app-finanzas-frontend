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
  const res = await axios.get<any>(API_URL);
  if (Array.isArray(res.data)) return res.data;
  if (res.data && Array.isArray(res.data.data)) return res.data.data;
  return [];
};

// ✅ Añadir un nuevo pago
export const addPago = async (pago: NuevoPago): Promise<RespuestaPago> => {
  try {
    const res = await axios.post<RespuestaPago>(API_URL, pago);
    return res.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || "Error al añadir el pago");
  }
};

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
