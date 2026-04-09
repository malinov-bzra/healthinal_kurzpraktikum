import { useState, useEffect } from "react";
import { Button,  Reshaped } from "reshaped/bundle";
import axios from "axios";
import "reshaped/bundle.css";
import "reshaped/themes/slate/theme.css";
import "./App.css";

const api = axios.create({
  baseURL: "http://localhost:8040/health-metrics",
});

export function App() {
  const [userId, setUserId] = useState("Nicholas");
  const [weight, setWeight] = useState("");
  const [showWeightInput, setShowWeightInput] = useState(false);
  const [steps, setSteps] = useState("");
  const [showStepsInput, setShowStepsInput] = useState(false);
  const [water, setWater] = useState("");
  const [showWaterInput, setShowWaterInput] = useState(false);
  const [sleep, setSleep] = useState("");
  const [showSleepInput, setShowSleepInput] = useState(false);

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const handleSave = async () => {
    try {
      const payload = {
        user_id: userId,
        weight: parseFloat(weight) || 0,
        steps: parseInt(steps) || 0,
        water: parseFloat(water) || 0,
        sleep: parseFloat(sleep) || 0,
      };

      await api.post("", payload);
      alert("Daten erfolgreich an Backend gesendet!");

      setShowWeightInput(false);
      setShowStepsInput(false);
      setShowWaterInput(false);
      setShowSleepInput(false);
    } catch (error) {
      console.error("Fehler beim Speichern:", error);
      alert("Fehler beim Senden der Daten.");
    }
  };

  return (
    <Reshaped theme="slate">
      <div className="page">
        {/* HIER gehört der User-Switch jetzt hin! */}
        <div className="user-switch-container" style={{ marginBottom: "20px" }}>
          <span>Nutzer: </span>
          <input
            className="user-input"
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="ID eingeben..."
          />
        </div>

        <h1>Hallo {userId}!</h1>
        <p>Deine heutigen Daten:</p>
      </div>

      <div className="cards">
        {/* Gewicht */}
        <div className="card">
          <div className="cardTitle">
            Gewicht: {weight ? `${weight} kg` : "...kg"}
          </div>
          {showWeightInput && (
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="Gewicht eingeben"
            />
          )}
          <div className="cardActions">
            <Button size="small" onClick={() => setShowWeightInput(true)}>
              Erstellen
            </Button>
            <Button size="small" variant="outline">Statistiken</Button>
          </div>
        </div>

        {/* Schritte */}
        <div className="card">
          <div className="cardTitle">
            Schritte: {steps ? `${steps} Schritte` : "...Schritte"}
          </div>
          {showStepsInput && (
            <input
              type="number"
              value={steps}
              onChange={(e) => setSteps(e.target.value)}
              placeholder="Schritte eingeben"
            />
          )}
          <div className="cardActions">
            <Button size="small" onClick={() => setShowStepsInput(true)}>
              Erstellen
            </Button>
            <Button size="small" variant="outline">Statistiken</Button>
          </div>
        </div>

        {/* Wasser */}
        <div className="card">
          <div className="cardTitle">
            Wasser: {water ? `${water} l` : "...l"}
          </div>
          {showWaterInput && (
            <input
              type="number"
              value={water}
              onChange={(e) => setWater(e.target.value)}
              placeholder="Wasseraufnahme eingeben"
            />
          )}
          <div className="cardActions">
            <Button size="small" onClick={() => setShowWaterInput(true)}>
              Erstellen
            </Button>
            <Button size="small" variant="outline">Statistiken</Button>
          </div>
        </div>

        {/* Schlaf */}
        <div className="card">
          <div className="cardTitle">
            Schlaf: {sleep ? `${sleep} h` : "...h"}
          </div>
          {showSleepInput && (
            <input
              type="number"
              value={sleep}
              onChange={(e) => setSleep(e.target.value)}
              placeholder="Schlaf eingeben"
            />
          )}
          <div className="cardActions">
            <Button size="small" onClick={() => setShowSleepInput(true)}>
              Erstellen
            </Button>
            <Button size="small" variant="outline">Statistiken</Button>
          </div>
        </div>
      </div>

      <div className="saveContainer" style={{ textAlign: "center", margin: "20px" }}>
        <Button
          color="primary"
          size="large"
          onClick={handleSave}
          disabled={!weight && !steps && !water && !sleep}
        >
          Daten senden
        </Button>
      </div>

      <div className="themeButton">
        <Button onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "🌙" : "☀️"}
        </Button>
      </div>
    </Reshaped>
  );
}
