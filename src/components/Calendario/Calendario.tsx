import { useState, useEffect } from "react";
import { addTrabajo } from "../../api/trabajosApi";
import { getClientes, Cliente } from "../../api/clientesApi";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { toast } from "react-toastify";

function Calendario() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [clienteId, setClienteId] = useState<number | "">("");
  const [fecha, setFecha] = useState<Date>(new Date());
  const [horas, setHoras] = useState("");
  const [mostrarBotonHoy, setMostrarBotonHoy] = useState(false);
  const [resumen, setResumen] = useState<string | null>(null);
  const [calendarKey, setCalendarKey] = useState(0);

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
    setCalendarKey((prev) => prev + 1);
    setMostrarBotonHoy(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsedHoras = parseFloat(horas);
    if (!clienteId || !fecha || isNaN(parsedHoras)) return;

    const nuevaFecha = [
      fecha.getFullYear(),
      String(fecha.getMonth() + 1).padStart(2, "0"),
      String(fecha.getDate()).padStart(2, "0"),
    ].join("-");

    // Obtén el nombre solo cuando lo necesites (opcional, puedes quitar si el backend ya no lo pide)
    const cliente = clientes.find((c) => c.id === Number(clienteId));
    const clienteNombre = cliente ? cliente.nombre : "";

    await addTrabajo({
      clienteId: Number(clienteId),
      nombre: clienteNombre, // elimina esta línea si el backend ya no lo requiere
      fecha: nuevaFecha,
      horas: parsedHoras,
      pagado: 0,
    });

    // Forzar recarga del componente Control
    localStorage.setItem("forzarRecargaControl", "true");
    
    toast.success("✅ Trabajo añadido correctamente");
    setResumen(
      `Trabajo añadido: ${parsedHoras}h para ${clienteNombre} en ${nuevaFecha}`
    );

    setTimeout(() => {
      setResumen(null);
    }, 3000);
    setHoras("");
  };

  return (
    <div className="container">
      <h2 className="title">Añadir Trabajo</h2>
      <form onSubmit={handleSubmit} className="card form-scroll">
        <label>Cliente:</label>
        <select
          value={clienteId}
          onChange={(e) => setClienteId(Number(e.target.value))}
          required
        >
          <option value="">Seleccionar cliente</option>
          {clientes.map((c) => (
            <option key={c.id} value={c.id}>
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
