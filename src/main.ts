const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const determineSelection = () => {
  if (!mark.checked) {
    player = "X";
    computer = "O";
    selectionElem.setAttribute("hidden", "");
    return;
  }

  player = "O";
  computer = "X";
  selectionElem.setAttribute("hidden", "");
};

const stopInterval = () => {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
};

const gameElem = document.getElementById("game") as HTMLElement;
const gameVerdict = gameElem.previousElementSibling as HTMLElement;
const selectionElem = gameElem.querySelector("#selection") as HTMLElement;
const mark = selectionElem.querySelector("#mark") as HTMLInputElement;
const playAgainElem = document.getElementById("playAgain") as HTMLButtonElement;
const timebar = document.getElementById("timebar") as HTMLElement;

let player = "";
let computer = "";
const totalTimeSeconds = 3;
const updateIntervalMs = 10;
let timeLeft = totalTimeSeconds;
let timerInterval: ReturnType<typeof setInterval> | null = null;
let eventsDisabled = false;
const board = [
  ["", "", ""],
  ["", "", ""],
  ["", "", ""],
];
const winningConditions = [
  // Rows
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  // Columns
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  // Diagonals
  [0, 4, 8],
  [2, 4, 6],
];

gameElem.addEventListener("click", performAction);
playAgainElem.addEventListener("click", replay);

function performAction(e: PointerEvent) {
  if (!(e.target instanceof HTMLButtonElement)) return;
  if (eventsDisabled) return;

  stopInterval();
  timeLeft = totalTimeSeconds;
  const target = e.target;
  if (target.id !== "startGame") target.disabled = true;
  if (target.id === "startGame") {
    determineSelection();
    if (player === "O") computerTurn();
    timerInterval = setInterval(limitedTimeAction, updateIntervalMs);
    return;
  }

  const targetedRow = Number(target.dataset.row);
  const targetedCol = Number(target.dataset.col);
  if (board[targetedRow][targetedCol] === "") playerTurn(target, targetedRow, targetedCol);
  else return;
  computerTurn();
  timerInterval = setInterval(limitedTimeAction, updateIntervalMs);
  checkForMatch();
}

async function verdict(outcome: string) {
  stopInterval();
  eventsDisabled = true;

  if (outcome === "Player Wins") {
    gameVerdict.textContent = "Player Wins!";
    gameVerdict.style.visibility = "visible";
  } else if (outcome === "Computer Wins") {
    gameVerdict.textContent = "Computer Wins!";
    gameVerdict.style.visibility = "visible";
  } else {
    gameVerdict.textContent = "Draw!";
    gameVerdict.style.visibility = "visible";
  }

  playAgainElem.removeAttribute("hidden");
}

function checkForMatch() {
  const flatBoard = board.flat();

  for (const winningCondition of winningConditions) {
    const [a, b, c] = winningCondition;
    if (flatBoard[a] === player && flatBoard[b] === player && flatBoard[c] === player) {
      verdict("Player Wins");
      return;
    } else if (flatBoard[a] === computer && flatBoard[b] === computer && flatBoard[c] === computer) {
      verdict("Computer Wins");
      return;
    }
  }

  if (flatBoard.every((cell) => cell !== "")) verdict("Draw");
}

function playerTurn(btnElem: HTMLButtonElement, r: number, c: number) {
  board[r][c] = player;
  btnElem.disabled = true;
  player === "X" ? (btnElem.style.color = "crimson") : (btnElem.style.color = "blue");
  btnElem.textContent = player;
}

function computerTurn() {
  if (board[0].every((s) => s !== "") && board[1].every((s) => s !== "") && board[2].every((s) => s !== "")) return;

  while (true) {
    const randomRow = Math.floor(Math.random() * 3);
    const randomSpot = Math.floor(Math.random() * 3);

    if (board[randomRow][randomSpot] === "") {
      board[randomRow][randomSpot] = computer;
      const btnElem = document.querySelector(`[data-row="${randomRow}"][data-col="${randomSpot}"]`) as HTMLButtonElement;
      btnElem.disabled = true;
      computer === "X" ? (btnElem.style.color = "crimson") : (btnElem.style.color = "blue");
      btnElem.textContent = computer;
      break;
    }
    continue;
  }
}

async function limitedTimeAction() {
  timeLeft -= updateIntervalMs / 1000;
  const widthPercentage = (timeLeft / totalTimeSeconds) * 100;

  if (timeLeft <= 0) {
    timebar.style.width = widthPercentage + "%";
    stopInterval();
    eventsDisabled = true;
    await sleep(300);
    computerTurn();
    if (!timerInterval && !eventsDisabled) return;
    timerInterval = setInterval(limitedTimeAction, updateIntervalMs);
    checkForMatch();
    timebar.style.width = "100%";
    timeLeft = totalTimeSeconds;
    await sleep(300);
    eventsDisabled = false;
    return;
  }

  timebar.style.width = widthPercentage + "%";
}

function replay() {
  stopInterval();
  player = "";
  computer = "";
  timeLeft = totalTimeSeconds;

  for (const innerArray of board) {
    for (let i = 0; i < innerArray.length; ++i) {
      innerArray[i] = "";
    }
  }

  const cells = gameElem.querySelectorAll(".cell") as NodeListOf<HTMLButtonElement>;
  cells.forEach((cell) => {
    cell.textContent = "";
    cell.disabled = false;
    cell.style.color = "";
  });

  timebar.style.width = "100%";
  gameVerdict.textContent = "";
  gameVerdict.style.visibility = "hidden";
  playAgainElem.setAttribute("hidden", "");
  selectionElem.removeAttribute("hidden");
  eventsDisabled = false;
}
