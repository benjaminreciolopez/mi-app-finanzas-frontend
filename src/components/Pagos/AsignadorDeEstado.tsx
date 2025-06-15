// src/components/Pagos/AsignadorDeEstado.tsx

import { useState, useMemo } from "react";
import { Trabajo, updateTrabajo } from "../../api/trabajosApi";
import { Material, updateMaterial } from "../../api/materialesApi";
import { toast } from "react-toastify";

interface Props {
  pago: {
    cantidad: number;
  };
  trabajos: (Trabajo & { precioHora: number })[];
  materiales: Material[];
  onGuardar: () => void;
  onCancelar: () => void; // ✅ Añadido
}

function AsignadorDeEstado({
  pago,
  trabajos,
  materiales,
  onGuardar,
  onCancelar,
}: Props) {
  const [seleccionados, setSeleccionados] = useState<
    { id: number; tipo: "trabajo" | "material"; coste: number }[]
  >([]);
  const [guardando, setGuardando] = useState(false);

  const totalSeleccionado = useMemo(
    () => seleccionados.reduce((acc, s) => acc + s.coste, 0),
    [seleccionados]
  );

  const saldoRestante = pago.cantidad - totalSeleccionado;

  const toggleSeleccion = (
    id: number,
    tipo: "trabajo" | "material",
    coste: number
  ) => {
    const existe = seleccionados.find((s) => s.id === id && s.tipo === tipo);
    if (existe) {
      setSeleccionados(
        seleccionados.filter((s) => s.id !== id || s.tipo !== tipo)
      );
    } else if (saldoRestante >= coste - 0.01) {
      setSeleccionados([...seleccionados, { id, tipo, coste }]);
    }
  };

  const handleGuardar = async () => {
    setGuardando(true);
    try {
      for (const s of seleccionados) {
        if (s.tipo === "trabajo") {
          await updateTrabajo(s.id, { pagado: 1, cuadrado: 1 });
        } else {
          await updateMaterial(s.id, { pagado: 1, cuadrado: 1 });
        }
      }
      toast.success("Tareas actualizadas correctamente");
      onGuardar(); // ✅ Llamada al evento de éxito
    } catch (error) {
      toast.error("Error al guardar cambios");
      console.error(error);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h3>Marcar tareas como saldadas</h3>
        <p>
          Saldo disponible: {pago.cantidad.toFixed(2)}€ <br />
          <strong>Saldo restante:</strong> {saldoRestante.toFixed(2)}€
        </p>

        <div style={{ maxHeight: "320px", overflowY: "auto" }}>
          <h4 style={{ marginTop: "1rem" }}>Trabajos</h4>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {trabajos.map((t) => {
              const coste = t.horas * t.precioHora;
              const seleccionado = seleccionados.some(
                (s) => s.id === t.id && s.tipo === "trabajo"
              );
              return (
                <li key={t.id} style={{ marginBottom: "6px" }}>
                  <label>
                    <input
                      type="checkbox"
                      checked={seleccionado}
                      onChange={() => toggleSeleccion(t.id, "trabajo", coste)}
                    />{" "}
                    {t.fecha} - {t.horas}h x {t.precioHora}€/h ={" "}
                    {coste.toFixed(2)}€
                  </label>
                </li>
              );
            })}
          </ul>

          <h4 style={{ marginTop: "1rem" }}>Materiales</h4>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {materiales.map((m) => {
              const seleccionado = seleccionados.some(
                (s) => s.id === m.id && s.tipo === "material"
              );
              return (
                <li key={m.id} style={{ marginBottom: "6px" }}>
                  <label>
                    <input
                      type="checkbox"
                      checked={seleccionado}
                      onChange={() =>
                        toggleSeleccion(m.id, "material", m.coste)
                      }
                    />{" "}
                    {m.fecha} - {m.descripcion || "Material"}:{" "}
                    {m.coste.toFixed(2)}€
                  </label>
                </li>
              );
            })}
          </ul>
        </div>

        <div style={{ marginTop: "1.5rem", display: "flex", gap: "8px" }}>
          <button onClick={handleGuardar} disabled={guardando}>
            {guardando ? "Guardando..." : "Guardar cambios"}
          </button>
          <button onClick={onCancelar} disabled={guardando}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

export default AsignadorDeEstado;
