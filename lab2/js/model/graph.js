(function (graph, $, undefined) {
  var checkPoint = ['H', 'R', 'G', 'L', '.', '#'];

  graph.map = [[], [], [], [], []];
  graph.solution = [[], [], [], [], []];
  graph.bestCount = -1;
  graph.startPosR = -1;
  graph.startPosC = -1;

  function randomizeObstacle(obstacle) {
    var coord = utils.randomCoord();
    while (obstacle > 0) {
      while (graph.map[coord.r][coord.c] != 4) {
        coord = utils.randomCoord();
      }

      graph.map[coord.r][coord.c] = 5;

      obstacle--;
    }
  }

  function randomizeCheckPoint() {
    for (var i = 0; i < 5; i ++) {
      var cur = i == 4 ? 5 : i;
      var coord = utils.randomCoord();

      while (graph.map[coord.r][coord.c] != 4) {
        coord = utils.randomCoord();
      }

      graph.map[coord.r][coord.c] = cur;

      if (cur == 0) {
        graph.startPosR = coord.r;
        graph.startPosC = coord.c;
      }
    }
  }

  graph.init = function () {
    while (graph.bestCount < 0 || graph.bestCount > 25) {
      utils.fillArray(graph.map, 4);

      randomizeCheckPoint();
      randomizeObstacle(utils.random(4, 8));

      solver.run();
    }

    view.renderMap();
    view.renderSolution();
  }

  graph.interprete = function (num) {
    return checkPoint[num];
  }
} (window.graph = window.graph || {}, jQuery));