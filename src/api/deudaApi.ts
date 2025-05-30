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

export async function getDeudaReal(): Promise<ResumenDeuda[]> {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Error al obtener la deuda real");
  return await res.json();
}
