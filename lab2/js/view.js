(function (view, $, undefined) {
  var table = $('#play-table')[0];
  var hintTable = $('#hint-table')[0];
  var instruction = $('#instruction');
  var stepCount = $('#step-count');

  var styledName = ['<span id="indicator">R</span>iver', '<span id="indicator">G</span>arden', '<span id="indicator">L</span>ibrary', '<span id="indicator">H</span>ome'];
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

  function onCheckPoint(state) {
    switch (state) {
    case 0:
      return 'We are now heading to <span id="indicator">R</span>iver!';
    case 1:
      return 'Good job! We are now heading to <span id="indicator">G</span>arden!';
    case 2:
      return 'Well done! We are now heading to <span id="indicator">L</span>ibrary!';
    case 3:
      return 'Almost there! We are now heading <span id="indicator">H</span>ome!';
    }
  }

  function getInstruction(pos, state) {
    if (graph.map[pos.r][pos.c] == 4) {
      return 'Moving towards ' + styledName[state] + '!';
    }
    
    return onCheckPoint(state);
  }

  function getScore() {
    if (stepCount == bestCount) return scoreString[0];
    if (stepCount - bestCount < 3) return scoreString[1];
    if (stepCount - bestCount < 5) return scoreString[2];

    return '';
  }

  view.setCellColor = function (cell, color) {
    cell.css({
      'background': color
    });
  }

  view.getCell = function (pos) {
    return $(table.rows[pos.r].cells[pos.c]);
  }

  view.getCellColor = function (cell) {
    return cell.css('background');
  }

  view.setCellText = function (cell, text) {
    cell.text(text);
  }

  view.resetCell = function (cell) {
    var r = parseInt(cell.attr('r')) - 1;
    var c = parseInt(cell.attr('c')) - 1;

    beforeHoverBg = (r + c) % 2 == 0 ? utils.lightBrown : utils.darkBrown;

    view.setCellText(cell, graph.interprete(graph.map[r][c]));
    view.setCellColor(cell, beforeHoverBg);
  }

  view.highlightCell = function (cell, curStep) {
    var r = parseInt(cell.attr('r')) - 1;
    var c = parseInt(cell.attr('c')) - 1;
    var text = graph.interprete(graph.map[r][c]);

    view.setCellColor(cell, utils.red);
    view.setCellText(cell, graph.map[r][c] < 4 ? text + '/' + curStep : curStep);

    beforeHoverBg = utils.red;
  }

  view.setInstruction = function (html, classType) {
    instruction.removeClass('success error');
    
    if (classType != '') {
      instruction.addClass(classType);
    }

    instruction.html(html);
  }

  view.setStepCount = function (count) {
    stepCount.text(count);
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

        view.resetCell(cell);
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

  view.resetPath = function () {
    view.renderMap();
  }

  view.updateMove = function (moveInfo, pos) {
    var cell = view.getCell(pos);

    switch (moveInfo.status) {
      case 'err':
        view.setInstruction(moveInfo.msg, 'error');
        break;
      case 'undo':
        view.resetCell(cell);
        view.setInstruction(getInstruction(moveInfo.prevPos, moveInfo.state), '');
        view.setStepCount(moveInfo.curStep);
        break;
      case 'ok':
        view.highlightCell(cell, moveInfo.curStep);
        view.setInstruction(getInstruction(pos, moveInfo.state), 'success');
        view.setStepCount(moveInfo.curStep);
        break;
      case 'fin':
        view.setInstruction('Congratulations!', 'success');
        view.setStepCount(moveInfo.curStep);
        $('html').trigger('reloadPlayground');
        break;
    }
  }

  view.congratInfo = function () {
    alert('You have completed in ' + stepCount + ' moves!\n' + getScore());
  }
} (window.view = window.view || {}, jQuery));