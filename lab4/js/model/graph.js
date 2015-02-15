(function (graph, $, undefined) {
  var checkPoint = ['H', 'R', 'G', 'L', '.', '#'];

  graph.map = [[], [], [], [], []];
  graph.solution = [[], [], [], [], []];
  graph.bestCount = -1;
  graph.startPosR = -1;
  graph.startPosC = -1;

  graph.init = function (ajaxData) {
    graph.bestCount = -1;

    for (var i = 0; i < 5; i ++)
      for (var j = 0; j < 5; j ++)
        graph.map[i][j] = ajaxData.puzzle[i][j];

    graph.startPosR = ajaxData.startPosR;
    graph.startPosC = ajaxData.startPosC;

    // solver.run();

    view.renderMap();
  }

  graph.interprete = function (num) {
    return checkPoint[num];
  }
} (window.graph = window.graph || {}, jQuery));