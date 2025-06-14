// src/api/deudaApi.ts

const API_BASE = import.meta.env.VITE_API_URL;
const API_URL = `${API_BASE}/api/deuda-real`;

export interface PagoUsado {
  id: number;
  fecha?: string; // ← Puede venir o no (según API)
  cantidad?: number; // ← Puede venir o no
  usado: number;
  cuadrado?: number; // ← Añadido para ver si el pago está completamente usado
}

export interface ResumenDeuda {
  clienteId: number;
  nombre: string;
  totalHorasPendientes: number;
  totalMaterialesPendientes: number;
  totalPagado: number;
  totalDeuda: number;
  saldoACuenta?: number; // ← Añádelo si tu API lo devuelve
  pagosUsados: PagoUsado[];
}
export async function getPendientes(clienteId: number) {
  try {
    const res = await fetch(`${API_BASE}/api/deuda/${clienteId}/pendientes`);
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Error al obtener pendientes: ${errorText}`);
    }
    return await res.json();
  } catch (error) {
    console.error("Error al obtener pendientes:", error);
    return [];
  }
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
