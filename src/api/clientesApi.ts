import axios from "axios";

const API_URL = "https://mi-app-finanzas-backend.onrender.com/api/clientes";

export interface Cliente {
  id: number;
  nombre: string;
  precioHora: number;
}

export const getClientes = async (): Promise<Cliente[]> => {
  const res = await axios.get<{ data: Cliente[] }>(API_URL);
  return res.data.data;
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
