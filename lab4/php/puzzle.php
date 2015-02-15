<?php
function is_ajax() {
  return isset($_SERVER['HTTP_X_REQUESTED_WITH']) &&
         strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest';
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

function generateNewPuzzle() {
  $puzzle = array(array(4, 4, 4, 4, 4),
                  array(4, 4, 4, 4, 4),
                  array(4, 4, 4, 4, 4),
                  array(4, 4, 4, 4, 4),
                  array(4, 4, 4, 4, 4));

  echo json_encode($puzzle);
}

function test_function(){
  $return = $_POST;
  
  //Do what you need to do with the info. The following are some examples.
  //if ($return["favorite_beverage"] == ""){
  //  $return["favorite_beverage"] = "Coke";
  //}
  //$return["favorite_restaurant"] = "McDonald's";
  
  $return["json"] = json_encode($return);
  echo json_encode($return);
}
?>