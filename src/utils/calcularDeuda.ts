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
    const trabajosCliente = trabajos.filter(
      (t) => Number(t.clienteId) === Number(cliente.id)
    );
    const materialesCliente = materiales.filter(
      (m) => Number(m.clienteId) === Number(cliente.id)
    );
    const pagosCliente = pagos.filter(
      (p) => Number(p.clienteId) === Number(cliente.id)
    );

    const totalHoras = trabajosCliente.reduce(
      (acc, t) => acc + Number(t.horas),
      0
    );

    const totalMateriales = materialesCliente.reduce(
      (acc, m) => acc + Number(m.coste),
      0
    );

    const totalPagado = pagosCliente.reduce(
      (acc, p) => acc + Number(p.cantidad),
      0
    );

    const costeTotalTrabajos = totalHoras * Number(cliente.precioHora);
    const deudaReal = Math.max(
      0,
      costeTotalTrabajos + totalMateriales - totalPagado
    );

    // LOG de depuración
    console.log("Cliente:", cliente.nombre, cliente.id, {
      totalHoras,
      totalMateriales,
      totalPagado,
      deudaReal,
    });

    return {
      clienteId: Number(cliente.id),
      nombre: cliente.nombre,
      horasPendientes: totalHoras,
      materialesPendientes: totalMateriales,
      totalDeuda: deudaReal,
    };
  });
}
