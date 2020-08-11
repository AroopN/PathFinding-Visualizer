var startSet = 0;
var endSet = 0;
var isDown = false; // Tracks status of mouse button
var nrows = 50;
var ncols = 110;

$(document)
  .mousedown(function () {
    // console.log("mousedown");
    isDown = true; // When mouse goes down, set isDown to true
  })
  .mouseup(function () {
    // console.log("mouseup");
    isDown = false; // When mouse goes up, set isDown to false
  });

function checkDown(el) {
  if (isDown) {
    cellClick(el);
  }
}

function loadTable() {
  // alert(12);
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
  // alert("a");
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
  $('#main').empty();
  loadTable();
}
let traverse = [];
let curr =0;
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
    var x = curr.split(",")[0];
    var y = curr.split(",")[1];
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
        break;
      }
      if (seen.indexOf(temp[0] + "," + temp[1]) == -1) {
        seen.push(temp[0] + "," + temp[1]);
        q.push(temp[0] + "," + temp[1]);
        traverse.push(temp[0] + "," + temp[1]);
        // cell.addClass("seen");
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
    var x = curr.split(",")[0];
    var y = curr.split(",")[1];
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
      if (seen.indexOf(temp[0] + "," + temp[1]) == -1) {
        seen.push(temp[0] + "," + temp[1]);
        st.push(temp[0] + "," + temp[1]);
        traverse.push(temp[0] + "," + temp[1]);
        // cell.addClass("seen");
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

  let q1 = [start];
  let q2 = [end];
  var found = false;

  while (q1.length != 0 && found == false && q2.length != 0) {
    // alert(traverse);
    let curr = q1.shift();
    let x = curr.split(",")[0];
    let y = curr.split(",")[1];
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
        q1.push(temp[0] + "," + temp[1]);
        traverse.push(temp[0] + "," + temp[1]);
        // cell.addClass("seen");
        if (seenFromEnd.indexOf(temp[0] + "," + temp[1]) != -1) {
          // alert("bingo1");
          found = true;
          break;
        }
      }
    }

    curr = q2.shift();
    x = curr.split(",")[0];
    y = curr.split(",")[1];
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
      // if (cell.attr("class") == "cell end") {
      //   found = true;
      //   // break;
      // }
      if (seenFromEnd.indexOf(temp[0] + "," + temp[1]) == -1) {
        seenFromEnd.push(temp[0] + "," + temp[1]);
        q2.push(temp[0] + "," + temp[1]);
        traverse.push(temp[0] + "," + temp[1]);
        // cell.addClass("seen");
        if (seenFromStart.indexOf(temp[0] + "," + temp[1]) != -1) {
          // alert("bingo2");
          found = true;
          break;
        }
      }
    }
    // alert(q1.length + " " + found + " " + q2.length);
  }
}

























let id= 0;
let speed=1;
function animateTraversal(){
    let curr = traverse.shift();
    // console.log(curr, traverse.length);
    if(traverse.length==0){
      // alert("bingo");
      clearInterval(id);
    }
    var x = curr.split(",")[0];
    var y = curr.split(",")[1];
    curr = [Number(x), Number(y)];
    id = "#\\(" + curr[0] + "\\," + curr[1] + "\\)";
    cell = $(id);
    cell.addClass("seen");
    speed=speed*10;


}








function visualize() {
  traverse = [];
  BiBFS();
  console.log(traverse);
  id = setInterval(animateTraversal, speed); 
}
