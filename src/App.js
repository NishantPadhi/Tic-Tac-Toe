import "./styles.css";
import { useEffect, useState } from "react";

const minLevel = 3;
const minErrorText = "Input value should be minimum 3";

const TicTacToeBox = ({ boxKey, player, handlePlayerChange, gameEnded }) => {
  const [isSelected, setIsSelected] = useState(false);
  const [selectionValue, setSelectionValue] = useState();

  const handleBoxSelection = () => {
    if (!isSelected && !gameEnded) {
      setIsSelected(true);
      if (player === "Player1 (X)") {
        setSelectionValue("X");
      } else {
        setSelectionValue("O");
      }
      handlePlayerChange(boxKey);
    }
  };

  return (
    <div
      className="ticTacToeBox"
      key={boxKey}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        ...(selectionValue === "X" ? { color: "red" } : { color: "blue" }),
        ...(isSelected || gameEnded
          ? { cursor: "not-allowed" }
          : { cursor: "pointer" }),
      }}
      onClick={handleBoxSelection}
    >
      {isSelected && selectionValue}
    </div>
  );
};

const findWinner = (gameMatrix, symbol, ticTacToeLevel) => {
  console.log(gameMatrix, symbol, ticTacToeLevel);
  // Column
  for (let i = 0; i < ticTacToeLevel; i++) {
    if (gameMatrix[i] === symbol) {
      let result = true;
      for (let j = 0; j < ticTacToeLevel - 1; j++) {
        const columnSymbol = gameMatrix[(j + 1) * ticTacToeLevel + i];
        if (columnSymbol !== symbol) {
          result = false;
          break;
        }
      }
      if (result) {
        return result;
      }
    }
  }
  // Row
  for (let i = 0; i < ticTacToeLevel; i++) {
    if (gameMatrix[i * ticTacToeLevel] === symbol) {
      let result = true;
      for (let j = 1; j < ticTacToeLevel; j++) {
        const columnSymbol = gameMatrix[i * ticTacToeLevel + j];
        if (columnSymbol !== symbol) {
          result = false;
          break;
        }
      }
      if (result) {
        return result;
      }
    }
  }
  // Check Diagonal
  if (
    gameMatrix[0] === symbol &&
    gameMatrix[ticTacToeLevel * ticTacToeLevel - 1] === symbol
  ) {
    let result = true;
    for (let i = 1; i < ticTacToeLevel - 1; i++) {
      const diagonalSymbol = gameMatrix[i * ticTacToeLevel + i];
      if (diagonalSymbol !== symbol) {
        result = false;
        break;
      }
      if (result) {
        return result;
      }
    }
  }

  // Check Diagonal
  if (
    gameMatrix[ticTacToeLevel - 1] === symbol &&
    gameMatrix[ticTacToeLevel * ticTacToeLevel - ticTacToeLevel] === symbol
  ) {
    let result = true;
    for (let i = ticTacToeLevel - 2; i > 0; i--) {
      const diagonalSymbol =
        gameMatrix[i * ticTacToeLevel + (ticTacToeLevel - 1 - i)];
      if (diagonalSymbol !== symbol) {
        result = false;
        break;
      }
      if (result) {
        return result;
      }
    }
  }
  return false;
};

export default function App() {
  const [ticTacToeLevel, setTicTacToeLevel] = useState();
  const [errorText, setErrorText] = useState("");
  const [gameEnded, setGameEnded] = useState(false);
  const [turn, setTurn] = useState("Player1 (X)");
  console.log(ticTacToeLevel);
  const [gameMatrix, setGameMatrix] = useState(
    !ticTacToeLevel ? [] : new Array(ticTacToeLevel * ticTacToeLevel)
  );
  const [winner, setWinner] = useState();

  useEffect(() => {
    setGameEnded(false);
    setTurn("Player1 (X)");
    setWinner();
    setGameMatrix(
      !ticTacToeLevel ? [] : new Array(ticTacToeLevel * ticTacToeLevel)
    );
  }, [ticTacToeLevel]);

  const resetBoard = () => {
    setTicTacToeLevel(0);
  };

  useEffect(() => {
    const result = findWinner(
      gameMatrix,
      turn === "Player1 (X)" ? "O" : "X",
      ticTacToeLevel
    );
    if (result) {
      setGameEnded(true);
      setWinner(turn === "Player1 (X)" ? "Player2 (O)" : "Player1 (X)");
    }
  }, [gameMatrix]);

  const handlePlayerChange = (boxKey) => {
    const locations = boxKey?.split("-");

    if (turn === "Player1 (X)") {
      setTurn("Player2 (O)");
      const arr = [...gameMatrix];
      arr[ticTacToeLevel * +locations[0] + +locations[1]] = "X";
      setGameMatrix(arr);
    } else {
      setTurn("Player1 (X)");
      const arr = [...gameMatrix];
      arr[ticTacToeLevel * +locations[0] + +locations[1]] = "O";
      setGameMatrix(arr);
    }
  };

  const handleLevelChange = (e) => {
    const levelValue = e?.target?.value;
    if (!levelValue || levelValue >= minLevel) {
      setErrorText("");
      setTicTacToeLevel(+levelValue);
    } else {
      setErrorText(minErrorText);
      setTicTacToeLevel(+levelValue);
    }
  };

  return (
    <div className="App">
      <div>
        <input
          type="text"
          placeholder="Enter Value"
          value={ticTacToeLevel}
          onChange={(e) => handleLevelChange(e)}
        />
        {errorText && <div style={{ color: "red" }}>{errorText}</div>}
      </div>
      {
        <div
          style={{
            marginTop: "50px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div>
            {ticTacToeLevel && !errorText ? (
              <>
                {!gameEnded && <h2>Player: {turn}</h2>}
                {new Array(ticTacToeLevel).fill("").map((_, parentIndex) => (
                  <div style={{ display: "flex" }}>
                    {new Array(ticTacToeLevel).fill("").map((_, childIndex) => (
                      <TicTacToeBox
                        boxKey={`${parentIndex}-${childIndex}`}
                        player={turn}
                        handlePlayerChange={handlePlayerChange}
                        gameEnded={gameEnded}
                      />
                    ))}
                  </div>
                ))}
              </>
            ) : null}
          </div>
        </div>
      }
      {winner && <h2>Winner: {winner}</h2>}
      {gameEnded && (
        <button style={{ marginTop: "24px" }} onClick={() => resetBoard()}>
          {" "}
          Restart{" "}
        </button>
      )}
    </div>
  );
}
