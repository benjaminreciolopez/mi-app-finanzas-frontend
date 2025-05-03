import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import {
  getTrabajos,
  addTrabajo,
  updateTrabajo,
  deleteTrabajo,
  Trabajo,
} from "../../api/trabajosApi";
import { getClientes, Cliente } from "../../api/clientesApi";
import { getPagos } from "../../api/pagosApi";
import { calcularDeudas } from "../../utils/calcularDeuda";

function Calendario() {
  const [trabajos, setTrabajos] = useState<Trabajo[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [nombre, setNombre] = useState("");
  const [fecha, setFecha] = useState<Date>(new Date());
  const [horas, setHoras] = useState("");
  const [trabajoEditando, setTrabajoEditando] = useState<number | null>(null);
  const [clientesSinDeuda, setClientesSinDeuda] = useState<string[]>([]);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    const [clientesData, trabajosData, pagosData] = await Promise.all([
      getClientes(),
      getTrabajos(),
      getPagos(),
    ]);

    setClientes(clientesData);
    setTrabajos(trabajosData);

    const deudas = calcularDeudas(clientesData, trabajosData, [], pagosData);
    const sinDeuda = deudas
      .filter((d) => d.totalDeuda <= 0)
      .map((d) => d.nombre);
    setClientesSinDeuda(sinDeuda);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsedHoras = parseFloat(horas);
    if (!nombre || !fecha || isNaN(parsedHoras)) return;

    const nuevaFecha = [
      fecha.getFullYear(),
      String(fecha.getMonth() + 1).padStart(2, "0"),
      String(fecha.getDate()).padStart(2, "0"),
    ].join("-");

    if (trabajoEditando !== null) {
      await updateTrabajo(trabajoEditando, {
        nombre,
        fecha: nuevaFecha,
        horas: parsedHoras,
      });
      setTrabajoEditando(null);
    } else {
      await addTrabajo({
        nombre,
        fecha: nuevaFecha,
        horas: parsedHoras,
        pagado: 0,
      });
    }

    await cargarDatos(); // 👈 recarga todo tras insertar o editar
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

  const eliminarTrabajo = async (id: number) => {
    const confirmacion = window.confirm("¿Eliminar este trabajo?");
    if (!confirmacion) return;
    await deleteTrabajo(id);
    setTrabajos((prev) => prev.filter((t) => t.id !== id));
  };

  const editarTrabajo = (trabajo: Trabajo) => {
    setNombre(trabajo.nombre);
    setHoras(trabajo.horas.toString());
    setFecha(new Date(trabajo.fecha));
    setTrabajoEditando(trabajo.id);
  };

  const trabajosPendientes = trabajos.filter(
    (t) => t.pagado === 0 && !clientesSinDeuda.includes(t.nombre)
  );

  const trabajosPorFecha = trabajosPendientes.reduce((acc, trabajo) => {
    if (!acc[trabajo.fecha]) acc[trabajo.fecha] = [];
    acc[trabajo.fecha].push(trabajo);
    return acc;
  }, {} as Record<string, Trabajo[]>);

  const resaltarDias = ({ date }: { date: Date }) => {
    const fechaStr = date.toISOString().split("T")[0];
    return trabajosPorFecha[fechaStr] ? "highlight" : null;
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
        <button type="submit" className="boton-accion">
          {trabajoEditando !== null ? "Actualizar Trabajo" : "Añadir Trabajo"}
        </button>
      </form>

      <div className="card">
        {trabajosPendientes.length === 0 ? (
          <p>No hay trabajos pendientes actualmente.</p>
        ) : (
          Object.entries(trabajosPorFecha)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([fecha, trabajos]) => (
              <div key={fecha} style={{ marginBottom: "1rem" }}>
                <strong>📅 {fecha}</strong>
                <ul style={{ paddingLeft: "1rem", marginTop: "0.5rem" }}>
                  {trabajos.map((trabajo) => (
                    <li key={trabajo.id} style={{ marginBottom: "12px" }}>
                      Cliente: <strong>{trabajo.nombre}</strong> -{" "}
                      {trabajo.horas}h
                      <div
                        style={{
                          marginTop: "6px",
                          display: "flex",
                          gap: "8px",
                          flexWrap: "wrap",
                        }}
                      >
                        <button
                          className="boton-accion"
                          onClick={() => editarTrabajo(trabajo)}
                        >
                          ✏️ Editar
                        </button>
                        <button
                          className="boton-accion"
                          onClick={() => eliminarTrabajo(trabajo.id)}
                        >
                          🗑️ Eliminar
                        </button>
                        <button
                          className="boton-accion"
                          onClick={() => marcarComoPagado(trabajo.id)}
                        >
                          ✅ Marcar como pagado
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))
        )}
      </div>
    </div>
  );
}

export default Calendario;
