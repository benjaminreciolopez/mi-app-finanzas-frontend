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

  useEffect(() => {
    getClientes().then(setClientes);
  }, []);

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
        <Calendar value={fecha} onChange={(val) => setFecha(val as Date)} />

        <label>Horas trabajadas:</label>
        <input
          type="number"
          placeholder="Ej: 4.5"
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
    </div>
  );
}

export default Calendario;
