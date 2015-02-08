(function (controller, $, undefined) {
  var stepCount = 0;
  var gameState = 0;

  var lastClick = {"r": -1, "c": -1};

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
    beforeHoverBg = highlight ? utils.red : ((r + c) % 2 == 0 ? utils.lightBrown : utils.darkBrown);

    cell.css({
      'background': beforeHoverBg
    });

    if (highlight) {
      if (graph.map[r][c] < 4) {
        cell.text(cell.text() + '/' + stepCount);
      } else {
        cell.text(stepCount);
      }
    } else {
      cell.text(map[graph.map[r][c]]);
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

  function init() {
    setStepCount(0);
    lastClick = {'r': -1, 'c': -1};
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

  $(function () {
    graph.init();
    init();

    $('#play-table td').hover(view.mouseInCell, view.mouseOutCell);

    $('#hint').hover(view.showSolution, view.hideSolution);

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
  });
} (window.controller = window.controller || {}, jQuery));