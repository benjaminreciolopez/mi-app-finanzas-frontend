import React, { useState } from "react";

interface TrabajoOMaterial {
  id: number;
  fecha: string;
  coste: number; // para trabajo: horas * precioHora
  tipo: "trabajo" | "material";
}

interface Props {
  trabajos: TrabajoOMaterial[];
  materiales: TrabajoOMaterial[];
  pago: { id: number; cantidad: number };
  onCerrar: () => void;
  onConfirmarAsignaciones: (
    asignaciones: {
      tareaId: number;
      tipo: "trabajo" | "material";
      usado: number;
    }[]
  ) => void;
}

const AsignadorManual: React.FC<Props> = ({
  trabajos,
  materiales,
  pago,
  onCerrar,
  onConfirmarAsignaciones,
}) => {
  const [seleccionados, setSeleccionados] = useState<
    { id: number; tipo: "trabajo" | "material"; usado: number }[]
  >([]);

  const totalAsignado = seleccionados.reduce((acc, s) => acc + s.usado, 0);
  const restante = pago.cantidad - totalAsignado;

  const toggleSeleccion = (
    tarea: TrabajoOMaterial,
    completo: boolean = true
  ) => {
    const yaEsta = seleccionados.find(
      (s) => s.id === tarea.id && s.tipo === tarea.tipo
    );
    if (yaEsta) {
      setSeleccionados((prev) =>
        prev.filter((s) => !(s.id === tarea.id && s.tipo === tarea.tipo))
      );
    } else {
      const aUsar = completo
        ? Math.min(restante, tarea.coste)
        : Math.min(restante, tarea.coste); // más adelante puedes hacerlo editable
      if (aUsar > 0) {
        setSeleccionados((prev) => [
          ...prev,
          { id: tarea.id, tipo: tarea.tipo, usado: aUsar },
        ]);
      }
    }
  };

  const renderFila = (t: TrabajoOMaterial) => {
    const marcado = seleccionados.find(
      (s) => s.id === t.id && s.tipo === t.tipo
    );
    const cubierto = (marcado?.usado ?? 0) >= t.coste;
    const pendiente = t.coste - (marcado?.usado ?? 0);

    return (
      <tr key={`${t.tipo}-${t.id}`}>
        <td>{t.fecha.slice(0, 10)}</td>
        <td>{t.tipo === "trabajo" ? "Trabajo" : "Material"}</td>
        <td>{t.coste.toFixed(2)}€</td>
        <td>
          {marcado
            ? cubierto
              ? "✅ Cuadrado"
              : `🟡 Falta ${pendiente.toFixed(2)}€`
            : "-"}
        </td>
        <td>
          <button
            onClick={() => toggleSeleccion(t)}
            style={{
              padding: "4px 8px",
              backgroundColor: marcado ? "#f87171" : "#60a5fa",
              color: "white",
              border: "none",
              borderRadius: "6px",
            }}
          >
            {marcado ? "Quitar" : "Asignar"}
          </button>
        </td>
      </tr>
    );
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "#00000066",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 999,
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: "12px",
          padding: "20px",
          width: "90%",
          maxWidth: "700px",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <h3>Asignar pago de {pago.cantidad.toFixed(2)}€</h3>
        <p>Restante: {restante.toFixed(2)}€</p>

        <table style={{ width: "100%", marginBottom: "1rem" }}>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Tipo</th>
              <th>Coste</th>
              <th>Estado</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>{[...trabajos, ...materiales].map(renderFila)}</tbody>
        </table>

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <button onClick={onCerrar}>Cancelar</button>
          <button
            disabled={seleccionados.length === 0}
            onClick={() =>
              onConfirmarAsignaciones(
                seleccionados.map(({ id, tipo, usado }) => {
                  const fuente = tipo === "trabajo" ? trabajos : materiales;
                  const encontrada = fuente.find((t) => t.id === id);
                  return {
                    tareaId: id,
                    tipo,
                    usado,
                    fechaTarea: encontrada?.fecha || new Date().toISOString(),
                  };
                })
              )
            }
          >
            Confirmar asignaciones
          </button>
        </div>
      </div>
    </div>
  );
};

export default AsignadorManual;
