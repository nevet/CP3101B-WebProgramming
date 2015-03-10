(function (gameStatus, $, undefined) {
  var tableContainer = $('#tableContainer');
  var table = $('#gameStatusTable');
  var content = $('.scrollContent');

  gameStatus.refresh = function () {
    $.post('php/puzzle.php', {'cmd': 'record'}, function (data) {
      var json = JSON.parse(data);

      tableContainer.css({
        "height": json.length * 25 + 28
      });

      content.html("");

      for (var i = 0; i < json.length; i ++) {
        var row = json[i];
        content.append('<tr><td>'+row[0]+'</td><td>'+row[1]+'</td><td>'+row[2]'</td><td>'+row[3]+'</td></tr>');
      }
    });
  }
} (window.gameStatus = window.gameStatus || {}, jQuery));