import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function searchAlignedSquares(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return lines[i];
    }
  }
  return null;
}

function isDraw(squares) {
  return squares.indexOf(null) === -1;
}

function Square(props) {
  return (
    <button className={`square ${props.isAligned ? 'hilight' : ''}`} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        isAligned={this.props.alignedSquares && this.props.alignedSquares.indexOf(i) >= 0}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    const rows = [];

    for (let y = 0; y < 3; y++) {
      const row = [];

      for (let x = 0; x < 3; x++) {
        row.push(this.renderSquare(x + (y * 3)));
      }
      rows.push(<div className="board-row">{row}</div>);
    }

    return <div>{rows}</div>;
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      isDescSort: false,
      xIsNext: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if (searchAlignedSquares(squares) || isDraw(squares) || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O';

    this.setState({
      history: history.concat([{
        squares,
        moveTo: i,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2 === 0),
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const alignedSquares = searchAlignedSquares(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        `Go to move col:${(step.moveTo % 3) + 1} row:${Math.floor(step.moveTo / 3) + 1}` :
        'Go to game start';
      return (
        <li key={move} className={move === history.length - 1 ? 'current' : ''}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    if (this.state.isDescSort) {
      moves.reverse();
    }

    let status;

    if (alignedSquares) {
      status = `Winner: ${current.squares[alignedSquares[0]]}`;
    } else if (isDraw(current.squares)) {
      status = 'Draw';
    } else {
      status = `Next player: ${this.state.xIsNext ? 'X' : 'O'}`;
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board squares={current.squares} alignedSquares={alignedSquares} onClick={i => this.handleClick(i)} />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <div>
            <input type="radio" name="order" checked={this.state.isDescSort} onChange={() => this.setState({ isDescSort: true })} />DESC
            <input type="radio" name="order" checked={!this.state.isDescSort} onChange={() => this.setState({ isDescSort: false })} />ASC
          </div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root'),
);
