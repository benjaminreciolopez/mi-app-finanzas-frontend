import { useEffect, useState } from "react";
import { getPagos, addPago, Pago } from "../../api/pagosApi";
import { getClientes, Cliente } from "../../api/clientesApi";
import { toast } from "react-toastify";

function Pagos() {
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [nombre, setNombre] = useState("");
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
    setPagos(pagosData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre || !cantidad || !fecha) return;
    try {
      await addPago({
        nombre,
        cantidad: parseFloat(cantidad),
        fecha,
        observaciones: observaciones.trim() || undefined,
      });
      toast.success("Pago registrado correctamente");
      setNombre("");
      setCantidad("");
      setFecha("");
      setObservaciones("");
      cargarDatos();
    } catch (error) {
      toast.error("Error al registrar el pago");
      console.error(error);
    }
  };

  return (
    <div className="container">
      <h2 className="title">Registro de Pagos</h2>

      <form onSubmit={handleSubmit} className="card">
        <select
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        >
          <option value="">Seleccionar cliente</option>
          {clientes.map((cliente) => (
            <option key={cliente.id} value={cliente.nombre}>
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
        {pagos.length === 0 ? (
          <p>No hay pagos registrados.</p>
        ) : (
          <ul>
            {pagos.map((pago) => (
              <li key={pago.id}>
                <strong>{pago.nombre}</strong>: {pago.cantidad.toFixed(2)} € el{" "}
                {pago.fecha}
                {pago.observaciones && ` — ${pago.observaciones}`}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Pagos;
