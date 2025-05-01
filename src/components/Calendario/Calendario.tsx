import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import {
  getTrabajos,
  addTrabajo,
  updateTrabajo,
  Trabajo,
} from "../../api/trabajosApi";
import { getClientes, Cliente } from "../../api/clientesApi";

function Calendario() {
  const [trabajos, setTrabajos] = useState<Trabajo[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [nombre, setNombre] = useState("");
  const [fecha, setFecha] = useState<Date>(new Date());
  const [horas, setHoras] = useState("");

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    const [clientesData, trabajosData] = await Promise.all([
      getClientes(),
      getTrabajos(),
    ]);
    setClientes(clientesData);
    setTrabajos(trabajosData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsedHoras = parseFloat(horas);
    if (!nombre || !fecha || isNaN(parsedHoras)) return;

    const nuevaFecha = fecha.toISOString().split("T")[0];

    const nuevoId = await addTrabajo({
      nombre,
      fecha: nuevaFecha,
      horas: parsedHoras,
      pagado: 0,
    });

    const nuevoTrabajo = {
      id: nuevoId,
      nombre,
      fecha: nuevaFecha,
      horas: parsedHoras,
      pagado: 0,
    };

    setTrabajos((prev) => [...prev, nuevoTrabajo]);
    setNombre("");
    setHoras("");
  };

  const marcarComoPagado = async (id: number) => {
    await updateTrabajo(id, { pagado: 1 });
    setTrabajos((prev) =>
      prev.map((trabajo) =>
        trabajo.id === id ? { ...trabajo, pagado: 1 } : trabajo
      )
    );
  };

  const trabajosPendientes = trabajos.filter((t) => t.pagado === 0);

  const trabajosPorFecha = trabajosPendientes.reduce((acc, trabajo) => {
    if (!acc[trabajo.fecha]) acc[trabajo.fecha] = [];
    acc[trabajo.fecha].push(trabajo);
    return acc;
  }, {} as Record<string, Trabajo[]>);

  const resaltarDias = ({ date }: { date: Date }) => {
    const fechaStr = date.toISOString().split("T")[0];
    if (trabajosPorFecha[fechaStr]) {
      return "highlight"; // Esta clase la defines tú en tu CSS
    }
    return null;
  };

  return (
    <div className="container">
      <h2 className="title">Calendario de Trabajos</h2>

      <form onSubmit={handleSubmit}>
        <select value={nombre} onChange={(e) => setNombre(e.target.value)}>
          <option value="">Seleccionar cliente</option>
          {clientes.map((c) => (
            <option key={c.id} value={c.nombre}>
              {c.nombre}
            </option>
          ))}
        </select>

        <Calendar
          value={fecha}
          onChange={(val) => setFecha(val as Date)}
          tileClassName={resaltarDias}
        />

        <input
          type="number"
          placeholder="Horas trabajadas"
          value={horas}
          onChange={(e) => setHoras(e.target.value)}
        />
        <button type="submit">Añadir Trabajo</button>
      </form>

      <div className="card">
        {trabajosPendientes.length === 0 && (
          <p>No hay trabajos pendientes actualmente.</p>
        )}
        {Object.entries(trabajosPorFecha)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([fecha, trabajos]) => (
            <div key={fecha} style={{ marginBottom: "1rem" }}>
              <strong>📅 {fecha}</strong>
              <ul style={{ paddingLeft: "1rem", marginTop: "0.5rem" }}>
                {trabajos.map((trabajo) => (
                  <li key={trabajo.id}>
                    Cliente: <strong>{trabajo.nombre}</strong> - {trabajo.horas}
                    h - Pendiente
                    <button
                      onClick={() => marcarComoPagado(trabajo.id)}
                      style={{ marginLeft: "10px" }}
                    >
                      Marcar como pagado
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
      </div>
    </div>
  );
}

export default Calendario;
