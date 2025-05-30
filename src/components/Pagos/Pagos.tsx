import { useEffect, useState } from "react";
import {
  getPagos,
  addPago,
  deletePago,
  updatePago,
  Pago,
} from "../../api/pagosApi";
import { getClientes, Cliente } from "../../api/clientesApi";
import { toast } from "react-toastify";
import { getTrabajos, updateTrabajo } from "../../api/trabajosApi";
import { AnimatePresence, motion } from "framer-motion";
import { getDeudaReal } from "../../api/deudaApi";

interface PagoConNombre extends Pago {
  nombre: string;
}

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
  const [pagoSeleccionado, setPagoSeleccionado] = useState<number | null>(null);

  useEffect(() => {
    cargarDatos();
  }, []);

  // Marca como pagados tantos trabajos como cubra el pago (FIFO)
  const marcarTrabajosComoPagados = async (
    clienteIdStr: string,
    pago: number
  ) => {
    const clienteId = parseInt(clienteIdStr);
    const trabajosCliente = await getTrabajos();

    // Filtra trabajos pendientes del cliente (FIFO)
    const pendientes = trabajosCliente
      .filter(
        (t) => Number(t.clienteId) === clienteId && Number(t.pagado) === 0
      )
      .sort(
        (a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
      );

    const cliente = clientes.find((c) => Number(c.id) === clienteId);
    if (!cliente) return;

    let restante = pago;

    for (const trabajo of pendientes) {
      const costeTrabajo = Number(trabajo.horas) * Number(cliente.precioHora);
      if (restante >= costeTrabajo) {
        await updateTrabajo(trabajo.id, { pagado: 1 });
        restante -= costeTrabajo;
      } else {
        break;
      }
    }
  };

  const cargarDatos = async () => {
    const [clientesData, pagosData] = await Promise.all([
      getClientes(),
      getPagos(),
    ]);

    setClientes(clientesData);

    const resumenDeudas = await getDeudaReal();
    const clientesConDeuda = new Set(
      resumenDeudas.filter((d) => d.totalDeuda > 0).map((d) => d.clienteId)
    );

    const pagosFiltrados = pagosData
      .filter((p) => clientesConDeuda.has(p.clienteId))
      .map((pago) => {
        const cliente = clientesData.find((c) => c.id === pago.clienteId);
        return {
          ...pago,
          nombre: cliente?.nombre || "Desconocido",
        };
      });

    setPagosConNombre(pagosFiltrados);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clienteId || !cantidad || !fecha) return;

    try {
      const id = await addPago({
        clienteId: parseInt(clienteId),
        cantidad: parseFloat(cantidad),
        fecha: new Date(fecha).toISOString(),
        observaciones: observaciones.trim() || undefined,
      });

      const cliente = clientes.find((c) => c.id === parseInt(clienteId));
      const nombreCliente = cliente?.nombre || "Desconocido";

      const nuevoPago: PagoConNombre = {
        id,
        clienteId: parseInt(clienteId),
        cantidad: parseFloat(cantidad),
        fecha: new Date(fecha).toISOString(),
        observaciones: observaciones.trim() || undefined,
        nombre: nombreCliente,
      };

      setPagosConNombre((prev) => [nuevoPago, ...prev]);

      toast.success("Pago registrado correctamente");
      setClienteId("");
      setCantidad("");
      setFecha("");
      setObservaciones("");
      await marcarTrabajosComoPagados(clienteId, parseFloat(cantidad));
      await cargarDatos();
    } catch (error) {
      toast.error("Error al registrar el pago");
      console.error(error);
    }
  };

  const handleUpdate = async (id: number, campo: string, valor: string) => {
    const pago = pagosConNombre.find((p) => p.id === id);
    if (!pago) return;
    const actualizado = { ...pago, [campo]: valor };

    try {
      await updatePago(id, {
        cantidad: parseFloat(actualizado.cantidad.toString()),
        fecha: new Date(actualizado.fecha).toISOString(),
        observaciones: actualizado.observaciones,
      });
      toast.success("Pago actualizado");
      cargarDatos();
      setPagoSeleccionado(null);
    } catch (error) {
      toast.error("Error al actualizar");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deletePago(id);
      toast.success("Pago eliminado");
      cargarDatos();
      setPagoSeleccionado(null);
    } catch (error) {
      toast.error("Error al eliminar el pago");
    }
  };

  // Agrupa pagos por cliente
  const pagosPorCliente: { [cliente: string]: PagoConNombre[] } = {};
  pagosConNombre.forEach((pago) => {
    if (!pagosPorCliente[pago.nombre]) pagosPorCliente[pago.nombre] = [];
    pagosPorCliente[pago.nombre].push(pago);
  });

  return (
    <div className="container">
      <h2 className="title">Registro de Pagos</h2>

      <form onSubmit={handleSubmit} className="card">
        <select
          value={clienteId}
          onChange={(e) => setClienteId(e.target.value)}
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

        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          required
        />

        <textarea
          placeholder="Observaciones (opcional)"
          value={observaciones}
          onChange={(e) => setObservaciones(e.target.value)}
        />

        <button type="submit">Registrar Pago</button>
      </form>

      <div className="card" style={{ marginTop: "1rem" }}>
        <h3>Historial de Pagos</h3>
        {Object.keys(pagosPorCliente).length === 0 ? (
          <p>No hay pagos registrados.</p>
        ) : (
          Object.entries(pagosPorCliente).map(([nombre, pagos]) => (
            <div key={nombre}>
              <p
                style={{
                  fontWeight: "bold",
                  color: clienteSeleccionado === nombre ? "#1e3a8a" : "#4f46e5",
                  cursor: "pointer",
                  background:
                    clienteSeleccionado === nombre ? "#e0e7ff" : "transparent",
                  borderRadius: "6px",
                  padding: "6px 10px",
                  marginBottom: 6,
                  userSelect: "none",
                }}
                onClick={() =>
                  setClienteSeleccionado(
                    clienteSeleccionado === nombre ? null : nombre
                  )
                }
              >
                {clienteSeleccionado === nombre ? "▼" : "▶"} {nombre}
              </p>
              <AnimatePresence>
                {clienteSeleccionado === nombre && (
                  <motion.ul
                    initial={{ opacity: 0, y: -15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.22 }}
                  >
                    {pagos.map((pago) => (
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
                                handleUpdate(
                                  pago.id,
                                  "cantidad",
                                  e.target.value
                                )
                              }
                            />
                            <input
                              type="date"
                              value={pago.fecha.slice(0, 10)}
                              disabled={pagoSeleccionado !== pago.id}
                              onChange={(e) =>
                                handleUpdate(pago.id, "fecha", e.target.value)
                              }
                            />
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
                            />
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
                )}
              </AnimatePresence>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Pagos;
