window.beforeHoverBg = "rgb(0, 0, 0)";
window.stepCount = 0;
window.bestCount = 0;
window.origraph = [[], [], [], [], []];
window.vis = [[], [], [], [], []];
window.si = 0;
window.sj = 0;

window.di = [-1, 0, 1, 0];
window.dj = [0, 1, 0, -1];

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

function verify(cell) {
  if (cell.text() == '#') return "Error: On obstacle!";
  
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
          origraph[i][j] = 30;
          break;
        case '#':
          origraph[i][j] = 40;
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
  if (!inside(i, j) || vis[i][j] || origraph[i][j] == 40) return false;

  if (origraph[i][j] < 5 && origraph[i][j] != (step + 1) % 4) return false;

  return true;
}

function dfs(i, j, step, cur)
{
  if (cur + dist(i, j, si, sj) >= bestCount) return;

  if (step == 4)
  {
    if (cur < bestCount) bestCount = cur;

    return;
  }

  for (var d = 0; d < 4; d ++)
  {
    var ni = i + di[d];
    var nj = j + dj[d];

    if (valid(ni, nj, step))
    {
      vis[ni][nj] = true;
      // printf("%d %d %d %d\n", ni, nj, step, cur);

      if (origraph[ni][nj] != 30)
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
  dfs(si, sj, 0, 0);

  console.log('best step is ' + bestCount);

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
    var msg = verify(cell);
    
    if (msg.indexOf('Error') == -1) {
      stepCount ++;
      if (cell.text() != '.') {
        cell.text(cell.text() + '/' + stepCount);
      } else {
        cell.text(stepCount);
      }
    } else {
      alert(msg);
      return;
    }

    beforeHoverBg = red;
    
    cell.css({
      "background": beforeHoverBg
    });

    $('#step-count').text(stepCount);
  });
});