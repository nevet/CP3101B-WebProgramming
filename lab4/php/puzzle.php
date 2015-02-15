<?php

$puzzle;
$startPosR;
$startPosC;

function is_ajax() {
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

  $puzzle = array_fill(0, 5, array_fill(0, 5, 4));

  randomizeObstacle(rand(4, 7));
  randomizeCheckPoint();

  $return["puzzle"] = $puzzle;

  $return["startPosR"] = $startPosR;
  $return["startPosC"] = $startPosC;

  echo json_encode($return);
}

if (is_ajax()) {
  // for GET
  if (isset($_GET["cmd"]) && !empty($_GET["cmd"])) {
    $command = $_GET["cmd"];

    switch ($command) {
      case "new":
        generateNewPuzzle();
        break;
      case "solution":
        break;
      default:
        echo "wrong";
        break;
    }
  }

  if (isset($_POST["cmd"]) && !empty($_POST["cmd"])) { //Checks if action value exists
    $action = $_POST["action"];
    switch($action) { //Switch case for value of action
      case "test": test_function(); break;
    }
  }
}
?>