import { useEffect, useState } from "react";
import { getClientes, Cliente } from "../../api/clientesApi";
import { getTrabajos, Trabajo } from "../../api/trabajosApi";
import { getMateriales, Material } from "../../api/materialesApi";

function Control() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [trabajos, setTrabajos] = useState<Trabajo[]>([]);
  const [materiales, setMateriales] = useState<Material[]>([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState<string | null>(
    null
  );

  useEffect(() => {
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
    cargarDatos();
  }, []);

  return (
    <div className="container">
      <h2 className="title">Control de Deudas</h2>
      <div className="card">
        {clientes.map((cliente) => {
          const trabajosCliente = trabajos.filter(
            (t) => t.nombre === cliente.nombre
          );
          const materialesCliente = materiales.filter(
            (m) => m.nombre === cliente.nombre
          );

          const totalTrabajosPagados = trabajosCliente
            .filter((t) => t.pagado === 1)
            .reduce((acc, t) => acc + t.horas * cliente.precioHora, 0);

          const totalMaterialesPagados = materialesCliente
            .filter((m) => m.pagado === 1)
            .reduce((acc, m) => acc + m.coste, 0);

          const totalTrabajosPendientes = trabajosCliente
            .filter((t) => t.pagado === 0)
            .reduce((acc, t) => acc + t.horas * cliente.precioHora, 0);

          const totalMaterialesPendientes = materialesCliente
            .filter((m) => m.pagado === 0)
            .reduce((acc, m) => acc + m.coste, 0);

          const seleccionado = clienteSeleccionado === cliente.nombre;

          return (
            <div key={cliente.id}>
              <p
                onClick={() =>
                  setClienteSeleccionado(seleccionado ? null : cliente.nombre)
                }
                style={{
                  cursor: "pointer",
                  fontWeight: "bold",
                  color: seleccionado ? "#1e3a8a" : "#4f46e5",
                  backgroundColor: seleccionado ? "#e0e7ff" : "transparent",
                  padding: "6px 10px",
                  borderRadius: "6px",
                  userSelect: "none",
                }}
              >
                {seleccionado ? "▼" : "▶"} {cliente.nombre}
              </p>

              <div style={{ marginLeft: "1rem", marginBottom: "0.5rem" }}>
                Ingresos cobrados:{" "}
                {(totalTrabajosPagados + totalMaterialesPagados).toFixed(2)}€
                <br />
                Deuda pendiente:{" "}
                {(totalTrabajosPendientes + totalMaterialesPendientes).toFixed(
                  2
                )}
                €
              </div>

              {seleccionado && (
                <div className="card" style={{ marginTop: "0.5rem" }}>
                  <h4>🛠️ Trabajos</h4>
                  {trabajosCliente.length === 0 ? (
                    <p>No hay trabajos.</p>
                  ) : (
                    <ul>
                      {trabajosCliente.map((t) => (
                        <li key={t.id}>
                          {t.fecha}: {t.horas}h -{" "}
                          {t.pagado ? "Pagado" : "Pendiente"}
                        </li>
                      ))}
                    </ul>
                  )}

                  <h4>🧱 Materiales</h4>
                  {materialesCliente.length === 0 ? (
                    <p>No hay materiales.</p>
                  ) : (
                    <ul>
                      {materialesCliente.map((m) => (
                        <li key={m.id}>
                          {m.fecha}: {m.descripcion} - {m.coste.toFixed(2)}€ -{" "}
                          {m.pagado ? "Pagado" : "Pendiente"}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
              <hr />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Control;
