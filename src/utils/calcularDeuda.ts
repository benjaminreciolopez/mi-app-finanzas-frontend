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
    // Ordena trabajos por fecha para simular el saldo de pagos
    const trabajosCliente = trabajos
      .filter((t) => Number(t.clienteId) === Number(cliente.id))
      .sort(
        (a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
      );

    // Suma todos los pagos
    let saldoPagos = pagos
      .filter((p) => Number(p.clienteId) === Number(cliente.id))
      .reduce((acc, p) => acc + Number(p.cantidad), 0);

    let horasPendientes = 0;
    for (const trabajo of trabajosCliente) {
      const coste = Number(trabajo.horas) * Number(cliente.precioHora);
      // Si el trabajo ya está pagado manualmente, lo saltamos
      if (Number(trabajo.pagado) === 1) continue;
      // Si hay saldo, lo pagamos
      if (saldoPagos >= coste) {
        saldoPagos -= coste;
      } else {
        // No hay suficiente saldo, estas horas quedan pendientes
        horasPendientes += Number(trabajo.horas);
      }
    }

    // Materiales pendientes (solo los NO pagados)
    const materialesPendientes = materiales.filter(
      (m) =>
        Number(m.clienteId) === Number(cliente.id) && Number(m.pagado) === 0
    );
    const totalMateriales = materialesPendientes.reduce(
      (acc, m) => acc + Number(m.coste),
      0
    );

    // Solo lo pendiente, ya no se resta pagos históricos
    const total =
      horasPendientes * Number(cliente.precioHora) + totalMateriales;

    // Log para depuración
    console.log("Cliente:", cliente.nombre, cliente.id, {
      horasPendientes,
      totalMateriales,
      total,
      saldoPagos_final: saldoPagos,
    });

    return {
      clienteId: Number(cliente.id),
      nombre: cliente.nombre,
      horasPendientes,
      materialesPendientes: totalMateriales,
      totalDeuda: total,
    };
  });
}
