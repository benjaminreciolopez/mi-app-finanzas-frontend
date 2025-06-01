import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL;
const API_URL = `${API_BASE}/api/clientes`;

export interface Cliente {
  id: number;
  nombre: string;
  precioHora: number;
  orden?: number;
}

export const getClientes = async (): Promise<Cliente[]> => {
  const res = await axios.get<{ data: Cliente[] }>(API_URL);
  return res.data.data;
};

export const actualizarOrdenClientes = async (
  ordenes: { id: number; orden: number }[]
): Promise<void> => {
  await fetch(`${import.meta.env.VITE_API_URL}/api/clientes/orden`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ordenes }),
  });
};

// Si quieres recibir el id al crear un cliente, descomenta esta función:
// export const addCliente = async (cliente: { nombre: string; precioHora: number }): Promise<number> => {
//   const res = await axios.post<{ id: number }>(API_URL, cliente);
//   return res.data.id;
// };

// Si no te hace falta, puedes dejarlo así:
export const addCliente = async (cliente: {
  nombre: string;
  precioHora: number;
}): Promise<void> => {
  await axios.post(API_URL, cliente);
};

export const updateCliente = async (
  id: number,
  cliente: Partial<Cliente>
): Promise<void> => {
  await axios.put(`${API_URL}/${id}`, cliente);
};

export const deleteCliente = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};
