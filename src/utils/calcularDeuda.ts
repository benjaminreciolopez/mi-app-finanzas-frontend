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
    // Siempre convierte ambos valores a número para evitar fallos de tipo
    const trabajosPendientes = trabajos.filter(
      (t) =>
        Number(t.clienteId) === Number(cliente.id) && Number(t.pagado) === 0
    );
    const materialesPendientes = materiales.filter(
      (m) =>
        Number(m.clienteId) === Number(cliente.id) && Number(m.pagado) === 0
    );
    const pagosDelCliente = pagos.filter(
      (p) => Number(p.clienteId) === Number(cliente.id)
    );

    const totalHoras = trabajosPendientes.reduce(
      (acc, t) => acc + Number(t.horas),
      0
    );
    const totalMateriales = materialesPendientes.reduce(
      (acc, m) => acc + Number(m.coste),
      0
    );
    const totalPagos = pagosDelCliente.reduce(
      (acc, p) => acc + Number(p.cantidad),
      0
    );

    const total = totalHoras * Number(cliente.precioHora) + totalMateriales;
    const deudaFinal = Math.max(0, parseFloat((total - totalPagos).toFixed(2)));

    return {
      clienteId: Number(cliente.id),
      nombre: cliente.nombre,
      horasPendientes: totalHoras,
      materialesPendientes: totalMateriales,
      totalDeuda: deudaFinal,
    };
  });
}
