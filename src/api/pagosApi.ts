import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL;
const API_URL = `${API_BASE}/api/pagos`;

export interface Pago {
  id: number;
  clienteId: number;
  cantidad: number;
  fecha: string;
  observaciones?: string;
}

interface RespuestaPago {
  id?: number;
  message: string;
  resumen: any;
}

// ✅ Obtener todos los pagos
export const getPagos = async (): Promise<Pago[]> => {
  const res = await axios.get<{ data: Pago[] }>(API_URL);
  return res.data.data;
};

// ✅ Añadir un nuevo pago
export async function addPago(pago: {
  clienteId: number;
  cantidad: number;
  fecha: string;
  observaciones?: string;
}): Promise<RespuestaPago> {
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

// Actualizar pago
export const updatePago = async (
  id: number,
  datos: Partial<Omit<Pago, "id">>
): Promise<RespuestaPago> => {
  const res = await axios.put<RespuestaPago>(`${API_URL}/${id}`, datos);
  return res.data;
};

// Eliminar pago
export const deletePago = async (id: number): Promise<RespuestaPago> => {
  const res = await axios.delete<RespuestaPago>(`${API_URL}/${id}`);
  return res.data;
};
