import axios from "axios";

const API_URL = "https://mi-app-finanzas-backend.onrender.com/api/trabajos";

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
  axios.put(`http://localhost:3001/api/trabajos/${id}`, datos);

export const addTrabajo = async (trabajo: {
  nombre: string;
  fecha: string;
  horas: number;
  pagado: number;
}): Promise<number> => {
  const res = await axios.post<{ id: number }>(API_URL, trabajo);
  return res.data.id;
};
