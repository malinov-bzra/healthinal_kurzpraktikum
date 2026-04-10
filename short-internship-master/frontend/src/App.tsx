import { useState, useEffect } from "react";
import { Button, Reshaped } from "reshaped/bundle";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from "axios";
import "reshaped/bundle.css";
import "reshaped/themes/slate/theme.css";
import "./App.css";

interface HealthEntry {
  createdAt: string;
  weight: number;
  steps: number;
  water: number;
  sleep: number;
}

const api = axios.create({
  baseURL: "http://localhost:8040/health-metrics",
});

export function App() {
  const [activeUserId, setActiveUserId] = useState("");
  const [searchUserId, setSearchUserId] = useState("");
  const [weight, setWeight] = useState("");
  const [steps, setSteps] = useState("");
  const [water, setWater] = useState("");
  const [sleep, setSleep] = useState("");
  const [history, setHistory] = useState<HealthEntry[]>([]);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("theme") === "dark");
  const [showStats, setShowStats] = useState<string | null>(null);

  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const fetchHistory = async () => {
    try {
      const response = await api.get(`/${searchUserId}`);
      const sortedData = response.data.sort((a: HealthEntry, b: HealthEntry) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
      setHistory(sortedData);
    } catch (err) {
      console.error(err);
      setHistory([]);
    }
  };

  const latestEntry = history.length > 0 ? history[history.length - 1] : null;
  const sleepAdvice =
    latestEntry && latestEntry.sleep < 7 ? "Du solltest mehr schlafen!" : "Mach weiter so!";
  const waterAdvice =
  latestEntry && latestEntry.water < 2 ? "Du solltest mehr Wasser trinken!" : "";



  useEffect(() => {
    if (searchUserId) fetchHistory();
  }, [searchUserId]);

  const getStatusColor = (type: string, val: string): string => {
    const value = parseFloat(val);
    if (isNaN(value) || value === 0) return "#64748b";
    switch (type) {
      case "sleep":
        if (value >= 7) return "#10b981";
        if (value >= 5) return "#f59e0b";
        return "#ef4444";
      case "water":
        if (value >= 2) return "#10b981";
        if (value >= 1) return "#f59e0b";
        return "#ef4444";
      case "steps":
        if (value >= 10000) return "#10b981";
        if (value >= 5000) return "#f59e0b";
        return "#ef4444";
      default:
        return "#3b82f6";
    }
  };

  const handleSave = async () => {
    try {
      const payload = {
        user_id: activeUserId,
        weight: parseFloat(weight) || 0,
        steps: parseInt(steps) || 0,
        water: parseFloat(water) || 0,
        sleep: parseFloat(sleep) || 0,
      };
      await api.post("", payload);
      setWeight(""); setSteps(""); setWater(""); setSleep("");
      fetchHistory();
    } catch (err) {
      console.error(err);
    }
  };

  const renderChart = (key: string, unit: string, defaultColor: string) => (
    <div className="chart-container">
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={history}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
          <XAxis
            dataKey="createdAt"
            tickFormatter={(str) => new Date(str).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' })}
            stroke="#64748b"
            fontSize={10}
          />
          <YAxis stroke="#64748b" fontSize={10} unit={unit} />
          <Tooltip
            contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
            labelFormatter={(label) => new Date(label).toLocaleDateString()}
          />
          <Line type="monotone" dataKey={key} stroke={defaultColor} strokeWidth={3} dot={{ r: 4, fill: defaultColor }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );

  return (
    <Reshaped theme="slate">
      <div className="app-container">
        <header className="app-header">
          <div className="user-pill">
            <span className="pill-label">Daten für:</span>
            <input type="text" value={activeUserId} onChange={(e) => setActiveUserId(e.target.value)} placeholder="Name..." />
          </div>
          <h1 className="welcome-title">Hallo{activeUserId ? ` ${activeUserId}` : "..."}! </h1>
        </header>

        <div className="main-grid">
          {[
            { id: "weight", label: "Gewicht", unit: "kg", val: weight, set: setWeight,  color: "#3b82f6" },
            { id: "steps", label: "Schritte", unit: "Steps", val: steps, set: setSteps,  color: "#10b981" },
            { id: "water", label: "Wasser", unit: "L", val: water, set: setWater, color: "#0ea5e9" },
            { id: "sleep", label: "Schlaf", unit: "h", val: sleep, set: setSleep,  color: "#8b5cf6" }
          ].map((item) => (
            <div className={`glass-card ${showStats === item.id ? 'expanded' : ''}`} key={item.id}>
              <div className="card-top">
                <span className="card-label">{item.label}</span>
              </div>
              <div className="input-group">
                <input type="number" value={item.val} onChange={(e) => item.set(e.target.value)} placeholder={`0 ${item.unit}`} />
                <div className="card-actions">
                  <Button variant="ghost" size="small" onClick={() => setShowStats(showStats === item.id ? null : item.id)}>
                    {showStats === item.id ? "Schliessen" : "Statistiken"}
                  </Button>
                </div>
              </div>
              {showStats === item.id && renderChart(item.id, item.unit, item.color)}
              {item.id === "sleep" && sleepAdvice && showStats === "sleep" && (
                <p style={{ marginTop: "12px", color: "#ef4444", fontWeight: 600 }}>
                  {sleepAdvice}
                </p>
                
              )}
              {item.id === "water" && waterAdvice && showStats === "water" && (
                <p style={{ marginTop: "12px", color: "#ef4444", fontWeight: 600 }}>
                  {waterAdvice}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="action-zone">
          {(weight || steps || water || sleep) && (
            <div className="modern-summary">
              <h3>Vorschau deiner Daten</h3>
              {weight && <p style={{ color: getStatusColor("weight", weight) }}>Dein aktuelles Gewicht beträgt heute {weight} kg.</p>}
              {steps && <p style={{ color: getStatusColor("steps", steps) }}>Du bist heute insgesamt {steps} Schritte gelaufen.</p>}
              {water && <p style={{ color: getStatusColor("water", water) }}>Du hast heute bereits {water} Liter Wasser getrunken.</p>}
              {sleep && <p style={{ color: getStatusColor("sleep", sleep) }}>Du hast in der letzten Nacht {sleep} Stunden geschlafen.</p>}
            </div>
          )}
          <Button color="primary" size="xlarge" className="save-btn" onClick={handleSave} disabled={(!weight && !steps && !water && !sleep) || !activeUserId}>
            Eintrag speichern
          </Button>
        </div>

        <section className="history-section">
          <div className="history-header">
            <h2>Verlauf</h2>
            <div className="search-pill">
              <input type="text" className="history-search-input" value={searchUserId} onChange={(e) => setSearchUserId(e.target.value)} placeholder="User suchen..." />
            </div>
          </div>
          <div className="table-wrapper">
            <table className="modern-table">
              <thead>
              <tr><th>Datum</th><th>kg</th><th>Schritte</th><th>Wasser</th><th>Schlaf</th></tr>
              </thead>
              <tbody>
              {history.length > 0 ? history.slice().reverse().slice(0, 5).map((entry, i) => (
                <tr key={i}>
                  <td>{new Date(entry.createdAt).toLocaleDateString()}</td>
                  <td>{entry.weight}</td><td>{entry.steps}</td><td>{entry.water}</td><td>{entry.sleep}</td>
                </tr>
              )) : <tr><td colSpan={5}>Keine Einträge gefunden</td></tr>}
              </tbody>
            </table>
          </div>
        </section>

        <div className="floating-toggle">
          <Button onClick={() => setDarkMode(!darkMode)} variant="ghost">{darkMode ? "☀️" : "🌙"}</Button>
        </div>
      </div>
    </Reshaped>
  );
}
