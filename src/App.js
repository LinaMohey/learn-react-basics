import { useState } from 'react';

function Square({ value, onSquareClick, isWinningSquare }) {
  return (
    <button className={`square ${isWinningSquare ? 'winning' : ''}`} onClick={onSquareClick}>
      {value}
    </button>
  );
}

export default function Game() {  //this is place show the steps of game
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0)
  const currentSquares = history[currentMove];
  const [isAscending, setisAscending] = useState(true)

  console.log('history', history);
  console.log('current square/box', currentSquares);
  console.log(currentMove);


  function jumpTo(nextMove) {
    setCurrentMove(nextMove)
    setXIsNext(nextMove % 2 === 0);

  }

  const moves = history.map((squares, move) => {
    console.log('move', move);
    //awel 7aga mynf3sh eny azhrlo l button "jump to move kza we ana fl move de f lazm n3ml check"
    //3yza azhra gamb next player a7sn men list.
    if (move === currentMove) return null

    return (<li key={move}>

      <button onClick={() => jumpTo(move)}> Jump to move {move} </button>
    </li>)

  })
  if (!isAscending) {
    moves.reverse()
  }


  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
    setXIsNext(!xIsNext);
  }

  return (
    //we did tat so the game control everything inside the board & track history.
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} currentMove={currentMove} />
      </div>
      <div className="game-info">
        {/* solution task 3 */}
        <button onClick={() => setisAscending(!isAscending)}>toggle order</button>

        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function Board({ xIsNext, squares, onPlay, currentMove }) {


  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) { // to avoid toggling or using the same square if we have data in square return
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';

    } else {
      nextSquares[i] = '0';
    }
    onPlay(nextSquares);
  }

  const result = calculateWinner(squares);
  const winner = result?.winner
  const winnerLine = result?.winnerPosition
  console.log(winnerLine, 'lines');


  //Task 4 solution pt.2
  const isDraw = !winner && squares.every(Boolean)
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else if (isDraw) {
    status = 'Its a Draw!'
  } else {
    status = 'Player Turn: ' + (xIsNext ? 'X' : 'O') + ' --' + (`You are at move #${currentMove}`);
  }
  //Todo: I want to enhance this instead of you are at move 0 to say sth about starting the game 



  {/* problem here the repetiion and hardcoded squares */ }
  {/* <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div> */}

  {/* solution task 2 */ }
  {/* we need to loop through rows & columns so we need to arrays one for row and one for columns to make the board */ }
  const board = [];

  for (let row = 0; row < 3; row++) {
    const rowSquares = [];
    for (let col = 0; col < 3; col++) {
      const index = row * 3 + col;
      // da 3shan a3rf row 1 column kam msln 3yza row 1 col 2 el raqm feh kam? yb2a index 5 => index = row * 3 + col index = 1 * 3 + 2 = 5

      rowSquares.push(
        <Square key={index} value={squares[index]} isWinningSquare={winnerLine?.includes(index)}
          onSquareClick={() => handleClick(index)} />
      );
    }

    board.push(
      <div key={row} className="board-row">
        {rowSquares}
      </div>
    );
  }


  return (
    <>
      <div className="status">{status}</div>
      {board}
    </>
  )




}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], //rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8],//columns
    [0, 4, 8], [2, 4, 6] //diagonal.
  ]

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        winner: squares[a],
        winnerPosition: [a, b, c]
      }
    }
  }
  return null

}
