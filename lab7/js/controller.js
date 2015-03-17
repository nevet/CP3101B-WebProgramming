(function (controller, $, undefined) {
  var gameState = 0;
  var lastCell = {'r': -1, 'c': -1};

  function init(checkUser) {
    $.get('php/puzzle.php', {'cmd': 'new'}, function (data) {
      graph.init(JSON.parse(data));
      path.init();
    }).done(function () {
      if (checkUser) {
        user.init();
      }
    });
  }

  function getMousePosition(event) {
    var rect = canvas.getCanvas().getBoundingClientRect();

    return {
      x: (event.clientX - rect.left) / (rect.right - rect.left) * canvas.width,
      y: (event.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height
    };
  }

  function getCellUnderMouse(event) {
    mousePos = getMousePosition(event);

    return {'r': parseInt(mousePos.y / 96), 'c': parseInt(mousePos.x / 96)};
  }

  $(function () {
    init(true);

    $('#gameStatus').on("click", function () {
      view.hideProfileDiv();
      gameStatus.refresh();
      view.showCover();
      view.showGameStatusDiv();
    });

    $(document).on("click", '.puzzleIdLink', function () {
      user.compete($(this).html(), function (data) {
        if (data == "invalid") {
          alert("The request is rejected!");
        } else {
          view.hideGameStatusDiv();
          view.hideCover();
          view.showCompeteStatus();

          graph.init(JSON.parse(data));
          path.init();
        }
      });
    });

    $('#profile').on("click", function () {
      view.hideGameStatusDiv();
      user.populateProfile();
      view.showCover();
      view.showProfileDiv();
    });

    $('#profileSubmit').on("click", function () {
      user.submitProfile(function (res) {
        if (res) {
          view.hideProfileDiv();
          view.hideCover();
        }
      });
    });

    $('#cover').on("click", function () {
      view.hideProfileDiv();
      view.hideGameStatusDiv();
      view.hideCover();
    });

    $('#hint').on("click", function () {
      if ($('.hintpanel').css('opacity') == 0) {
        $.get('php/puzzle.php', {'cmd': 'solution'}, function (data) {
          view.renderSolution(JSON.parse(data));
          view.showSolution();
        });
      } else {
        view.hideSolution();
      }
    });

    $('#play-table').mousemove(function () {
      var cell = getCellUnderMouse(event);

      if (lastCell.r != cell.r || lastCell.c != cell.c) {
        view.mouseInCell(cell);
        view.mouseOutCell(lastCell);

        lastCell = cell;
      }
    });

    $('html').on('gameFinished', function (event, stepCount) {
      var handled = false;

      $.get('php/puzzle.php', {'cmd': 'finish', 'userStep': stepCount}, function (data) {
        if (data == "verifyRequest") {
          user.verify(function (res) {
            if (res != "ok") {
              alert('You are not authorized!');
            } else {
              $.get('php/puzzle.php', {'cmd': 'confirmFinish'}, function (data) {
                view.congratInfo(JSON.parse(data), stepCount);
              }).done(function () {
                view.hideCompeteStatus();
                init(false);
              });
            }
          });
        } else {
          view.congratInfo(JSON.parse(data), stepCount);
          view.hideCompeteStatus();
          init(false);
        }
      });
    });

    $('#play-table').on("click", function () {
      var cell = getCellUnderMouse(event);
      path.tryPlace(cell);
    });
  });
} (window.controller = window.controller || {}, jQuery));