

$(document).ready(function() {

  $(".inputBox").hide();
  $("#currentID").text("");

  $("#joinButton").click(function() {
    $(".joinBox").show();
  });

  $("#joinSubmit").click(function() { //"로그인" 시도
    var id = $("#inputID").val();
    var psw = $("#inputPSW").val();
    if(id == "" || psw == "" || !validateID(id) || !validatePSW(psw)) {
      //정상적인 입력이 아닌 경우

      //경고 메세지
      alert("아이디 또는 패스워드의 입력양식을 체크해주세요.");
      //input공간 초기화
      $("#inputID").val("");
      $("#inputPSW").val("");
      //loginBox 감추기
      $(".joinBox").hide();
    }
    else {
      //정상적인 입력인 경우 -> 정상처리
      $("#test").text($("#joinForm").serialize());
      $.ajax({
        url: "./joinRequest.php",
        type: "post",
        data: $("#joinForm").serialize(),
      }).done(function(data) {
        if(data == "success") {
          alert("로그인 성공");
          //로그인 사용자ID 표시
          //사용자 데이터 출력
        }
        else {
          alert(data);
          alert("로그인 실패");
        }
      });
    }
  });

  $("#joinSignin").click(function() { //"회원가입" 시도
    var id = $("#inputID").val();
    var psw = $("#inputPSW").val();
    if(id == "" || psw == "" || !validateID(id) || !validatePSW(psw)) {
      //정상적인 입력이 아닌 경우

      //경고 메세지
      alert("아이디 또는 패스워드의 입력양식을 체크해주세요.");
      //input공간 초기화
      $("#inputID").val("");
      $("#inputPSW").val("");
      //loginBox 감추기
      $(".joinBox").hide();  
    }
    else {
      //정상적인 입력인 경우 -> 정상처리
      $.ajax({
        url: "./joinRequest.php",
        type: "post",
        data: $("#joinForm").serialize(),
      }).done(function(data) {
        if(data == "success") {
          alert("회원가입 성공");
          alert("회원가입이 완료되었습니다.")
        }
        else {
          alert(data);
          alert("회원가입 실패");
          alert("아이디가 중복됩니다. 다시 회원가입해주세요.");
        }
      });
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
