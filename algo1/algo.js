// Create a 2D grid
function createGrid(rows, cols) {
    const grid = new Array(rows);
    for (let i = 0; i < rows; i++) {
      grid[i] = new Array(cols).fill(0);
    }
    return grid;
  }
  
  // Calculate Manhattan distance heuristic
  function manhattanDistance(start, end) {
    const dx = Math.abs(start[0] - end[0]);
    const dy = Math.abs(start[1] - end[1]);
    return dx + dy;
  }
  
  // A* algorithm
  function aStar(grid, start, end) {
    const rows = grid.length;
    const cols = grid[0].length;
    const openSet = new Set();
    const closedSet = new Set();
    const cameFrom = {};
  
    const gScore = createGrid(rows, cols, Infinity);
    const fScore = createGrid(rows, cols, Infinity);
    gScore[start[0]][start[1]] = 0;
    fScore[start[0]][start[1]] = manhattanDistance(start, end);
  
    const getNeighbors = ([x, y]) => {
      const neighbors = [];
      if (x > 0 && grid[x - 1][y] !== 1) neighbors.push([x - 1, y]);
      if (x < rows - 1 && grid[x + 1][y] !== 1) neighbors.push([x + 1, y]);
      if (y > 0 && grid[x][y - 1] !== 1) neighbors.push([x, y - 1]);
      if (y < cols - 1 && grid[x][y + 1] !== 1) neighbors.push([x, y + 1]);
      return neighbors;
    };
  
    while (openSet.size > 0) {
      let current;
      let currentFScore = Infinity;
  
      // Find the node in the open set with the lowest fScore
      for (const node of openSet) {
        if (fScore[node[0]][node[1]] < currentFScore) {
          current = node;
          currentFScore = fScore[node[0]][node[1]];
        }
      }
  
      if (current[0] === end[0] && current[1] === end[1]) {
        // Reached the goal
        const path = [current];
        while (cameFrom[current]) {
          current = cameFrom[current];
          path.unshift(current);
        }
        return path;
      }
  
      openSet.delete(current);
      closedSet.add(current);
  
      const neighbors = getNeighbors(current);
      for (const neighbor of neighbors) {
        if (closedSet.has(neighbor)) continue;
  
        const tentativeGScore = gScore[current[0]][current[1]] + 1;
        if (!openSet.has(neighbor)) openSet.add(neighbor);
        else if (tentativeGScore >= gScore[neighbor[0]][neighbor[1]]) continue;
  
        cameFrom[neighbor] = current;
        gScore[neighbor[0]][neighbor[1]] = tentativeGScore;
        fScore[neighbor[0]][neighbor[1]] =
          tentativeGScore + manhattanDistance(neighbor, end);
      }
    }
  
    return []; // No path found
  }
  
  // Interactive grid creation and pathfinding
  function createInteractiveGrid() {
    const rows = parseInt(prompt
  ('Enter the number of rows:'));
  const cols = parseInt(prompt('Enter the number of columns:'));
  
  const grid = createGrid(rows, cols);
  const start = [0, 0];
  const end = [rows - 1, cols - 1];
  
  const container = document.createElement('div');
  container.style.display = 'grid';
  container.style.gridTemplateColumns = 'repeat(${cols}, 1fr)';
  container.style.width = '400px';
  container.style.margin = '20px auto';
  
  for (let i = 0; i < rows; i++) {
  for (let j = 0; j < cols; j++) {
  const cell = document.createElement('div');
  cell.style.border = '1px solid #ccc';
  cell.style.width = '40px';
  cell.style.height = '40px';
  cell.dataset.row = i;
  cell.dataset.col = j;
  
    cell.addEventListener('click', () => {
      const row = parseInt(cell.dataset.row);
      const col = parseInt(cell.dataset.col);
      if (grid[row][col] === 0) {
        grid[row][col] = 1;
        cell.style.background = '#000';
      } else {
        grid[row][col] = 0;
        cell.style.background = '';
      }
    });
  
    container.appendChild(cell);
  }
  }
  
  const pathButton = document.createElement('button');
  pathButton.textContent = 'Find Path';
  pathButton.style.width = '100px';
  pathButton.style.margin = '20px auto';
  pathButton.addEventListener('click', () => {
  const path = aStar(grid, start, end);
  if (path.length === 0) {
  alert('No path found!');
  } else {
  for (const [row, col] of path) {
  const cell = container.querySelector('[data-row="${row}"][data-col="${col}"]');
  cell.style.background = 'yellow';
  }
  }
  });
  
  const startButton = document.createElement('button');
  startButton.textContent = 'Select Start';
  startButton.style.width = '100px';
  startButton.style.margin = '20px auto';
  startButton.addEventListener('click', () => {
  container.addEventListener('click', (e) => {
  const cell = e.target;
  const row = parseInt(cell.dataset.row);
  const col = parseInt(cell.dataset.col);
  start[0] = row;
  start[1] = col;
  cell.style.background = 'green';
  });
  });
  
  const endButton = document.createElement('button');
  endButton.textContent = 'Select End';
  endButton.style.width = '100px';
  endButton.style.margin = '20px auto';
  endButton.addEventListener('click', () => {
  container.addEventListener('click', (e) => {
  const cell = e.target;
  const row = parseInt(cell.dataset.row);
  const col = parseInt(cell.dataset.col);
  end[0] = row;
  end[1] = col;
  cell.style.background = 'red';
  });
  });
  
  document.body.appendChild(container);
  document.body.appendChild(startButton);
  document.body.appendChild(endButton);
  document.body.appendChild(pathButton);
  }
  
  createInteractiveGrid();