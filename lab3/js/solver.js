(function (solver, $, underfined) {
  var vis = [[], [], [], [], []];
  var path = [[], [], [], [], []];

  function valid(i, j, step) {
    if (!utils.inside(i, j) || vis[i][j] || graph.map[i][j] == 5) return false;

    if (graph.map[i][j] < 4 && graph.map[i][j] != (step + 1) % 4) return false;

    return true;
  }

  function dfs(i, j, step, cur) {
    if (cur + utils.dist(i, j, graph.startPosR, graph.startPosC) >= graph.bestCount) return false;

    if (step == 4) {
      if (cur < graph.bestCount) {
        graph.bestCount = cur;
        utils.clone(path, graph.solution);
      }

      return;
    }

    for (var d = 0; d < 4; d ++) {
      var ni = i + utils.di[d];
      var nj = j + utils.dj[d];

      if (valid(ni, nj, step)) {
        vis[ni][nj] = true;
        path[ni][nj] = (d + 2) % 4;

        if (graph.map[ni][nj] != 4) {
          dfs(ni, nj, step + 1, cur + 1);
        } else {
          dfs(ni, nj, step, cur + 1);
        }

        vis[ni][nj] = false;
      }
    }
  }

  solver.run = function () {
    utils.fillArray(vis, false);
    utils.fillArray(path, 0);
    path[0][0] = -1;
    graph.bestCount = 50;

    dfs(graph.startPosR, graph.startPosC, 0, 0);
  }
} (window.solver = window.solver || {}, jQuery));