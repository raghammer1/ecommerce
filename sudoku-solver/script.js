let numSelected = null;
var tileSelected = null;

var newGame = function () {
  setGame();
};

let board = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
];

window.onload = newGame;

function setGame() {
  for (let i = 0; i < 9; i++) {
    let number = document.createElement('div');
    number.id = i + 1;
    number.innerText = i + 1;
    number.classList.add('number');
    document.getElementById('digits').appendChild(number);
    number.addEventListener('click', selectNumber);
  }
  let number = document.createElement('div');
  number.id = 10;
  number.innerText = 'E';
  number.classList.add('number');
  document.getElementById('digits').appendChild(number);
  number.addEventListener('click', selectNumber);
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      let tile = document.createElement('div');
      tile.id = i.toString() + '-' + j.toString();
      tile.addEventListener('click', selectTile);
      if (i == 2 || i == 5) tile.classList.add('horizontal-border');
      if (j == 2 || j == 5) tile.classList.add('vertical-border');
      tile.classList.add('tile');
      if (board[i][j] != 0) {
        tile.innerText = board[i][j].toString();
        tile.classList.add('tile-selected');
      } else {
        tile.classList.add('make-thin');
      }
      document.getElementById('board').appendChild(tile);
    }
  }
  document.getElementById('solve').addEventListener('click', solve);
  document.getElementById('reset').addEventListener('click', function () {
    reload = location.reload();
  });
  document.getElementById('rules').addEventListener('click', function () {
    openModal();
  });
  document.getElementById('close-btn').addEventListener('click', closeModal);
  document.getElementById('over').addEventListener('click', closeModal);
  document.addEventListener('keydown', function (e) {
    if (
      e.key === 'Escape' &&
      !document.getElementById('mod').classList.contains('hidden')
    ) {
      closeModal();
    }
    if (
      e.key === 'r' &&
      document.getElementById('mod').classList.contains('hidden')
    ) {
      openModal();
    } else if (
      e.key === 'r' &&
      !document.getElementById('mod').classList.contains('hidden')
    ) {
      closeModal();
    }
    if (e.key === 'h') {
      hinted();
    }
  });
}

const closeModal = function () {
  document.getElementById('mod').classList.add('hidden');
  document.getElementById('over').classList.add('hidden');
};

const openModal = function () {
  document.getElementById('mod').classList.remove('hidden');
  document.getElementById('over').classList.remove('hidden');
};

function solve() {
  let row = 9;
  let col = 9;
  var sudoku = new Array(row);
  for (var i = 0; i < sudoku.length; i++) {
    sudoku[i] = new Array(col);
  }
  const childrens = document.getElementById('board').childNodes;
  for (let children of childrens) {
    let coords = children.id.split('-');
    let r = parseInt(coords[0]);
    let c = parseInt(coords[1]);
    if (children.innerText != '') {
      sudoku[r][c] = parseInt(children.innerText);
    } else {
      sudoku[r][c] = 0;
    }
  }
  main(sudoku);
  for (let children of childrens) {
    let coords = children.id.split('-');
    let r = parseInt(coords[0]);
    let c = parseInt(coords[1]);
    children.innerText = sudoku[r][c];
  }
  document.getElementById('digits').innerHTML = '';
}

function main(sudoku) {
  // checks if the sudoku given by the user is valid or not
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (sudoku[i][j] !== 0) {
        for (let k = 0; k < 9; k++) {
          if (sudoku[i][k] === sudoku[i][j]) {
            if (k !== j) {
              alert(
                'Number are given in the same row hence it is not possible to solve this sudoku'
              );
              return sudoku;
            }
          } else if (sudoku[k][j] === sudoku[i][j]) {
            if (k !== i) {
              alert(
                'Number are given in the same column hence it is not possible to solve this sudoku'
              );
              return sudoku;
            }
          }
        }
        let a = 3 * Math.floor(i / 3);
        let a_sub = a + 3;

        while (a < a_sub) {
          let b = 3 * Math.floor(j / 3);
          let b_sub = b + 3;
          while (b < b_sub) {
            console.log(a, b);
            if (sudoku[a][b] === sudoku[i][j] && a !== i && b !== j) {
              alert(
                'Number are given in the same box hence it is not possible to solve this sudoku'
              );
              return sudoku;
            }
            b += 1;
          }
          a += 1;
        }
      }
    }
  }

  // Now when verfied that the given sudoku is correct then we can start and try to find a possible solution for the given sudoku
  if (solver(sudoku, 0, 0)) {
    return sudoku;
  } else {
    alert('NO POSSIBLE SOLUTION FOR THE GIVEN SUDOKU PATTERN');
  }
}

function solver(sudoku, row, col) {
  if (row == 8 && col == 9) {
    return true;
  }
  if (col === 9) {
    col = 0;
    row++;
  }
  if (sudoku[row][col] > 0) {
    return solver(sudoku, row, col + 1);
  }
  for (let num = 1; num < 10; num++) {
    // console.log(num);
    if (checker(sudoku, row, col, num)) {
      sudoku[row][col] = num;
      if (solver(sudoku, row, col + 1)) {
        return true;
      }
    }
    sudoku[row][col] = 0;
  }
  return false;
}

function checker(sudoku, row, col, num) {
  if (
    unusedInColumn(num, sudoku, col) == false ||
    unusedInRow(num, sudoku, row) == false
  ) {
    return false;
  }
  row = row - (row % 3);
  col = col - (col % 3);
  return boxChecker(sudoku, row, col, num);
}

function unusedInColumn(num, sudoku, col) {
  for (let i = 0; i < 9; i++) {
    if (sudoku[i][col] === num) {
      return false;
    }
  }
}

function unusedInRow(num, sudoku, row) {
  for (let i = 0; i < 9; i++) {
    if (sudoku[row][i] === num) {
      return false;
    }
  }
}

function boxChecker(sudoku, row, col, num) {
  for (let i = row; i < row + 3; i++) {
    for (let j = col; j < col + 3; j++) {
      if (sudoku[i][j] === num) {
        return false;
      }
    }
  }
  return true;
}

function selectTile() {
  let coords = this.id.split('-');
  let hi = this;
  let r = parseInt(coords[0]);
  let c = parseInt(coords[1]);
  console.log(numSelected);
  if (numSelected.id == 10) {
    this.innerText = '';
    this.classList.remove('grey-back');
  } else if (numSelected != null) {
    this.innerText = numSelected.innerText;
    this.classList.add('grey-back');
  }
}

function selectNumber() {
  if (numSelected != null) {
    numSelected.classList.remove('number-selected');
  }
  numSelected = this;
  this.classList.add('number-selected');
}
