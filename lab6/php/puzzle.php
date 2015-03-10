<?php
session_start();

$session_id = session_id();

require_once("solver.php");
require_once("../../config.php");

$puzzle = array_fill(0, 5, array_fill(0, 5, 4));
$startPosR;
$startPosC;
$db;

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

function stringify($array) {
  $str = "";

  for ($i = 0; $i < 5; $i ++) {
    for ($j = 0; $j < 5; $j ++) {
      $str = $str . $array[$i][$j];
    }
  }

  return $str;
}

function decode($solstr) {
  $mul = 1;
  $offset = 0;
  $solution = array_fill(0, 5, array_fill(0, 5, 0));

  if ($solstr[0] == '-') {
    $mul = -1;
    $offset = 1;
  }

  for ($i = 0; $i < 5; $i ++) {
    for ($j = 0; $j < 5; $j ++) {
      $solution[$i][$j] = intval($solstr[$i * 5 + $j + $offset]);
    }
  }

  $solution[0][0] *= $mul;

  return $solution;
}

function getRecord() {
  global $db;

  $db = new mysqli(db_host, db_uid, db_pwd, db_name);
  if ($db->connect_errno) // are we connected properly?
    exit("Failed to connect to MySQL: (" . $db->connect_errno . ") " . $db->connect_error); 

  $res = $db->query("SELECT * FROM RECORDS ORDER BY RECORD_ID DESC LIMIT 25");

  while ($obj = mysql_fetch_object($res)) {
    $arr[] = $obj;
  }

  echo json_encode($arr);
}

function generateUserName($userId) {
  $userName = "";

  // echo "user id = ". $userId . "<br>";

  while ($userId > 0) {
    $cur = (int)$userId % 62;
    $userId = (int)($userId / 62);

    // echo "cur = $cur, user id = $userId" . "<br>";

    if ($cur < 9) {
      $userName = $cur . $userName;
    } else
    if ($cur >= 10 && $cur < 36) {
      $userName = chr($cur + 55) . $userName;
    } else {
      $userName = chr($cur + 61) . $userName;
    }

    // echo "user name = $userName " . "<br>";
  }

  while (strlen($userName) < 5) {
    $userName = "0" . $userName;
  }

  return "Guest$userName";
}

function getUserInfo() {
  global $db, $session_id;

  $db = new mysqli(db_host, db_uid, db_pwd, db_name);
  if ($db->connect_errno) // are we connected properly?
    exit("Failed to connect to MySQL: (" . $db->connect_errno . ") " . $db->connect_error); 

  $res = $db->query("SELECT * FROM USERS WHERE SESSION_ID='$session_id'");

  if (!$res || $res->num_rows == 0) {
    $res = $db->query("SHOW TABLE STATUS LIKE 'USERS'");
    $res = $res->fetch_assoc();
    $userId = $res['Auto_increment'];
    $_SESSION["userId"] = $userId;

    $guestName = generateUserName(intval($userId));

    // echo $session_id . "<br>";

    $res = $db->query("INSERT INTO USERS VALUES(null, '$session_id', '$guestName', '')");

    echo json_encode(array("userType" => "new", "userId" => $userId, "userName" => $guestName));
  } else {
    $res = $res->fetch_assoc();
    $_SESSION["userId"] = $res["USER_ID"];
    echo json_encode(array("userType" => "return", "userId" => $userId, "userName" => $res["USER_NAME"]));
  }

  $db->close();
}

function editUserInfo() {
  global $db;

  if (!isset($_REQUEST["userId"]) || !isset($_REQUEST["name"]) ||
      !isset($_REQUEST["oldPass"]) || !isset($_REQUEST["newPass"])) {
    echo "Fields cannot be empty!";
    return;
  }

  $reqUserId = $db->escape_string($_REQUEST["userId"]);
  $reqName = $db->escape_string($_REQUEST["name"]);
  $reqOldPass = $db->escape_string($_REQUEST["oldPass"]);
  $reqNewPass = $db->escape_string($_REQUEST["newPass"]);

  if ($reqOldPass == "") $reqOldPass = NULL;

  $db = new mysqli(db_host, db_uid, db_pwd, db_name);
  if ($db->connect_errno) // are we connected properly?
    exit("Failed to connect to MySQL: (" . $db->connect_errno . ") " . $db->connect_error); 

  $res = $db->query("SELECT * FROM USERS WHERE USER_ID=$reqUserId");

  if (!$res || $res->num_rows == 0) {
    echo "User doesn't exit, please contact admin for help!";
  } else {
    $res = $res->fetch_assoc();

    if ($reqOldPass != $res["USER_PASSWD"]) {
      echo "Old password wrong!";
      return;
    } else
    if ($reqName == $res["USER_NAME"]) {
      echo "Name has been used! Please change a name.";
      return;
    } else
    {
      $userId = $res["USER_ID"];
      $db->query("UPDATE USERS SET USER_NAME=$reqName, USER_PASSWD=$reqNewPass WHERE USER_ID=$userId");

      echo "ok";
    }
  }
}

function verifyUserInfo() {
  global $db;

  if (!isset($_REQUEST["userId"]) || !isset($_REQUEST["passwd"])) {
    echo "Invalid operation! Please contact admin for help.";
    return;
  }

  $reqUserId = $db->escape_string($_REQUEST["userId"]);
  $reqPasswd = $db->escape_string($_REQUEST["passwd"]);

  if ($reqOldPass == "") $reqOldPass = NULL;

  $db = new mysqli(db_host, db_uid, db_pwd, db_name);
  if ($db->connect_errno) // are we connected properly?
    exit("Failed to connect to MySQL: (" . $db->connect_errno . ") " . $db->connect_error); 

  $res = $db->query("SELECT * FROM USERS WHERE USER_ID=$reqUserId");

  if (!$res || $res->num_rows == 0) {
    echo "Invalid operation! Please contact admin for help.";
    return;
  } else {
    $res = $res->fetch_assoc();

    if ($reqPasswd != $res["USER_PASSWD"]) {
      echo "invalid";
    } else {
      echo "ok";
    }
  }
}

function generateNewPuzzle() {
  global $puzzle, $startPosR, $startPosC, $db;

  randomizeObstacle(rand(4, 7));
  randomizeCheckPoint();

  $solution = solve($startPosR, $startPosC, $puzzle);

  while ($solution["bestCount"] > 25)
  {
    $puzzle = array_fill(0, 5, array_fill(0, 5, 4));
    randomizeObstacle(rand(4, 7));
    randomizeCheckPoint();

    $solution = solve($startPosR, $startPosC, $puzzle);
  }

  $map = stringify($puzzle);
  $sol = stringify($solution["solution"]);

  $db = new mysqli(db_host, db_uid, db_pwd, db_name);
  $res = $db->query("SELECT * FROM PUZZLES WHERE MAP='$map'");

  if (!$res || $res->num_rows == 0) {
    $res = $db->query("SHOW TABLE STATUS LIKE 'PUZZLES'");
    $res = $res->fetch_assoc();
    $_SESSION["mapId"] = $res['Auto_increment'];
    $_SESSION["bestCount"] = $solution["bestCount"]; 
    $_SESSION["solution"] = $solution["solution"];

    $res = $db->query("INSERT INTO PUZZLES VALUES(NULL, '$map', ".$solution["bestCount"].", '$sol', 0, 0, 0)");
  } else {
    $res = $res->fetch_assoc();

    $_SESSION["bestCount"] = $res["BESTCOUNT"]; 
    $_SESSION["solution"] = decode($res["SOLUTION"]);
  }
  
  $_SESSION["startTime"] = microtime(true);

  $return["puzzle"] = $puzzle;
  $return["startPosR"] = $startPosR;
  $return["startPosC"] = $startPosC;

  echo json_encode($return);
}

function endGame() {
  global $db;

  if (!isset($_REQUEST["userStep"])) return;

  $db = new mysqli(db_host, db_uid, db_pwd, db_name);
  $mapId = $_SESSION["mapId"];
  $userId = $_SESSION["userId"];
  $timeElapse = microtime(true) - $_SESSION["startTime"];
  $userStep = $db->escape_string($_REQUEST["userStep"]);

  $db->query("INSERT INTO RECORDS VALUES(null, $mapId, $userId, $timeElapse, $userStep)");

  $res = $db->query("SELECT * FROM PUZZLES WHERE PUZZLE_ID=$mapId");

  if (!$res || $res->num_rows == 0) {
    echo "wrong!";
  } else {
    $row = $res->fetch_assoc();
    $newPlayedTimes = $row["PLAYED_TIMES"] + 1;
    $newAvgStep = ($row["AVG_STEP"] * $row["PLAYED_TIMES"] + $userStep) / $newPlayedTimes;
    $newAvgTime = ($row["AVG_TIME"] * $row["PLAYED_TIMES"] + $timeElapse) / $newPlayedTimes;
    
    $db->query("UPDATE PUZZLES SET PLAYED_TIMES=$newPlayedTimes, AVG_STEP=$newAvgStep, AVG_TIME=$newAvgTime WHERE PUZZLE_ID=$mapId");
  }

  $db->close();

  // $_SESSION["startTime"] = microtime(true);

  echo json_encode(array("bestCount" => $_SESSION["bestCount"],
                         "timeUsed" => $timeElapse));
}

// if (isAjax()) {
  // for GET
  if (isset($_REQUEST["cmd"]) && !empty($_REQUEST["cmd"])) {
    $command = $_REQUEST["cmd"];

    switch ($command) {
      case "user":
        getUserInfo();
        break;
      case "userEdit":
        editUserInfo();
        break;
      case "verify":
        verifyUserInfo();
        break;
      case "record":
        getRecord();
        break;
      case "new":
        generateNewPuzzle();
        break;
      case "finish":
        endGame();
        break;
      case "solution":
        echo json_encode(array("bestCount" => $_SESSION["bestCount"],
                               "solution" => $_SESSION["solution"]));
        break;
      default:
        echo "wrong";
        break;
    }
  }
// }
?>