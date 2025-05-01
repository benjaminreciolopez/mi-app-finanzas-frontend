import axios from "axios";

export interface ResumenMensual {
  id: number;
  año: number;
  mes: number;
  total: number;
}

// URL completa al backend en Render
const API_URL = "https://mi-app-finanzas-backend.onrender.com/api/evolucion";

export const getEvolucion = async (): Promise<ResumenMensual[]> => {
  const res = await axios.get<{ data: ResumenMensual[] }>(API_URL);
  return res.data.data;
};
