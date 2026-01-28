// Budhi Chal (Three Men's Morris-like) implementation
// Author: prepared for repository integration

// Board points layout (9 points):
// Coordinates are percent positions inside the board container (x%, y%).
// Indexing:
// 0 1 2
// 3 4 5
// 6 7 8
const POINTS = [
  {id:0, x:0,   y:0},   // top-left (corner)
  {id:1, x:50,  y:0},   // top-center
  {id:2, x:100, y:0},   // top-right
  {id:3, x:0,   y:50},  // mid-left
  {id:4, x:50,  y:50},  // center
  {id:5, x:100, y:50},  // mid-right
  {id:6, x:0,   y:100}, // bottom-left
  {id:7, x:50,  y:100}, // bottom-center
  {id:8, x:100, y:100}  // bottom-right
];

// Adjacency: allowed moves along the lines drawn on board.
// Each index maps to a set of indices you can move to (adjacent).
const ADJ = {
  0:[1,3,4],   // corner connects to top-center, mid-left, center (diagonal)
  1:[0,2,4],
  2:[1,5,4],
  3:[0,4,6],
  4:[0,1,2,3,5,6,7,8], // center connects to all (the star lines)
  5:[2,4,8],
  6:[3,4,7],
  7:[6,8,4],
  8:[5,7,4]
};

// Lines that constitute a "three in a row" (winning sets)
const LINES = [
  [0,1,2],[3,4,5],[6,7,8], // rows
  [0,3,6],[1,4,7],[2,5,8], // cols
  [0,4,8],[2,4,6]          // diagonals
];

const boardEl = document.getElementById('board');
const statusEl = document.getElementById('status');
const restartBtn = document.getElementById('restart');

let state = {
  // 0 = empty, 1 = player1, 2 = player2
  cells: Array(9).fill(0),
  turn: 1,
  phase: 'placement', // 'placement' or 'movement'
  placed: {1:0, 2:0},
  selectedFrom: null,
  gameOver: false
};

function renderBoard(){
  boardEl.innerHTML = '';

  // SVG lines to draw the board (simple lines connecting points)
  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS,'svg');
  svg.setAttribute('viewBox','0 0 100 100');
  svg.setAttribute('preserveAspectRatio','none');

  // draw rectangle outer (not necessary) and lines:
  // grid vertical/horizontal
  svg.appendChild(line(0,0,100,0));
  svg.appendChild(line(0,50,100,50));
  svg.appendChild(line(0,100,100,100));
  svg.appendChild(line(0,0,0,100));
  svg.appendChild(line(50,0,50,100));
  svg.appendChild(line(100,0,100,100));
  // diagonals to center
  svg.appendChild(line(0,0,50,50));
  svg.appendChild(line(100,0,50,50));
  svg.appendChild(line(0,100,50,50));
  svg.appendChild(line(100,100,50,50));
  boardEl.appendChild(svg);

  // points
  POINTS.forEach(p=>{
    const point = document.createElement('button');
    point.className = 'point';
    point.style.left = p.x + '%';
    point.style.top  = p.y + '%';
    point.setAttribute('data-id', p.id);
    point.setAttribute('aria-label', 'Point ' + p.id);
    point.setAttribute('title', 'Point ' + p.id);

    // piece inside
    const piece = document.createElement('span');
    piece.className = 'piece';

    const value = state.cells[p.id];
    if(value === 1){
      point.classList.add('p1');
      piece.classList.add('p1');
    } else if(value === 2){
      point.classList.add('p2');
      piece.classList.add('p2');
    } else {
      point.classList.add('empty');
    }

    // clickable logic
    if(state.gameOver){
      point.classList.add('disabled');
    } else if(state.phase === 'placement'){
      if(value === 0){
        point.classList.add('selectable');
      } else {
        point.classList.add('disabled');
      }
    } else { // movement
      if(state.selectedFrom == null){
        // allow selecting a piece of current player to move
        if(value === state.turn){
          point.classList.add('selectable');
        } else {
          point.classList.add('disabled');
        }
      } else {
        // we have a selected piece, allow choosing adjacent empty points as destination
        const from = state.selectedFrom;
        if(value === 0 && ADJ[from].includes(p.id)){
          point.classList.add('selectable');
        } else {
          point.classList.add('disabled');
        }
      }
    }

    point.appendChild(piece);
    point.addEventListener('click', onPointClick);
    boardEl.appendChild(point);
  });

  updateStatus();
}

function line(x1,y1,x2,y2){
  const svgNS = "http://www.w3.org/2000/svg";
  const l = document.createElementNS(svgNS,'line');
  l.setAttribute('x1', x1);
  l.setAttribute('y1', y1);
  l.setAttribute('x2', x2);
  l.setAttribute('y2', y2);
  l.setAttribute('stroke', '#777');
  l.setAttribute('stroke-width', '0.6');
  l.setAttribute('stroke-linecap', 'round');
  return l;
}

function onPointClick(e){
  if(state.gameOver) return;
  const id = Number(this.getAttribute('data-id'));
  if(state.phase === 'placement'){
    handlePlacement(id);
  } else {
    handleMovementClick(id);
  }
  renderBoard();
}

function handlePlacement(id){
  if(state.cells[id] !== 0) return;
  state.cells[id] = state.turn;
  state.placed[state.turn] += 1;

  if(checkWin(state.turn)){
    state.gameOver = true;
    statusEl.textContent = `Player ${state.turn} wins!`;
    return;
  }

  // switch turn
  if(state.placed[1] >= 3 && state.placed[2] >= 3){
    state.phase = 'movement';
  } else {
    state.turn = state.turn === 1 ? 2 : 1;
  }
}

function handleMovementClick(id){
  if(state.selectedFrom == null){
    // select a piece to move
    if(state.cells[id] === state.turn){
      state.selectedFrom = id;
    }
  } else {
    // try to move from selectedFrom to id
    const from = state.selectedFrom;
    const to = id;
    if(state.cells[to] === 0 && ADJ[from].includes(to)){ 
      state.cells[to] = state.cells[from];
      state.cells[from] = 0;
      state.selectedFrom = null;

      if(checkWin(state.turn)){
        state.gameOver = true;
        statusEl.textContent = `Player ${state.turn} wins!`;
        return;
      }

      // switch turn
      state.turn = state.turn === 1 ? 2 : 1;
    } else {
      // invalid move: deselect or ignore
      state.selectedFrom = null;
    }
  }
}

function checkWin(player){
  return LINES.some(line => line.every(i => state.cells[i] === player));
}

function updateStatus(){
  if(state.gameOver) return;
  if(state.phase === 'placement'){
    statusEl.textContent = `Turn: Player ${state.turn} (${state.turn === 1 ? '●' : '○'}) — Placement phase (${state.placed[1]}/3 vs ${state.placed[2]}/3)`;
  } else {
    statusEl.textContent = `Turn: Player ${state.turn} (${state.turn === 1 ? '●' : '○'}) — Movement phase`;
  }
}

restartBtn.addEventListener('click', ()=>{
  state.cells = Array(9).fill(0);
  state.turn = 1;
  state.phase = 'placement';
  state.placed = {1:0,2:0};
  state.selectedFrom = null;
  state.gameOver = false;
  updateStatus();
  renderBoard();
});

// initial render
renderBoard();