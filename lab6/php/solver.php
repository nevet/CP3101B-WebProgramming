<?php
$puzzle;
$startPosR;
$startPosC;
$solution = array_fill(0, 5, array_fill(0, 5, 0));
$vis = array_fill(0, 5, array_fill(0, 5, false));
$path = array_fill(0, 5, array_fill(0, 5, 0));
$bestCount = 50;

$di = array(-1, 0, 1, 0);
$dj = array(0, 1, 0, -1);

function dist($i1, $j1, $i2, $j2) {
  return abs($i1 - $i2) + abs($j1 - $j2);
}

function inside($i, $j) {
  return $i >= 0 && $i < 5 && $j >= 0 && $j < 5;
}

function valid($i, $j, $step) {
  global $vis, $puzzle;

  if (!inside($i, $j) || $vis[$i][$j] || $puzzle[$i][$j] == 5) return false;

  if ($puzzle[$i][$j] < 4 && $puzzle[$i][$j] != ($step + 1) % 4) return false;

  return true;
}

function copyArray($ori, & $copy) {
  for ($i = 0; $i < count($ori); $i ++)
    for ($j = 0; $j < count($ori[$i]); $j ++) {
      $copy[$i][$j] = $ori[$i][$j];
    }
}

function dfs($i, $j, $step, $cur) {
  global $di, $dj, $startPosR, $startPosC, $bestCount, $puzzle, $solution, $path, $vis;

  if ($cur + dist($i, $j, $startPosR, $startPosC) >= $bestCount) return;

  if ($step == 4) {
    if ($cur < $bestCount) {
      $bestCount = $cur;
      copyArray($path, $solution);
    }

    return;
  }

  for ($d = 0; $d < 4; $d ++) {
    $ni = $i + $di[$d];
    $nj = $j + $dj[$d];

    if (valid($ni, $nj, $step)) {
      $vis[$ni][$nj] = true;
      $path[$ni][$nj] = ($d + 2) % 4;

      if ($puzzle[$ni][$nj] != 4) {
        dfs($ni, $nj, $step + 1, $cur + 1);
      } else {
        dfs($ni, $nj, $step, $cur + 1);
      }

      $vis[$ni][$nj] = false;
    }
  }
}

function solve($sr, $sc, $maze) {
  global $startPosR, $startPosC, $bestCount, $puzzle, $solution, $path, $vis;

  copyArray($maze, $puzzle);
  $startPosR = $sr;
  $startPosC = $sc;

  $solution = array_fill(0, 5, array_fill(0, 5, 0));
  $vis = array_fill(0, 5, array_fill(0, 5, false));
  $path = array_fill(0, 5, array_fill(0, 5, 0));
  $bestCount = 50;

  $path[0][0] = -1;

  dfs($startPosR, $startPosC, 0, 0);

  $return["solution"] = $solution;
  $return["bestCount"] = $bestCount;

  return $return;
}
?>