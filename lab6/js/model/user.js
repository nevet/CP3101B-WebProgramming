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
        userName = json.userName;
        alert(json.userName + ", welcome back!");
      } else {
        alert("Welcome on board, " + json.userName);
      }
    });
  }

  user.populateProfile = function () {
    inputName.text(userName);
  }

  user.submitProfile = function () {
    var data = {'cmd': 'userEdit', 'userId': userId, 'name': inputName.text(), 'oldPass': inputOldPasswd.text(), 'newPass': inputNewPasswd};
    $.post('php/puzzle/php', data, function (response) {
      if (response == "ok") {
        alert("Profile updated!");
      } else {
        alert(response);
      }
    });
  }

  user.verify = function () {
    var dfd = $.Deferred();

    var answer = prompt('You are too fast! Please enter your password to verify:\n');

    $.post('php/puzzle.php', {'cmd': 'verify', 'userId': userId, 'passwd': answer}, function (res) {
      dfd.resolve(res);
    });
  }
} (window.user = window.user || {}, jQuery));