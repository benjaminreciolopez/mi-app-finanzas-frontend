import axios from "axios";

export interface ResumenMensual {
  id: number;
  año: number;
  mes: number;
  total: number;
}

export const getEvolucion = async (): Promise<ResumenMensual[]> => {
  const res = await axios.get<{ data: ResumenMensual[] }>("/api/evolucion");
  return res.data.data;
};
