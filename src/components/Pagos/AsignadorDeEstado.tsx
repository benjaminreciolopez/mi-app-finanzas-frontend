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
  pago,
  trabajos,
  materiales,
  saldoACuenta,
  clienteId,
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

  const saldoDisponible = pago ? pago.cantidad : 0;
  const saldoTotal = +(saldoDisponible + saldoACuenta).toFixed(2);
  const saldoRestante = Math.max(
    +(saldoTotal - totalSeleccionado).toFixed(2),
    0
  );
  const actualizarSaldoCliente = async (
    clienteId: number,
    nuevoSaldo: number
  ) => {
    if (!clienteId || isNaN(clienteId)) return;
    try {
      await fetch(
        `${import.meta.env.VITE_API_URL}/api/clientes/${clienteId}/saldo`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nuevoSaldo }),
        }
      );
    } catch (error) {
      console.error("❌ Error al actualizar saldo del cliente:", error);
    }
  };

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
      }

      const nuevoSaldo = +(
        saldoDisponible +
        saldoACuenta -
        totalSeleccionado
      ).toFixed(2);
      await actualizarSaldoCliente(clienteId, Math.max(nuevoSaldo, 0));

      toast.success("Tareas marcadas como saldadas");
      onGuardar();
    } catch (error) {
      toast.error("Error al guardar cambios");
      console.error(error);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal" style={{ maxWidth: 480, padding: "1.5rem" }}>
        <h3 style={{ marginBottom: 8 }}>Marcar tareas como saldadas</h3>
        <p>
          <strong>Saldo nuevo pago:</strong> {saldoDisponible.toFixed(2)}€{" "}
          <br />
          <strong>Saldo anterior a cuenta:</strong> {saldoACuenta.toFixed(2)}€{" "}
          <br />
          <strong>Saldo total disponible:</strong>{" "}
          <span style={{ fontWeight: 600 }}>{saldoTotal.toFixed(2)}€</span>{" "}
          <br />
          <strong>Saldo restante:</strong>{" "}
          <span
            style={{
              color: saldoRestante < 0 ? "crimson" : "#2d2",
              fontWeight: 600,
            }}
          >
            {saldoRestante.toFixed(2)}€
          </span>{" "}
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
          <h4 style={{ marginBottom: "0.5rem" }}>Trabajos</h4>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {[...trabajos]
              .sort((a, b) => a.fecha.localeCompare(b.fecha))
              .map((t) => {
                const coste = +(t.horas * t.precioHora).toFixed(2);
                const seleccionado = seleccionados.some(
                  (s) => s.id === t.id && s.tipo === "trabajo"
                );
                return (
                  <li
                    key={t.id}
                    style={{
                      marginBottom: "6px",
                      background: seleccionado ? "#eef6fb" : "transparent",
                      padding: "4px 6px",
                      borderRadius: "6px",
                    }}
                  >
                    <label style={{ cursor: "pointer" }}>
                      <input
                        type="checkbox"
                        checked={seleccionado}
                        onChange={() => toggleSeleccion(t.id, "trabajo", coste)}
                        style={{ marginRight: 8 }}
                      />
                      {t.fecha || "Sin fecha"} – {t.horas}h × {t.precioHora}€/h
                      = <strong>{coste.toFixed(2)}€</strong>
                    </label>
                  </li>
                );
              })}
          </ul>

          {/* Lista de materiales */}
          <h4 style={{ margin: "1rem 0 0.5rem" }}>Materiales</h4>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {[...materiales]
              .sort((a, b) => a.fecha.localeCompare(b.fecha))
              .map((m) => {
                const seleccionado = seleccionados.some(
                  (s) => s.id === m.id && s.tipo === "material"
                );
                return (
                  <li
                    key={m.id}
                    style={{
                      marginBottom: "6px",
                      background: seleccionado ? "#eef6fb" : "transparent",
                      padding: "4px 6px",
                      borderRadius: "6px",
                    }}
                  >
                    <label style={{ cursor: "pointer" }}>
                      <input
                        type="checkbox"
                        checked={seleccionado}
                        onChange={() =>
                          toggleSeleccion(m.id, "material", m.coste)
                        }
                        style={{ marginRight: 8 }}
                      />
                      {m.fecha || "Sin fecha"} – {m.descripcion || "Material"}:{" "}
                      <strong>{m.coste.toFixed(2)}€</strong>
                    </label>
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
