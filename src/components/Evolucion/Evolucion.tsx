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

function Evolucion() {
  const añoActual = new Date().getFullYear();
  const [año, setAño] = useState<number>(añoActual);
  const [datos, setDatos] = useState<ResumenMensual[]>([]);

  useEffect(() => {
    cargarEvolucion(año);
  }, [año]);

  // 👇 CAMBIO HECHO AQUÍ
  const API_URL = "https://mi-app-finanzas-backend.onrender.com/api/evolucion";

  const cargarEvolucion = async (añoElegido: number) => {
    try {
      const res = await axios.get<{ data: ResumenMensual[] }>(
        `${API_URL}?año=${añoElegido}`
      );
      setDatos(res.data.data);
    } catch (error) {
      console.error("❌ Error cargando evolución:", error);
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
