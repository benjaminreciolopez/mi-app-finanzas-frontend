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
  cuadrado: number;
  clienteId: number;
}

// Adaptar los materiales al camelCase (clienteId)
export const getMateriales = async (): Promise<Material[]> => {
  const res = await axios.get<{ data: any[] }>(API_URL);
  return res.data.data.map((mat) => ({
    ...mat,
    clienteId: mat.clienteId ?? mat.clienteid, // <-- adapta aquí
  }));
};

// El input ahora es clienteId, adaptamos al backend si hace falta
export const addMaterial = async (material: {
  descripcion: string;
  coste: number;
  nombre: string;
  fecha: string;
  pagado?: number;
  cuadrado?: number;
  clienteId: number;
}): Promise<number> => {
  // Creamos un objeto plano para la API (sin tipar como Material)
  const dataToSend = {
    ...material,
    clienteid: material.clienteId, // el backend lo quiere así
  };
  delete (dataToSend as any).clienteId; // Borra la propiedad camelCase

  const res = await axios.post<{ id: number }>(API_URL, dataToSend);
  return res.data.id;
};

export const updateMaterial = async (id: number, datos: Partial<Material>) => {
  await axios.put(`${API_URL}/${id}`, datos);
};
