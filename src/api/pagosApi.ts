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

// Obtener todos los pagos
export const getPagos = async (): Promise<Pago[]> => {
  const res = await axios.get<{ data: Pago[] }>(API_URL);
  return res.data.data;
};

export async function addPago(pago: {
  clienteId: number;
  cantidad: number;
  fecha: string;
  observaciones?: string;
}): Promise<number> {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(pago),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Error al añadir el pago");
  }

  const data = await res.json();
  return data.id;
}

// Actualizar un pago existente
export const updatePago = async (
  id: number,
  datos: Partial<Omit<Pago, "id">>
) => {
  await axios.put(`${API_URL}/${id}`, datos);
};

// Eliminar un pago por ID
export const deletePago = async (id: number) => {
  await axios.delete(`${API_URL}/${id}`);
};
