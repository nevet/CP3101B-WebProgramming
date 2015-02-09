(function (path, $, undefined) {
  var curStep = 0;
  var lastPos = {'r': -1, 'c': -1};

  path.walk = [[], [], [], [], []];

  function clickOnAdjcent(position) {
    if (lastPos.r == -1) return true;

    return utils.dist(position.r, position.c, lastPos.r, lastPos.c) < 2;
  }

  function getDirection(position) {
    if (!clickOnAdjcent(position)) return -1;

    var dr = position.r - lastPos.r;
    var dc = position.c - lastPos.c;

    return dr != 0 ? dr + 1 : 2 - dc;
  }

  function getPrevPos(position) {
    var d = path.walk[position.r][position.c];

    return {'r': position.r - d, 'c': position.c - d};
  }

  path.init = function {
    curStep = 0;
    lastPos = {'r': -1, 'c': -1};
    utils.fillArray(path.walk, -1);

    view.resetPath();
  }

  path.tryPlace = function (position) {
    var r = position.r;
    var c = position.c;

    var moveInfo;

    if (graph.map[r][c] == 5) {
      moveInfo = {'status': 'err', 'msg': 'On obstacle!'};
    } else {
      var direction = getDirection(position);

      if (direction == -1) {
        moveInfo = {'status': 'err', 'msg': 'Cats cannot fly!'};
      } else
      if (direction == 0) {
        curStep --;

        lastPos = getPrevPos(position);
        moveInfo = {'status': 'undo', 'prevPos': lastPos, 'curStep': curStep};
        
        path.walk[position.r][position.c] = -1;
      } else
      if(path.walk[r][c] != -1 ||
         (r == graph.startPosR && c == graph.startPosC && curStep == 0)) {
        moveInfo = {'status': 'err', 'msg': 'Cannot walk across the path!'};
      } else {
        curStep ++;
        
        if (r == graph.startPosR && c == graph.startPosC) {
          moveInfo = {'status': 'fin', 'curStep': curStep};
        } else {
          moveInfo = {'status': 'ok', 'curStep': curStep};
          lastPos = position;
        }
      }
    }

    view.updateMove(moveInfo, position);
  }
} (window.path = window.path || {}, jQuery));

if (!clickOnAdjcent(cell)) return {'status': 'err', 'msg': 'Cats cannot fly!'};