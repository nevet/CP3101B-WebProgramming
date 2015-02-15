(function (view, $, undefined) {
  var playCanvas = document.getElementById("play-table");
  var hintCanvas = document.getElementById("hint-table");
  var instruction = $('#instruction');
  var stepCount = $('#step-count');

  var styledName = ['<span id="indicator">R</span>iver', '<span id="indicator">G</span>arden', '<span id="indicator">L</span>ibrary', '<span id="indicator">H</span>ome'];
  var scoreString = ['Perfect play!', 'Good enough!', 'Can be more efficient!', 'Have another try!'];

  function printPath(i, j, cur) {
    if (cur == 0) return;

    var cell = {'r': i + 1, 'c': j + 1};
    var text = graph.interprete(graph.map[i][j]);

    setCellColor(cell, utils.clickedColor);
    setCellText(cell, cur);

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

  function getScore(count) {
    if (count == graph.bestCount + 1) return scoreString[0];
    if (count - graph.bestCount < 4) return scoreString[1];
    if (count - graph.bestCount < 6) return scoreString[2];

    return '';
  }

  function setCellColor(cell, color) {
    canvas.drawBackground(cell.r, cell.c, color);
  }

  function setCellText(cell, text) {
    canvas.drawText(cell.r, cell.c, text);
  }

  function resetCell(cell) {
    canvas.resetCell(cell.r, cell.c);
  }

  function highlightCell(cell, curStep) {
    setCellColor(cell, utils.clickedColor);
    setCellText(cell, curStep);
  }

  function setInstruction(html, classType) {
    instruction.removeClass('success error');
    
    if (classType != '') {
      instruction.addClass(classType);
    }

    instruction.html(html);
  }

  function setStepCount(count) {
    stepCount.text(count);
  }

  view.renderSolution = function () {
    var solution = graph.solution;

    var bdi = utils.di[solution[graph.startPosR][graph.startPosC]];
    var bdj = utils.dj[solution[graph.startPosR][graph.startPosC]];
    
    canvas.setCanvas(hintCanvas);
    printPath(graph.startPosR + bdi, graph.startPosC + bdj, graph.bestCount);
    canvas.setCanvas(playCanvas);
  }

  view.renderMap = function () {
    canvas.setCanvas(playCanvas);
    canvas.resetCanvas();
  }

  view.mouseInCell = function (cell) {
    var pos = {'r': cell.r + 1, 'c': cell.c + 1};

    setCellColor(pos, utils.hoverColor);

    if (path.chosen(cell)) {
      setCellText(pos, path.getStep(cell));
    }
  }

  view.mouseOutCell = function (cell) {
    if (cell.r == -1) return;

    var pos = {'r': cell.r + 1, 'c': cell.c + 1};

    resetCell(pos);

    if (path.chosen(cell)) {
      setCellColor(pos, utils.clickedColor);
      setCellText(pos, path.getStep(cell));
    }
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
    var cell = {'r': pos.r + 1, 'c': pos.c + 1};

    switch (moveInfo.status) {
      case 'err':
        setInstruction(moveInfo.msg, 'error');
        break;
      case 'undo':
        resetCell(cell);
        setInstruction(getInstruction(moveInfo.prevPos, moveInfo.state), '');
        setStepCount(moveInfo.curStep);
        break;
      case 'ok':
        highlightCell(cell, moveInfo.curStep);
        setInstruction(getInstruction(pos, moveInfo.state), 'success');
        setStepCount(moveInfo.curStep);
        break;
      case 'fin':
        setInstruction('Congratulations!', 'success');
        setStepCount(moveInfo.curStep);
        $('html').trigger('reloadPlayground', [moveInfo.curStep]);
        break;
    }
  }

  view.congratInfo = function (count) {
    alert('You have completed in ' + count + ' moves!\n' + getScore(count));
  }
} (window.view = window.view || {}, jQuery));