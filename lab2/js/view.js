(function (view, $, undefined) {
  var table = $('#play-table')[0];
  var hintTable = $('#hint-table')[0];

  var styledName = ['<span id="indicator">H</span>ome', '<span id="indicator">R</span>iver', '<span id="indicator">G</span>arden', '<span id="indicator">L</span>ibrary'];
  var scoreString = ['Perfect play!', 'Good enough!', 'Can be more efficient!', 'Have another try!'];

  var beforeHoverBg;

  function printPath(i, j, cur) {
    if (cur == 0) return;

    var cell = $(hintTable.rows[i].cells[j]);
    var text = graph.interprete(graph.map[i][j]);

    view.setCellText(cell, graph.map[i][j] < 4 ? text + '/' + cur : cur);
    view.setCellColor(cell, utils.red);

    var d = graph.solution[i][j];
    var ndi = utils.di[d];
    var ndj = utils.dj[d];

    printPath(i + ndi, j + ndj, cur - 1);
  }

  view.setCellColor = function (cell, color) {
    cell.css({
      'background': color
    });
  }

  view.getCellColor = function (cell) {
    return cell.css('background');
  }

  view.setCellText = function (cell, text) {
    cell.text(text);
  }

  view.renderSolution = function () {
    for (var i = 0; i < 5; i ++)
      for (var j = 0; j < 5; j ++) {
        var cell = $(hintTable.rows[i].cells[j]);

        view.setCellText(cell, graph.interprete(graph.map[i][j]));
      }

    var solution = graph.solution;

    console.log(solution);

    var bdi = utils.di[solution[graph.startPosR][graph.startPosC]];
    var bdj = utils.dj[solution[graph.startPosR][graph.startPosC]];
    
    printPath(graph.startPosR + bdi, graph.startPosC + bdj, graph.bestCount);
  }

  view.renderMap = function () {
    for (var i = 0; i < 5; i ++)
      for (var j = 0; j < 5; j ++) {
        var cell = $(table.rows[i].cells[j]);

        view.setCellText(cell, graph.interprete(graph.map[i][j]));
        view.setCellColor(cell, (i + j) % 2 == 0 ? utils.lightBrown : utils.darkBrown);
      }
  }

  view.mouseInCell = function () {
    var cell = $(this);
    beforeHoverBg = view.getCellColor(cell);
    var rgb = beforeHoverBg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+)\))?/);
    var blended = utils.rgbSum(utils.genColor(255, 192, 203), utils.genColor(rgb[1], rgb[2], rgb[3]));

    view.setCellColor(cell, blended);
  }

  view.mouseOutCell = function () {
    var cell = $(this);
    view.setCellColor(cell, beforeHoverBg);
  }

  view.showSolution = function () {
    $('.hintpanel').css({
      'z-index': 10,
    });

    $('.hintpanel').addClass('ani-fadeIn');

    $('.hintpanel').on("webkitAnimationEnd oanimationend msAnimationEnd animationend", function (e) {
      $('.hintpanel').css({
        'opacity': 1,
        'z-index': 10
      });

      $(this).removeClass('ani-fadeIn');
    });
  }

  view.hideSolution = function () {
    $('.hintpanel').addClass('ani-fadeOut');

    $('.hintpanel').on("webkitAnimationEnd oanimationend msAnimationEnd animationend", function (e) {
      $('.hintpanel').css({
        'z-index': -1,
        'opacity': 0
      });

      $(this).removeClass('ani-fadeOut');
    });
  }
} (window.view = window.view || {}, jQuery));