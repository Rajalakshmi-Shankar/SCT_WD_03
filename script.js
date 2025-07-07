const board = document.getElementById("board");
const status = document.getElementById("status");
const restartBtn = document.getElementById("restart");
const themeToggle = document.getElementById("themeToggle");
const timerDisplay = document.getElementById("timer");
const moveCounter = document.getElementById("moveCounter");
const modeDisplay = document.getElementById("mode");

let cells = Array(9).fill(null);
let currentPlayer = "X"; // Player is X, Computer is O
let gameOver = false;
let timer = 300;
let interval = null;
let moves = 0;

function createBoard() {
  board.innerHTML = "";
  cells.forEach((_, index) => {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.dataset.index = index;
    cell.addEventListener("click", handleClick);
    board.appendChild(cell);
  });
}

function handleClick(e) {
  const index = e.target.dataset.index;
  if (cells[index] || gameOver || currentPlayer !== "X") return;

  makeMove(index, "X");
  if (!gameOver) {
    setTimeout(() => computerMove(), 500); // delay for better UX
  }
}

function makeMove(index, player) {
  if (cells[index] || gameOver) return;
  const cell = document.querySelector(`.cell[data-index="${index}"]`);
  cells[index] = player;
  cell.textContent = player;
  cell.classList.add(player.toLowerCase());
  moves++;
  moveCounter.textContent = `Moves: ${moves}`;

  if (checkWinner(player)) {
    status.textContent = `🎉 Player ${player} wins!`;
    gameOver = true;
    clearInterval(interval);
    return;
  }

  if (cells.every(cell => cell)) {
    status.textContent = "🤝 It's a Tie!";
    gameOver = true;
    clearInterval(interval);
    return;
  }

  currentPlayer = player === "X" ? "O" : "X";
  status.textContent = `Player ${currentPlayer}'s turn`;
}

function computerMove() {
  if (gameOver) return;
  let emptyIndices = cells.map((val, i) => val === null ? i : null).filter(i => i !== null);
  if (emptyIndices.length === 0) return;

  // Simple AI: random valid move
  const index = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
  makeMove(index, "O");
}

function checkWinner(player) {
  const winPatterns = [
    [0,1,2], [3,4,5], [6,7,8],
    [0,3,6], [1,4,7], [2,5,8],
    [0,4,8], [2,4,6]
  ];

  return winPatterns.some(pattern => {
    const [a, b, c] = pattern;
    if (cells[a] === player && cells[b] === player && cells[c] === player) {
      pattern.forEach(i => {
        document.querySelector(`.cell[data-index="${i}"]`).style.backgroundColor = "#00b894";
      });
      return true;
    }
    return false;
  });
}

function restartGame() {
  cells = Array(9).fill(null);
  currentPlayer = "X";
  gameOver = false;
  moves = 0;
  moveCounter.textContent = "Moves: 0";
  status.textContent = "Player X's turn";
  createBoard();
  resetTimer();
}

function resetTimer() {
  clearInterval(interval);
  timer = 300;
  timerDisplay.textContent = `⏳ Time Left: ${timer}s`;
  interval = setInterval(() => {
    timer--;
    timerDisplay.textContent = `⏳ Time Left: ${timer}s`;
    if (timer <= 0) {
      clearInterval(interval);
      gameOver = true;
      status.textContent = "⏰ Game Over: Time's up!";
    }
  }, 1000);
}

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light");
});

restartBtn.addEventListener("click", restartGame);

createBoard();
resetTimer();
