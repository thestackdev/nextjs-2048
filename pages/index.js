import { Component } from "react";

let divs = [];
for (let i = 0; i < 16; i++) {
  divs.push({ value: 0, index: i });
}

export class GameBoard extends Component {
  state = { pieces: divs, points: 0 };

  componentDidMount() {
    this.generateRandom();
    this.generateRandom();
    document.addEventListener("keyup", this.handleKeyUp);
  }

  generateRandom = () => {
    const tempPieces = this.state.pieces;
    const blankPieces = tempPieces.filter((piece) => piece.value === 0);
    const blankPiece = Math.floor(Math.random() * blankPieces.length);
    tempPieces[blankPiece].value = 2;
    this.setState({ pieces: tempPieces });
  };

  handleRow = (type, isFirst) => {
    const tempPieces = this.state.pieces;

    for (let i = 0; i < 16; i += 4) {
      let one = tempPieces[i].value;
      let two = tempPieces[i + 1].value;
      let three = tempPieces[i + 2].value;
      let four = tempPieces[i + 3].value;
      const row = [one, two, three, four];
      let filteredRow = row.filter((num) => num);
      let missing = Array(4 - filteredRow.length).fill(0);

      let newRow = [];

      switch (type) {
        case "Right":
          newRow = missing.concat(filteredRow);
          break;
        case "Left":
          newRow = filteredRow.concat(missing);
          break;

        default:
          break;
      }

      tempPieces[i].value = newRow[0];
      tempPieces[i + 1].value = newRow[1];
      tempPieces[i + 2].value = newRow[2];
      tempPieces[i + 3].value = newRow[3];

      this.setState({ pieces: tempPieces });

      if (isFirst) this.combineNumbers([i, i + 1, i + 2, i + 3], type);
    }
  };

  handleColumn = (type, isFirst) => {
    const tempPieces = this.state.pieces;
    for (let i = 0; i < 4; i++) {
      let one = tempPieces[i].value;
      let two = tempPieces[i + 4 * 1].value;
      let three = tempPieces[i + 4 * 2].value;
      let four = tempPieces[i + 4 * 3].value;
      const column = [one, two, three, four];
      let filteredRow = column.filter((num) => num);
      let missing = Array(4 - filteredRow.length).fill(0);

      let newRow = [];

      switch (type) {
        case "Down":
          newRow = missing.concat(filteredRow);
          break;
        case "Up":
          newRow = filteredRow.concat(missing);
          break;

        default:
          break;
      }

      tempPieces[i].value = newRow[0];
      tempPieces[i + 4 * 1].value = newRow[1];
      tempPieces[i + 4 * 2].value = newRow[2];
      tempPieces[i + 4 * 3].value = newRow[3];

      this.setState({ pieces: tempPieces });

      if (isFirst)
        this.combineNumbers([i, i + 4 * 1, i + 4 * 2, i + 4 * 3], type);
    }
  };

  combineNumbers = (arr, type) => {
    let x, y;

    let { pieces: gameArray, points } = this.state;

    switch (type) {
      case "Right":
      case "Down":
        x = 0;
        y = 1;

        for (let i = 3; i >= 0; i--) {
          if (
            gameArray[arr[i + x]].value === gameArray[arr[i + y]]?.value &&
            gameArray[arr[i + x]].value !== 0
          ) {
            const newNumber =
              gameArray[arr[i + x]].value + gameArray[arr[i + y]].value;
            gameArray[arr[i + y]].value = newNumber;

            points += gameArray[arr[i + x]].value;
            gameArray[arr[i + x]].value = 0;

            if (type === "Right") this.handleRow(type, false);
            else this.handleColumn(type, false);
          }
        }
        break;
      case "Left":
      case "Up":
        x = 1;
        y = 0;
        for (let i = 0; i < 3; i++) {
          if (
            gameArray[arr[i + x]].value === gameArray[arr[i + y]].value &&
            gameArray[arr[i + x]].value !== 0
          ) {
            const newNumber =
              gameArray[arr[i + x]].value + gameArray[arr[i + y]].value;
            gameArray[arr[i + y]].value = newNumber;
            points += gameArray[arr[i + x]].value;
            gameArray[arr[i + x]].value = 0;

            if (type === "Left") this.handleRow(type, false);
            else this.handleColumn(type, false);
          }
        }
        break;

      default:
        break;
    }
    this.setState({ pieces: gameArray, points: points });
  };

  handleKeyUp = (event) => {
    switch (event.key) {
      case "ArrowRight":
        this.handleRow("Right", true);
        this.generateRandom();
        break;
      case "ArrowLeft":
        this.handleRow("Left", true);
        this.generateRandom();
        break;
      case "ArrowDown":
        this.handleColumn("Down", true);
        this.generateRandom();
        break;
      case "ArrowUp":
        this.handleColumn("Up", true);
        this.generateRandom();
        break;
      default:
        break;
    }
  };

  pickColor = (num) => {
    switch (num) {
      case 2:
        return "#B0BEC5";
      case 4:
        return "#FFCCBC";
      case 8:
        return "#FFAB91";
      case 16:
        return "#FFD54F";
      case 32:
        return "#A5D6A7";
      case 64:
        return "#4FC3F7";
      case 128:
        return "#7986CB";
      case 256:
        return "#EF9A9A";
      case 512:
        return "#B2FF59";
      case 1024:
        return "#F3E5F5";
      case 2048:
        return "#9575CD";
      default:
        break;
    }
  };

  render() {
    return (
      <>
        <div className="score">{`Score : ${this.state.points}`}</div>
        <div className="grid">
          {this.state.pieces.map((piece, index) => (
            <div
              style={{ backgroundColor: this.pickColor(piece.value) }}
              className="piece"
              key={index}
            >
              {piece.value || ""}
            </div>
          ))}
        </div>
      </>
    );
  }
}

export default GameBoard;
