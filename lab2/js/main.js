// all comments will be deleted after release for better performance
(function () {
  var beforeHoverBg = "rgb(0, 0, 0)";
  var stepCount = 0;
  var bestCount = 0;
  var bestPathCount = 0;
  var si = 0;
  var sj = 0;
  var gameState = 0;

  var di = [-1, 0, 1, 0];
  var dj = [0, 1, 0, -1];

  var map = ['H', 'R', 'G', 'L', '.', '#'];
  var origraph = [[], [], [], [], []];
  var vis = [[], [], [], [], []];
  var path = [[], [], [], [], []];
  var bestPath = [[], [], [], [], []];
  var lastClick = {"r": -1, "c": -1};

  var lightBrown = "rgb(86, 51, 36)";
  var darkBrown = "rgb(52, 34, 34)";
  var red = "rgb(255, 0, 0)";
  var table = $('#play-table')[0];
  var hintTable = $('#hint-table')[0];
  var styledName = ['<span id="indicator">H</span>ome', '<span id="indicator">R</span>iver', '<span id="indicator">G</span>arden', '<span id="indicator">L</span>ibrary'];
  var scoreString = ['Perfect play!', 'Good enough!', 'Can be more efficient!', 'Have another try!'];

  var solver = new function() {
    var valid = function (i, j, step)
    {
      if (!inside(i, j) || vis[i][j] || origraph[i][j] == 5) return false;

      if (origraph[i][j] < 4 && origraph[i][j] != (step + 1) % 4) return false;

      return true;
    }

    var clone = function(path) {
      for (var i = 0; i < 5; i ++)
        for (var j = 0; j < 5; j ++)
          bestPath[i][j] = path[i][j];
    }

    this.run = function(i, j, step, cur)
    {
      if (cur + dist(i, j, si, sj) >= bestCount) return false;

      if (step == 4) {
        if (cur < bestCount) {
          bestCount = cur;
          clone(path);
        }

        return;
      }

      for (var d = 0; d < 4; d ++) {
        var ni = i + di[d];
        var nj = j + dj[d];

        if (valid(ni, nj, step)) {
          vis[ni][nj] = true;
          path[ni][nj] = (d + 2) % 4;

          if (origraph[ni][nj] != 4) {
            this.run(ni, nj, step + 1, cur + 1);
          } else {
            this.run(ni, nj, step, cur + 1);
          }

          vis[ni][nj] = false;
        }
      }
    }
  }

  function rgbSum(c1, c2) {
    var output = "rgb(" + Math.floor((c1.r + c2.r) / 2) + ", " + Math.floor((c1.g + c2.g) / 2) + ", " + Math.floor((c1.b + c2.b) / 2) + ")";
    return output;
  }

  function genColor(r, g, b) {
    return {"r": parseInt(r, 10),
            "g": parseInt(g, 10),
            "b": parseInt(b, 10)};
  }

  function abs(a) {
    return a < 0 ? -a : a;
  }

  function dist(i1, j1, i2, j2) {
    return abs(i1 - i2) + abs(j1 - j2);
  }

  function inside(i, j) {
    return i >= 0 && i < 5 && j >= 0 && j < 5;
  }

  function getCellClickCount(cell) {
    var text = cell.text();
    var count = text.match(/^(?:[HRGL]\/)?(\d+)$/);
    return count != null ? parseInt(count[1], 10) : -1;
  }

  function clickOnAdjcent(cell) {
    var r = parseInt(cell.attr('r'), 10);
    var c = parseInt(cell.attr('c'), 10);

    return lastClick.r == -1 || dist(r, c, lastClick.r, lastClick.c) < 2;
  }

  function clickOnVisited(cell) {
    return getCellClickCount(cell);
  }

  function setGameState(state) {
    gameState = state;

    switch (state) {
    case 0:
      return 'Start from <span id="indicator">H</span>ome :)';
    case 1:
      return 'Good start! We are now heading to <span id="indicator">R</span>iver!';
    case 2:
      return 'Good job! We are now heading to <span id="indicator">G</span>arden!';
    case 3:
      return 'Well done! We are now heading to <span id="indicator">L</span>ibrary!';
    case 4:
      return 'Almost there! We are now heading <span id="indicator">H</span>ome!';
    }
  }

  function setInstruction(cell) {
    var instruction = $('#instruction');

    if (cell.text() == '.') {
      instruction.html('Moving towards ' + styledName[gameState] + '!');
    } else {
      instruction.html(setGameState(gameState));
    }
  }

  function setStepCount(count) {
    stepCount = count;
    $('#step-count').text(stepCount);
  }

  function setCellStatus(cell, highlight) {
    var r = parseInt(cell.attr('r'), 10) - 1;
    var c = parseInt(cell.attr('c'), 10) - 1;
    beforeHoverBg = highlight ? red : ((r + c) % 2 == 0 ? lightBrown : darkBrown);

    cell.css({
      'background': beforeHoverBg
    });

    if (highlight) {
      if (origraph[r][c] < 4) {
        cell.text(cell.text() + '/' + stepCount);
      } else {
        cell.text(stepCount);
      }
    } else {
      cell.text(map[origraph[r][c]]);
    }

    if (highlight) {
      lastClick = {'r': r + 1, 'c': c + 1};
    } else {
      for (var d = 0; d < 4; d ++) {
        var nr = r + di[d];
        var nc = c + dj[d];

        if (inside(nr, nc) && getCellClickCount($(table.rows[nr].cells[nc])) == stepCount - 1) {
          lastClick = {'r': nr + 1, 'c': nc + 1};

          break;
        }
      }
    }
  }

  function getScore() {
    if (stepCount == bestCount) return scoreString[0];
    if (stepCount - bestCount < 3) return scoreString[1];
    if (stepCount - bestCount < 5) return scoreString[2];

    return '';
  }

  function verify(cell) {
    if (cell.text() == '#') return {'status': 'err', 'msg': 'On obstacle!'};

    if (!clickOnAdjcent(cell)) return {'status': 'err', 'msg': 'Cats cannot fly!'};

    var cellStepCount = clickOnVisited(cell);

    if (cellStepCount == stepCount) {
      return {'status': 'undo', 'msg': ''};
    } else
    if (cellStepCount != -1) {
      if (gameState != 4 || cellStepCount != 1) {
        return {'status': 'err', 'msg': 'Cats cannot walk across their path!'};
      }
    }

    switch (gameState) {
      case 0:
        // we just started the game, we can only click on 'H'
        if (cell.text() != 'H') {
          return {'status': 'err', 'msg': 'We should start from <span id="indicator">H</span>ome'};
        } else {
          return {'status': 'ok', 'msg': setGameState(1)};
        }
        break;
      case 1:
        // we are heading to 'R'
        if (cell.text() == 'R') {
          return {'status': 'ok', 'msg': setGameState(2)};
        } else {
          if (cell.text() == '.') {
            return {'status': 'ok', 'msg': 'Moving towards <span id="indicator">R</span>iver!'};
          }

          return {'status': 'err', 'msg': 'We should visit <span id="indicator">R</span>iver first!'};
        }
        break;
      case 2:
        // we are heading to 'G'
        if (cell.text() == 'G') {
          return {'status': 'ok', 'msg': setGameState(3)};
        } else {
          if (cell.text() == '.') {
            return {'status': 'ok', 'msg': 'Moving towards <span id="indicator">G</span>arden!'};
          }

          return {'status': 'err', 'msg': 'We should visit <span id="indicator">G</span>arden first!'};
        }
        break;
      case 3:
        // we are heading to 'L'
        if (cell.text() == 'L') {
          return {'status': 'ok', 'msg': setGameState(4)};
        } else {
          if (cell.text() == '.') {
            return {'status': 'ok', 'msg': 'Moving towards <span id="indicator">L</span>ibrary!'};
          }

          return {'status': 'err', 'msg': 'We should visit <span id="indicator">L</span>ibrary first!'};
        }
        break;
      case 4:
        // we are heading to 'H'
        if (cell.text() == 'H/1') {
          return {'status': 'fin', 'msg': ''};
        } else {
          if (cell.text()) {
            return {'status': 'ok', 'msg': 'Moving towards <span id="indicator">H</span>ome!'};
          }

          return {'status': 'err', 'msg': 'We should visit <span id="indicator">H</span>ome'};
        }
    }

    return {'status': 'idle', 'msg': ''};
  }

  function init() {
    for (var i = 0; i < 5; i ++)
      for (var j = 0; j < 5; j ++) {
        var cell = $(table.rows[i].cells[j]);
        setCellStatus(cell, false);
        vis[i][j] = false;

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

    setStepCount(0);
    lastClick = {'r': -1, 'c': -1};
  }

  function printPath(i, j, cur) {
    if (cur == 0) return;

    var cell = $(hintTable.rows[i].cells[j]);

    if (origraph[i][j] < 4) {
      cell.text(cell.text() + '/' + cur);
    } else {
      cell.text(cur);
    }

    cell.css({
      'background': red
    });

    var d = bestPath[i][j];
    var ndi = di[d];
    var ndj = dj[d];

    printPath(i + ndi, j + ndj, cur - 1);
  }

  $(function () {
    init();

    bestCount = 50;
    path[0][0] = -1;
    solver.run(si, sj, 0, 0);
    console.log(bestPath);
    var bdi = di[bestPath[si][sj]];
    var bdj = dj[bestPath[si][sj]];
    printPath(si + bdi, sj + bdj, bestCount);
    bestCount ++;

    console.log('best step is ' + bestCount);
    console.log('best path count is ' + bestPath.length);

    $('#play-table td').hover(function () {
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

    $('#play-table td').on("click", function () {
      var cell = $(this);
      var instruction = $('#instruction');
      instruction.removeClass('success error');

      var msg = verify(cell);

      if (msg.status == 'err') {
        instruction.addClass('error');
        instruction.html(msg.msg);
      } else
      if (msg.status == 'ok') {
        instruction.addClass('success');
        instruction.html(msg.msg);

        setStepCount(stepCount + 1);
        setCellStatus(cell, true);
      } else
      if (msg.status == 'undo') {
        setCellStatus(cell, false);
        setStepCount(stepCount - 1);
        
        if (origraph[cell.attr('r') - 1][cell.attr('c') - 1] < 4) {
          gameState --;
        }

        setInstruction(cell);
      } else
      if (msg.status == 'fin') {
        setStepCount(stepCount + 1);
        instruction.html('Congratulations!');
        
        alert('You have completed in ' + stepCount + ' moves!\n' + getScore());

        init();
        instruction.html(setGameState(0));
      }
    });

    $('#hint').hover(function () {
      $('.hintpanel').css({
        'z-index': 10,
      });

      $('.hintpanel').addClass('ani-fadeIn');

      $('.hintpanel').on("webkitAnimationEnd oanimationend msAnimationEnd animationend", function (e) {
        $('.hintpanel').css({
          'opacity': 1,
          'z-index': 10
        });

        $(this).removeClass('ani-fadeIn');
      });
    }, function () {
      $('.hintpanel').addClass('ani-fadeOut');

      $('.hintpanel').on("webkitAnimationEnd oanimationend msAnimationEnd animationend", function (e) {
        $('.hintpanel').css({
          'z-index': -1,
          'opacity': 0
        });

        $(this).removeClass('ani-fadeOut');
      });
    });
  });
})();