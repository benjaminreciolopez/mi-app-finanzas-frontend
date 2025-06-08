import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";

interface ResumenMensual {
  id: number;
  año: number;
  mes: number;
  total: number;
}

// ✅ Saca la URL fuera del componente para evitar recalculado
const API_URL = `${import.meta.env.VITE_API_URL}/api/evolucion`;

function Evolucion() {
  const añoActual = new Date().getFullYear();
  const [año, setAño] = useState<number>(añoActual);
  const [datos, setDatos] = useState<ResumenMensual[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    cargarEvolucion(año);
    // eslint-disable-next-line
  }, [año]);

  const cargarEvolucion = async (añoElegido: number) => {
    setLoading(true);
    try {
      const res = await axios.get<{ data: ResumenMensual[] }>(
        `${API_URL}?año=${añoElegido}`
      );
      setDatos(res.data.data);
    } catch (error) {
      console.error("❌ Error cargando evolución:", error);
      setDatos([]);
    } finally {
      setLoading(false);
    }
  };

  const formatearMes = (mes: number) => {
    const nombres = [
      "Ene",
      "Feb",
      "Mar",
      "Abr",
      "May",
      "Jun",
      "Jul",
      "Ago",
      "Sep",
      "Oct",
      "Nov",
      "Dic",
    ];
    return nombres[mes - 1] || "";
  };

  // Construye array con 12 meses (rellenados con total 0 si no hay datos)
  const mesesCompletos = Array.from({ length: 12 }, (_, i) => ({
    mes: formatearMes(i + 1),
    total: 0,
  }));

  datos.forEach((d) => {
    const index = d.mes - 1;
    if (index >= 0 && index < 12) {
      mesesCompletos[index].total = d.total;
    }
  });

  return (
    <div className="container" style={{ padding: "1rem", minHeight: "100vh" }}>
      <h2 className="title">Evolución de Ingresos</h2>

      <div style={{ marginBottom: "1rem" }}>
        <label>
          Seleccionar año:{" "}
          <select
            value={año}
            onChange={(e) => setAño(parseInt(e.target.value))}
          >
            {[añoActual, añoActual - 1, añoActual - 2].map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Mensaje si está cargando */}
      {loading && (
        <p style={{ color: "#888", textAlign: "center" }}>Cargando datos...</p>
      )}

      {/* Mensaje si no hay datos */}
      {!loading && mesesCompletos.every((m) => m.total === 0) && (
        <p style={{ color: "#999", textAlign: "center" }}>
          No hay datos para este año.
        </p>
      )}

      <div style={{ width: "100%", height: 400 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={mesesCompletos}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mes" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="total"
              stroke="#8884d8"
              strokeWidth={2}
              dot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Evolucion;
