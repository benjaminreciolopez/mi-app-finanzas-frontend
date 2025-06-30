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
        <div>
          Saldo total disponible: <strong>{saldoTotal.toFixed(2)}€</strong>
        </div>
        <div className="saldo-restante">
          Saldo restante: {saldoRestante.toFixed(2)}€
        </div>
        <div className="tareas-azul">
          Tareas seleccionadas: {seleccionados.length}
        </div>

        {/* Barra de progreso */}
        <div className="barra-progreso">
          <div
            className="relleno"
            style={{
              width: saldoTotal
                ? `${(totalSeleccionado / saldoTotal) * 100}%`
                : "0%",
            }}
          />
        </div>
        <div className="info-barra">
          {totalSeleccionado.toFixed(2)}€ usados de {saldoTotal.toFixed(2)}€
        </div>

        {/* Lista de tareas y materiales */}
        <div style={{ maxHeight: 220, overflowY: "auto", marginBottom: 12 }}>
          <h4>Trabajos pendientes</h4>
          <ul style={{ margin: 0, padding: 0 }}>
            {trabajos.length === 0 && (
              <li className="tarea-card vacio">Ningún trabajo pendiente.</li>
            )}
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
                    className={`tarea-card${seleccionado ? " selected" : ""}`}
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
                      {t.fecha || "Sin fecha"} — {t.horas}h × {t.precioHora}€/h
                      = <strong>{coste.toFixed(2)}€</strong>
                    </span>
                  </li>
                );
              })}
          </ul>

          <h4>Materiales pendientes</h4>
          <ul>
            {materiales.length === 0 && (
              <li className="tarea-card vacio">Ningún material pendiente.</li>
            )}
            {[...materiales]
              .sort((a, b) => a.fecha.localeCompare(b.fecha))
              .map((m) => {
                const seleccionado = seleccionados.some(
                  (s) => s.id === m.id && s.tipo === "material"
                );
                return (
                  <li
                    key={`material-${m.id}`}
                    className={`tarea-card${seleccionado ? " selected" : ""}`}
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
                      {m.fecha || "Sin fecha"} — {m.descripcion || "Material"}:{" "}
                      <strong>{m.coste.toFixed(2)}€</strong>
                    </span>
                  </li>
                );
              })}
          </ul>
        </div>
        <button
          className="seleccionar-todo-btn"
          disabled={guardando}
          onClick={() => {
            // Si están todas seleccionadas, deselecciona todo
            const tareasTotales = (() => {
              const tareas = [];
              for (const t of [...trabajos].sort((a, b) =>
                a.fecha.localeCompare(b.fecha)
              )) {
                tareas.push({
                  id: t.id,
                  tipo: "trabajo" as const,
                  coste: +(t.horas * t.precioHora).toFixed(2),
                });
              }
              for (const m of [...materiales].sort((a, b) =>
                a.fecha.localeCompare(b.fecha)
              )) {
                tareas.push({
                  id: m.id,
                  tipo: "material" as const,
                  coste: m.coste,
                });
              }
              return tareas;
            })();

            if (seleccionados.length === tareasTotales.length) {
              setSeleccionados([]);
            } else {
              // Selecciona automáticamente hasta agotar saldo
              let saldo = saldoTotal;
              const nuevasSeleccionadas: {
                id: number;
                tipo: "trabajo" | "material";
                coste: number;
              }[] = [];
              for (const tarea of tareasTotales) {
                if (saldo >= tarea.coste - 0.01) {
                  nuevasSeleccionadas.push(tarea);
                  saldo -= tarea.coste;
                } else {
                  break;
                }
              }
              setSeleccionados(nuevasSeleccionadas);
            }
          }}
        >
          {/* Cambia el texto del botón */}
          {(() => {
            const tareasTotales = trabajos.length + materiales.length;
            if (seleccionados.length === tareasTotales && tareasTotales > 0) {
              return "Deseleccionar todo";
            }
            // Si ya están todas las que caben en saldo seleccionadas:
            let saldo = saldoTotal;
            let todasLasQueCaben = 0;
            for (const t of [...trabajos].sort((a, b) =>
              a.fecha.localeCompare(b.fecha)
            )) {
              const coste = +(t.horas * t.precioHora).toFixed(2);
              if (saldo >= coste - 0.01) {
                todasLasQueCaben++;
                saldo -= coste;
              } else {
                break;
              }
            }
            for (const m of [...materiales].sort((a, b) =>
              a.fecha.localeCompare(b.fecha)
            )) {
              if (saldo >= m.coste - 0.01) {
                todasLasQueCaben++;
                saldo -= m.coste;
              } else {
                break;
              }
            }
            if (
              seleccionados.length === todasLasQueCaben &&
              todasLasQueCaben > 0
            ) {
              return "Deseleccionar todo";
            }
            return "Seleccionar todo lo que cubre el saldo";
          })()}
        </button>
      </div>

      <div className="botones">
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
  );
}

export default AsignadorDeEstado;
