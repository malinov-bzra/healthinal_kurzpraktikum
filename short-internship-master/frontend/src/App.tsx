import { useState, useEffect } from "react";
import { Button, useTheme, Reshaped } from "reshaped/bundle";
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

function AppContent() {
  const { colorMode, invertColorMode } = useTheme();
  const isDark = colorMode === "dark";

  const [activeUserId, setActiveUserId] = useState("");
  const [weight, setWeight] = useState("");
  const [steps, setSteps] = useState("");
  const [water, setWater] = useState("");
  const [sleep, setSleep] = useState("");
  const [history, setHistory] = useState<HealthEntry[]>([]);
  const [showStats, setShowStats] = useState<string | null>(null);

  useEffect(() => {
    document.body.classList.toggle("app-dark", isDark);
    document.body.classList.toggle("app-light", !isDark);
  }, [isDark]);

  const colors = {
    pageBg: isDark ? "#0f172a" : "#f8fafc",
    text: isDark ? "#e2e8f0" : "#0f172a",
    mutedText: isDark ? "#94a3b8" : "#64748b",
    cardBg: isDark ? "#1e293b" : "#ffffff",
    cardBorder: isDark ? "#334155" : "#e2e8f0",
    inputBg: isDark ? "#0f172a" : "#f8fafc",
    inputBorder: isDark ? "#475569" : "#cbd5e1",
    summaryBg: isDark ? "#111827" : "#f1f5f9",
    tableHeaderBorder: isDark ? "#334155" : "#cbd5e1",
    tableRowBorder: isDark ? "#334155" : "#e2e8f0",
    chartGrid: isDark ? "#334155" : "#e2e8f0",
    chartAxis: isDark ? "#94a3b8" : "#64748b",
    tooltipBg: isDark ? "#020617" : "#ffffff",
    tooltipText: isDark ? "#e2e8f0" : "#0f172a",
  };

  const fetchHistory = async (userId: string) => {
    if (!userId.trim()) {
      setHistory([]);
      return;
    }

    try {
      const response = await api.get(`/${userId}`);
      const sortedData = response.data.sort((a: HealthEntry, b: HealthEntry) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
      setHistory(sortedData);
    } catch (err) {
      console.error(err);
      setHistory([]);
    }
  };

  useEffect(() => {
    if (activeUserId.trim()) {
      fetchHistory(activeUserId);
    } else {
      setHistory([]);
    }
  }, [activeUserId]);

  const latestEntry = history.length > 0 ? history[history.length - 1] : null;

  const sleepAdvice = latestEntry
    ? latestEntry.sleep < 7
      ? "Du solltest mehr schlafen!"
      : "Mach weiter so!"
    : null;

  const waterAdvice = latestEntry
    ? latestEntry.water < 2
      ? "Du solltest mehr Wasser trinken!"
      : "Mach weiter so!"
    : null;

  const stepsAdvice = latestEntry
    ? latestEntry.steps < 5000
      ? "Du solltest mehr Schritte machen!"
      : "Mach weiter so!"
    : null;

  const getStatusColor = (type: string, val: string): string => {
    const value = parseFloat(val);
    if (isNaN(value) || value === 0) return colors.mutedText;

    switch (type) {
      case "sleep":
        if (value >= 7) return "#22c55e";
        if (value >= 5) return "#f59e0b";
        return "#ef4444";
      case "water":
        if (value >= 2) return "#22c55e";
        if (value >= 1) return "#f59e0b";
        return "#ef4444";
      case "steps":
        if (value >= 10000) return "#22c55e";
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

      setWeight("");
      setSteps("");
      setWater("");
      setSleep("");

      fetchHistory(activeUserId);
    } catch (err) {
      console.error(err);
    }
  };

  const renderChart = (key: string, unit: string, defaultColor: string) => {
    const labels: Record<string, string> = {
      weight: "Gewicht",
      steps: "Schritte",
      water: "Wasser",
      sleep: "Schlaf",
    };

    return (
      <div className="chart-container" style={{ borderTopColor: colors.cardBorder }}>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={history}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={colors.chartGrid} />
            <XAxis
              dataKey="createdAt"
              tickFormatter={(str) =>
                new Date(str).toLocaleDateString("de-DE", {
                  day: "2-digit",
                  month: "2-digit",
                })
              }
              stroke={colors.chartAxis}
              fontSize={10}
            />
            <YAxis
              stroke={colors.chartAxis}
              fontSize={10}
              tickFormatter={(value) => `${value}${unit}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: colors.tooltipBg,
                border: `1px solid ${colors.chartGrid}`,
                borderRadius: "8px",
                color: colors.tooltipText,
              }}
              labelStyle={{ color: colors.tooltipText }}
              itemStyle={{ color: colors.tooltipText }}
              labelFormatter={(label) => new Date(label).toLocaleDateString("de-DE")}
              formatter={(value) => [value, labels[key] ?? key]}
            />
            <Line
              type="monotone"
              dataKey={key}
              stroke={defaultColor}
              strokeWidth={3}
              dot={{ r: 4, fill: defaultColor }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  };

  return (
    <div
      className="app-container"
      style={{
        background: colors.pageBg,
        color: colors.text,
        minHeight: "100vh",
      }}
    >
      <header className="app-header">
        <div
          className="user-pill"
          style={{
            background: isDark ? "#1e293b" : "#e2e8f0",
            color: colors.text,
          }}
        >
          <span className="pill-label">Daten für:</span>
          <input
            type="text"
            value={activeUserId}
            onChange={(e) => setActiveUserId(e.target.value)}
            placeholder="User-ID..."
            style={{
              background: "transparent",
              border: "none",
              color: colors.text,
              outline: "none",
            }}
          />
        </div>
        <h1 className="welcome-title" style={{ color: colors.text }}>
          Hallo{activeUserId ? ` ${activeUserId}` : "..."}!
        </h1>
      </header>

      <div className="main-grid">
        {[
          { id: "weight", label: "Gewicht", unit: "kg", val: weight, set: setWeight, color: "#3b82f6" },
          { id: "steps", label: "Schritte", unit: "Schritte", val: steps, set: setSteps, color: "#22c55e" },
          { id: "water", label: "Wasser", unit: "l", val: water, set: setWater, color: "#06b6d4" },
          { id: "sleep", label: "Schlaf", unit: "h", val: sleep, set: setSleep, color: "#a855f7" },
        ].map((item) => (
          <div
            className={`glass-card ${showStats === item.id ? "expanded" : ""}`}
            key={item.id}
            style={{
              background: colors.cardBg,
              border: `1px solid ${colors.cardBorder}`,
              color: colors.text,
            }}
          >
            <div className="card-top">
              <span className="card-label" style={{ color: colors.text }}>
                {item.label}
              </span>
            </div>

            <div className="input-group">
              <input
                type="number"
                value={item.val}
                onChange={(e) => item.set(e.target.value + "")}
                placeholder={`0 ${item.unit}`}
                style={{
                  background: colors.inputBg,
                  border: `1px solid ${colors.inputBorder}`,
                  color: colors.text,
                }}
              />
              <div className="card-actions">
                <Button
                  variant="ghost"
                  size="small"
                  onClick={() => setShowStats(showStats === item.id ? null : item.id)}
                >
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

            {item.id === "steps" && stepsAdvice && showStats === "steps" && (
              <p style={{ marginTop: "12px", color: "#ef4444", fontWeight: 600 }}>
                {stepsAdvice}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="action-zone">
        {(weight || steps || water || sleep) && (
          <div
            className="modern-summary"
            style={{
              background: colors.summaryBg,
              color: colors.text,
              border: `1px solid ${colors.cardBorder}`,
            }}
          >
            <h3 style={{ color: colors.text }}>Vorschau deiner Daten</h3>
            {weight && (
              <p style={{ color: getStatusColor("weight", weight) }}>
                Dein aktuelles Gewicht beträgt heute {weight} kg.
              </p>
            )}
            {steps && (
              <p style={{ color: getStatusColor("steps", steps) }}>
                Du bist heute insgesamt {steps} Schritte gelaufen.
              </p>
            )}
            {water && (
              <p style={{ color: getStatusColor("water", water) }}>
                Du hast heute bereits {water} Liter Wasser getrunken.
              </p>
            )}
            {sleep && (
              <p style={{ color: getStatusColor("sleep", sleep) }}>
                Du hast in der letzten Nacht {sleep} Stunden geschlafen.
              </p>
            )}
          </div>
        )}

        <Button
          color="primary"
          size="xlarge"
          className="save-btn"
          onClick={handleSave}
          disabled={(!weight && !steps && !water && !sleep) || !activeUserId}
        >
          Eintrag speichern
        </Button>
      </div>

      <section
        className="history-section"
        style={{
          background: colors.cardBg,
          color: colors.text,
          border: `1px solid ${colors.cardBorder}`,
        }}
      >
        <div className="history-header">
          <h2 style={{ color: colors.text }}>Verlauf</h2>
        </div>

        <div className="table-wrapper">
          <table className="modern-table" style={{ color: colors.text }}>
            <thead>
              <tr>
                <th style={{ color: colors.text, borderBottomColor: colors.tableHeaderBorder }}>Datum</th>
                <th style={{ color: colors.text, borderBottomColor: colors.tableHeaderBorder }}>Kilogramm</th>
                <th style={{ color: colors.text, borderBottomColor: colors.tableHeaderBorder }}>Schritte</th>
                <th style={{ color: colors.text, borderBottomColor: colors.tableHeaderBorder }}>Wasser</th>
                <th style={{ color: colors.text, borderBottomColor: colors.tableHeaderBorder }}>Schlaf</th>
              </tr>
            </thead>
            <tbody>
              {history.length > 0 ? (
                history
                  .slice()
                  .reverse()
                  .slice(0, 5)
                  .map((entry, i) => (
                    <tr key={i}>
                      <td style={{ color: colors.text, borderBottomColor: colors.tableRowBorder }}>
                        {new Date(entry.createdAt).toLocaleDateString()}
                      </td>
                      <td style={{ color: colors.text, borderBottomColor: colors.tableRowBorder }}>
                        {entry.weight}
                      </td>
                      <td style={{ color: colors.text, borderBottomColor: colors.tableRowBorder }}>
                        {entry.steps}
                      </td>
                      <td style={{ color: colors.text, borderBottomColor: colors.tableRowBorder }}>
                        {entry.water}
                      </td>
                      <td style={{ color: colors.text, borderBottomColor: colors.tableRowBorder }}>
                        {entry.sleep}
                      </td>
                    </tr>
                  ))
              ) : (
                <tr>
                  <td colSpan={5} style={{ color: colors.mutedText }}>
                    Keine Einträge gefunden
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <div className="floating-toggle">
        <Button onClick={invertColorMode} variant="ghost">
          {isDark ? "☀️" : "🌙"}
        </Button>
      </div>
    </div>




  );
}

export function App() {
  return (
    <Reshaped theme="slate" defaultColorMode="light">
      <AppContent />
    </Reshaped>
  );
}
