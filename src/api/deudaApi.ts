// src/api/deudaApi.ts

const API_BASE = import.meta.env.VITE_API_URL;
const API_URL = `${API_BASE}/api/deuda-real`;

export interface ResumenDeuda {
  clienteId: number;
  nombre: string;
  totalHorasPendientes: number;
  totalMaterialesPendientes: number;
  totalPagado: number;
  totalDeuda: number;
}

export async function getDeudaReal(): Promise<ResumenDeuda[]> {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Error al obtener la deuda real: ${errorText}`);
    }
    return await res.json();
  } catch (error) {
    console.error("Error al obtener deudas:", error);
    return [];
  }
}
