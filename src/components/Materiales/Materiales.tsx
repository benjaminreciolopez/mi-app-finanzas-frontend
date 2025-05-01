import { useEffect, useState } from "react";
import {
  getMateriales,
  addMaterial,
  updateMaterial,
  Material,
} from "../../api/materialesApi";
import { getClientes, Cliente } from "../../api/clientesApi";

function Materiales() {
  const [materiales, setMateriales] = useState<Material[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [descripcion, setDescripcion] = useState("");
  const [coste, setCoste] = useState("");
  const [nombre, setNombre] = useState("");
  const [fecha, setFecha] = useState("");

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
    if (!descripcion || isNaN(parsedCoste) || !fecha) return;

    const nuevoId = await addMaterial({
      descripcion,
      coste: parsedCoste,
      nombre,
      fecha,
      pagado: 0,
    });

    setMateriales([
      ...materiales,
      {
        id: nuevoId,
        descripcion,
        coste: parsedCoste,
        nombre,
        fecha,
        pagado: 0,
      },
    ]);

    setDescripcion("");
    setCoste("");
    setNombre("");
    setFecha("");
  };

  const marcarComoPagado = async (id: number) => {
    await updateMaterial(id, { pagado: 1 });
    setMateriales((prev) =>
      prev.map((m) => (m.id === id ? { ...m, pagado: 1 } : m))
    );
  };

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
        <select value={nombre} onChange={(e) => setNombre(e.target.value)}>
          <option value="">Asignar a cliente (opcional)</option>
          {clientes.map((c) => (
            <option key={c.id} value={c.nombre}>
              {c.nombre}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
        />
        <button type="submit">Añadir Material</button>
      </form>

      <div className="card">
        {materiales.map((material) => (
          <div key={material.id}>
            {material.fecha} - {material.descripcion} ({material.coste}€)
            {material.nombre && (
              <>
                {" "}
                - Cliente: <strong>{material.nombre}</strong>
              </>
            )}
            {" - "}
            {material.pagado ? "Pagado" : "Pendiente"}
            {!material.pagado && (
              <button
                onClick={() => marcarComoPagado(material.id)}
                style={{ marginLeft: "10px" }}
              >
                Marcar como pagado
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Materiales;
