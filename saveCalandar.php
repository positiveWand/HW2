<?php
$userID = $_POST["userID"];
$sunList = $_POST["Sun"];
$monList = $_POST["Mon"];
$tueList = $_POST["Tue"];
$wedList = $_POST["Wed"];
$thuList = $_POST["Thu"];
$friList = $_POST["Fri"];
$satList = $_POST["Sat"];

$dayList = array($sunList, $monList, $tueList, $wedList, $thuList, $friList, $satList);

$day = array("Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat");
$count = 0;

foreach($dayList as $aDay) {
    $workDay = $day[$count]; //일정 "날짜"
    $calandarFile = fopen("./data/".$userID."_".$workDay.".txt", "w");
    foreach($aDay as $aWork) {
        $workID = $aWork["id"];
        $workTitle = $aWork["title"]; //일정 "제목"
        $workDescription = $aWork["description"]; //일정 "내용"
        fwrite($calandarFile, $workID."||");
        fwrite($calandarFile, $workTitle."||");
        fwrite($calandarFile, $workDescription."\n");
        fclose($calandarFile);
    }
    $count = $count + 1;
}

echo "success";
?>