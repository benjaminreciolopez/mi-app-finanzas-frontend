import { useEffect, useState } from "react";
import {
  getMateriales,
  addMaterial,
  updateMaterial,
  Material,
} from "../../api/materialesApi";
import { getClientes, Cliente } from "../../api/clientesApi";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

function Materiales() {
  const [materiales, setMateriales] = useState<Material[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [descripcion, setDescripcion] = useState("");
  const [coste, setCoste] = useState("");
  const [fecha, setFecha] = useState("");
  const [clienteSeleccionado, setClienteSeleccionado] =
    useState<Cliente | null>(null);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    const [clientesData, materialesData] = await Promise.all([
      getClientes(),
      getMateriales(),
    ]);
    setClientes(clientesData);
    setMateriales(materialesData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsedCoste = parseFloat(coste);
    if (!descripcion || isNaN(parsedCoste) || !fecha || !clienteSeleccionado)
      return;

    const nuevoId = await addMaterial({
      descripcion,
      coste: parsedCoste,
      nombre: clienteSeleccionado.nombre, // Solo para mostrar
      fecha,
      pagado: 0,
      clienteId: clienteSeleccionado.id,
      cuadrado: 0, // Añadido por compatibilidad
    });

    setMateriales((prev) => [
      ...prev,
      {
        id: nuevoId,
        descripcion,
        coste: parsedCoste,
        nombre: clienteSeleccionado.nombre,
        fecha,
        pagado: 0,
        clienteId: clienteSeleccionado.id,
        cuadrado: 0, // Añadido por compatibilidad
      },
    ]);

    setDescripcion("");
    setCoste("");
    setFecha("");
    setClienteSeleccionado(null);
    toast.success("Material añadido");
  };

  const marcarComoPagado = async (id: number) => {
    await updateMaterial(id, { pagado: 1 });
    setMateriales((prev) => prev.filter((m) => m.id !== id));
    toast.success("Material marcado como pagado");
  };

  const materialesPendientes = materiales.filter((m) => m.pagado === 0);

  const mostrarBotonAñadir = !!(
    descripcion.trim() ||
    coste.trim() ||
    fecha.trim()
  );

  return (
    <div className="container">
      <h2 className="title">Registro de Materiales</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />
        <input
          type="number"
          placeholder="Coste (€)"
          value={coste}
          onChange={(e) => setCoste(e.target.value)}
        />
        <select
          value={clienteSeleccionado ? clienteSeleccionado.id : ""}
          onChange={(e) => {
            const cli = clientes.find((c) => c.id === Number(e.target.value));
            setClienteSeleccionado(cli || null);
          }}
          required
        >
          <option value="">Asignar a cliente</option>
          {clientes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nombre}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
        />
        {mostrarBotonAñadir && <button type="submit">Añadir Material</button>}
      </form>

      <div className="card">
        <AnimatePresence>
          {materialesPendientes.length === 0 && (
            <p>No hay materiales pendientes.</p>
          )}
          {materialesPendientes.map((material) => (
            <motion.div
              key={material.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              style={{ marginBottom: "12px" }}
            >
              {material.fecha} - {material.descripcion} ({material.coste}€)
              {material.nombre && (
                <>
                  {" "}
                  - Cliente: <strong>{material.nombre}</strong>
                </>
              )}
              <button
                className="boton-accion"
                onClick={() => marcarComoPagado(material.id)}
                style={{
                  marginLeft: "10px",
                }}
              >
                Marcar como pagado
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default Materiales;
