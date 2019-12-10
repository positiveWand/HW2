<?php
$userID = $_POST["userID"]; //유저 아이디

$resultJson = array(
    "Sun"=>array(),
    "Mon"=>array(),
    "Tue"=>array(),
    "Wed"=>array(),
    "Thu"=>array(),
    "Fri"=>array(),
    "Sat"=>array(),
);


//달력 정보 읽어오기
$dayArray = array("Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat");

foreach($dayArray as $aDay) {
    $dayFile = fopen("./data/".$userID."_".$aDay.".txt", "r");
    while(!feof($dayFile)) {
        $aWork = fgets($dayFile); //한 줄(=1명의 유저) 읽기
        if(empty($aWork)) {
            break;
        }
        $workInfo = explode("||", $aWork); //구분자("||")를 이용해 정보 분리
        $dictWork = array();
        $dictWork["id"] = trim($workInfo[0]);
        $dictWork["title"] = trim($workInfo[1]);
        $dictWork["description"] = trim($workInfo[2]);
        //유저 정보 (index : 0 -> 아이디(timestamp), index : 1 -> 제목(title), index : 2 -> 내용(description))
        array_push($resultJson[$aDay], $dictWork);
    }
    fclose($dayFile);
}

echo json_encode($resultJson); //클라이언트에 정보 전송
?>