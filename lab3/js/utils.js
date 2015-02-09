(function (utils, $, undefined) {
  utils.di = [-1, 0, 1, 0];
  utils.dj = [0, 1, 0, -1];

  utils.lightBrown = "rgb(86, 51, 36)";
  utils.darkBrown = "rgb(52, 34, 34)";
  utils.red = "rgb(255, 0, 0)";

  utils.rgbSum = function(c1, c2) {
    var output = "rgb(" + Math.floor((c1.r + c2.r) / 2) + ", " + Math.floor((c1.g + c2.g) / 2) + ", " + Math.floor((c1.b + c2.b) / 2) + ")";
    return output;
  }

  utils.genColor = function (r, g, b) {
    return {"r": parseInt(r, 10),
            "g": parseInt(g, 10),
            "b": parseInt(b, 10)};
  }

  utils.abs = function(a) {
    return a < 0 ? -a : a;
  }

  utils.dist = function (i1, j1, i2, j2) {
    return utils.abs(i1 - i2) + utils.abs(j1 - j2);
  }

  utils.inside = function (i, j) {
    return i >= 0 && i < 5 && j >= 0 && j < 5;
  }

  utils.fillArray = function (array, value) {
    for (var i = 0; i < 5; i ++)
      for (var j = 0; j < 5; j ++)
        array[i][j] = value;
  }

  utils.clone = function (ori, copy) {
    for (var i = 0; i < 5; i ++)
      for (var j = 0; j < 5; j ++)
        copy[i][j] = ori[i][j];
  }

  utils.random = function (lower, upper) {
    return lower + Math.floor(Math.random() * (upper - lower));
  }

  utils.randomCoord = function () {
    return {'r': utils.random(0, 5), 'c': utils.random(0, 5)};
  }
} (window.utils = window.utils || {}, jQuery));