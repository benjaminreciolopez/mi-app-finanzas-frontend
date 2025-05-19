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
import { getMateriales } from "../../api/materialesApi";
import { calcularDeudas } from "../../utils/calcularDeuda";
console.log("Pagos.tsx se está ejecutando");

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

  const marcarTrabajosComoPagados = async (
    clienteIdStr: string,
    pago: number
  ) => {
    const clienteId = parseInt(clienteIdStr);
    const trabajosCliente = await getTrabajos();

    // Depuración: muestra todos los trabajos y sus clienteId
    console.log("clienteId recibido:", clienteId, typeof clienteId);
    console.log(
      "Trabajos recuperados:",
      trabajosCliente.map((t) => ({
        id: t.id,
        clienteId: t.clienteId,
        pagado: t.pagado,
        fecha: t.fecha,
        horas: t.horas,
      }))
    );

    // Filtro robusto por id y pagado
    const pendientes = trabajosCliente
      .filter(
        (t) =>
          Number(t.clienteId) === Number(clienteId) && Number(t.pagado) === 0
      )
      .sort(
        (a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
      );

    // Depuración: ¿qué trabajos se van a revisar?
    console.log("Trabajos pendientes de pago encontrados:", pendientes);

    // Obtén el precio/hora del cliente (usando id para mayor seguridad)
    const cliente = clientes.find((c) => Number(c.id) === Number(clienteId));
    if (!cliente) {
      console.log("No se encontró el cliente para el id:", clienteId);
      return;
    }
    console.log("Cliente encontrado:", cliente);

    let restante = pago;

    for (const trabajo of pendientes) {
      const costeTrabajo = Number(trabajo.horas) * Number(cliente.precioHora);
      console.log(
        `Revisando trabajo ${trabajo.id} (${trabajo.fecha}) | Horas: ${trabajo.horas} | Coste: ${costeTrabajo} | Restante: ${restante}`
      );
      if (restante >= costeTrabajo) {
        await updateTrabajo(trabajo.id, { pagado: 1 });
        restante -= costeTrabajo;
        console.log(
          `✅ Marcado como pagado trabajo ${trabajo.id}. Nuevo restante: ${restante}`
        );
      } else {
        console.log(
          `⛔ No hay suficiente pago para marcar trabajo ${trabajo.id} como pagado.`
        );
        break;
      }
    }
    console.log("Finalizó proceso de marcado de trabajos. Restante:", restante);
  };
  const cargarDatos = async () => {
    const [clientesData, pagosData, trabajosData, materialesData] =
      await Promise.all([
        getClientes(),
        getPagos(),
        getTrabajos(),
        getMateriales(),
      ]);

    setClientes(clientesData);

    const deudas = calcularDeudas(
      clientesData,
      trabajosData,
      materialesData,
      pagosData
    );

    const clientesConDeuda = new Set(
      deudas.filter((d) => d.totalDeuda > 0).map((d) => d.clienteId)
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
      console.log(
        "Voy a marcar trabajos como pagados para",
        clienteId,
        cantidad
      );
      await marcarTrabajosComoPagados(clienteId, parseFloat(cantidad));
      console.log("He llamado a marcarTrabajosComoPagados");
      await cargarDatos(); // 👈 este es el cambio importante
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
  console.log("Componente Pagos montado");

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
