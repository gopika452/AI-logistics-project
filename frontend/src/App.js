import { useState } from "react";
import { Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend
);

export default function App() {
  const [form, setForm] = useState({
    distance_km: "",
    traffic_level: "",
    weather: "",
    shipment_weight: "",
  });

  const [result, setResult] = useState("");
  const [stats, setStats] = useState({ delayed: 0, ontime: 0 });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("http://127.0.0.1:8000/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        distance_km: Number(form.distance_km),
        traffic_level: Number(form.traffic_level),
        weather: Number(form.weather),
        shipment_weight: Number(form.shipment_weight),
      }),
    });

    const data = await response.json();
    setResult(data.prediction);

    if (data.prediction === "Delayed") {
      setStats({ ...stats, delayed: stats.delayed + 1 });
    } else {
      setStats({ ...stats, ontime: stats.ontime + 1 });
    }
  };

  const pieData = {
    labels: ["Delayed", "On Time"],
    datasets: [
      {
        data: [stats.delayed, stats.ontime],
        backgroundColor: ["#ff6b6b", "#4cd137"],
        borderWidth: 0,
      },
    ],
  };

  const lineData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Predicted Orders",
        data: [120, 135, 150, 145, 160, 170, 180],
        borderColor: "#00d2ff",
        backgroundColor: "rgba(0,210,255,0.2)",
        tension: 0.4,
        fill: true,
        pointRadius: 5,
      },
    ],
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.header}>🚀 AI Logistics Intelligence Platform</h1>

      <div style={styles.kpiGrid}>
        <KPI title="Total Predictions" value={stats.delayed + stats.ontime} />
        <KPI title="Delayed" value={stats.delayed} color="#ff6b6b" />
        <KPI title="On Time" value={stats.ontime} color="#4cd137" />
        <KPI title="Accuracy" value="94%" color="#00d2ff" />
      </div>

      <div style={styles.grid}>
        <div style={styles.glassCard}>
          <h3>📦 Shipment Prediction</h3>
          <form onSubmit={handleSubmit} style={styles.form}>
            <input style={styles.input} placeholder="Distance (km)" name="distance_km" onChange={handleChange} required />
            <select style={styles.input} name="traffic_level" onChange={handleChange} required>
              <option value="">Traffic</option>
              <option value="0">Low</option>
              <option value="1">Medium</option>
              <option value="2">High</option>
            </select>
            <select style={styles.input} name="weather" onChange={handleChange} required>
              <option value="">Weather</option>
              <option value="0">Clear</option>
              <option value="1">Rainy</option>
              <option value="2">Foggy</option>
            </select>
            <input style={styles.input} placeholder="Weight (kg)" name="shipment_weight" onChange={handleChange} required />
            <button style={styles.button}>Predict</button>
          </form>
          {result && (
            <h3 style={{ color: result === "Delayed" ? "#ff6b6b" : "#4cd137" }}>
              Result: {result}
            </h3>
          )}
        </div>

        <div style={styles.glassCard}>
          <h3>⏱ Delay Analytics</h3>
          <Pie data={pieData} />
        </div>

        <div style={styles.glassCardWide}>
          <h3>📈 Weekly Demand Forecast</h3>
          <Line data={lineData} />
        </div>
      </div>
    </div>
  );
}

const KPI = ({ title, value, color = "#00d2ff" }) => (
  <div style={{ ...styles.kpiCard, borderLeft: `5px solid ${color}` }}>
    <h4>{title}</h4>
    <h2 style={{ color }}>{value}</h2>
  </div>
);

const styles = {
  page: {
    minHeight: "100vh",
    padding: "25px",
    background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
    color: "white",
  },
  header: {
    textAlign: "center",
    marginBottom: "20px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "20px",
  },
  glassCard: {
    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(10px)",
    padding: "20px",
    borderRadius: "16px",
    boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
  },
  glassCardWide: {
    gridColumn: "span 2",
    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(10px)",
    padding: "20px",
    borderRadius: "16px",
    boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  input: {
    padding: "12px",
    borderRadius: "10px",
    border: "none",
    outline: "none",
  },
  button: {
    padding: "12px",
    borderRadius: "12px",
    border: "none",
    background: "linear-gradient(135deg, #00d2ff, #3a7bd5)",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
  },
  kpiGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
    gap: "15px",
    marginBottom: "20px",
  },
  kpiCard: {
    background: "rgba(255,255,255,0.1)",
    backdropFilter: "blur(10px)",
    padding: "15px",
    borderRadius: "14px",
    textAlign: "center",
  },
};