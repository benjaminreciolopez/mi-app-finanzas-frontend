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

// ✅ Ahora devuelven el objeto completo
export const getPagos = async (): Promise<Pago[]> => {
  const res = await axios.get<{ data: Pago[] }>(API_URL);
  return res.data.data;
};

export async function addPago(pago: {
  clienteId: number;
  cantidad: number;
  fecha: string;
  observaciones?: string;
}): Promise<any> {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(pago),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Error al añadir el pago");
  }

  // Devuelve el objeto { id, message, resumen }
  return await res.json();
}

export const updatePago = async (
  id: number,
  datos: Partial<Omit<Pago, "id">>
): Promise<any> => {
  const res = await axios.put(`${API_URL}/${id}`, datos);
  return res.data; // Devuelve { message, resumen }
};

export const deletePago = async (id: number): Promise<any> => {
  const res = await axios.delete(`${API_URL}/${id}`);
  return res.data; // Devuelve { message, resumen }
};
