import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL;
const API_URL = `${API_BASE}/api/clientes`;

export interface Cliente {
  id: number;
  nombre: string;
  precioHora: number;
}

export const getClientes = async (): Promise<Cliente[]> => {
  const res = await axios.get<{ data: Cliente[] }>(API_URL);
  return res.data.data;
};

export const actualizarOrdenClientes = async (
  ordenes: { id: number; orden: number }[]
) => {
  await axios.put(`${API_URL}/orden`, { ordenes });
};

export const addCliente = async (cliente: {
  nombre: string;
  precioHora: number;
}) => {
  await axios.post(API_URL, cliente);
};
export const updateCliente = (id: number, cliente: Partial<Cliente>) =>
  axios.put(`${API_URL}/${id}`, cliente);

export const deleteCliente = (id: number) => axios.delete(`${API_URL}/${id}`);
