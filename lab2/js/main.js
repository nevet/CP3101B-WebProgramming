// all comments will be deleted after release for better performance
window.beforeHoverBg = "rgb(0, 0, 0)";
window.stepCount = 0;
window.bestCount = 0;
window.bestPathCount = 0;
window.si = 0;
window.sj = 0;
window.gameState = 0;

window.origraph = [[], [], [], [], []];
window.vis = [[], [], [], [], []];
window.path = [[], [], [], [], []];
window.bestPath = [];
window.lastClick = {"r": -1, "c": -1};

window.di = [-1, 0, 1, 0];
window.dj = [0, 1, 0, -1];

window.map = ['H', 'R', 'G', 'L', '.', '#'];

var lightBrown = "rgb(86, 51, 36)";
var darkBrown = "rgb(52, 34, 34)";
var red = "rgb(255, 0, 0)";
var table = $('table')[0];

function rgbSum(c1, c2) {
  var output = "rgb(" + Math.floor((c1.r + c2.r) / 2) + ", " + Math.floor((c1.g + c2.g) / 2) + ", " + Math.floor((c1.b + c2.b) / 2) + ")";
  return output;
}

function genColor(r, g, b) {
  return {"r": parseInt(r, 10),
          "g": parseInt(g, 10),
          "b": parseInt(b, 10)};
}

function clickOnAdjcent(cell) {
  var r = parseInt(cell.attr('r'), 10);
  var c = parseInt(cell.attr('c'), 10);

  return lastClick.r == -1 || dist(r, c, lastClick.r, lastClick.c) < 2;
}

function clickOnVisited(cell) {
  var visited = cell.text().match('/^(?:[HRGL]\/)?(\d+)$/');

  return visited != null ? parseInt(visited[1], 10) : -1;
}

function recoverCell(cell) {
  var r = parseInt(cell.attr('r'), 10) - 1;
  var c = parseInt(cell.attr('c'), 10) - 1;

  cell.text(map[origraph[r][c]]);
  cell.css({
    "background": (r + c) % 2 == 0 ? lightBrown : darkBrown
  });

  stepCount --;
}

function verify(cell) {
  if (cell.text() == '#') return 'Error: On obstacle!';

  // if user clicks on some non-adjacent cell, invalid 
  if (!clickOnAdjcent(cell)) return 'Error: Cats cannot fly!';

  // else, we have 3 cases:
  // 1. he clicks on some visited cell
  //  1.1 that cell is where he comes
  //  1.2 that cell is a cell on the path
  // 2. a new adjacent cell

  var cellStepCount = clickOnVisited(cell);

  if (cellStepCount == stepCount) {
    // case 1.1
    recoverCell(cell);
    return '';
  } else
  if (cellStepCount != -1) {
    // case 1.2
    return 'Error: Cats cannot visit any non-home cell twice!';
  }

  // case 2
  switch (gameState) {
    case 0:
      // we just started the game, we can only click on 'H'
      if (cell.text() != 'H') {
        return 'Error: We should start from <span id="indicator">H</span>ome';
      } else {
        gameState = 1;
        return 'Good start! We are now heading to <span id="indicator">R</span>iver!';
      }
      break;
    case 1:
      // we are heading to 'R'
      if (cell.text() == 'R') {
        gameState = 2;

        return 'Good job! We are now heading to <span id="indicator">G</span>arden!';
      } else {
        if (cell.text() == '.') {
          return 'Moving towards <span id="indicator">R</span>iver!';
        }

        return 'Error: We should visit <span id="indicator">R</span>iver first!';
      }
      break;
    case 2:
      // we are heading to 'G'
      if (cell.text() == 'G') {
        gameState = 3;

        return 'Well done! We are now heading to <span id="indicator">L</span>ibrary!';
      } else {
        if (cell.text() == '.') {
          return 'Moving towards <span id="indicator">G</span>arden!';
        }

        return 'Error: We should visit <span id="indicator">G</span>arden first!';
      }
      break;
    case 3:
      // we are heading to 'L'
      if (cell.text() == 'L') {
        gameState = 4;

        return 'Almost there! We are now heading <span id="indicator">H</span>ome!';
      } else {
        if (cell.text() == '.') {
          return 'Moving towards <span id="indicator">L</span>ibrary!';
        }

        return 'Error: We should visit <span id="indicator">L</span>ibrary first!';
      }
      break;
    case 4:
      // we are heading to 'H' {
      if (cell.text() == 'H/1') {
        gameState = 0;

        alert('You have completed in ' + stepCount + ' moves!' + getScore());
      } else {
        if (cell.text()) {
          return 'Moving towards <span id="indicator">H</span>ome!';
        }

        return 'Error: We should visit <span id="indicator">H</span>ome!';
      }
  }
  
  return "Success";
}

function init() {
  for (var i = 0; i < 5; i ++)
    for (var j = 0; j < 5; j ++) {
      var color = (i + j) % 2 == 0 ? lightBrown : darkBrown;
      var cell = $(table.rows[i].cells[j]);
      vis[i][j] = false;
      
      cell.css({
        "background": color
      });

      switch (cell.text()) {
        case '.':
          origraph[i][j] = 4;
          break;
        case '#':
          origraph[i][j] = 5;
          break;
        case 'H':
          origraph[i][j] = 0;
          si = i;
          sj = j;
          break;
        case 'R':
          origraph[i][j] = 1;
          break;
        case 'G':
          origraph[i][j] = 2;
          break;
        case 'L':
          origraph[i][j] = 3;
          break;
      }
    }
}

function abs(a)
{
  return a < 0 ? -a : a;
}

function dist(i1, j1, i2, j2)
{
  return abs(i1 - i2) + abs(j1 - j2);
}

function inside(i, j)
{
  return i >= 0 && i < 5 && j >= 0 && j < 5;
}

function valid(i, j, step)
{
  if (!inside(i, j) || vis[i][j] || origraph[i][j] == 5) return false;

  if (origraph[i][j] < 4 && origraph[i][j] != (step + 1) % 4) return false;

  return true;
}

function dfs(i, j, step, cur)
{
  if (cur + dist(i, j, si, sj) >= bestCount) return;

  if (step == 4)
  {
    if (cur < bestCount) bestCount = cur;
    bestPath.push(path);
    bestPathCount ++;

    return;
  }

  for (var d = 0; d < 4; d ++)
  {
    var ni = i + di[d];
    var nj = j + dj[d];

    if (valid(ni, nj, step))
    {
      vis[ni][nj] = true;
      path[ni][nj] = (d + 2) % 4;
      // printf("%d %d %d %d\n", ni, nj, step, cur);

      if (origraph[ni][nj] != 4)
      {
        dfs(ni, nj, step + 1, cur + 1);
      } else
      {
        dfs(ni, nj, step, cur + 1);
      }

      vis[ni][nj] = false;
    }
  }
}

$(function () {
  init();

  bestCount = 50;
  path[0][0] = -1;
  dfs(si, sj, 0, 0);

  console.log('best step is ' + bestCount);
  console.log('best path count is ' + bestPath.length);

  $('td').hover(function () {
    beforeHoverBg = $(this).css("background");
    var rgb = beforeHoverBg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+)\))?/);

    $(this).css({
      "background": rgbSum(genColor(255, 192, 203), genColor(rgb[1], rgb[2], rgb[3]))
    });
  }, function () {
    $(this).css({
      "background": beforeHoverBg
    });
  })

  $('td').on("click", function () {
    var cell = $(this);
    var instruction = $('#instruction');
    instruction.removeClass('success error');

    var msg = verify(cell);

    if (msg.length) {
      instruction.html(msg);
    } else {
      $('#step-count').text(stepCount);
      return;
    }
    
    if (msg.indexOf('Error') == -1) {
      stepCount ++;
      lastClick = {"r": parseInt(cell.attr('r')), "c": parseInt(cell.attr('c'))};

      $('#instruction').addClass('success');
      if (cell.text() != '.') {
        cell.text(cell.text() + '/' + stepCount);
      } else {
        cell.text(stepCount);
      }
    } else {
      $('#instruction').addClass('error');
      return;
    }

    beforeHoverBg = red;
    
    cell.css({
      "background": beforeHoverBg
    });

    $('#step-count').text(stepCount);
  });
});