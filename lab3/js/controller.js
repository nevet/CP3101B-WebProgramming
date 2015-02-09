(function (controller, $, undefined) {
  var gameState = 0;
  var lastCell = {'r': -1, 'c': -1};

  function init() {
    graph.init();
    path.init();
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

    $('#hint').hover(view.showSolution, view.hideSolution);

    $('#play-table').mousemove(function () {
      var cell = getCellUnderMouse(event);

      if (lastCell.r != cell.r || lastCell.c != cell.c) {
        view.mouseInCell(cell);
        view.mouseOutCell(lastCell);

        lastCell = cell;
      }
    });

    $('html').on('reloadPlayground', function (event, stepCount) {
      view.congratInfo(stepCount);
      init();
    });

    $('#play-table').on("click", function () {
      var cell = getCellUnderMouse(event);
      path.tryPlace(cell);
    });
  });
} (window.controller = window.controller || {}, jQuery));