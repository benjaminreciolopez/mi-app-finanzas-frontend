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
  pagos: Pago[] // <-- Los pagos ya no se usan aquí, pero lo dejamos por compatibilidad
): DeudaCliente[] {
  return clientes.map((cliente) => {
    // Trabajos pendientes: pagado = 0
    const trabajosPendientes = trabajos.filter(
      (t) =>
        Number(t.clienteId) === Number(cliente.id) && Number(t.pagado) === 0
    );
    // Materiales pendientes: pagado = 0
    const materialesPendientes = materiales.filter(
      (m) =>
        Number(m.clienteId) === Number(cliente.id) && Number(m.pagado) === 0
    );

    const totalHoras = trabajosPendientes.reduce(
      (acc, t) => acc + Number(t.horas),
      0
    );
    const totalMateriales = materialesPendientes.reduce(
      (acc, m) => acc + Number(m.coste),
      0
    );

    // Deuda = trabajos pendientes + materiales pendientes
    const total = totalHoras * Number(cliente.precioHora) + totalMateriales;

    // LOG de depuración
    console.log("Cliente:", cliente.nombre, cliente.id, {
      trabajosPendientes,
      totalHoras,
      totalMateriales,
      total,
    });

    return {
      clienteId: Number(cliente.id),
      nombre: cliente.nombre,
      horasPendientes: totalHoras,
      materialesPendientes: totalMateriales,
      totalDeuda: total,
    };
  });
}
