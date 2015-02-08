(function (view, $, undefined) {
  var table = $('#play-table')[0];
  var hintTable = $('#hint-table')[0];
  var styledName = ['<span id="indicator">H</span>ome', '<span id="indicator">R</span>iver', '<span id="indicator">G</span>arden', '<span id="indicator">L</span>ibrary'];
  var scoreString = ['Perfect play!', 'Good enough!', 'Can be more efficient!', 'Have another try!'];

  function setCellColor(cell, color) {
    cell.css({
      'background': color
    });
  }

  function setCellText(cell, text) {
    cell.text(text);
  }

  function printPath(i, j, cur) {
    if (cur == 0) return;

    var cell = $(hintTable.rows[i].cells[j]);

    setCellText(cell, graph.map[i][j] < 4 ? cell.text() + '/' + cur : cur);
    setCellColor(cell, utils.red);

    var d = graph.solution[i][j];
    var ndi = utils.di[d];
    var ndj = utils.dj[d];

    printPath(i + ndi, j + ndj, cur - 1);
  }

  view.renderSolution = function () {
    var solution = graph.solution;

    var bdi = utils.di[solution[graph.startPosR][graph.startPosC]];
    var bdj = utils.dj[solution[graph.startPosR][graph.startPosC]];
    
    printPath(graph.startPosR + bdi, graph.startPosC + bdj, graph.bestCount);
  }

  view.renderMap = function () {
    for (var i = 0; i < 5; i ++)
      for (var j = 0; j < 5; j ++) {
        var cell = $(table.rows[i].cells[j]);

        setCellText(cell, graph.interprete(graph.map[i][j]));
        setCellColor(cell, (i + j) % 2 == 0 ? utils.lightBrown : utils.darkBrown);
      }
  }
} (window.view = window.view || {}, jQuery));