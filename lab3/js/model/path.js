(function (path, $, undefined) {
  var curStep = 0;
  var state = 0;
  var lastPos = {'r': -1, 'c': -1};
  var pathStep = [[], [], [], [], []];

  path.walk = [[], [], [], [], []];

  function clickOnAdjcent(position) {
    if (lastPos.r == -1) return true;

    return utils.dist(position.r, position.c, lastPos.r, lastPos.c) < 2;
  }

  function getDirection(position) {
    if (!clickOnAdjcent(position)) return -1;

    var dr = position.r - lastPos.r;
    var dc = position.c - lastPos.c;

    if (dr == 0 && dc == 0) return -2;

    return dr != 0 ? dr + 1 : 2 - dc;
  }

  function getPrevPos(position) {
    var d = path.walk[position.r][position.c];

    return {'r': position.r - utils.di[d], 'c': position.c - utils.dj[d]};
  }

  path.init = function () {
    view.resetPath();
    utils.fillArray(path.walk, -1);

    curStep = 1;
    pathStep[graph.startPosR][graph.startPosC] = 1;
    state = 0;
    lastPos = {'r': graph.startPosR, 'c': graph.startPosC};

    view.updateMove({'status': 'ok', 'curStep': curStep, 'state': state}, lastPos);
  }

  path.chosen = function (position) {
    return path.walk[position.r][position.c] != -1 || (position.r == graph.startPosR && position.c == graph.startPosC);
  }

  path.getStep = function (position) {
    return pathStep[position.r][position.c];
  }

  path.tryPlace = function (position) {
    var r = position.r;
    var c = position.c;

    var moveInfo;

    if (graph.map[r][c] == 5) {
      moveInfo = {'status': 'err', 'msg': 'On obstacle!'};
    } else 
    if (graph.map[r][c] == 0 && curStep == 1) {
      moveInfo = {'status': 'err', 'msg': 'Cannot walk across the path!'};
    } else {
      var direction = getDirection(position);

      if (direction == -1) {
        moveInfo = {'status': 'err', 'msg': 'Cats cannot fly!'};
      } else
      if (direction == -2) {
        curStep --;

        lastPos = getPrevPos(position);
        if (graph.map[lastPos.r][lastPos.c] < 4 &&
            graph.map[lastPos.r][lastPos.c] != 0) {
          state --;
        }
        moveInfo = {'status': 'undo', 'prevPos': lastPos, 'curStep': curStep, 'state': state};
        
        path.walk[r][c] = -1;
      } else
      if(path.walk[r][c] != -1) {
        moveInfo = {'status': 'err', 'msg': 'Cannot walk across the path!'};
      } else {
        curStep ++;

        if (r == graph.startPosR && c == graph.startPosC) {
          moveInfo = {'status': 'fin', 'curStep': curStep};
        } else {
          if (graph.map[r][c] < 4) {
            state ++;
          }

          path.walk[r][c] = direction;
          pathStep[r][c] = curStep;
          moveInfo = {'status': 'ok', 'curStep': curStep, 'state': state};
          lastPos = position;
        }
      }
    }

    view.updateMove(moveInfo, position);
  }
} (window.path = window.path || {}, jQuery));