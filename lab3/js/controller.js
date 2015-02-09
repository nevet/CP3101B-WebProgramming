(function (controller, $, undefined) {
  var gameState = 0;

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

  function getClickedCell(event) {
    mousePos = getMousePosition(event);

    return {'r': parseInt(mousePos.y / 96), 'c': parseInt(mousePos.x / 96)};
  }

  $(function () {
    init();

    // $('#play-table td').hover(view.mouseInCell, view.mouseOutCell);

    $('#hint').hover(view.showSolution, view.hideSolution);

    $('html').on('reloadPlayground', function (event, stepCount) {
      view.congratInfo(stepCount);
      init();
    });

    $('#play-table').on("click", function () {
      var cell = getClickedCell(event);
      path.tryPlace(cell);
    });
  });
} (window.controller = window.controller || {}, jQuery));