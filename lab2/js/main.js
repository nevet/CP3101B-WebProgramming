window.beforeHoverBg = "rgb(0, 0, 0)";

function rgbSum(c1, c2) {
  var a = c1.a + c2.a * (1 - c1.a);
  console.log(c1, c2);
  var output = "rgb(" + Math.floor((c1.r + c2.r) / 2) + ", " + Math.floor((c1.g + c2.g) / 2) + ", " + Math.floor((c1.b + c2.b) / 2) + ")";
  console.log(output);
  return output;
}

$(function () {
  var table = $('table')[0];

  for (var i = 0; i < 5; i ++)
    for (var j = 0; j < 5; j ++)
    {
      var color = (i + j) % 2 == 0 ? "rgb(86, 51, 36)" : "rgb(52, 34, 34)";
      $(table.rows[i].cells[j]).css({
        "background": color
      });
    }

  $('td').hover(function () {
    beforeHoverBg = $(this).css("background");
    var rgb = beforeHoverBg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+)\))?/);
    console.log(beforeHoverBg);

    $(this).css({
      "background": rgbSum({"r": 255, "g": 192, "b": 203}, {"r": parseInt(rgb[1]), "g": parseInt(rgb[2]), "b": parseInt(rgb[3])})
    });
  }, function () {
    $(this).css({
      "background": beforeHoverBg
    });
  })

  $('td').on("click", function () {
    $(this).css({
      "background": "red"
    });
  });
});