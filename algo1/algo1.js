var refreshBtn = document.getElementById("refresh-btn");
  refreshBtn.addEventListener("click", function() {
    location.reload();
  });


var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var startBtn = document.getElementById("start-btn");
var heuristicSelect = document.getElementById("heuristic-select");

// Define the size of each cell in the grid
var cellSize = 30;

// Define the number of rows and columns in the grid
var numRows = 20;
var numCols = 20;

// Create a 2D array to store the grid cells
var grid = new Array(numRows);
for (var i = 0; i < numRows; i++) {
  grid[i] = new Array(numCols);
}

// Initialize the grid cells
for (var i = 0; i < numRows; i++) {
  for (var j = 0; j < numCols; j++) {
    grid[i][j] = {
      i: i,
      j: j,
      wall: false,
      start: false,
      end: false,
      visited: false,
      parent: null,
      g: Infinity,
      h: 0,
      f: Infinity
    };
  }
}

// Draw the grid on the canvas
function drawGrid() {
  for (var i = 0; i < numRows; i++) {
    for (var j = 0; j < numCols; j++) {
      var cell = grid[i][j];
      if (cell.wall) {
        fillCell(cell, "#000000");
      } else if (cell.start) {
        fillCell(cell, "#74C05A");
      } else if (cell.end) {
        fillCell(cell, "#800000");
      } else {
        fillCell(cell, "#dddbcb");
      }
    }
  }
}

// Fill a cell with a given color
function fillCell(cell, color) {
  ctx.fillStyle = color;
  ctx.fillRect(cell.j * cellSize, cell.i * cellSize, cellSize, cellSize);
}

// Add event listeners to the canvas to allow the user to place markers and walls
canvas.addEventListener("mousedown", function(event) {
  var cell = getCellFromEvent(event);
  if (cell) {
    if (event.ctrlKey || event.metaKey) {
      cell.wall = true;
    } else if (event.shiftKey) {
      setStartCell(cell);
    } else {
      setEndCell(cell);
    }
    drawGrid();
  }
});

// Get the grid cell corresponding to a mouse event
function getCellFromEvent(event) {
  var rect = canvas.getBoundingClientRect();
  var x = event.clientX - rect.left;
  var y = event.clientY - rect.top;
  var i = Math.floor(y / cellSize);
  var j = Math.floor(x / cellSize);
  if (i >= 0 && i < numRows && j >= 0 && j < numCols) {
    return grid[i][j];
  } else {
    return null;
  }
}

// Set the start cell
function setStartCell(cell) {
  if (!cell.wall && !cell.end) {
    var startCell = getStartCell();
    if (startCell) {
      startCell.start = false;
    }
    cell.start = true;
  }
}

// Set the end cell
function setEndCell(cell) {
  if (!cell.wall && !cell.start) {
    var endCell = getEndCell();
    if (endCell) {
      endCell.end = false;
    }
    cell.end = true;
  }
}

// Get the start cell
function getStartCell() {
  for (var i = 0; i < numRows; i++) {
    for (var j = 0; j < numCols; j++) {
      if (grid[i][j].start) {
        return grid[i][j];
      }
    }
  }
  return null;
}

// Get the end cell
function getEndCell() {
  for (var i = 0; i < numRows; i++) {
    for (var j = 0; j < numCols; j++) {
      if (grid[i][j].end) {
        return grid[i][j];
      }
    }
  }
  return null;
}

// Find the shortest path from the start cell to the end cell using A* algorithm
function findShortestPath() {
  var startCell = getStartCell();
  var endCell = getEndCell();
  if (!startCell || !endCell) {
    alert(" Are you stupid set the start and end markers.");
    return;
  }

  // Reset the cell properties
  for (var i = 0; i < numRows; i++) {
    for (var j = 0; j < numCols; j++) {
      grid[i][j].visited = false;
      grid[i][j].parent = null;
      grid[i][j].g = Infinity;
      grid[i][j].h = 0;
      grid[i][j].f = Infinity;
    }
  }

  // Initialize the start cell
  startCell.g = 0;
  startCell.h = heuristic(startCell, endCell);
  startCell.f = startCell.h;

  // Create a priority queue for the open set
  var openSet = new PriorityQueue();
  openSet.enqueue(startCell);

  // Search for the shortest path
  while (!openSet.isEmpty()) {
    var currentCell = openSet.dequeue();

    if (currentCell === endCell) {
      // Found the shortest path
      drawShortestPath();
      return;
    }

    currentCell.visited = true;

    // Check the neighbors of the current cell
    var neighbors = getNeighbors(currentCell);
    for (var i = 0; i < neighbors.length; i++) {
      var neighborCell = neighbors[i];

      if (!neighborCell.wall && !neighborCell.visited) {
        var tentativeG = currentCell.g + distance(currentCell, neighborCell);
        if (tentativeG < neighborCell.g) {
          neighborCell.parent = currentCell;
          neighborCell.g = tentativeG;
          neighborCell.h = heuristic(neighborCell, endCell);
          neighborCell.f = neighborCell.g + neighborCell.h;
          if (!openSet.contains(neighborCell)) {
            openSet.enqueue(neighborCell);
          }
        }
      }
    }
  }

  // Could not find a path
  alert(" Whey you made that Could not find a path from the start to the end.");
}

// Get the neighbors of a given cell
function getNeighbors(cell) {
  var neighbors = [];

  if (cell.i > 0) {
    neighbors.push(grid[cell.i - 1][cell.j]);
  }
  if (cell.i < numRows - 1) {
    neighbors.push(grid[cell.i + 1][cell.j]);
  }
  if (cell.j > 0) {
    neighbors.push(grid[cell.i][cell.j - 1]);
  }
  if (cell.j < numCols - 1) {
    neighbors.push(grid[cell.i][cell.j + 1]);
  }

  return neighbors;
}

// Calculate the distance between two cells
function distance(cell1, cell2) {
  if (heuristicSelect.value === "manhattan") {
    return Math.abs(cell1.i - cell2.i) + Math.abs(cell1.j - cell2.j);
  } else {
    return Math.sqrt(Math.pow(cell1.i - cell2.i, 2) + Math.pow(cell1.j - cell2.j, 2));
  }
}

// Calculate the heuristic value between two cells
function heuristic(cell1, cell2) {
  return distance(cell1, cell2);
}

// Draw the shortest path on the canvas
function drawShortestPath() {
  var endCell = getEndCell();
  var currentCell = endCell;
  while (currentCell.parent) {
    fillCell(currentCell, "#CDC827");
    currentCell = currentCell.parent;
  }
}

// Define a priority queue data structure for the A* algorithm
function PriorityQueue() {
  this.elements = [];

  this.enqueue = function(element) {
    var added = false;
    for (var i = 0; i < this.elements.length; i++) {
      if (element.f < this.elements[i].f) {
        this.elements.splice(i, 0, element);
        added = true;
        break;
      }
    }
    if (!added) {
      this.elements.push(element);
    }
  };

  this.dequeue = function() {
    return this.elements.shift();
  };

  this.contains = function(element) {
    return this.elements.indexOf(element) !== -1;
  };

  this.isEmpty = function() {
    return this.elements.length === 0;
  };
}

// Initialize the canvas and draw the grid
canvas.width = numCols * cellSize;
canvas.height = numRows * cellSize;
drawGrid();

// Add event listener to the start button to start the algorithm
startBtn.addEventListener("click", function() {
  findShortestPath();
});