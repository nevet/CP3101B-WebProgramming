(function (controller, $, undefined) {
  var gameState = 0;

  function init() {
    graph.init();
    path.init();
  }

  function getCellPosition(cell) {
    return {'r': parseInt(cell.attr('r')), 'c': parseInt(cell.attr('c'))};
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

  

  function verify(cell) {
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
    init();

    $('#play-table td').hover(view.mouseInCell, view.mouseOutCell);

    $('#hint').hover(view.showSolution, view.hideSolution);

    $('html').on('reloadPlayground', function () {
      view.congratInfo();
      init();
    });

    $('#play-table td').on("click", function () {
      var cell = $(this);
      path.tryPlace(getCellPosition(cell));
    });
  });
} (window.controller = window.controller || {}, jQuery));