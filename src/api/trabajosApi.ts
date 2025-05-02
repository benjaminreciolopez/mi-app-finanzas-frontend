import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL;
const API_URL = `${API_BASE}/api/trabajos`;

export interface Trabajo {
  id: number;
  nombre: string;
  fecha: string;
  horas: number;
  pagado: number;
}

export const getTrabajos = async (): Promise<Trabajo[]> => {
  const res = await axios.get<{ data: Trabajo[] }>(API_URL);
  return res.data.data;
};

export const updateTrabajo = (id: number, datos: Partial<Trabajo>) =>
  axios.put(`${API_URL}/${id}`, datos);

export const addTrabajo = async (trabajo: {
  nombre: string;
  fecha: string;
  horas: number;
  pagado: number;
}): Promise<number> => {
  const res = await axios.post<{ id: number }>(API_URL, trabajo);
  return res.data.id;
};

// ✅ Nueva función para eliminar trabajo
export const deleteTrabajo = async (id: number) => {
  await axios.delete(`${API_URL}/${id}`);
};
