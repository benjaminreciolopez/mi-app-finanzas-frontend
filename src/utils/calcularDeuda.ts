import { Cliente } from "../api/clientesApi";
import { Trabajo } from "../api/trabajosApi";
import { Material } from "../api/materialesApi";
import { Pago } from "../api/pagosApi";

export interface DeudaCliente {
  clienteId: number;
  nombre: string;
  horasPendientes: number;
  materialesPendientes: number;
  totalDeuda: number;
}

export function calcularDeudas(
  clientes: Cliente[],
  trabajos: Trabajo[],
  materiales: Material[],
  pagos: Pago[]
): DeudaCliente[] {
  return clientes.map((cliente) => {
    const trabajosPendientes = trabajos.filter(
      (t) => t.clienteId === cliente.id && t.pagado === 0
    );
    const materialesPendientes = materiales.filter(
      (m) => m.nombre === cliente.nombre && m.pagado === 0
    );
    const pagosDelCliente = pagos.filter((p) => p.clienteId === cliente.id);

    const totalHoras = trabajosPendientes.reduce((acc, t) => acc + t.horas, 0);
    const totalMateriales = materialesPendientes.reduce(
      (acc, m) => acc + m.coste,
      0
    );
    const totalPagos = pagosDelCliente.reduce((acc, p) => acc + p.cantidad, 0);

    const total = totalHoras * cliente.precioHora + totalMateriales;
    const deudaFinal = Math.max(0, parseFloat((total - totalPagos).toFixed(2)));

    return {
      clienteId: cliente.id,
      nombre: cliente.nombre,
      horasPendientes: totalHoras,
      materialesPendientes: totalMateriales,
      totalDeuda: deudaFinal,
    };
  });
}
