import React, { useState } from "react";
import GameArea from "./GameArea";
import "./App.css";

const App: React.FC = () => {
  const [snakeColor, setSnakeColor] = useState<string>("#00ff00");
  const [difficulty, setDifficulty] = useState<number>(200);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        gap: "20px",
      }}
    >
      <label>
        Snake Color:
        <input
          type="color"
          value={snakeColor}
          onChange={(e) => setSnakeColor(e.target.value)}
        />
      </label>
      <label>
        Difficulty:
        <select
          value={difficulty}
          onChange={(e) => {
            setDifficulty(Number(e.target.value));
            const selectElement = document.querySelector("select");
            if (selectElement) {
              (selectElement as HTMLSelectElement).blur();
            }
          }}
        >
          <option value={300}>Easy</option>
          <option value={200}>Medium</option>
          <option value={100}>Hard</option>
        </select>
      </label>
      <GameArea snakeColor={snakeColor} gameSpeed={difficulty} />
    </div>
  );
};

export default App;
