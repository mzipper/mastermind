import { StyleSheet, css } from "aphrodite";
import Button from "@mui/material/Button";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";
import { useState } from "react";

function App() {
  const [selectedColor, setSelectedColor] = useState("red");

  const [activeRow, setActiveRow] = useState(0);
  const rows = 10;
  const cols = 4;

  const [isGameOver, setIsGameOver] = useState(false);

  const createCode = () => {
    const codeArray = [];

    for (let i = 0; i < cols; i++) {
      const randomNumber = Math.floor(Math.random() * 6) + 1;
      codeArray.push(randomNumber);
    }

    return codeArray;
  };

  const [code, setCode] = useState(createCode());

  const initializeBoard = () => {
    const resultNum = 2;

    return Array.from({ length: rows }, () => ({
      guess: Array(cols).fill("grey"),
      result: Array(resultNum).fill(0),
    }));
  };

  const [boardArray, setBoardArray] = useState(initializeBoard);

  const handleClick = (event, value) => {
    setSelectedColor(value || selectedColor);
  };

  const changeGuess = (num) => {
    const modifiedBoard = boardArray.map((array, index) => {
      if (index === activeRow) {
        const updatedGuess = array.guess.map((arrayItem, innerIndex) =>
          innerIndex === num ? selectedColor : arrayItem
        );

        return {
          ...array,
          guess: updatedGuess,
        };
      } else return array;
    });

    setBoardArray(modifiedBoard);
  };

  const handleGuessClick = (buttonNum) => {
    changeGuess(buttonNum);
  };

  const getColorFromNum = (number) => {
    let color = "grey";

    switch (number) {
      case 0:
        color = "grey";
        break;
      case 1:
        color = "red";
        break;
      case 2:
        color = "orange";
        break;
      case 3:
        color = "yellow";
        break;
      case 4:
        color = "green";
        break;
      case 5:
        color = "blue";
        break;
      case 6:
        color = "purple";
        break;

      default:
        color = "grey";
        break;
    }
    return color;
  };

  const getNumFromColor = (color) => {
    let number = 0;

    switch (color) {
      case "grey":
        number = 0;
        break;
      case "red":
        number = 1;
        break;
      case "orange":
        number = 2;
        break;
      case "yellow":
        number = 3;
        break;
      case "green":
        number = 4;
        break;
      case "blue":
        number = 5;
        break;
      case "purple":
        number = 6;
        break;
      default:
        number = 0;
        break;
    }
    return number;
  };

  const handleDoneClick = () => {
    for (let i = 0; i < boardArray[activeRow].guess.length; i++) {
      const color = boardArray[activeRow].guess[i];
      const numGuess = getNumFromColor(color);
      if (numGuess === 0) {
        return;
      }
    }

    const exactMatchMap = new Map();
    const codeMap = new Map();
    const nonExactMatchMap = new Map();

    for (let i = 0; i < boardArray[activeRow].guess.length; i++) {
      const color = boardArray[activeRow].guess[i];
      const numGuess = getNumFromColor(color);

      const numCode = code[i];
      if (numGuess === numCode) {
        exactMatchMap.set(numGuess, (exactMatchMap.get(numGuess) || 0) + 1);
      } else {
        codeMap.set(numCode, (codeMap.get(numCode) || 0) + 1);
        nonExactMatchMap.set(
          numGuess,
          (nonExactMatchMap.get(numGuess) || 0) + 1
        );
      }
    }

    let exactValue = 0;
    exactMatchMap.forEach((value, key) => {
      exactValue += value || 0;
    });

    let nonExactTotalNum = 0;

    codeMap.forEach((value, key) => {
      const nonExactValue = nonExactMatchMap.get(key) || 0;
      nonExactTotalNum += Math.min(value, nonExactValue);
    });

    const modifiedBoard = boardArray.map((array, index) => {
      if (index === activeRow) {
        const updatedResult = Array(exactValue, nonExactTotalNum);

        return {
          ...array,
          result: updatedResult,
        };
      } else return array;
    });

    setBoardArray(modifiedBoard);

    if (exactValue === cols || activeRow === rows - 1) {
      setIsGameOver(true);
    }

    setActiveRow(activeRow + 1);
  };

  return (
    <div className={css(styles.container)}>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <div>Selected Color: {selectedColor.toUpperCase()}</div>
        <div
          style={{
            backgroundColor: selectedColor,
            width: 25,
            height: 15,
            marginLeft: 10,
          }}
        ></div>
      </div>

      {isGameOver && (
        <div
          className={css(styles.guessRow)}
          style={{
            marginBottom: "10px",
          }}
        >
          <div
            style={{
              alignSelf: "center",
              fontSize: "3rem",
            }}
          >
            Code:
          </div>
          <div className={css(styles.gueses)}>
            {code.map((codeItem, innerIndex) => {
              return (
                <div className={css(styles.guessSquares)}>
                  <div
                    className={css(styles.guessButton)}
                    style={{
                      backgroundColor: getColorFromNum(codeItem),
                      color: "white",
                    }}
                  ></div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      <BoardGuesses
        boardArray={boardArray}
        activeRow={activeRow}
        handleGuessClick={handleGuessClick}
        cols={cols}
        isGameOver={isGameOver}
      ></BoardGuesses>
      {!isGameOver && (
        <Button
          variant="contained"
          style={{ backgroundColor: "cornflowerblue", width: 200 }}
          onClick={() => handleDoneClick()}
        >
          Done
        </Button>
      )}
      <ToggleButtonGroup value={selectedColor} exclusive onChange={handleClick}>
        <div className={css(styles.choiceSquares)}>
          <ToggleButton
            className={css(styles.choiceButton)}
            style={{ backgroundColor: "red" }}
            value="red"
          >
            Red
          </ToggleButton>
        </div>
        <div className={css(styles.choiceSquares)}>
          <ToggleButton
            className={css(styles.choiceButton)}
            style={{ backgroundColor: "orange" }}
            value="orange"
          >
            Orange
          </ToggleButton>
        </div>
        <div className={css(styles.choiceSquares)}>
          <ToggleButton
            className={css(styles.choiceButton)}
            style={{ backgroundColor: "yellow" }}
            value="yellow"
          >
            Yellow
          </ToggleButton>
        </div>
        <div className={css(styles.choiceSquares)}>
          <ToggleButton
            className={css(styles.choiceButton)}
            style={{ backgroundColor: "green" }}
            value="green"
          >
            Green
          </ToggleButton>
        </div>
        <div className={css(styles.choiceSquares)}>
          <ToggleButton
            className={css(styles.choiceButton)}
            style={{ backgroundColor: "blue" }}
            value="blue"
          >
            Blue
          </ToggleButton>
        </div>
        <div className={css(styles.choiceSquares)}>
          <ToggleButton
            className={css(styles.choiceButton)}
            style={{ backgroundColor: "purple" }}
            value="purple"
          >
            Purple
          </ToggleButton>
        </div>
      </ToggleButtonGroup>
    </div>
  );
}

export default App;

function BoardGuesses({
  boardArray,
  activeRow,
  handleGuessClick,
  cols,
  isGameOver,
}) {
  return boardArray.map((row, index) => {
    const remaining = cols - (row.result[0] + row.result[1]);

    return (
      <div key={index} className={css(styles.guessRow)}>
        <div
          className={css(styles.gueses)}
          style={
            index === activeRow && !isGameOver
              ? { boxShadow: "0 0 0 3px red inset" }
              : {}
          }
        >
          {row.guess.map((guess, innerIndex) => {
            if (index === activeRow && !isGameOver) {
              return (
                <div key={innerIndex} className={css(styles.guessSquares)}>
                  <div
                    className={css(styles.guessButton)}
                    style={{
                      backgroundColor: guess,
                      color: "white",
                      cursor: "pointer",
                      boxShadow: "0 0 15px white",
                    }}
                    onClick={() => handleGuessClick(innerIndex)}
                  ></div>
                </div>
              );
            } else {
              return (
                <div key={innerIndex} className={css(styles.guessSquares)}>
                  <div
                    className={css(styles.guessButton)}
                    style={{ backgroundColor: guess, color: "white" }}
                  ></div>
                </div>
              );
            }
          })}
        </div>

        <div className={css(styles.results)}>
          {row.result.map((result, innerIndex) => {
            if (result > 0 && innerIndex === 0) {
              return Array(result)
                .fill(0)
                .map(() => {
                  return (
                    <div className={css(styles.resultSquares)}>
                      <div
                        className={css(styles.resultButton)}
                        style={{ backgroundColor: "green", color: "white" }}
                      ></div>
                    </div>
                  );
                });
            } else if (result > 0 && innerIndex === 1) {
              return Array(result)
                .fill(0)
                .map(() => {
                  return (
                    <div className={css(styles.resultSquares)}>
                      <div
                        className={css(styles.resultButton)}
                        style={{ backgroundColor: "yellow", color: "white" }}
                      ></div>
                    </div>
                  );
                });
            } else return null;
          })}
          {Array(remaining)
            .fill(0)
            .map((_, innerIndex) => {
              return (
                <div key={innerIndex} className={css(styles.resultSquares)}>
                  <div
                    className={css(styles.resultButton)}
                    style={{ backgroundColor: "grey", color: "white" }}
                  ></div>
                </div>
              );
            })}
        </div>
      </div>
    );
  });
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  guessRow: {
    display: "flex",
    flexDirection: "row",
  },
  gueses: {
    display: "flex",
    flexDirection: "row",
  },
  results: {
    display: "flex",
    flexDirection: "row",
  },
  guessSquares: {
    display: "flex",
    height: 60,
    width: 60,
    margin: 5,
    backgroundColor: "tan",
  },
  guessButton: {
    margin: "auto",
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  resultSquares: {
    display: "flex",
    height: 30,
    width: 30,
    margin: "5px 3.5px",
    backgroundColor: "tan",
  },
  resultButton: {
    margin: "auto",
    width: 22,
    height: 22,
    borderRadius: 50,
  },
  choiceSquares: {
    display: "flex",
    height: 130,
    width: 130,
    margin: 5,
  },
  choiceButton: {
    margin: "auto",
    width: 90,
    height: 90,
    borderRadius: 50,
  },
});
