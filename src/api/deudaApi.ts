import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL;
const API_URL = `${API_BASE}/api/deuda-real`;

export interface ResumenDeuda {
  clienteId: number;
  nombre: string;
  totalHoras: number;
  totalMateriales: number;
  totalPagado: number;
  totalDeuda: number;
}

export const getDeudaReal = async (): Promise<ResumenDeuda[]> => {
  const res = await axios.get<ResumenDeuda[]>(API_URL);
  return res.data;
};
