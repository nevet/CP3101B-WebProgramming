(function (gameStatus, $, undefined) {
  var tableContainer = $('#tableContainer');
  var content = $('.content');

  gameStatus.latestRecord;

  gameStatus.refresh = function () {
    $.post('php/puzzle.php', {'cmd': 'record'}, function (data) {
      gameStatus.latestRecord = JSON.parse(data);

      tableContainer.css({
        "height": gameStatus.latestRecord.length * 25 + 28
      });

      content.html("");

      for (var i = 0; i < gameStatus.latestRecord.length; i ++) {
        var row = gameStatus.latestRecord[i];

        content.append('<tr><td><a href=# class="puzzleIdLink">'+row["PUZZLE_ID"]+'</a></td><td>'+row["USER_NAME"]
                       +'</td><td>'+row["STEP"]+'</td><td>'+row["TIME"]+'</td></tr>');
      }
    });
  }
} (window.gameStatus = window.gameStatus || {}, jQuery));