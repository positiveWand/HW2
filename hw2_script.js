var logedIn = false;

var addShown = false;
var joinShown = false;

var aCalandar = {
  "userID" : "",
  "Sun" : [],
  "Mon" : [],
  "Tue" : [],
  "Wed" : [],
  "Thu" : [],
  "Fri" : [],
  "Sat" : []
};

var currentWork = null;

$(document).ready(function() {

  //초기 설정
  logedIn = false;
  $(".inputBox").hide();
  $("#currentID").text("");

  $("#addButton").click(function() {
    if(logedIn) {
      if(!addShown) {
        $(".addBox").show();
        addShown = true;
      }
      else {
        $(".addBox").hide();
        addShown = false;
      }
    }
    else {
      alert("추가하기 위해 로그인을 해주세요.")
    }
  });

  $("#joinButton").click(function() {
    if(!joinShown){
      $(".joinBox").show();
      joinShown = true;
    }
    else {
      $(".joinBox").hide();
      joinShown = false;
    }
  });

  $("#logoutButton").click(function() {
    alert("로그아웃이 되었습니다.");
    logedIn = false;
    $("#currentID").text("");
    clearCalandar();
  });

  $(document).on("click", ".works", function() {
    $("#editDay").attr("disabled", true);
    $("#editTitle").attr("disabled", true);
    $("#editDescription").attr("disabled", true);

    $("#editEdit").attr("disabled",false);
    $("#editDelete").attr("disabled",false);
    $("#editSubmit").attr("disabled", true);
    $("#editCancel").attr("disabled",false);

    var thisID = $(this).attr("id");
    var thisDay = $(this).parent().attr("id").replace("List", "");
    currentWork = findWork(thisID);
    var thisTitle = currentWork["title"];
    var thisDescription = currentWork["description"];

    $("#editDay").val(thisDay);
    $("#editTitle").val(thisTitle);
    $("#editDescription").val(thisDescription);


    $(".editBox").show();
  });


  //$(".updateBox").show();

  //"AddBox"관련 처리
  //"Save" 버튼
  $("#addSave").click(function() {
    var day = $("#inputDay").val();
    var title = $("#inputTitle").val();
    var description = $("#inputDescription").val();
    var id = $("#currentID").text();

    var currentDate = new Date();

    if(title == "" || description == "") { //정상적인 입력이 아닌 경우
      alert("할 일의 제목과 내용을 입력해주세요.");
    }
    else { //정상적인 입력인 경우
      aCalandar[day].push({"id" : currentDate.getTime(), "title" : title, "description" : description});
      saveCalandar();
      showCalandar();
      alert("저장되었습니다.");
      $("#inputDay").val("Sun");
      $("#inputTitle").val("");
      $("#inputDescription").val("");
      $(".addBox").hide();
      addShown = false;
    }

  });
  //"Cancel"버튼
  $("#addCancel").click(function() {
    $(".addBox").hide();
    addShown = false;
  });


  //"JoinBox"관련 처리
  //"Submit"버튼
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
      joinShown = false;
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
          joinShown = false;

          logedIn = true;

          //로그인 사용자ID 표시
          $("#currentID").text(id);
          //사용자 데이터 출력
          getAndShowCalandar();
        }
        else {
          //alert(data);
          alert("로그인 실패");
        }
      });
    }
  });
  //"Signin"버튼
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
      joinShown = false;
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
          $(".joinBox").hide();
          joinShown = false;
        }
        else {
          //alert(data);
          alert("회원가입 실패");
          alert("아이디가 중복됩니다. 다시 회원가입해주세요.");
        }
      });
    }
  });

  //"EditBox"관련 처리
  //"Edit"버튼
  $("#editEdit").click(function() {
    $("#editDay").attr("disabled", false);
    $("#editTitle").attr("disabled", false);
    $("#editDescription").attr("disabled", false);

    $("#editEdit").attr("disabled",true);
    $("#editDelete").attr("disabled",true);
    $("#editSubmit").attr("disabled", false);
    $("#editCancel").attr("disabled",false);
  });
  //"Delete"버튼
  $("#editDelete").click(function() {
    var currentID = currentWork["id"];
    popWork(currentID);
    saveCalandar();
    alert("삭제되었습니다.");
    $(".editBox").hide();
    showCalandar();
  });
  //"Submit"버튼
  $("#editSubmit").click(function() {
    currentWork["title"] = $("#editTitle").val();
    currentWork["description"] = $("#editDescription").val();
    aCalandar[$("#editDay").val()].push(popWork(currentWork["id"]));
    saveCalandar();
    alert("저장되었습니다.");
    $(".editBox").hide();
    showCalandar();
  });
  //"Cancel"버튼
  $("#editCancel").click(function() {
    $(".editBox").hide();
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


function getAndShowCalandar() {
  $.ajax({
    url: "./readCalandar.php",
    type: "post",
    data: "userID="+$("#currentID").text(),
    datatype: "json"
  }).done(function(jsonData) {
    /*
    Calandar.json
    {"Mon" : [works], "Tue" : [works], ... , Sun : [works]}

    Work.json
    {"id" : unique key(timestamp), "title" : "할 일 제목", "description" : "할 일 내용"}
    */
   //json파일을 해석하여 1. 달력에 표시, 2. 별도의 저장소에 저장
    jsonData = JSON.parse(jsonData);
    var days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    var haveData = false;

    clearCalandar();
    for(var i = 0; i < 7; i++){
      var dayWorks = jsonData[days[i]];
      if(dayWorks != undefined) {
        for(var j = 0; j < dayWorks.length; j++) {
          haveData = true;
          aCalandar[days[i]].push({"id" : dayWorks[j]["id"], "title" : dayWorks[j]["title"], "description" : dayWorks[j]["description"]});
        }
      }
    }

    aCalandar["userID"] = $("#currentID").text();
    if(!haveData) {
      alert("저장한 데이터가 없습니다.");
    }
    showCalandar();
  });
}

function showCalandar() {
  $("#SunList").html("<ul id=\"SunList\"></ul>");
  $("#MonList").html("<ul id=\"MonList\"></ul>");
  $("#TueList").html("<ul id=\"TueList\"></ul>");
  $("#WedList").html("<ul id=\"WedList\"></ul>");
  $("#ThuList").html("<ul id=\"ThuList\"></ul>");
  $("#FriList").html("<ul id=\"FriList\"></ul>");
  $("#SatList").html("<ul id=\"SatList\"></ul>");

  var days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  for(var i = 0; i < 7; i++){
    var dayWorks = aCalandar[days[i]];
    if(dayWorks != undefined) {
      for(var j = 0; j < dayWorks.length; j++) {
        var id = dayWorks[j]["id"];
        var title = dayWorks[j]["title"];
  
        $("#"+days[i]+"List").append("<li id=\""+id+"\" class=\"works\">"+title+"</li>");
      }
    }
  }
  $(".works").attr("draggable", true);
  $(".works").on("dragstart", function(event) {
    event.originalEvent.dataTransfer.setData("text", event.originalEvent.target.id);
  });
  $(".works").on("dragover", function(event) {
    event.originalEvent.preventDefault();
  });
  $(".works").on("drop", function(event) {
    event.preventDefault();
    var data = event.originalEvent.dataTransfer.getData("text");
    event.originalEvent.target.parentNode.insertBefore(document.getElementById(data), event.originalEvent.target);
  });
  $(".data").on("dragover", function(event) {
    event.originalEvent.preventDefault();
  });
  $(".data").on("drop", function(event) {
    if(event.originalEvent.target.tagName == "td") {
      event.preventDefault();
      var data = event.originalEvent.dataTransfer.getData("text");
      event.originalEvent.target.childNodes[0].appendChild(document.getElementById(data));
    }
  });
}

function saveCalandar() {
  $.ajax({
    url: "./saveCalandar.php",
    type: "post",
    data: "targetJson="+JSON.stringify(aCalandar),
  }).done(function(data) {
    console.log("save "+data);
  });
}

function clearCalandar() {
  aCalandar = {
    "userID" : "",
    "Sun" : [],
    "Mon" : [],
    "Tue" : [],
    "Wed" : [],
    "Thu" : [],
    "Fri" : [],
    "Sat" : []
  };

  showCalandar();
}

function findWork(workID) {
  var days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  var targetWork = null;

  for(var i = 0; i < 7; i++){
    var dayWorks = aCalandar[days[i]];
    if(dayWorks != undefined) {
      for(var j = 0; j < dayWorks.length; j++) {
        if(dayWorks[j]["id"] == workID) {
          targetWork = dayWorks[j];
          return targetWork;
        }
      }
    }
  }

  return targetWork;
}

function popWork(workID) {
  var days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  var targetWork = null;

  for(var i = 0; i < 7; i++){
    var dayWorks = aCalandar[days[i]];
    if(dayWorks != undefined) {
      for(var j = 0; j < dayWorks.length; j++) {
        if(dayWorks[j]["id"] == workID) {
          targetWork = dayWorks[j];
          aCalandar[days[i]].splice(j, 1);
          return targetWork;
        }
      }
    }
  }

  return targetWork;
}

function findDay(workID) {
  var days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  var targetDay = null;

  for(var i = 0; i < 7; i++){
    var dayWorks = aCalandar[days[i]];
    if(dayWorks != undefined) {
      for(var j = 0; j < dayWorks.length; j++) {
        if(dayWorks[j]["id"] == workID) {
          targetDay = days[i];
          return targetDay;
        }
      }
    }
  }

  return targetDay;
}

