(function (controller, $, undefined) {
  var beforeHoverBg;

  $(function () {
    graph.init();

    console.log('best step is ' + graph.bestCount);

    $('#play-table td').hover(
      function () {
        var cell = $(this);
        beforeHoverBg = view.getCellColor(cell);
        var rgb = beforeHoverBg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+)\))?/);
        var blended = utils.rgbSum(utils.genColor(255, 192, 203), utils.genColor(rgb[1], rgb[2], rgb[3]));

        view.setCellColor(cell, blended);
      },
      function () {
        var cell = $(this);
        view.setCellColor(cell, beforeHoverBg);
    });

    $('#hint').hover(view.showSolution, view.hideSolution);
  });
} (window.controller = window.controller || {}, jQuery));