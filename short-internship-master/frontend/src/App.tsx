import { useState, useEffect } from "react";
import { Button, Avatar, Reshaped } from "reshaped/bundle";
import "reshaped/bundle.css";
import "reshaped/themes/slate/theme.css";
import "./App.css";
import avatarImage from "./images/basic_avatar.jpg";

export function App() {
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

  return (
    <Reshaped theme="slate">
      <div className="page">
        <h1>Hallo Benutzer!</h1>
        <p>Deine heutigen Daten:</p>
      </div>

      <div className="cards">
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
              Erfassen
            </Button>
            <Button
              size="small"
              onClick={() => setShowWeightInput(true)}
            >
              Bearbeiten
            </Button>
            <Button
              size="small"
              variant="outline"
            >
              Statistiken
            </Button>
          </div>
        </div>

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
              Erfassen
            </Button>
            <Button
              size="small"
              onClick={() => setShowStepsInput(true)}
            >
              Bearbeiten
            </Button>
            <Button size="small" variant="outline">
              Statistiken
            </Button>
          </div>
        </div>

        <div className="card">
          <div className="cardTitle">
            Wasseraufnahmen: {water ? `${water} l` : "...l"}
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
              Erfassen
            </Button>
            <Button
              size="small"
              onClick={() => setShowWaterInput(true)}
            >
              Bearbeiten
            </Button>
            <Button size="small" variant="outline">
              Statistiken
            </Button>
          </div>
        </div>

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
              Erfassen
            </Button>
            <Button
              size="small"
              onClick={() => setShowSleepInput(true)}
            >
              Bearbeiten
            </Button>
            <Button size="small" variant="outline">
              Statistiken
            </Button>
          </div>
        </div>
      </div>

      <div className="summary">
        {weight && <p>Heute wiegst du {weight} kg.</p>}
        {steps && <p>Heute hast du {steps} Schritte gemacht.</p>}
        {water && <p>Du hast heute {water} l Wasser getrunken.</p>}
        {sleep && <p>Dein Schlaf ging heute {sleep} h.</p>}
      </div>

      <div className="avatar">
        <Avatar src={avatarImage} />
      </div>

      <div className="kiButton">
        <Button>KI-Button</Button>
      </div>

      <div className="themeButton">
        <Button onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "🌙" : "☀️"}
        </Button>
      </div>
    </Reshaped>
  );
}
