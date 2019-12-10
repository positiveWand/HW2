<?php
$workDay = $_POST["workDay"]; //일정 "날짜"
$workTitle = $_POST["workTitle"]; //일정 "제목"
$workDescription = $_POST["workDescription"]; //일정 "내용"
$userID = $_POST["userID"];

$calandarFile = fopen("./data/".$userID."_".$workDay.".txt", "a+");
fwrite($calandarFile, $workTitle."||");
fwrite($calandarFile, $workDescription."\n");
fclose($calandarFile);

echo "success";
?>