// all (r, c) in canvas are 1 - based!!
(function (canvas, $, undefined) {
  var ctx;
  var canvasInstance;
  var n = 5;

  canvas.width = 480;
  canvas.height = 480;
  canvas.scale = canvas.width / n;

  function drawGrid() {
    for (var i = 0; i < n; i++) {
      for (var j = 0; j < n; j++) {
        ctx.strokeStyle = '#646464';
        ctx.strokeRect(j * canvas.scale, i * canvas.scale, canvas.scale - 5, canvas.scale - 5);
      }
    }
  }

  function drawCircle(r, c) {
    var cx = (c - 0.5) * canvas.scale;
    var cy = (r - 0.5) * canvas.scale;

    ctx.fillStyle = "#CC3E3E";
    ctx.lineWidth = "2";
    ctx.beginPath();
    ctx.arc(cx, cy, canvas.scale / 2.5, 0, Math.PI * 2, true);
    ctx.fill();
  }

  function drawRectangle(r, c, color) {
    var rx = c * canvas.scale;
    var ry = r * canvas.scale;

    ctx.fillStyle = color;
    ctx.fillRect(rx, ry, (canvas.scale * 5) / 8, canvas.scale / 8);
  }

  function drawObstacle(r, c) {
    drawCircle(r, c);
    drawRectangle(r - 0.55, c - 0.82, 'white');
  }

  function drawRiver(r, c) {
    var rx = (c - 0.4) * canvas.scale;
    var ry = (r - 0.9) * canvas.scale;

    ctx.strokeStyle = "#52CCCC";
    ctx.lineWidth = "10";
    ctx.beginPath();
    ctx.moveTo(rx, ry);
    ctx.quadraticCurveTo(rx - canvas.scale / 2, ry + canvas.scale / 8, rx, ry + canvas.scale / 2.5);
    ctx.quadraticCurveTo(rx + canvas.scale / 2.5, ry + (canvas.scale * 5) / 8,rx - canvas.scale / 2,ry + (canvas.scale * 3) / 4);
    ctx.stroke();
  }

  function drawLibrary(r, c) {
    var rx = (c - 0.8) * canvas.scale;
    var ry = (r - 0.87) * canvas.scale;

    ctx.strokeStyle = "black";
    ctx.lineWidth = "2";
    ctx.strokeRect(rx, ry, canvas.scale / 2, (canvas.scale * 3) / 4);
    var rx1 = rx + canvas.scale / 13;
    ctx.fillStyle = "#297ACC";      
    for (var i = 1; i < 9; i++) {
      ctx.fillRect(rx1, ry + i * (canvas.scale / 13), canvas.scale / 3, canvas.scale / 30);
    }
  }

  function drawHome(r, c) {
    var cx = (c - 0.9) * canvas.scale;
    var cy = (r - 0.6) * canvas.scale;
    
    ctx.fillStyle = "#5EA7CC";
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.quadraticCurveTo(cx + (canvas.scale * 3) / 8, cy - canvas.scale / 1.6, cx + (canvas.scale * 3) / 4,cy);
    ctx.lineTo(cx,cy);
    ctx.fill();
    
    ctx.fillStyle = "#5EA7CC";
    ctx.beginPath();
    ctx.moveTo(cx + canvas.scale / 8, cy);
    ctx.lineTo(cx + canvas.scale / 8, cy + canvas.scale / 2);
    ctx.lineTo(cx + canvas.scale / 2 + canvas.scale / 8, cy + canvas.scale / 2);
    ctx.lineTo(cx + canvas.scale / 2 + canvas.scale / 8, cy) ;
    ctx.lineTo(cx + canvas.scale / 8, cy);
    ctx.fill();       
  }

  function drawGarden(r, c) {
    var cx = (c - 0.5) * canvas.scale;
    var cy = (r - 0.75) * canvas.scale;

    ctx.fillStyle = "green";
    ctx.beginPath();
    ctx.arc(cx, cy, canvas.scale / 6, 0, Math.PI * 2, true);
    ctx.fill();
    ctx.fillStyle = "brown";
    ctx.fillRect(cx - canvas.scale / 40, cy + canvas.scale / 6, canvas.scale / 25, canvas.scale / 2);
  }

  function drawPattern(r, c) {
    switch (graph.map[r - 1][c - 1]) {
      case 0:
        drawHome(r, c);
        break;
      case 1:
        drawRiver(r, c);
        break;
      case 2:
        drawGarden(r, c);
        break;
      case 3:
        drawLibrary(r, c);
        break;
      case 5:
        drawObstacle(r, c);
        break;
    }
  }

  function drawPuzzle() {
    drawGrid();

    for (var i = 1; i <= n; i ++)
      for (var j = 1; j <= n; j ++) {
        drawPattern(i, j);
      }
  }

  function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  canvas.setCanvas = function (instance) {
    canvasInstance = instance;
    ctx = instance.getContext("2d");
  }

  canvas.getCanvas = function () {
    return canvasInstance;
  }

  canvas.drawBackground = function (r, c, color) {
    var rx = (c - 1) * canvas.scale;
    var ry = (r - 1) * canvas.scale;

    ctx.fillStyle = color;
    ctx.fillRect(rx + 1, ry + 1, canvas.scale - 6, canvas.scale - 6);

    drawPattern(r, c);
  }

  canvas.drawText = function (r, c, text, color) {
    var rx = (c - 1) * canvas.scale;
    var ry = (r - 1) * canvas.scale;

    ctx.font = "10px Georgia";
    ctx.fillStyle = color;
    ctx.fillText(text, rx + 2, ry + 2);
  }

  canvas.resetCell = function (r, c) {
    canvas.drawBackground(r, c, utils.normalColor);
    drawPattern(r, c);
  }

  canvas.resetCanvas = function () {
    clearCanvas();
    drawPuzzle();
  }
} (window.canvas = window.canvas || {}, jQuery));