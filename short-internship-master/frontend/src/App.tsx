import { Button, Avatar, Reshaped } from "reshaped/bundle";
import "reshaped/bundle.css";
import "reshaped/themes/slate/theme.css";
import "./App.css";
import avatarImage from "./images/basic_avatar.jpg";

export function App() {
  return (
    <Reshaped theme="slate">
      <div className="page">
        <h1>Hallo Benutzer!</h1>
        <p>Hier deine heutigen Daten:</p>
      </div>

      <div className="cards">
        <div className="card">
          <div className="cardTitle">Gewicht: ...kg</div>
          <div className="cardActions">
            <Button size="small">Erfassen</Button>
            <Button size="small" variant="outline">
              Bearbeiten
            </Button>
          </div>
        </div>

        <div className="card">
          <div className="cardTitle">Schritte: ...Schritte</div>
          <div className="cardActions">
            <Button size="small">Erfassen</Button>
            <Button size="small" variant="outline">
              Bearbeiten
            </Button>
          </div>
        </div>

        <div className="card">
          <div className="cardTitle">Wasseraufnahmen: ...l</div>
          <div className="cardActions">
            <Button size="small">Erfassen</Button>
            <Button size="small" variant="outline">
              Bearbeiten
            </Button>
          </div>
        </div>

        <div className="card">
          <div className="cardTitle">Schlaf: ...h</div>
          <div className="cardActions">
            <Button size="small">Erfassen</Button>
            <Button size="small" variant="outline">
              Bearbeiten
            </Button>
          </div>
        </div>
      </div>

      <div className="avatar">
        <Avatar src={avatarImage} />
      </div>


    </Reshaped>


  );
}
