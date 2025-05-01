import axios from "axios";

const API_URL = "https://mi-app-finanzas-backend.onrender.com/api/pagos";

export interface Pago {
  id: number;
  nombre: string;
  cantidad: number;
  fecha: string;
}

export const getPagos = async (): Promise<Pago[]> => {
  const res = await axios.get<{ data: Pago[] }>(API_URL);
  return res.data.data;
};

export const addPago = async (pago: {
  nombre: string;
  cantidad: number;
  fecha: string;
}) => {
  await axios.post(API_URL, pago);
};
