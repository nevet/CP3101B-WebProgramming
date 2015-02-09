(function (controller, $, undefined) {
  var gameState = 0;

  function init() {
    graph.init();
    path.init();
  }

  function getCellPosition(cell) {
    return {'r': parseInt(cell.attr('r')) - 1, 'c': parseInt(cell.attr('c')) - 1};
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