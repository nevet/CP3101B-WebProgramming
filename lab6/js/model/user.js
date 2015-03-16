(function (user, $, undefined) {
  var userName;
  var userId;
  var inputName = $('input[name=userName]');
  var inputOldPasswd = $('input[name=oldPasswd]');
  var inputNewPasswd = $('input[name=newPasswd]');

  user.init = function () {
    $.post('php/puzzle.php', {'cmd': 'user'}, function (data) {
      var json = JSON.parse(data);
      console.log(json);

      if (json.userType == "return") {
        alert(json.userName + ", welcome back!");
      } else {
        alert("Welcome on board, " + json.userName);
      }

      userName = json.userName;
      userId = json.userId;
    });
  }

  user.populateProfile = function () {
    inputName.val(userName);
    inputOldPasswd.val("");
    inputNewPasswd.val("");
  }

  user.submitProfile = function (callback) {
    var data = {'cmd': 'userEdit', 'userId': userId, 'name': inputName.val(), 'oldPass': inputOldPasswd.val(), 'newPass': inputNewPasswd.val()};
    // console.log(data);
    
    $.post('php/puzzle.php', data, function (response) {
      if (response == "ok") {
        userName = data.name;
        
        alert("Profile updated!");

        callback(true);
      } else {
        alert(response);

        callback(false);
      }
    });
  }

  user.verify = function (callback) {
    var answer = prompt('You are too fast! Please enter your password to verify:\n');

    $.post('php/puzzle.php', {'cmd': 'verify', 'userId': userId, 'passwd': answer}, callback);
  }

  user.compete = function (puzzleId, callback) {
    for (var i = 0; i < gameStatus.latestRecord.length; i ++) {
      var row = gameStatus.latestRecord[i];

      if (row["PUZZLE_ID"] == puzzleId) {
        // if (row["USER_NAME"] == userName) {
        //   alert("You cannot compete with yourself!");
        //   break;
        // } else {
          $.get("php/puzzle.php", {"cmd": "compete", "puzzleId": puzzleId}, callback);
          break;
        // }
      }
    }
  }
} (window.user = window.user || {}, jQuery));