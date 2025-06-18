import { useState, useMemo } from "react";
import { updateTrabajo } from "../../api/trabajosApi";
import { updateMaterial } from "../../api/materialesApi";
import { toast } from "react-toastify";

// ✅ TIPOS MÍNIMOS QUE USA EL MODAL (coinciden con lo que devuelve getPendientes)
type TrabajoPendiente = {
  id: number;
  fecha: string;
  horas: number;
  precioHora: number;
  coste: number;
};
type MaterialPendiente = {
  id: number;
  fecha: string;
  descripcion?: string;
  coste: number;
};

interface Props {
  pago: { cantidad: number } | null;
  trabajos: TrabajoPendiente[];
  materiales: MaterialPendiente[];
  saldoACuenta: number;
  clienteId: number;
  onGuardar: () => void;
  onCancelar: () => void;
}

function AsignadorDeEstado({
  trabajos,
  materiales,
  saldoACuenta,
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

  // ✅ Solo usa el saldoACuenta como saldo total disponible
  const saldoTotal = +saldoACuenta.toFixed(2);
  const saldoRestante = Math.max(
    +(saldoTotal - totalSeleccionado).toFixed(2),
    0
  );

  const toggleSeleccion = (
    id: number,
    tipo: "trabajo" | "material",
    coste: number
  ) => {
    const index = seleccionados.findIndex(
      (s) => s.id === id && s.tipo === tipo
    );
    if (index !== -1) {
      setSeleccionados((prev) => prev.filter((_, i) => i !== index));
    } else if (saldoRestante >= coste - 0.01) {
      setSeleccionados((prev) => [...prev, { id, tipo, coste }]);
    } else {
      toast.warning("Saldo insuficiente para seleccionar esta tarea");
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
        // Aquí cada API ya llama a actualizarSaldoCliente por detrás
      }

      toast.success("Tareas marcadas como saldadas");
      onGuardar(); // Esto debe recargar los datos del cliente en el frontend
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
          <strong>Saldo total disponible:</strong>{" "}
          <span style={{ fontWeight: 600 }}>{saldoTotal.toFixed(2)}€</span>
          <br />
          <strong>Saldo restante:</strong>{" "}
          <span
            style={{
              color: saldoRestante < 0 ? "crimson" : "#2d2",
              fontWeight: 600,
            }}
          >
            {saldoRestante.toFixed(2)}€
          </span>
          <br />
          <strong>Tareas seleccionadas:</strong> {seleccionados.length}
        </p>

        {/* Lista de trabajos */}
        <div
          style={{
            maxHeight: "320px",
            overflowY: "auto",
            paddingRight: "6px",
            marginTop: "1rem",
            borderTop: "1px solid #ddd",
            paddingTop: "1rem",
          }}
        >
          <div style={{ marginTop: 16, marginBottom: 12 }}>
            <div
              style={{
                height: 8,
                width: "100%",
                background: "#e5e7eb",
                borderRadius: 4,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${(totalSeleccionado / saldoTotal) * 100}%`,
                  background: "#4f46e5",
                  height: "100%",
                  transition: "width 0.3s ease",
                }}
              />
            </div>
            <small style={{ display: "block", marginTop: 4, color: "#6b7280" }}>
              {totalSeleccionado.toFixed(2)}€ usados de {saldoTotal.toFixed(2)}€
            </small>
          </div>

          <h4>Trabajos</h4>
          <ul>
            {[...trabajos]
              .sort((a, b) => a.fecha.localeCompare(b.fecha))
              .map((t) => {
                const coste = +(t.horas * t.precioHora).toFixed(2);
                const seleccionado = seleccionados.some(
                  (s) => s.id === t.id && s.tipo === "trabajo"
                );
                return (
                  <li
                    key={`trabajo-${t.id}`}
                    className={`tarea-card ${seleccionado ? "selected" : ""}`}
                  >
                    <input
                      type="checkbox"
                      checked={seleccionado}
                      disabled={
                        (!seleccionado && saldoRestante < coste - 0.01) ||
                        guardando
                      }
                      onChange={() => toggleSeleccion(t.id, "trabajo", coste)}
                    />
                    <span>
                      {t.fecha || "Sin fecha"} – {t.horas}h × {t.precioHora}€/h
                      = <strong>{coste.toFixed(2)}€</strong>
                    </span>
                  </li>
                );
              })}
          </ul>

          <h4>Materiales</h4>
          <ul>
            {[...materiales]
              .sort((a, b) => a.fecha.localeCompare(b.fecha))
              .map((m) => {
                const seleccionado = seleccionados.some(
                  (s) => s.id === m.id && s.tipo === "material"
                );
                return (
                  <li
                    key={`material-${m.id}`}
                    className={`tarea-card ${seleccionado ? "selected" : ""}`}
                  >
                    <input
                      type="checkbox"
                      checked={seleccionado}
                      disabled={
                        (!seleccionado && saldoRestante < m.coste - 0.01) ||
                        guardando
                      }
                      onChange={() =>
                        toggleSeleccion(m.id, "material", m.coste)
                      }
                    />
                    <span>
                      {m.fecha || "Sin fecha"} – {m.descripcion || "Material"}:{" "}
                      <strong>{m.coste.toFixed(2)}€</strong>
                    </span>
                  </li>
                );
              })}
          </ul>
        </div>

        <div style={{ marginTop: "1.5rem", display: "flex", gap: "8px" }}>
          <button
            onClick={handleGuardar}
            disabled={guardando || seleccionados.length === 0}
          >
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
