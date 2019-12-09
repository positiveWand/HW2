

$(document).ready(function() {

  $(".inputBox").hide();
  $("#currentID").text("");

  $("#joinButton").click(function() {
    $(".loginBox").show();
  });

  $("#loginSubmit").click(function() {
    var id = $("#inputID").val();
    var psw = $("#inputPSW").val();
    if(id == "" || psw == "" || !validateID(id) || !validatePSW(psw)) {
      //정상적인 입력이 아닌 경우
      alert("아이디 또는 패스워드의 입력양식을 체크해주세요.");
      $("#inputID").val("");
      $("#inputPSW").val("");
      $(".loginBox").hide();
      
    }
    else {
      //정상적인 입력인 경우 -> 정상처리
    }
  });

  $("#loginSignin").click(function() {
    var id = $("#inputID").val();
    var psw = $("#inputPSW").val();
    if(id == "" || psw == "" || !validateID(id) || !validatePSW(psw)) {
      //정상적인 입력이 아닌 경우
      alert("아이디 또는 패스워드의 입력양식을 체크해주세요.");
      $("#inputID").val("");
      $("#inputPSW").val("");
      $(".loginBox").hide();
      
    }
    else {
      //정상적인 입력인 경우 -> 정상처리
    }
  });

  
});

function validateID(aString) {
  var idPattern = /^([A-Za-z0-9]){6,15}$/;
  return idPattern.test(aString);
}

function validatePSW(aString) {
  var pswPattern = /^.*(?=^.{8,15}$)(?=.*\d)(?=.*[a-zA-Z0-9])(?=.*[!@#$%^&+=]).*$/;
  return pswPattern.test(aString);
}
