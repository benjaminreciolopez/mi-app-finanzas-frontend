import { useEffect, useState } from "react";
import { getClientes, Cliente } from "../../api/clientesApi";
import { getTrabajos, Trabajo } from "../../api/trabajosApi";
import { getMateriales, Material } from "../../api/materialesApi";

interface DeudaCliente {
  nombre: string;
  horasPendientes: number;
  materialesPendientes: number;
  totalDeuda: number;
}

function Control() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [trabajos, setTrabajos] = useState<Trabajo[]>([]);
  const [materiales, setMateriales] = useState<Material[]>([]);
  const [deudas, setDeudas] = useState<DeudaCliente[]>([]);

  useEffect(() => {
    cargarDatos();
  }, []);

  useEffect(() => {
    calcularDeudas();
  }, [clientes, trabajos, materiales]);

  const cargarDatos = async () => {
    const [clientesData, trabajosData, materialesData] = await Promise.all([
      getClientes(),
      getTrabajos(),
      getMateriales(),
    ]);
    setClientes(clientesData);
    setTrabajos(trabajosData);
    setMateriales(materialesData);
  };

  const calcularDeudas = () => {
    if (clientes.length === 0) return;

    const resumen: DeudaCliente[] = clientes.map((cliente) => {
      const trabajosPendientes = trabajos.filter(
        (t) => t.nombre === cliente.nombre && t.pagado === 0
      );
      const materialesPendientes = materiales.filter(
        (m) => m.nombre === cliente.nombre && m.pagado === 0
      );

      const horas = trabajosPendientes.reduce((acc, t) => acc + t.horas, 0);
      const costeMateriales = materialesPendientes.reduce(
        (acc, m) => acc + m.coste,
        0
      );
      const total = parseFloat(
        (horas * cliente.precioHora + costeMateriales).toFixed(2)
      );

      return {
        nombre: cliente.nombre,
        horasPendientes: horas,
        materialesPendientes: costeMateriales,
        totalDeuda: total,
      };
    });

    setDeudas(resumen.filter((d) => d.totalDeuda > 0));
  };

  return (
    <div className="container">
      <h2 className="title">Control de Deudas</h2>
      <div className="card">
        <h3 className="title" style={{ marginTop: "2rem" }}>
          Clientes con ingresos cobrados
        </h3>
        <div className="card">
          {clientes.map((cliente) => {
            const trabajosPagados = trabajos.filter(
              (t) => t.nombre === cliente.nombre && t.pagado === 1
            );
            const materialesPagados = materiales.filter(
              (m) => m.nombre === cliente.nombre && m.pagado === 1
            );

            const totalTrabajos = trabajosPagados.reduce(
              (acc, t) => acc + t.horas * cliente.precioHora,
              0
            );
            const totalMateriales = materialesPagados.reduce(
              (acc, m) => acc + m.coste,
              0
            );
            const total = totalTrabajos + totalMateriales;

            if (total === 0) return null;

            return (
              <div key={cliente.id}>
                <strong>{cliente.nombre}</strong>: {total.toFixed(2)} €
                (Trabajos: {totalTrabajos.toFixed(2)} €, Materiales:{" "}
                {totalMateriales.toFixed(2)} €)
              </div>
            );
          })}
        </div>
        {deudas.length === 0 && <p>No hay deudas pendientes.</p>}
        {deudas.map((d, i) => (
          <div key={i}>
            <strong>{d.nombre}</strong>
            <br />
            Horas pendientes: {d.horasPendientes}h<br />
            Materiales pendientes: {d.materialesPendientes}€<br />
            <strong>Total deuda: {d.totalDeuda}€</strong>
            <hr />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Control;
