(function (gameStatus, $, undefined) {
  var tableContainer = $('#tableContainer');
  var table = $('#gameStatusTable');
  var content = $('.scrollContent');

  gameStatus.refresh = function () {
    $.post('php/puzzle.php', {'cmd': 'record'}, function (data) {
      var json = JSON.parse(data);

      console.log(json);

      tableContainer.css({
        "height": json.length * 25 + 28
      });

      content.html("");

      for (var i = 0; i < json.length; i ++) {
        var row = json[i];
        console.log(row);
        content.append('<tr><td>'+row["PUZZLE_ID"]+'</td><td>'+row["USER_NAME"]
                       +'</td><td>'+row["STEP"]+'</td><td>'+row["TIME"]+'</td></tr>');
      }
    });
  }
} (window.gameStatus = window.gameStatus || {}, jQuery));