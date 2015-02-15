<?php

require_once("solver.php");

$puzzle = array_fill(0, 5, array_fill(0, 5, 4));
$startPosR;
$startPosC;

function isAjax() {
  return isset($_SERVER['HTTP_X_REQUESTED_WITH']) &&
         strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest';
}

function randomizeObstacle($obstacle) {
  global $puzzle;

  $coordr = rand(0, 4);
  $coordc = rand(0, 4);

  while ($obstacle > 0) {
    while ($puzzle[$coordr][$coordc] != 4) {
      $coordr = rand(0, 4);
      $coordc = rand(0, 4);
    }

    $puzzle[$coordr][$coordc] = 5;

    $obstacle--;
  }
}

function randomizeCheckPoint() {
  global $puzzle, $startPosR, $startPosC;

  for ($i = 0; $i < 5; $i ++) {
    $cur = $i == 4 ? 5 : $i;
    
    $coordr = rand(0, 4);
    $coordc = rand(0, 4);

    while ($puzzle[$coordr][$coordc] != 4) {
      $coordr = rand(0, 4);
      $coordc = rand(0, 4);
    }

    $puzzle[$coordr][$coordc] = $cur;

    if ($cur == 0) {
      $startPosR = $coordr;
      $startPosC = $coordc;
    }
  }
}

function generateNewPuzzle() {
  global $puzzle, $startPosR, $startPosC;

  randomizeObstacle(rand(4, 7));
  randomizeCheckPoint();

  $result = solve($startPosR, $startPosC, $puzzle);

  while ($result["bestCount"] > 25)
  {
    $puzzle = array_fill(0, 5, array_fill(0, 5, 4));
    randomizeObstacle(rand(4, 7));
    randomizeCheckPoint();

    $result = solve($startPosR, $startPosC, $puzzle);
  }

  $return["puzzle"] = $puzzle;

  $return["startPosR"] = $startPosR;
  $return["startPosC"] = $startPosC;

  echo json_encode($return);
}

function generateSolution() {
  global $puzzle, $startPosR, $startPosC;

  solve($startPosR, $startPosC, $puzzle);
}

if (isAjax()) {
  // for GET
  if (isset($_GET["cmd"]) && !empty($_GET["cmd"])) {
    $command = $_GET["cmd"];

    switch ($command) {
      case "new":
        generateNewPuzzle();
        break;
      case "solution":
        generateSolution();
        break;
      default:
        echo "wrong";
        break;
    }
  }
}
?>