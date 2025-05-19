import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL;
const API_URL = `${API_BASE}/api/materiales`;

export interface Material {
  id: number;
  descripcion: string;
  coste: number;
  nombre: string;
  fecha: string;
  pagado: number;
  clienteId: number;
}

export const getMateriales = async (): Promise<Material[]> => {
  const res = await axios.get<{ data: Material[] }>(API_URL);
  return res.data.data;
};

export const addMaterial = async (material: {
  descripcion: string;
  coste: number;
  nombre: string;
  fecha: string;
  pagado: number;
  clienteId: number;
}): Promise<number> => {
  const res = await axios.post<{ id: number }>(API_URL, material);
  return res.data.id;
};

export const updateMaterial = async (id: number, datos: Partial<Material>) => {
  await axios.put(`${API_URL}/${id}`, datos);
};
