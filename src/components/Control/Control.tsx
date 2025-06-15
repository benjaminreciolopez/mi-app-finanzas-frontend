import { useEffect, useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
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
import { toast } from "react-toastify";
import { getDeudaReal, ResumenDeuda } from "../../api/deudaApi";
import { motion, AnimatePresence } from "framer-motion";

function Control() {
  const [trabajos, setTrabajos] = useState<Trabajo[]>([]);
  const [materiales, setMateriales] = useState<Material[]>([]);
  const [ordenClientes, setOrdenClientes] = useState<Cliente[]>([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState<number | null>(
    null
  );
  const [deudas, setDeudas] = useState<ResumenDeuda[]>([]);
  const [trabajoSeleccionado, setTrabajoSeleccionado] = useState<number | null>(
    null
  );

  useEffect(() => {
    setTrabajoSeleccionado(null);
  }, [clienteSeleccionado]);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    const [clientesData, trabajosData, materialesData] = await Promise.all([
      getClientes(),
      getTrabajos(),
      getMateriales(),
    ]);
    const clientesConRegistros = clientesData
      .filter(
        (c) =>
          trabajosData.some((t) => t.clienteId === c.id) ||
          materialesData.some((m) => m.clienteId === c.id)
      )
      .sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0));

    setTrabajos(trabajosData);
    setMateriales(materialesData);
    setOrdenClientes(clientesConRegistros);

    const resumenDeudas = await getDeudaReal();
    setDeudas(resumenDeudas);
  };

  const onDragEnd = async (result: DropResult) => {
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
    await cargarDatos();
  };

  const eliminarTrabajo = async (id: number) => {
    if (window.confirm("¿Eliminar este trabajo?")) {
      await deleteTrabajo(id);
      toast.success("Trabajo eliminado");
      await cargarDatos();
    }
  };

  return (
    <div className="container">
      <h2 className="title">Control de Clientes</h2>
      <div className="card">
        <div style={{ maxHeight: "70vh", overflowY: "auto" }}>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="clientes">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {ordenClientes.map((cliente, index) => {
                    const seleccionado = clienteSeleccionado === cliente.id;
                    const trabajosCliente = trabajos
                      .filter((t) => t.clienteId === cliente.id)
                      .sort(
                        (a, b) =>
                          new Date(a.fecha).getTime() -
                          new Date(b.fecha).getTime()
                      );
                    const materialesCliente = materiales.filter(
                      (m) => m.clienteId === cliente.id
                    );
                    const deuda = deudas.find(
                      (d) => d.clienteId === cliente.id
                    );

                    const totalHoras = trabajosCliente.reduce(
                      (acc, t) => acc + t.horas,
                      0
                    );
                    const totalHorasPagadas = trabajosCliente
                      .filter((t) => t.pagado)
                      .reduce((acc, t) => acc + t.horas, 0);

                    const totalCobrado = totalHorasPagadas * cliente.precioHora;

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
                                  seleccionado ? null : cliente.id
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
                              {deuda && deuda.totalTareasPendientes !== 0 && (
                                <div>
                                  Total por saldar:{" "}
                                  {deuda.totalTareasPendientes.toFixed(2)} €
                                </div>
                              )}
                              {deuda && deuda.totalDeuda !== 0 && (
                                <div>
                                  Deuda real: {deuda.totalDeuda.toFixed(2)} €
                                </div>
                              )}
                              {deuda && deuda.totalHorasPendientes !== 0 && (
                                <div>
                                  Horas pendientes: {deuda.totalHorasPendientes}
                                  h
                                </div>
                              )}
                              {deuda &&
                                deuda.totalMaterialesPendientes !== 0 && (
                                  <div>
                                    Materiales pendientes:{" "}
                                    {deuda.totalMaterialesPendientes.toFixed(2)}{" "}
                                    €
                                  </div>
                                )}
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
                                    <p>
                                      <strong>Trabajos pendientes:</strong>{" "}
                                      {
                                        trabajosCliente.filter((t) => !t.pagado)
                                          .length
                                      }{" "}
                                      de {trabajosCliente.length}
                                    </p>
                                    <p>
                                      <strong>Total horas trabajadas:</strong>{" "}
                                      {totalHoras}h
                                    </p>
                                    <p>
                                      <strong>Total cobrado:</strong>{" "}
                                      {totalCobrado.toFixed(2)} €
                                    </p>
                                    <ul>
                                      {trabajosCliente.map((t) => (
                                        <li
                                          key={t.id}
                                          style={{
                                            background:
                                              !t.pagado &&
                                              trabajoSeleccionado === t.id
                                                ? "#eef6fb"
                                                : "transparent",
                                            cursor: !t.pagado
                                              ? "pointer"
                                              : "default",
                                            borderRadius: "6px",
                                            padding: "2px 4px",
                                            marginBottom: "2px",
                                            position: "relative",
                                          }}
                                          onClick={() => {
                                            if (!t.pagado) {
                                              setTrabajoSeleccionado(
                                                trabajoSeleccionado === t.id
                                                  ? null
                                                  : t.id
                                              );
                                            }
                                          }}
                                        >
                                          {t.fecha}: {t.horas}h{" "}
                                          {t.pagado
                                            ? "(Pagado)"
                                            : "(Pendiente)"}
                                          <AnimatePresence>
                                            {!t.pagado &&
                                              trabajoSeleccionado === t.id && (
                                                <motion.div
                                                  key="botones"
                                                  initial={{
                                                    opacity: 0,
                                                    x: 20,
                                                  }}
                                                  animate={{ opacity: 1, x: 0 }}
                                                  exit={{ opacity: 0, x: 20 }}
                                                  transition={{
                                                    duration: 0.18,
                                                  }}
                                                  style={{
                                                    display: "inline-block",
                                                    marginLeft: 12,
                                                  }}
                                                >
                                                  <button
                                                    className="boton-accion"
                                                    onClick={async (e) => {
                                                      e.stopPropagation();
                                                      await marcarComoPagado(
                                                        t.id
                                                      );
                                                      setTrabajoSeleccionado(
                                                        null
                                                      );
                                                    }}
                                                    style={{ marginRight: 4 }}
                                                  >
                                                    ✅ Marcar pagado
                                                  </button>
                                                  <button
                                                    className="boton-accion"
                                                    onClick={async (e) => {
                                                      e.stopPropagation();
                                                      await eliminarTrabajo(
                                                        t.id
                                                      );
                                                      setTrabajoSeleccionado(
                                                        null
                                                      );
                                                    }}
                                                  >
                                                    🗑️ Eliminar
                                                  </button>
                                                </motion.div>
                                              )}
                                          </AnimatePresence>
                                        </li>
                                      ))}
                                    </ul>
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
    </div>
  );
}

export default Control;
