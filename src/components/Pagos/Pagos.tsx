import { useEffect, useRef, useState } from "react";
import {
  getPagos,
  addPago,
  deletePago,
  updatePago,
  Pago,
} from "../../api/pagosApi";
import { getClientes, Cliente } from "../../api/clientesApi";
import { toast } from "react-toastify";
import { AnimatePresence, motion } from "framer-motion";
import { getDeudaReal } from "../../api/deudaApi";
import { guardarAsignaciones } from "../../api/asignacionesApi";
import {
  getAsignacionesCliente,
  PagoAsignado,
} from "../../api/asignacionesApi";
const API_BASE = import.meta.env.VITE_API_URL;
import AsignadorManual from "../AsignadorManual"; // ajusta ruta si es distinta

interface PagoConNombre extends Pago {
  nombre: string;
}
interface PagoUsado {
  id: number;
  usado: number;
  fecha?: string;
}

type UsoPagosPorCliente = { [clienteId: number]: PagoUsado[] };

function Pagos() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [pagosConNombre, setPagosConNombre] = useState<PagoConNombre[]>([]);
  const [clienteId, setClienteId] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [fecha, setFecha] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [clienteSeleccionado, setClienteSeleccionado] = useState<string | null>(
    null
  );
  const [mostrarAsignador, setMostrarAsignador] = useState(false);
  const [pagoRecienCreado, setPagoRecienCreado] = useState<Pago | null>(null);
  const [pendientes, setPendientes] = useState<{
    trabajos: any[];
    materiales: any[];
  }>({ trabajos: [], materiales: [] });

  const [asignaciones, setAsignaciones] = useState<PagoAsignado[]>([]);
  const pagosListRef = useRef<HTMLUListElement>(null);
  const [loadingPago, setLoadingPago] = useState(false);
  const [pagoSeleccionado, setPagoSeleccionado] = useState<number | null>(null);
  const [usoPagosPorCliente, setUsoPagosPorCliente] =
    useState<UsoPagosPorCliente>({});

  useEffect(() => {
    if (!clienteSeleccionado) {
      setAsignaciones([]);
      return;
    }
    const cliente = clientes.find((c) => c.nombre === clienteSeleccionado);
    if (!cliente) return;
    getAsignacionesCliente(cliente.id)
      .then(setAsignaciones)
      .catch(() => setAsignaciones([]));
  }, [clienteSeleccionado, clientes]);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    const [clientesData, pagosData, resumenDeudas] = await Promise.all([
      getClientes(),
      getPagos(),
      getDeudaReal(),
    ]);

    setClientes(clientesData);

    // Mapear pagos usados por cliente
    const uso: UsoPagosPorCliente = {};
    resumenDeudas.forEach((d) => {
      uso[d.clienteId] = d.pagosUsados ?? [];
    });
    setUsoPagosPorCliente(uso);

    const pagosConNombres = pagosData.map((pago: Pago) => {
      const cliente = clientesData.find((c) => c.id === pago.clienteId);
      return {
        ...pago,
        nombre: cliente?.nombre || "Desconocido",
      };
    });

    setPagosConNombre(pagosConNombres);
  };

  // ... imports y hooks como antes ...

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clienteId || !cantidad || !fecha) return;

    setLoadingPago(true);

    try {
      const respuesta = await addPago({
        clienteId: parseInt(clienteId),
        cantidad: parseFloat(cantidad),
        fecha: new Date(fecha).toISOString(),
        observaciones: observaciones.trim() || undefined,
      });

      setClienteId("");
      setCantidad("");
      setFecha("");
      setObservaciones("");

      if (respuesta.resumen && respuesta.id != null) {
        const nuevosPagosCliente = respuesta.resumen.pagosUsados.map(
          (p: PagoUsado) => ({
            id: p.id ?? 0,
            clienteId: respuesta.resumen!.clienteId,
            cantidad: p.usado,
            fecha: p.fecha || fecha,
            observaciones: "",
            nombre: respuesta.resumen!.nombre,
          })
        );

        const pendientesRes = await fetch(
          `${API_BASE}/api/deuda/${respuesta.resumen.clienteId}/pendientes`
        );
        const pendientesData = await pendientesRes.json();

        setUsoPagosPorCliente((prev) => ({
          ...prev,
          [respuesta.resumen!.clienteId]: respuesta.resumen!.pagosUsados,
        }));

        setPagoRecienCreado({
          id: respuesta.id,
          clienteId: respuesta.resumen!.clienteId,
          cantidad: parseFloat(cantidad),
          fecha,
          observaciones,
        });

        setPendientes(pendientesData);
        setMostrarAsignador(true);
        setPagosConNombre((prev) => [
          ...prev.filter((p) => p.clienteId !== respuesta.resumen!.clienteId),
          ...nuevosPagosCliente,
        ]);
        toast.success("Pago registrado correctamente");
      } else {
        await cargarDatos();
      }
    } catch (error) {
      toast.error("Error al registrar el pago");
      console.error(error);
    } finally {
      setLoadingPago(false);
    }
  };
  const handleUpdate = async (id: number, campo: string, valor: string) => {
    const pago = pagosConNombre.find((p) => p.id === id);
    if (!pago) return;

    const actualizado = { ...pago, [campo]: valor };

    try {
      const respuesta = await updatePago(id, {
        cantidad:
          typeof actualizado.cantidad === "number"
            ? actualizado.cantidad
            : parseFloat(
                (actualizado.cantidad as string | number).toString() || "0"
              ),
        fecha: new Date(actualizado.fecha).toISOString(),
        observaciones: actualizado.observaciones,
      });

      toast.success("Pago actualizado");

      if (respuesta.resumen) {
        setUsoPagosPorCliente((prev) => ({
          ...prev,
          [respuesta.resumen!.clienteId]: respuesta.resumen!.pagosUsados,
        }));

        setPagosConNombre((prev) => {
          const nuevosPagosCliente = respuesta.resumen!.pagosUsados.map(
            (p: PagoUsado) => ({
              id: p.id ?? 0,
              clienteId: respuesta.resumen!.clienteId,
              cantidad: p.usado,
              fecha: p.fecha || actualizado.fecha,
              observaciones: actualizado.observaciones,
              nombre: respuesta.resumen!.nombre,
            })
          );

          return [
            ...prev.filter((p) => p.clienteId !== respuesta.resumen!.clienteId),
            ...nuevosPagosCliente,
          ];
        });
      } else {
        await cargarDatos();
      }

      setPagoSeleccionado(null);
    } catch (error) {
      toast.error("Error al actualizar");
      console.error(error);
    }
  };
  const handleDelete = async (id: number) => {
    try {
      const respuesta = await deletePago(id);
      toast.success("Pago eliminado");

      if (respuesta.resumen) {
        setUsoPagosPorCliente((prev) => ({
          ...prev,
          [respuesta.resumen!.clienteId]: respuesta.resumen!.pagosUsados,
        }));

        setPagosConNombre((prev) => prev.filter((p) => p.id !== id));
      } else {
        await cargarDatos();
      }

      setPagoSeleccionado(null);
    } catch (error) {
      toast.error("Error al eliminar el pago");
      console.error(error);
    }
  };

  useEffect(() => {
    if (pagosListRef.current && clienteId) {
      // Solo hace scroll si hay pagos en la lista del cliente seleccionado
      const pagosCliente = pagosConNombre.filter(
        (p) => p.clienteId === parseInt(clienteId)
      );
      if (pagosCliente.length > 0) {
        pagosListRef.current.scrollTop = pagosListRef.current.scrollHeight;
      }
    }
  }, [clienteId, pagosConNombre]);

  return (
    <div className="container">
      <h2 className="title">Registro de Pagos</h2>
      <form onSubmit={handleSubmit} className="card">
        <select
          value={clienteId}
          onChange={(e) => {
            setClienteId(e.target.value);
            const cliente = clientes.find(
              (c) => c.id === parseInt(e.target.value)
            );
            setClienteSeleccionado(cliente ? cliente.nombre : null);
          }}
          required
        >
          <option value="">Seleccionar cliente</option>
          {clientes.map((cliente) => (
            <option key={cliente.id} value={cliente.id}>
              {cliente.nombre}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Cantidad"
          value={cantidad}
          onChange={(e) => setCantidad(e.target.value)}
          required
        />
        <label
          style={{
            marginBottom: "2px",
            display: "block",
            fontSize: "0.98em",
            color: "#444",
          }}
        >
          Fecha
        </label>

        <div style={{ position: "relative", marginBottom: "12px" }}>
          {!fecha && (
            <span
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
                color: "#aaa",
                fontSize: "1em",
                pointerEvents: "none",
                zIndex: 1,
                width: "max-content",
                whiteSpace: "nowrap",
              }}
            >
              Seleccione fecha
            </span>
          )}
          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            required
            style={{
              width: "100%",
              border: "1px solid #ccc",
              borderRadius: "6px",
              padding: "8px",
              fontSize: "1em",
              background: "transparent",
              minHeight: "40px",
              boxSizing: "border-box",
            }}
          />
        </div>

        <textarea
          placeholder="Observaciones (opcional)"
          value={observaciones}
          onChange={(e) => setObservaciones(e.target.value)}
        />

        <button type="submit" disabled={loadingPago}>
          {loadingPago ? "Guardando..." : "Registrar Pago"}
        </button>
      </form>
      <div className="card" style={{ marginTop: "1rem" }}>
        <h3>Historial de Pagos</h3>
        {!clienteId ? (
          <p>Selecciona un cliente para ver sus pagos.</p>
        ) : (
          (() => {
            const cliente = clientes.find((c) => c.id === parseInt(clienteId));
            const pagosCliente = pagosConNombre.filter(
              (p) => p.clienteId === parseInt(clienteId)
            );

            if (!cliente || pagosCliente.length === 0) {
              return <p>No hay pagos registrados para este cliente.</p>;
            }

            return (
              <>
                <motion.ul
                  className="historial-pagos"
                  ref={pagosListRef}
                  initial={false}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.22 }}
                  style={{
                    maxHeight: "230px",
                    overflowY: "auto",
                    marginBottom: "12px",
                    paddingRight: "4px",
                    scrollbarWidth: "thin",
                    scrollbarColor: "#a5b4fc #f3f4f6",
                  }}
                >
                  {pagosCliente.map((pago) => (
                    <li
                      key={pago.id}
                      style={{
                        background:
                          pagoSeleccionado === pago.id
                            ? "#eef6fb"
                            : "transparent",
                        cursor: "pointer",
                        borderRadius: "6px",
                        padding: "4px 6px",
                        marginBottom: "6px",
                      }}
                      onClick={() =>
                        setPagoSeleccionado(
                          pagoSeleccionado === pago.id ? null : pago.id
                        )
                      }
                    >
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <div style={{ flex: 1 }}>
                          <input
                            type="number"
                            value={pago.cantidad}
                            disabled={pagoSeleccionado !== pago.id}
                            onChange={(e) =>
                              handleUpdate(pago.id, "cantidad", e.target.value)
                            }
                            style={{
                              width: "100%",
                              border: "1px solid #ccc",
                              borderRadius: "6px",
                              padding: "8px",
                              marginBottom: "6px",
                              fontSize: "1em",
                            }}
                          />

                          {/* Campo de fecha alineado con placeholder visual */}
                          <div
                            style={{
                              position: "relative",
                              marginBottom: "12px",
                            }}
                          >
                            {!pago.fecha && (
                              <span
                                style={{
                                  position: "absolute",
                                  left: "16px",
                                  top: "13px",
                                  color: "#aaa",
                                  fontSize: "1em",
                                  pointerEvents: "none",
                                  zIndex: 1,
                                }}
                              >
                                Seleccione fecha
                              </span>
                            )}
                            <input
                              type="date"
                              value={pago.fecha ? pago.fecha.slice(0, 10) : ""}
                              disabled={pagoSeleccionado !== pago.id}
                              onChange={(e) =>
                                handleUpdate(pago.id, "fecha", e.target.value)
                              }
                              style={{
                                width: "100%",
                                border: "1px solid #ccc",
                                borderRadius: "6px",
                                padding: "8px",
                                fontSize: "1em",
                                background: "transparent",
                                minHeight: "40px",
                                boxSizing: "border-box",
                              }}
                            />
                          </div>
                          <input
                            type="text"
                            placeholder="Observaciones"
                            disabled={pagoSeleccionado !== pago.id}
                            value={pago.observaciones || ""}
                            onChange={(e) =>
                              handleUpdate(
                                pago.id,
                                "observaciones",
                                e.target.value
                              )
                            }
                            style={{
                              width: "100%",
                              border: "1px solid #ccc",
                              borderRadius: "6px",
                              padding: "8px",
                              fontSize: "1em",
                              marginBottom: "6px",
                            }}
                          />
                          {usoPagosPorCliente[pago.clienteId]?.some(
                            (p: PagoUsado) => p.id === pago.id
                          ) && (
                            <div>
                              Usado:{" "}
                              {
                                usoPagosPorCliente[pago.clienteId].find(
                                  (p: PagoUsado) => p.id === pago.id
                                )?.usado
                              }
                              € de {pago.cantidad}€
                            </div>
                          )}
                        </div>
                        <AnimatePresence>
                          {pagoSeleccionado === pago.id && (
                            <motion.div
                              key="botones"
                              initial={{ opacity: 0, x: 15 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 15 }}
                              transition={{ duration: 0.18 }}
                              style={{ display: "flex", marginLeft: 8 }}
                            >
                              <button
                                className="boton-accion"
                                style={{ marginRight: 4 }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleUpdate(
                                    pago.id,
                                    "cantidad",
                                    pago.cantidad.toString()
                                  );
                                }}
                              >
                                Guardar
                              </button>
                              <button
                                className="boton-accion"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(pago.id);
                                }}
                              >
                                Eliminar
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </li>
                  ))}
                </motion.ul>
                {/* --- Detalle de uso de pagos para este cliente --- */}
                <div className="card" style={{ marginTop: 16 }}>
                  <h4>🧾 Detalle de uso de pagos</h4>
                  {asignaciones.length === 0 ? (
                    <p>No hay pagos asignados para este cliente.</p>
                  ) : (
                    <table style={{ width: "100%", fontSize: "0.97em" }}>
                      <thead>
                        <tr>
                          <th>Fecha pago</th>
                          <th>Tipo</th>
                          <th>Fecha tarea</th>
                          <th>Monto aplicado (€)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {asignaciones.map((a) => (
                          <tr key={a.id}>
                            <td>{a.fecha_pago?.slice(0, 10)}</td>
                            <td>
                              {a.tipo === "trabajo" ? "Trabajo" : "Material"}
                            </td>
                            <td>{a.fecha_tarea?.slice(0, 10)}</td>
                            <td>{a.usado.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </>
            );
          })()
        )}
      </div>
      {/* Cierra la tarjeta de historial de pagos */}
      {mostrarAsignador && pagoRecienCreado && (
        <AsignadorManual
          trabajos={pendientes.trabajos}
          materiales={pendientes.materiales}
          pago={pagoRecienCreado}
          onCerrar={() => setMostrarAsignador(false)}
          onConfirmarAsignaciones={async (asignaciones) => {
            if (!pagoRecienCreado) return;

            try {
              await guardarAsignaciones(pagoRecienCreado.id, asignaciones);
              toast.success("Asignaciones guardadas");

              // Refresca los datos después de asignar
              await cargarDatos();
              const cliente = clientes.find(
                (c) => c.id === pagoRecienCreado.clienteId
              );
              if (cliente) {
                setClienteSeleccionado(cliente.nombre);
              }
            } catch (error) {
              toast.error("Error al guardar asignaciones");
              console.error(error);
            } finally {
              setMostrarAsignador(false);
            }
          }}
        />
      )}
    </div>
  );
}

export default Pagos;
