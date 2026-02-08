const determineSelection = (selectedChoice: string) => {
  if (selectedChoice === "selectedX") {
    player = "X";
    computer = "O";
    selectionElem.setAttribute("hidden", "");
    return;
  }

  player = "O";
  computer = "X";
  selectionElem.setAttribute("hidden", "");
};

const gameElem = document.getElementById("game") as HTMLElement;
const currentTurnElem = gameElem?.previousElementSibling as HTMLElement;
const selectionElem = gameElem.lastElementChild as HTMLElement;
const timebar = document.getElementById("timebar") as HTMLElement;

let player = "";
let computer = "";
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

function performAction(e: PointerEvent) {
  if (!(e.target instanceof HTMLButtonElement)) return;
  const target = e.target;
  target.disabled = true;
  if (target.id === "selectedX" || target.id === "selectedO") {
    determineSelection(target.id);
    if (player === "O") computerTurn();
    return;
  }

  const targetedRow = Number(target.dataset.row);
  const targetedCol = Number(target.dataset.col);
  if (board[targetedRow][targetedCol] === "") playerTurn(target, targetedRow, targetedCol);
  else return;
  computerTurn();
  checkForMatch();
}

function verdict(outcome: string) {
  console.log(outcome);
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

  if (board[0].every((s) => s !== "") && board[1].every((s) => s !== "") && board[2].some((s) => s !== "")) verdict("Draw");
}

function playerTurn(btnElem: HTMLButtonElement, r: number, c: number) {
  board[r][c] = player;
  btnElem.disabled = true;
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
      btnElem.textContent = computer;
      break;
    }
    continue;
  }
}
