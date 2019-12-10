var logedIn = false;

var aCalandar = {
  "Sun" : [],
  "Mon" : [],
  "Tue" : [],
  "Wed" : [],
  "Thu" : [],
  "Fri" : [],
  "Sat" : []
};

$(document).ready(function() {

  //초기 설정
  logedIn = false;
  $(".inputBox").hide();
  $("#currentID").text("");

  $("#addButton").click(function() {
    if(logedIn) {
      $(".addBox").show();
    }
    else {
      alert("추가하기 위해 로그인을 해주세요.")
    }
  });

  $("#joinButton").click(function() {
    $(".joinBox").show();
  });

  //$(".updateBox").show();

  //"AddBox"관련 처리
  $("#addSave").click(function() {
    var day = $("#inputDay").val();
    var title = $("#inputTitle").val();
    var description = $("#inputDescription").val();
    var id = $("#currentID").text();

    if(title == "" || description == "") { //정상적인 입력이 아닌 경우
      alert("할 일의 제목과 내용을 입력해주세요.");
    }
    else { //정상적인 입력인 경우
      //입력된 내용 서버에 저장
      alert($("#addForm").serialize());
      $.ajax({
        url: "./addRequest.php",
        type: "post",
        data: $("#addForm").serialize()+"&userID="+id,
      }).done(function(data) {
        if(data == "success") {
          alert("저장되었습니다.");
          $(".addBox").hide();

          showCalandar();
        }
      });
    }

  });

  $("#addCancel").click(function() {
    $(".addBox").hide();
  });


  //"JoinBox"관련 처리
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
      //alert($("#joinForm").serialize());
      $.ajax({
        url: "./joinRequest.php",
        type: "post",
        data: $("#joinForm").serialize()+"&request=Submit",
      }).done(function(data) {
        if(data == "success") {
          alert("로그인 성공");
          $(".joinBox").hide();

          logedIn = true;

          //로그인 사용자ID 표시
          $("#currentID").text(id);
          //사용자 데이터 출력
          showCalandar();
        }
        else {
          //alert(data);
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
        data: $("#joinForm").serialize()+"&request=Signin",
      }).done(function(data) {
        if(data == "success") {
          //alert("회원가입 성공");
          alert("회원가입이 완료되었습니다.")
        }
        else {
          //alert(data);
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

function showCalandar() {
  $.ajax({
    url: "./readCalandar.php",
    type: "post",
    data: "userID="+id,
    datatype: "json"
  }).done(function(jsonData) {
    /*
    Calandar.json
    {"Mon" : [works], "Tue" : [works], ... , Sun : [works]}

    Work.json
    {"title" : "할 일 제목", "description" : "할 일 내용"}
    */
   //json파일을 해석하여 1. 달력에 표시, 2. 별도의 저장소에 저장
    var days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    for(var i = 0; i < 7; i++){
      var dayWorks = jsonData[days[i]];
      for(var j = 0; j < dayWorks.length; j) {
        appendWork(days[i], dayWorks[j]["title"], dayWorks[j]["description"]);
      }
    }
  });
}
function appendWork(day, title, description) {
  $("#"+day+"List").append("<li class=\"works\">"+title+"</li>");
  aCalandar[day].push({"title" : title, "description" : description});
}

function saveCalandar() {
  $.ajax({
    url: "./saveCalandar.php",
    type: "post",
    data: aCalandar,
  }).done(function(data) {
    console.log("save "+data);
  });
}

function clearCalandar() {

}