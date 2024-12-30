let area = document.getElementById("gameArea");
// area.style.height = '1rem';
// area.style.width = '1rem';
// area.style.backgroundColor = 'black';
let cellsize = 2;
let button = document.getElementById("startButton");
let collect = document.getElementById("collect");
let finalGrid = [];

for (let i = 0; i < 9; i++) {
  for (let j = 0; j < 9; j++) {
    let cell = document.createElement("div");
    cell.style.left = `${j * cellsize}rem`;
    cell.style.top = `${i * cellsize}rem`;
    cell.classList.add("cell");
    cell.contentEditable = true;
    cell.addEventListener("input", (event) => {
      let cellvalue = cell.innerText.trim();
      console.log(event);
      if (
        event.inputType !== "deleteContentBackward" &&
        event.inputType !== "deleteContentForward"
      ) {
        if (/^[1-9]$/.test(cellvalue)) {
          if (isDuplicate(i, j, cellvalue)) {
            cell.innerText = ""; // Clear invalid input
            alert("Duplicate Value in row / column / grid");
          } else {
            cell.style.borderColor = "black";
          }
        } else {
          cell.innerText = ""; // Clear invalid input
          alert("Only numbers from 1-9 are allowed");
        }
      }
    });
    area.appendChild(cell);
  }
}
//CheckDuplicate
isDuplicate = (row, column, value) => {
  //checkrow
  for (let j = 0; j < 9; j++) {
    if (area.children[9 * row + j].innerText === value && j !== column) {
      return true;
    }
  }

  //checkColumn

  for (let i = 0; i < 9; i++) {
    if (area.children[9 * i + column].innerText === value && i !== row) {
      return true;
    }
  }

  //checkmatrix

  let startRow = Math.floor(row / 3) * 3;
  let startColumn = Math.floor(column / 3) * 3;

  for (let i = startRow; i < startRow + 3; i++) {
    for (let j = startColumn; j < startColumn + 3; j++) {
      if (
        area.children[9 * i + j].innerText === value &&
        (i !== row || j !== column)
      ) {
        return true;
      }
    }
  }

  return false;
};

for (let i = 0; i < 9; i++) {
  for (let j = 0; j < 9; j++) {
    if (j % 3 == 0 && j != 0) {
      let cellIndex = 9 * i + j;
      area.children[cellIndex].classList.add("leftBorder");
    }
    if (i % 3 == 0 && i != 0) {
      let cellIndex = 9 * i + j;
      area.children[cellIndex].classList.add("topBorder");
    }
  }
}

//event listeners to accept only integer data.

button.onclick = () => {
  const cells = area.children;
  for (let i = 0; i < cells.length; i++) {
    cells[i].contentEditable = false;
  }
  collect();
  let start = checkNext(grid);
  backTrack(grid, start[0], start[1], xCount);
  console.log(grid);
  // fillarea();
};
// fillarea = () =>{
//     for(let i=0; i<grid.length; i++){
//         for(let j=0; j<grid[i].length; j++){
//             if(area.children[(9*i)+j].innerText===''){
//                 area.children[(9*i)+j].innerText=grid[i][j];
//             }
//         }
//     }
// }

let grid = [];
let tempArray = [];
let xCount = 0;
collect = () => {
  for (let i = 0; i < area.children.length; i++) {
    let currentValue = area.children[i].innerText.trim();

    if (/^[1-9]$/.test(currentValue)) {
      tempArray.push(parseInt(currentValue));
    } else {
      tempArray.push(-1);
    }

    if (tempArray.length === 9) {
      grid.push(tempArray);
      tempArray = [];
    }
  }

  // console.log(grid);
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (grid[i][j] === -1) {
        grid[i][j] = "X";
        xCount++;
      }
    }
  }
  console.log(grid);
  console.log(xCount);
};
// backTrack = (grid,i,j,xCount) =>{
//     if(xCount===0){
//         // solved=true;
//         return;
//     }

//     for(let val=1; val<=9; val++){
//         if(checkCondition(grid,i,j,val)==true){
//             grid[i][j] = val;
//             let a = checkNext(grid);
//             backTrack(grid,a[0],a[1],xCount-1);
//             if(checkforX(grid)===false) return;
//             grid[i][j] = 'X';
//         }
//     }
//    return;
// }

//Highlight grid borders.

backTrack = async (grid, i, j, xCount) => {
  if (xCount === 0) {
    return; // Base case: All empty cells are filled
  }

  for (let val = 1; val <= 9; val++) {
    if (checkCondition(grid, i, j, val)) {
      grid[i][j] = val; // Place the value

      // Update the DOM to show the current state
      updateGridVisual(grid);
      // await delay(100); // Add a delay to visualize recursion steps

      let next = checkNext(grid); // Get the next empty cell
      await backTrack(grid, next[0], next[1], xCount - 1); // Recur for the next cell

      if (checkforX(grid) === false) return; // Stop recursion if solved
      grid[i][j] = "X"; // Undo the move
      updateGridVisual(grid); // Update the DOM for backtracking
      // await delay(100);
    }
  }
};

delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

updateGridVisual = (grid) => {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      let cellIndex = 9 * i + j;
      area.children[cellIndex].innerText = grid[i][j] === "X" ? "" : grid[i][j];
    }
  }
};

checkforX = (grid) => {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (grid[i][j] === "X") return true;
    }
  }
  return false;
};

checkCondition = (grid, iindex, jindex, val) => {
  //Check vertical
  for (let j = 0; j < grid[iindex].length; j++) {
    if (grid[iindex][j] === val && j !== jindex) {
      return false;
    }
  }

  //Check Horizontal
  for (let i = 0; i < grid.length; i++) {
    if (grid[i][jindex] === val && i != iindex) {
      return false;
    }
  }

  //Check for 3X3 sub matrix
  let startRow = Math.floor(iindex / 3) * 3;
  let startCol = Math.floor(jindex / 3) * 3;

  for (let i = startRow; i < startRow + 3; i++) {
    for (let j = startCol; j < startCol + 3; j++) {
      if (grid[i][j] === val && (i != iindex || j != jindex)) {
        return false;
      }
    }
  }

  return true;
};

checkNext = (grid) => {
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (grid[i][j] === "X") {
        return [i, j];
      }
    }
  }
  return [-1, -1];
};
