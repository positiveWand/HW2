<?php
$request = $_POST["request"]; //요청 종류
$userID = $_POST["userID"]; //유저 아이디
$userPSW = $_POST["userPSW"]; //유저 비밀번호
$userFound = false;

$result = $request;



//유저 정보 읽어오기
$usersArray = array(); //전체 유저 정보가 저장되는 array
$userFile = fopen("./data/person.txt", "r");
while(!feof($userFile)) {
    $anUser = fgets($userFile); //한 줄(=1명의 유저) 읽기
    if(empty($anUser)) {
        break;
    }
    $userInfo = explode("||", $anUser); //구분자("||")를 이용해 정보 분리
    $userInfo[0] = trim($userInfo[0]);
    $userInfo[1] = trim($userInfo[1]);
    //유저 정보 (index : 0 -> 아이디, index : 1 -> 비밀번호)
    array_push($usersArray, $userInfo);
}
fclose($userFile);

$numOfUsers = count($usersArray, 0); //총 유저의 수



$userFound = findUser($usersArray, $userID);
$loginSuccess = login($usersArray, $userID, $userPSW);

if($request == "Submit") {
    if($loginSuccess) {
        $result = "success";
    }
    else {
        $result = "${loginSuccess}";
    }
} else if($request == "Signin") {
    if($userFound) { //이미 등록된 정보 있음(회원가입 실패)
        $result = "fail";
    }
    else { //등록된 정보가 없을 경우(회원가입 성공)
        //회원가입 진행(유저 정보 기록)
        $userFile = fopen("./data/person.txt", "a+");
        fwrite($userFile, $userID."||");
        fwrite($userFile, $userPSW."\n");
        fclose($userFile);
        $result = "success";
    }
}

echo $result; //클라이언트에 정보 전송

function login($anArray, $anID, $aPSW) {
    $result = false;

    foreach($anArray as $anUser) {
        $id = $anUser[0];
        $psw = $anUser[1];

        if($id == $anID and $psw == $aPSW) {
            $result = true;
            break;
        }
    }

    return $result;
}

function findUser($anArray, $anID) {
    $result = false;

    foreach($anArray as $anUser) {
        $id = $anUser[0];

        if($id == $anID) {
            $result = true;
            break;
        }
    }

    return $result;
}
?>