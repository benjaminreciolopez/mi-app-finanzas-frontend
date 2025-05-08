import { useState, useEffect } from "react";
import { addTrabajo } from "../../api/trabajosApi";
import { getClientes, Cliente } from "../../api/clientesApi";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { toast } from "react-toastify";

function Calendario() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [nombre, setNombre] = useState("");
  const [fecha, setFecha] = useState<Date>(new Date());
  const [horas, setHoras] = useState("");
  const [mostrarBotonHoy, setMostrarBotonHoy] = useState(false);
  const [resumen, setResumen] = useState<string | null>(null);
  const [calendarKey, setCalendarKey] = useState(0); // 👈 esto fuerza el re-render

  useEffect(() => {
    getClientes().then(setClientes);
  }, []);

  useEffect(() => {
    const hoy = new Date();
    setMostrarBotonHoy(
      fecha.getFullYear() !== hoy.getFullYear() ||
        fecha.getMonth() !== hoy.getMonth() ||
        fecha.getDate() !== hoy.getDate()
    );
  }, [fecha]);

  const handleChangeFecha = (value: Date) => {
    setFecha(value);
  };

  const volverAHoy = () => {
    const hoy = new Date();
    setFecha(hoy);
    setCalendarKey((prev) => prev + 1); // 👈 reinicia el Calendar para mostrar el mes actual
    setMostrarBotonHoy(false);
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

    await addTrabajo({
      nombre,
      fecha: nuevaFecha,
      horas: parsedHoras,
      pagado: 0,
    });

    toast.success("✅ Trabajo añadido correctamente");
    setResumen(
      `Trabajo añadido: ${parsedHoras}h para ${nombre} en ${nuevaFecha}`
    );

    setTimeout(() => {
      setResumen(null);
    }, 3000); // 👈 3 segundos de visibilidad
    setNombre("");
    setHoras("");
  };

  return (
    <div className="container">
      <h2 className="title">Añadir Trabajo</h2>
      <form onSubmit={handleSubmit} className="card">
        <label>Cliente:</label>
        <select
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        >
          <option value="">Seleccionar cliente</option>
          {clientes.map((c) => (
            <option key={c.id} value={c.nombre}>
              {c.nombre}
            </option>
          ))}
        </select>

        <label>Fecha:</label>
        {mostrarBotonHoy && (
          <div className="flex justify-end mb-2">
            <button type="button" className="boton-accion" onClick={volverAHoy}>
              📅 Hoy
            </button>
          </div>
        )}
        <Calendar
          key={calendarKey}
          value={fecha}
          onChange={(value) => handleChangeFecha(value as Date)}
        />

        <label>Horas trabajadas:</label>
        <input
          type="number"
          placeholder="Horas"
          value={horas}
          onChange={(e) => setHoras(e.target.value)}
          required
        />

        <button
          type="submit"
          className="boton-accion"
          style={{ marginTop: "10px" }}
        >
          ➕ Añadir Trabajo
        </button>
      </form>
      {resumen && (
        <div
          style={{
            marginTop: "1rem",
            backgroundColor: "#ecfdf5",
            border: "1px solid #10b981",
            padding: "12px",
            borderRadius: "8px",
            color: "#065f46",
            fontWeight: "500",
            textAlign: "center",
          }}
        >
          ✅ {resumen}
        </div>
      )}
    </div>
  );
}

export default Calendario;
