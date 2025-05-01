import React, { useEffect, useState } from "react";
import {
  getClientes,
  addCliente,
  updateCliente,
  deleteCliente,
} from "../../api/clientesApi";

interface Cliente {
  id: number;
  nombre: string;
  precioHora: number;
}

function Clientes() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [nombre, setNombre] = useState("");
  const [precioHora, setPrecioHora] = useState("");
  const [modoEdicion, setModoEdicion] = useState(false);
  const [clienteSeleccionado, setClienteSeleccionado] =
    useState<Cliente | null>(null);

  useEffect(() => {
    cargarClientes();
  }, []);

  const cargarClientes = async () => {
    try {
      const data = await getClientes();
      setClientes(data || []); // ✅ Asegura que sea siempre un array
    } catch (error) {
      console.error("❌ Error al cargar clientes:", error);
      setClientes([]); // ✅ Para evitar el error de .map
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre || !precioHora) return;

    if (modoEdicion && clienteSeleccionado) {
      await updateCliente(clienteSeleccionado.id, {
        nombre,
        precioHora: parseFloat(precioHora),
      });
    } else {
      await addCliente({ nombre, precioHora: parseFloat(precioHora) });
    }

    resetFormulario();
    cargarClientes();
  };

  const handleSeleccionar = (cliente: Cliente) => {
    setClienteSeleccionado(cliente);
  };

  const handleEditar = () => {
    if (clienteSeleccionado) {
      setNombre(clienteSeleccionado.nombre);
      setPrecioHora(clienteSeleccionado.precioHora.toString());
      setModoEdicion(true);
    }
  };

  const handleEliminar = async () => {
    if (clienteSeleccionado) {
      await deleteCliente(clienteSeleccionado.id);
      resetFormulario();
      cargarClientes();
    }
  };

  const resetFormulario = () => {
    setNombre("");
    setPrecioHora("");
    setClienteSeleccionado(null);
    setModoEdicion(false);
  };

  return (
    <div className="container">
      <h2 className="title">{modoEdicion ? "Editar Cliente" : "Clientes"}</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <input
          type="number"
          placeholder="Precio por hora"
          value={precioHora}
          onChange={(e) => setPrecioHora(e.target.value)}
        />
        <button type="submit">
          {modoEdicion ? "Guardar Cambios" : "Añadir Cliente"}
        </button>
        {modoEdicion && (
          <button
            type="button"
            onClick={resetFormulario}
            style={{
              marginLeft: "10px",
              backgroundColor: "#e5e7eb",
              color: "#111827",
            }}
          >
            Cancelar
          </button>
        )}
      </form>

      <div className="card">
        {clientes.map((cliente) => (
          <div
            key={cliente.id}
            onClick={() => handleSeleccionar(cliente)}
            style={{
              padding: "12px",
              border:
                clienteSeleccionado?.id === cliente.id
                  ? "2px solid #4f46e5"
                  : "1px solid #d1d5db",
              borderRadius: "8px",
              marginBottom: "10px",
              cursor: "pointer",
              backgroundColor:
                clienteSeleccionado?.id === cliente.id ? "#eef2ff" : "#ffffff",
              transition: "background-color 0.2s",
            }}
          >
            <div>
              <strong>{cliente.nombre}</strong> - {cliente.precioHora} €/hora
            </div>
            {clienteSeleccionado?.id === cliente.id && (
              <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
                <button onClick={handleEditar}>✏️ Editar</button>
                <button
                  onClick={handleEliminar}
                  style={{ backgroundColor: "#dc2626" }}
                >
                  🗑️ Eliminar
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Clientes;
