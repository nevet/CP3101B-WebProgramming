(function (controller, $, undefined) {
  var gameState = 0;
  var lastCell = {'r': -1, 'c': -1};

  function init(checkUser) {
    if (checkUser) {
      user.init();
    }

    $.get('php/puzzle.php', {'cmd': 'new'}, function (data) {
      graph.init(JSON.parse(data));
      path.init();
    });
  }

  function getMousePosition(event) {
    var rect = canvas.getCanvas().getBoundingClientRect();

    return {
      x: (event.clientX - rect.left) / (rect.right - rect.left) * canvas.width,
      y: (event.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height
    };
  }

  function getCellUnderMouse(event) {
    mousePos = getMousePosition(event);

    return {'r': parseInt(mousePos.y / 96), 'c': parseInt(mousePos.x / 96)};
  }

  $(function () {
    init(true);

    $('#gameStatus').on("click", function () {
      gameStatus.refresh();
      view.showCover();
      view.showGameStatusDiv();
    });

    $('#profile').on("click", function () {
      user.populateProfile().done(function () {
        view.showCover();
        view.showProfileDiv();
      });
    });

    $('#profileSubmit').on("click", function () {
      var success = user.submitProfile();

      if (success) {
        view.hideProfileDiv();
        view.hideCover();
      }
    });

    $('#cover').on("click", function () {
      view.hideProfileDiv();
      view.hideGameStatusDiv();
      view.hideCover();
    });

    $('#hint').hover(function () {
      $.get('php/puzzle.php', {'cmd': 'solution'}, function (data) {
        view.renderSolution(JSON.parse(data));
        view.showSolution();
      });
    }, view.hideSolution);

    $('#play-table').mousemove(function () {
      var cell = getCellUnderMouse(event);

      if (lastCell.r != cell.r || lastCell.c != cell.c) {
        view.mouseInCell(cell);
        view.mouseOutCell(lastCell);

        lastCell = cell;
      }
    });

    $('html').on('reloadPlayground', function (event, stepCount) {
      $.get('php/puzzle.php', {'cmd': 'finish', 'userStep': stepCount}, function (data) {
        view.congratInfo(JSON.parse(data), stepCount);
      }).done(function () {
        init(false);
      });
    });

    $('#play-table').on("click", function () {
      var cell = getCellUnderMouse(event);
      path.tryPlace(cell);
    });
  });
} (window.controller = window.controller || {}, jQuery));