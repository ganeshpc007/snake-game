import React, { useState, useEffect } from "react";

interface Position {
  x: number;
  y: number;
}

interface GameAreaProps {
  snakeColor: string;
  gameSpeed: number;
}

const getRandomPosition = (gridSize: number): Position => {
  return {
    x: Math.floor(Math.random() * gridSize),
    y: Math.floor(Math.random() * gridSize),
  };
};

const GameArea: React.FC<GameAreaProps> = ({ snakeColor, gameSpeed }) => {
  const gridSize = 20;
  const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Position>(getRandomPosition(gridSize));
  const [direction, setDirection] = useState<Position>({ x: 0, y: 0 });
  const [score, setScore] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [obstacles] = useState<Position[]>([
    { x: 5, y: 5 },
    { x: 15, y: 15 },
  ]);

  useEffect(() => {
    if (gameOver) return;

    const moveSnake = () => {
      setSnake((prevSnake) => {
        const newHead = {
          x: prevSnake[0].x + direction.x,
          y: prevSnake[0].y + direction.y,
        };

        if (newHead.x === food.x && newHead.y === food.y) {
          setFood(getRandomPosition(gridSize));
          setScore((prevScore) => prevScore + 1);
          return [newHead, ...prevSnake];
        }

        const newSnake = [newHead, ...prevSnake.slice(0, -1)];

        if (
          newHead.x < 0 ||
          newHead.x >= gridSize ||
          newHead.y < 0 ||
          newHead.y >= gridSize ||
          newSnake
            .slice(1)
            .some(
              (segment) => segment.x === newHead.x && segment.y === newHead.y
            ) ||
          obstacles.some(
            (obstacle) => obstacle.x === newHead.x && obstacle.y === newHead.y
          )
        ) {
          setGameOver(true);
          return prevSnake;
        }

        return newSnake;
      });
    };

    const interval = setInterval(moveSnake, gameSpeed);

    return () => {
      clearInterval(interval);
    };
  }, [direction, food, gridSize, gameOver, obstacles, gameSpeed]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case "ArrowUp":
          setDirection({ x: 0, y: -1 });
          break;
        case "ArrowDown":
          setDirection({ x: 0, y: 1 });
          break;
        case "ArrowLeft":
          setDirection({ x: -1, y: 0 });
          break;
        case "ArrowRight":
          setDirection({ x: 1, y: 0 });
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood(getRandomPosition(gridSize));
    setDirection({ x: 0, y: 0 });
    setScore(0);
    setGameOver(false);
  };

  const getHeadSegmentStyle = () => {
    let borderStyle = "";
    if (direction.x === 0 && direction.y === -1) {
      borderStyle = "50% 50% 0 0";
    } else if (direction.x === 0 && direction.y === 1) {
      borderStyle = "0 0 50% 50%";
    } else if (direction.x === -1 && direction.y === 0) {
      borderStyle = "50% 0 0 50%";
    } else {
      borderStyle = "0 50% 50% 0";
    }
    return {
      backgroundColor: "darkgreen",
      boxShadow: "0 0 5px rgba(0,0,0,0.5)",
      borderRadius: borderStyle,
    };
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ marginBottom: "20px" }}>
        <h1>Score: {score}</h1>
      </div>
      <div
        style={{
          position: "relative",
          width: "400px",
          height: "400px",
          backgroundColor: "lightgray",
        }}
      >
        {snake.map((segment, index) => (
          <div
            key={index}
            style={{
              position: "absolute",
              width: "20px",
              height: "20px",
              left: `${segment.x * 20}px`,
              top: `${segment.y * 20}px`,
              ...(index === 0
                ? getHeadSegmentStyle()
                : { borderRadius: "50%", backgroundColor: snakeColor }),
            }}
          ></div>
        ))}
        <div
          style={{
            position: "absolute",
            width: "20px",
            height: "20px",
            backgroundColor: "red",
            left: `${food.x * 20}px`,
            top: `${food.y * 20}px`,
          }}
        ></div>
        {obstacles.map((obstacle, index) => (
          <div
            key={index}
            style={{
              position: "absolute",
              width: "20px",
              height: "20px",
              backgroundColor: "black",
              left: `${obstacle.x * 20}px`,
              top: `${obstacle.y * 20}px`,
            }}
          ></div>
        ))}
      </div>

      <div
        style={{
          marginTop: "20px",
          color: "red",
          visibility: gameOver ? "visible" : "hidden",
        }}
      >
        <h2>Game Over!</h2>
        <button onClick={resetGame}>Restart Game</button>
      </div>
    </div>
  );
};

export default GameArea;
