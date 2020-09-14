var startSet = 0;
var endSet = 0;
var isDown = false; 
var nrows = 31;
var ncols = 51;



function generateMaze() {
  clearTable();
  let walls = [];
    function maze(x, y) {
      var n = x * y - 1;
      if (n < 0) {
        alert("illegal maze dimensions");
        return;
      }
      var horiz = [];
      for (var j = 0; j < x + 1; j++) (horiz[j] = []), (verti = []);
      for (var j = 0; j < x + 1; j++)
        (verti[j] = []),
          (here = [
            Math.floor(Math.random() * x),
            Math.floor(Math.random() * y),
          ]),
          (path = [here]),
          (unvisited = []);
      for (var j = 0; j < x + 2; j++) {
        unvisited[j] = [];
        for (var k = 0; k < y + 1; k++)
          unvisited[j].push(
            j > 0 &&
              j < x + 1 &&
              k > 0 &&
              (j != here[0] + 1 || k != here[1] + 1)
          );
      }
      while (0 < n) {
        var potential = [
          [here[0] + 1, here[1]],
          [here[0], here[1] + 1],
          [here[0] - 1, here[1]],
          [here[0], here[1] - 1],
        ];
        var neighbors = [];
        for (var j = 0; j < 4; j++)
          if (unvisited[potential[j][0] + 1][potential[j][1] + 1])
            neighbors.push(potential[j]);
        if (neighbors.length) {
          n = n - 1;
          next = neighbors[Math.floor(Math.random() * neighbors.length)];
          unvisited[next[0] + 1][next[1] + 1] = false;
          if (next[0] == here[0])
            horiz[next[0]][(next[1] + here[1] - 1) / 2] = true;
          else verti[(next[0] + here[0] - 1) / 2][next[1]] = true;
          path.push((here = next));
        } else here = path.pop();
      }
      return { x: x, y: y, horiz: horiz, verti: verti };
    }
    function display(m) {
      for (var j = 0; j < m.x * 2 + 1; j++) {
        if (0 == j % 2)
          for (var k = 0; k < m.y * 2 + 1; k++){
            let id = "#\\(" + j + "\\," + k + "\\)";
            let cell = $(id);
            
            if (0 == k % 2) cell.attr("class", "cell wall");

            else if (j > 0 && m.verti[j / 2 - 1][Math.floor(k / 2)])
              cell.className == "cell";
            else cell.attr("class", "cell wall");
          }
        else
          for (var k = 0; k < m.y * 2 + 1; k++){
            let id = "#\\(" + j + "\\," + k + "\\)";
            let cell = $(id);
            if (0 == k % 2)
              if (k > 0 && m.horiz[(j - 1) / 2][k / 2 - 1]) cell.attr("class", "cell");
              else cell.attr("class", "cell wall");
            else cell.attr("class", "cell");
          }
        // text.push(line.join("") + "\r\n");
      }
      // return text.join("");
    }
    display(maze(Math.floor(nrows/2), Math.floor(ncols/2)));
    console.log(walls.length);

    for(var i=0;i<walls.length;i++){
      walls[i].attr("class","cell wall");
    }

  }

$(document)
  .mousedown(function () {
    
    isDown = true; 
  })
  .mouseup(function () {
    
    isDown = false; 
  });

function checkDown(el) {
  if (isDown) {
    cellClick(el);
  }
}

function loadTable() {
  
  var i;
  table = $("#main");
  for (i = 0; i < nrows; i++) {
    row = document.createElement("div");
    row.className = "table-row";
    row.id = "row" + i;
    table.append(row);
    row = $("#row" + i);
    var j = 0;
    for (j = 0; j < ncols; j++) {
      cell = document.createElement("div");
      cell.id = "(" + i + "," + j + ")";
      cell.setAttribute("onmouseover", "checkDown(this);");
      cell.setAttribute("onclick", "cellClick(this);");
      cell.className = "cell";
      row.append(cell);
    }
  }
}

function cellClick(cell) {
  
  if (startSet == cell.id) {
    startSet = 0;
    cell.className = "cell";
    return;
  }
  if (endSet == cell.id) {
    endSet = 0;
    cell.className = "cell";
    return;
  }

  if (startSet == 0) {
    cell.className = "cell start";
    startSet = cell.id;
  } else if (endSet == 0) {
    cell.className = "cell end";
    endSet = cell.id;
  } else {
    if (cell.className == "cell wall") {
      cell.className = "cell";
    } else {
      cell.className = "cell wall";
    }
  }
}
function clearTable() {
  startSet=0;
  endSet=0
  clearInterval(Intervalid);
  $('#main').empty();
  loadTable();
}
function clearPaths() {
  clearInterval(Intervalid);
  for (i = 0; i < nrows; i++) {
    for(j=0;j<ncols;j++){
        id = "#\\(" + i + "\\," + j + "\\)";
        cell = $(id);
        
        if (cell.hasClass("seen") || cell.hasClass("isPath")) {
          cell.removeClass("seen");
          cell.removeClass("isPath");
          
        }
    }
  }
}
let traverse = [];
let curr =0;
let path = []




function BFS(){
  var start = startSet.slice(1, startSet.length - 1);
  var dirs = [
    [-1, 0],
    [0, 1],
    [1, 0],
    [0, -1],
  ];
  let seen = [start];
  let q = [start];
  var found = false;

  while (q.length != 0 && found == false) {
    let curr = q.shift();
    
    curr_complete = curr;
    curr = curr.split(" ");
    curr = curr[curr.length - 1];
    var x = curr.split(",")[0];
    var y = curr.split(",")[1];
    curr_str = curr;
    curr = [Number(x), Number(y)];
    var i = 0;
    for (i = 0; i < 4; i++) {
      var dir = dirs[i];
      temp = [curr[0] + dir[0], curr[1] + dir[1]];
      id = "#\\(" + temp[0] + "\\," + temp[1] + "\\)";
      cell = $(id);
      if (
        temp[0] < 0 ||
        temp[1] < 0 ||
        temp[0] >= nrows ||
        temp[1] >= ncols ||
        cell.attr("class") == "cell wall"
      ) {
        continue;
      }
      if (cell.attr("class") == "cell end") {
        found = true;
        path = curr_complete;
        path = path.split(" ");
        break;
      }
      if (seen.indexOf(temp[0] + "," + temp[1]) == -1) {
        seen.push(temp[0] + "," + temp[1]);
        q.push(curr_complete + " " + temp[0] + "," + temp[1]);
        traverse.push(temp[0] + "," + temp[1]);
        
      }
    }
  }
}





function DFS() {
  var start = startSet.slice(1, startSet.length - 1);
  var dirs = [
    [-1, 0],
    [0, 1],
    [1, 0],
    [0, -1],
  ];
  let seen = [start];
  let st = [start];
  var found = false;

  while (st.length != 0 && found == false) {
    let curr = st.pop();
    
    curr_complete = curr;
    curr = curr.split(" ");
    curr = curr[curr.length - 1];
    var x = curr.split(",")[0];
    var y = curr.split(",")[1];
    curr_str = curr;
    curr = [Number(x), Number(y)];
    var i = 0;
    for (i = 0; i < 4; i++) {
      var dir = dirs[i];
      temp = [curr[0] + dir[0], curr[1] + dir[1]];
      id = "#\\(" + temp[0] + "\\," + temp[1] + "\\)";
      cell = $(id);
      if (
        temp[0] < 0 ||
        temp[1] < 0 ||
        temp[0] >= nrows ||
        temp[1] >= ncols ||
        cell.attr("class") == "cell wall"
      ) {
        continue;
      }
      if (cell.attr("class") == "cell end") {
        found = true;
        path = curr_complete;
        path = path.split(" ");
        break;
      }
      if (seen.indexOf(temp[0] + "," + temp[1]) == -1) {
        seen.push(temp[0] + "," + temp[1]);
        st.push(curr_complete + " " + temp[0] + "," + temp[1]);
        traverse.push(temp[0] + "," + temp[1]);
        
      }
    }
  }
}













function BiBFS() {
  var start = startSet.slice(1, startSet.length - 1);
  var end = endSet.slice(1, endSet.length - 1);
  var dirs = [
    [-1, 0],
    [0, 1],
    [1, 0],
    [0, -1],
  ];
  let seenFromEnd = [end];
  let seenFromStart = [start];

  let pathFromStart = new Map();
  let pathFromEnd = new Map();
  

  let q1 = [start];
  let q2 = [end];
  var found = false;

  while (q1.length != 0 && found == false && q2.length != 0) {
    
    let curr = q1.shift();
    curr_complete = curr;
    curr = curr.split(" ");
    curr = curr[curr.length - 1];
    var x = curr.split(",")[0];
    var y = curr.split(",")[1];
    curr_str = curr;
    curr = [Number(x), Number(y)];
    var i = 0;
    for (i = 0; i < 4; i++) {
      var dir = dirs[i];
      temp = [curr[0] + dir[0], curr[1] + dir[1]];
      id = "#\\(" + temp[0] + "\\," + temp[1] + "\\)";
      cell = $(id);
      if (
        temp[0] < 0 ||
        temp[1] < 0 ||
        temp[0] >= nrows ||
        temp[1] >= ncols ||
        cell.attr("class") == "cell wall"
      ) {
        continue;
      }
      if (seenFromStart.indexOf(temp[0] + "," + temp[1]) == -1) {
        seenFromStart.push(temp[0] + "," + temp[1]);
        q1.push(curr_complete + " " + temp[0] + "," + temp[1]);
        pathFromStart.set(
          temp[0] + "," + temp[1],
          curr_complete + " " + temp[0] + "," + temp[1]
        );
        traverse.push(temp[0] + "," + temp[1]);
        
        if (seenFromEnd.indexOf(temp[0] + "," + temp[1]) != -1) {
          
          path = pathFromStart.get(temp[0] + "," + temp[1]);
          path = path.concat(" ");
          path = path.concat(pathFromEnd.get(temp[0] + "," + temp[1]));
          found = true;
          path = path.split(" ");

          newpath = [];
          n = path.length;
          i = 0;
          j = n - 1;
          while (i < j) {
            newpath.push(path[j]);
            j -= 1;
            newpath.push(path[i]);
            i += 1;
          }
          if (n % 2 != 0) newpath.push(path[i]);
          path = newpath;
          path.shift();

          break;
        }
      }
    }

    curr = q2.shift();
    curr_complete = curr;
    curr = curr.split(" ");
    curr = curr[0];
    var x = curr.split(",")[0];
    var y = curr.split(",")[1];
    curr_str = curr;
    curr = [Number(x), Number(y)];
    i = 0;
    for (i = 0; i < 4; i++) {
      let dir = dirs[i];
      let temp = [curr[0] + dir[0], curr[1] + dir[1]];
      id = "#\\(" + temp[0] + "\\," + temp[1] + "\\)";
      cell = $(id);
      if (
        temp[0] < 0 ||
        temp[1] < 0 ||
        temp[0] >= nrows ||
        temp[1] >= ncols ||
        cell.attr("class") == "cell wall"
      ) {
        continue;
      }
      if (seenFromEnd.indexOf(temp[0] + "," + temp[1]) == -1) {
        seenFromEnd.push(temp[0] + "," + temp[1]);
        q2.push(temp[0] + "," + temp[1]+" " +curr_complete);
        pathFromEnd.set(
          temp[0] + "," + temp[1],
          curr_complete + " " + temp[0] + "," + temp[1]
        );
        traverse.push(temp[0] + "," + temp[1]);
        
        if (seenFromStart.indexOf(temp[0] + "," + temp[1]) != -1) {
          
          path = pathFromStart.get(temp[0] + "," + temp[1]);
          path = path.concat(' ');
          path = path.concat(pathFromEnd.get(temp[0] + "," + temp[1]));
          found = true;
          path = path.split(" ");

          newpath = [];
          n = path.length;
          i = 0;
          j = n - 1;
          while (i < j) {
            newpath.push(path[j]);
            j -= 1;
            newpath.push(path[i]);
            i += 1;
          }
          if (n % 2 != 0) newpath.push(path[i]);
          path = newpath;
          path.shift();


          break;
        }
      }
    }
    
  }
}





function myFunction() {
  document.getElementById("myDropdown").classList.toggle("show");
}


window.onclick = function (event) {
  if (!event.target.matches(".dropbtn")) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains("show")) {
        openDropdown.classList.remove("show");
      }
    }
  }
};

















let Intervalid= 0;
let speed=1;
function animateTraversal(){
    let curr = traverse.shift();
    var x = curr.split(",")[0];
    var y = curr.split(",")[1];
    curr = [Number(x), Number(y)];
    id = "#\\(" + curr[0] + "\\," + curr[1] + "\\)";
    cell = $(id);
    cell.addClass("seen");
    if (traverse.length == 0) {
      clearInterval(Intervalid);
      Intervalid = setInterval(animatePath, 100);
    }

}


function animatePath(){
  let curr = path.shift();
  console.log(curr);
  if (path.length == 0) {
    clearInterval(Intervalid);
  }
  var x = curr.split(",")[0];
  var y = curr.split(",")[1];
  console.log(y)
  curr = [Number(x), Number(y)];
  id = "#\\(" + curr[0] + "\\," + curr[1] + "\\)";
  console.log(id);
  cell = $(id);
  cell.addClass("isPath");

}

let isBi = false;



function visualize(choice) {
  clearPaths();
  traverse = [];
  if(choice=="BFS"){
    BFS();
  }
  else if(choice=='DFS'){
    DFS();
  }
  else{
    isBi=true;
    BiBFS();
  }
  Intervalid = setInterval(animateTraversal, 1);
}
