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

  user.submitProfile = function () {
    var data = {'cmd': 'userEdit', 'userId': userId, 'name': inputName.val(), 'oldPass': inputOldPasswd.val(), 'newPass': inputNewPasswd.val()};
    // console.log(data);
    
    $.post('php/puzzle.php', data, function (response) {
      if (response == "ok") {
        userName = data.name;
        
        alert("Profile updated!");

        return true;
      } else {
        alert(response);

        return false;
      }
    });
  }
} (window.user = window.user || {}, jQuery));