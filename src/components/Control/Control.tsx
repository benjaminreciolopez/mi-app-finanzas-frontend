// src/components/Control/Control.tsx
import { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import {
  getClientes,
  Cliente,
  actualizarOrdenClientes,
} from "../../api/clientesApi";
import {
  getTrabajos,
  updateTrabajo,
  deleteTrabajo,
  Trabajo,
} from "../../api/trabajosApi";
import { getMateriales, Material } from "../../api/materialesApi";
import { getPagos } from "../../api/pagosApi";
import { toast } from "react-toastify";
import { calcularDeudas, DeudaCliente } from "../../utils/calcularDeuda";

function Control() {
  const [trabajos, setTrabajos] = useState<Trabajo[]>([]);
  const [materiales, setMateriales] = useState<Material[]>([]);
  const [ordenClientes, setOrdenClientes] = useState<Cliente[]>([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState<string | null>(
    null
  );
  const [deudas, setDeudas] = useState<DeudaCliente[]>([]);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    const [clientesData, trabajosData, materialesData, pagosData] =
      await Promise.all([
        getClientes(),
        getTrabajos(),
        getMateriales(),
        getPagos(),
      ]);

    const clientesConRegistros = clientesData
      .filter(
        (c) =>
          trabajosData.some((t) => t.nombre === c.nombre) ||
          materialesData.some((m) => m.nombre === c.nombre)
      )
      .sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0));

    setTrabajos(trabajosData);
    setMateriales(materialesData);
    setOrdenClientes(clientesConRegistros);

    const resumenDeudas = calcularDeudas(
      clientesConRegistros,
      trabajosData,
      materialesData,
      pagosData
    );
    setDeudas(resumenDeudas);
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
    }
  };

  const marcarComoPagado = async (id: number) => {
    await updateTrabajo(id, { pagado: 1 });
    toast.success("Trabajo marcado como pagado");
    cargarDatos();
  };

  const eliminarTrabajo = async (id: number) => {
    if (window.confirm("¿Eliminar este trabajo?")) {
      await deleteTrabajo(id);
      toast.success("Trabajo eliminado");
      cargarDatos();
    }
  };

  return (
    <div className="container">
      <h2 className="title">Control de Clientes</h2>
      <div className="card">
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="clientes">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {ordenClientes.map((cliente, index) => {
                  const seleccionado = clienteSeleccionado === cliente.nombre;
                  const trabajosCliente = trabajos
                    .filter((t) => t.nombre === cliente.nombre)
                    .sort(
                      (a, b) =>
                        new Date(a.fecha).getTime() -
                        new Date(b.fecha).getTime()
                    );
                  const materialesCliente = materiales.filter(
                    (m) => m.nombre === cliente.nombre
                  );
                  const deuda = deudas.find((d) => d.clienteId === cliente.id);
                  const totalHoras = trabajosCliente.reduce(
                    (acc, t) => acc + t.horas,
                    0
                  );

                  return (
                    <Draggable
                      key={cliente.id}
                      draggableId={cliente.id.toString()}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{
                            ...provided.draggableProps.style,
                            marginBottom: "1rem",
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
                            Total deuda: {deuda?.totalDeuda.toFixed(2)} €
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
                                <>
                                  <ul>
                                    {trabajosCliente.map((t) => (
                                      <li key={t.id}>
                                        {t.fecha}: {t.horas}h{" "}
                                        {t.pagado ? "(Pagado)" : "(Pendiente)"}{" "}
                                        {!t.pagado && (
                                          <>
                                            <button
                                              className="boton-accion"
                                              onClick={() =>
                                                marcarComoPagado(t.id)
                                              }
                                            >
                                              ✅ Marcar pagado
                                            </button>
                                            <button
                                              className="boton-accion"
                                              onClick={() =>
                                                eliminarTrabajo(t.id)
                                              }
                                            >
                                              🗑️ Eliminar
                                            </button>
                                          </>
                                        )}
                                      </li>
                                    ))}
                                  </ul>
                                  <p>
                                    <strong>Total horas trabajadas:</strong>{" "}
                                    {totalHoras}h
                                  </p>
                                </>
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
