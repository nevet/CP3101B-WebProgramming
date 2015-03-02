(function (controller, $, undefined) {
  var gameState = 0;
  var lastCell = {'r': -1, 'c': -1};

  function init() {
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
    init();

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
      $.get('php/puzzle.php', {'cmd': 'bestCount', 'userStep': }, function (data) {
        view.congratInfo(parseInt(data), stepCount);
      }).done(function () {
        init();
      });
    });

    $('#play-table').on("click", function () {
      var cell = getCellUnderMouse(event);
      path.tryPlace(cell);
    });
  });
} (window.controller = window.controller || {}, jQuery));