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

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    const [clientesData, pagosData] = await Promise.all([
      getClientes(),
      getPagos(),
    ]);
    setClientes(clientesData);

    const pagosExtendidos = pagosData.map((pago) => {
      const cliente = clientesData.find((c) => c.id === pago.clienteId);
      return {
        ...pago,
        nombre: cliente?.nombre || "Desconocido",
      };
    });

    setPagosConNombre(pagosExtendidos);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clienteId || !cantidad || !fecha) return;

    try {
      await addPago({
        clienteId: parseInt(clienteId),
        cantidad: parseFloat(cantidad),
        fecha: new Date(fecha).toISOString(),
        observaciones: observaciones.trim() || undefined,
      });
      toast.success("Pago registrado correctamente");
      setClienteId("");
      setCantidad("");
      setFecha("");
      setObservaciones("");
      cargarDatos();
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
    } catch (error) {
      toast.error("Error al actualizar");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deletePago(id);
      toast.success("Pago eliminado");
      cargarDatos();
    } catch (error) {
      toast.error("Error al eliminar el pago");
    }
  };

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
        {pagosConNombre.length === 0 ? (
          <p>No hay pagos registrados.</p>
        ) : (
          <ul>
            {pagosConNombre.map((pago) => (
              <li key={pago.id} style={{ marginBottom: "12px" }}>
                <strong>{pago.nombre}</strong>
                <br />
                <input
                  type="number"
                  value={pago.cantidad}
                  onChange={(e) =>
                    handleUpdate(pago.id, "cantidad", e.target.value)
                  }
                />
                <input
                  type="date"
                  value={pago.fecha.slice(0, 10)}
                  onChange={(e) =>
                    handleUpdate(pago.id, "fecha", e.target.value)
                  }
                />
                <input
                  type="text"
                  placeholder="Observaciones"
                  value={pago.observaciones || ""}
                  onChange={(e) =>
                    handleUpdate(pago.id, "observaciones", e.target.value)
                  }
                />
                <button
                  onClick={() => handleDelete(pago.id)}
                  className="boton-accion"
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Pagos;
