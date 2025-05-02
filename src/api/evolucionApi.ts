import axios from "axios";

export interface ResumenMensual {
  id: number;
  año: number;
  mes: number;
  total: number;
}

// URL completa al backend en Render
const API_BASE = import.meta.env.VITE_API_URL;
const API_URL = `${API_BASE}/api/evolucion`;

export const getEvolucion = async (): Promise<ResumenMensual[]> => {
  const res = await axios.get<{ data: ResumenMensual[] }>(API_URL);
  return res.data.data;
};
