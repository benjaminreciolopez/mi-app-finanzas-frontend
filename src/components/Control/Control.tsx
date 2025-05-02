import { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { getClientes, Cliente } from "../../api/clientesApi";
import { getTrabajos, Trabajo } from "../../api/trabajosApi";
import { getMateriales, Material } from "../../api/materialesApi";
import { actualizarOrdenClientes } from "../../api/clientesApi";
import { toast } from "react-toastify";

function Control() {
  const [trabajos, setTrabajos] = useState<Trabajo[]>([]);
  const [materiales, setMateriales] = useState<Material[]>([]);
  const [ordenClientes, setOrdenClientes] = useState<Cliente[]>([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState<string | null>(
    null
  );

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    const [clientesData, trabajosData, materialesData] = await Promise.all([
      getClientes(),
      getTrabajos(),
      getMateriales(),
    ]);

    const clientesConRegistros = clientesData.filter(
      (c) =>
        trabajosData.some((t) => t.nombre === c.nombre) ||
        materialesData.some((m) => m.nombre === c.nombre)
    );

    setTrabajos(trabajosData);
    setMateriales(materialesData);
    setOrdenClientes(clientesConRegistros);
  };

  const onDragEnd = async (result: any) => {
    if (!result.destination) return;

    const updated = Array.from(ordenClientes);
    const [moved] = updated.splice(result.source.index, 1);
    updated.splice(result.destination.index, 0, moved);
    setOrdenClientes(updated);

    const ordenesActualizadas = updated.map((cliente, index) => ({
      id: cliente.id,
      orden: index,
    }));

    try {
      await actualizarOrdenClientes(ordenesActualizadas);
      toast.success("Orden guardado correctamente");
    } catch (error) {
      toast.error("Error al guardar el orden");
      console.error("Error:", error);
    }
  };

  return (
    <div className="container">
      <h2 className="title">Control de Clientes</h2>
      <div className="card">
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="clientes">
            {(provided: any) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {ordenClientes.map((cliente, index) => {
                  const seleccionado = clienteSeleccionado === cliente.nombre;
                  const trabajosCliente = trabajos.filter(
                    (t) => t.nombre === cliente.nombre
                  );
                  const materialesCliente = materiales.filter(
                    (m) => m.nombre === cliente.nombre
                  );
                  const totalHoras = trabajosCliente.reduce(
                    (acc, t) => acc + t.horas,
                    0
                  );
                  const totalTrabajos = trabajosCliente
                    .filter((t) => t.pagado === 1)
                    .reduce((acc, t) => acc + t.horas * cliente.precioHora, 0);
                  const totalMateriales = materialesCliente
                    .filter((m) => m.pagado === 1)
                    .reduce((acc, m) => acc + m.coste, 0);
                  const totalPagado = totalTrabajos + totalMateriales;

                  return (
                    <Draggable
                      key={cliente.id}
                      draggableId={cliente.id.toString()}
                      index={index}
                    >
                      {(provided: any) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{
                            ...provided.draggableProps.style,
                            marginBottom: "1rem",
                            borderBottom: "1px solid #ddd",
                            paddingBottom: "0.5rem",
                          }}
                        >
                          <p
                            onClick={() =>
                              setClienteSeleccionado(
                                seleccionado ? null : cliente.nombre
                              )
                            }
                            style={{
                              cursor: "pointer",
                              fontWeight: "bold",
                              color: seleccionado ? "#1e3a8a" : "#4f46e5",
                              backgroundColor: seleccionado
                                ? "#e0e7ff"
                                : "transparent",
                              padding: "6px 10px",
                              borderRadius: "6px",
                              userSelect: "none",
                            }}
                          >
                            {seleccionado ? "▼" : "▶"} {cliente.nombre}
                          </p>

                          <div style={{ marginLeft: "1rem" }}>
                            Total horas: {totalHoras}h<br />
                            Total cobrado: {totalPagado.toFixed(2)} €
                          </div>

                          {seleccionado && (
                            <div
                              className="card"
                              style={{ marginTop: "0.5rem" }}
                            >
                              <h4>🛠️ Trabajos</h4>
                              {trabajosCliente.length === 0 ? (
                                <p>No hay trabajos.</p>
                              ) : (
                                <ul>
                                  {trabajosCliente.map((t) => (
                                    <li key={t.id}>
                                      {t.fecha}: {t.horas}h{" "}
                                      {t.pagado ? "(Pagado)" : "(Pendiente)"}
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
                                      {m.fecha}: {m.descripcion} -{" "}
                                      {m.coste.toFixed(2)}€{" "}
                                      {m.pagado ? "(Pagado)" : "(Pendiente)"}
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
}

export default Control;
