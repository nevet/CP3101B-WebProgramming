 // the main part is here
      var w = 480, h = 480;
      var ctx = document.getElementById("samplecanvas").getContext("2d"); // somehow memorize this..., I prefer to make the variable ctx global


      function DrawGrid(n) { // let's make an n*n chessboard
        var scale = w/n;
        for (var i = 0; i < n; i++) {
          for (var j = 0; j < n; j++) {// flip
            ctx.strokeStyle = '#646464';
            ctx.strokeRect(j*scale, i*scale, scale-5, scale-5); // a square, leave 1 pixel spacing so that you can see the gaps
          }
        }
      }

      function DrawCircle(r, c, n) { // put circle at cell (r,c), 1-based indexing, of an n*n chessboard
        var scale = w/n;
        var cx = (c-0.5)*scale; cy = (r-0.5)*scale; // the center of cell (r, c) is at coordinate (cx, 
        ctx.fillStyle = "#CC3E3E"; // color
        ctx.lineWidth = "2"; // thicker line
        ctx.beginPath();
        ctx.arc(cx, cy, scale/2.5, 0, Math.PI*2, true); // Outer circle (anticlockwise)
        ctx.fill();
      }

      function DrawRectangle(r,c,n){
        var scale = w/n;
        var rx=(c-0.82)*scale;
        var ry=(r-0.55)*scale;
        ctx.fillStyle="white";
        ctx.fillRect(rx,ry,(scale*5)/8,scale/8);
      }

      function DrawObstacle(r,c,n){
        DrawCircle(r,c,n);
        DrawRectangle(r,c,n);
      }

      function DrawRiver(r, c, n){
        var scale = w/n;
        var rx = (c-0.4)*scale;
        var ry = (r-0.9)*scale;
        ctx.strokeStyle = "#52CCCC";
        ctx.lineWidth = "10";
        ctx.beginPath();
        ctx.moveTo(rx,ry);
        ctx.quadraticCurveTo(rx-scale/2,ry+scale/8,rx,ry+scale/2.5);
        ctx.quadraticCurveTo(rx+scale/2.5,ry+(scale*5)/8,rx-scale/2,ry+(scale*3)/4);
        ctx.stroke();
      }

      function DrawLibrary(r, c, n){
        var scale = w/n;
        var rx=(c-0.8)*scale;
        var ry=(r-0.87)*scale;
        ctx.strokeStyle = "black";
        ctx.lineWidth = "2";
        ctx.strokeRect(rx,ry,scale/2,(scale*3)/4);
        var rx1 = rx + scale/13; 
        ctx.fillStyle = "#297ACC";      
        for(var i=1;i<9;i++)
        {
          ctx.fillRect(rx1,ry+i*(scale/13),scale/3,scale/30);
        }
      }

      function DrawHome(r,c,n)
      {
        var scale = w/n;
        var cx=(c-0.9)*scale;
        var cy=(r-0.6)*scale;
        
        ctx.fillStyle = "#5EA7CC";
        ctx.beginPath();
        ctx.moveTo(cx,cy);
        ctx.quadraticCurveTo(cx+(scale*3)/8,cy-scale/1.6,cx+(scale*3)/4,cy);
        ctx.lineTo(cx,cy);
        ctx.fill();
        
        
        var img = new Image();
        img.src="brick.gif";
        img.onload = function(){
        var ptrn = ctx.createPattern(img,'repeat-x');
        ctx.fillStyle = ptrn;
        ctx.beginPath();
        ctx.moveTo(cx+scale/8,cy);
        ctx.lineTo(cx+scale/8,cy+scale/2);
        ctx.lineTo(cx+scale/2+scale/8,cy+scale/2);
        ctx.lineTo(cx+scale/2+scale/8,cy) ;
        ctx.lineTo(cx+scale/8,cy);
        ctx.fill();  
        }     
      }

      function DrawGarden(r,c,n)
      {
        var scale = w/n;
        var cx=(c-0.5)*scale;
        var cy=(r-0.75)*scale;
        ctx.fillStyle="green";
        ctx.beginPath();
        ctx.arc(cx, cy, scale/6, 0, Math.PI*2, true);
        ctx.fill();
        ctx.fillStyle="brown";
        ctx.fillRect(cx-scale/40,cy+scale/6,scale/25,scale/2);
      }

      function DrawPuzzle(n)
      {
        DrawGrid(n); 
        DrawObstacle(2,4,n);
        DrawObstacle(4,5,n);
        DrawObstacle(5,1,n);
        DrawObstacle(5,5,n);
        DrawRiver(3,2,n);
        DrawLibrary(3,5,n);
        DrawHome(1,1,n);
        DrawGarden(1,3,n);
      }

      DrawPuzzle(5);
  