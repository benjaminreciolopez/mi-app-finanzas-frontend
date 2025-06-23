import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL;
const API_URL = `${API_BASE}/api/trabajos`;

export interface Trabajo {
  id: number;
  clienteId: number;
  fecha: string;
  horas: number;
  precioHora: number;
  pagado: number; // debe ser 0 o 1
  cuadrado: number; // también 0 o 1
  observaciones?: string;
  nombre?: string; // Campo opcional para compatibilidad
}

export const getTrabajos = async (): Promise<Trabajo[]> => {
  try {
    const res = await axios.get<{ data: Trabajo[] }>(API_URL);
    return res.data.data;
  } catch (error) {
    throw error;
  }
};

export const updateTrabajo = async (
  id: number,
  datos: Partial<Trabajo>
): Promise<void> => {
  await axios.put(`${API_URL}/${id}`, datos);
};

export const addTrabajo = async (trabajo: {
  clienteId: number;
  fecha: string;
  horas: number;
  pagado: number;
}): Promise<number> => {
  const res = await axios.post<{ id: number }>(API_URL, trabajo);
  return res.data.id;
};

export const deleteTrabajo = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};
