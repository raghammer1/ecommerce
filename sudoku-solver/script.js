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
}

function solve() {
  // let sudoku = [[], [], [], [], [], [], [], [], []];
  let row = 9;
  let col = 9;
  var sudoku = new Array(row);
  for (var i = 0; i < sudoku.length; i++) {
    sudoku[i] = new Array(col);
  }

  // i = 0;
  // let j = 0;
  const childrens = document.getElementById('board').childNodes;
  for (let children of childrens) {
    // if (i == 9) {
    //   i = 0;
    //   j++;
    // // }
    // if (children.innerText != '') {
    //   console.log(parseInt(children.innerText));
    // } else {
    //   console.log(0);
    // }
    // i++;
    let coords = children.id.split('-');
    let r = parseInt(coords[0]);
    let c = parseInt(coords[1]);
    if (children.innerText != '') {
      sudoku[r][c] = parseInt(children.innerText);
    } else {
      sudoku[r][c] = 0;
    }
    // if (children.innerText != '') {
    //   children.classList.add('grey-back');
    //   sudoku[j][i].push(parseInt(children.innerText));
    //   i++;
    // } else {
    //   sudoku[j][i].push(0);
    //   i++;
    // }
  }

  // console.log(sudoku);
  main(sudoku);
  // console.log(sudoku);
  // const childrens = document.getElementById('board').childNodes;
  for (let children of childrens) {
    // if (i == 9) {
    //   i = 0;
    //   j++;
    // // }
    // if (children.innerText != '') {
    //   console.log(parseInt(children.innerText));
    // } else {
    //   console.log(0);
    // }
    // i++;
    let coords = children.id.split('-');
    let r = parseInt(coords[0]);
    let c = parseInt(coords[1]);
    // if (children.innerText != '') {
    //   sudoku[r][c] = parseInt(children.innerText);
    // } else {
    //   sudoku[r][c] = 0;
    // }
    children.innerText = sudoku[r][c];
  }
  document.getElementById('digits').innerHTML = '';
}

function main(sudoku) {
  if (solver(sudoku, 0, 0)) {
    // console.log('DONE');
    return sudoku;
    // printed(sudoku, originalSudoku);
  } else {
    console.log('NO possible solutions');
    alert('NO POSSIBLE SOLUTION');
  }
}

function solver(sudoku, row, col) {
  if (row == 8 && col == 8) {
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
    // console.log(checker(sudoku, row, col, num));
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
  // console.log(row, col);
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
  document.addEventListener('keydown', function (e) {
    // console.log(e.key);
    if (e.key === '1') {
      hi.innerText = '1';
      return;
    } else if (e.key === '2') {
      hi.innerText = '2';
      return;
    } else if (e.key === '3') {
      hi.innerText = '3';
    } else if (e.key === '4') {
      hi.innerText = '4';
    } else if (e.key === '5') {
      hi.innerText = '5';
    } else if (e.key === '6') {
      hi.innerText = '6';
    } else if (e.key === '7') {
      hi.innerText = '7';
    } else if (e.key === '8') {
      hi.innerText = '8';
    } else if (e.key === '9') {
      hi.innerText = '9';
    }
  });
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
