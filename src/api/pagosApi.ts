import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL;
const API_URL = `${API_BASE}/api/pagos`;

export interface Pago {
  id: number;
  nombre: string;
  cantidad: number;
  fecha: string;
  observaciones?: string; // ✅ nuevo campo opcional
}

// Obtener todos los pagos
export const getPagos = async (): Promise<Pago[]> => {
  const res = await axios.get<{ data: Pago[] }>(API_URL);
  return res.data.data;
};

// Añadir un nuevo pago
export const addPago = async (pago: {
  nombre: string;
  cantidad: number;
  fecha: string;
  observaciones?: string; // ✅ permitir enviar observaciones opcionales
}) => {
  await axios.post(API_URL, pago);
};
