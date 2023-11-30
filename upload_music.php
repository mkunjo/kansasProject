<?php

$servername = "127.0.0.1";
$username = "bob";
$password = "";
$dbname = "MusicDB";

//Connecting to DB
$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error){
    die("Connection failed: ") . $conn->connect_error;
}

$targetDir = "/uploads/audio_uploads";

//Check if the file was uploaded
if(isset($_FILES['file']) && $_FILES['file']['error'] == 0){
    $filename = basename($_FILES["file"]["name"]);
    $targetPath = $targetDir.$fileName;

    //Moving file to targetPath
    if(move_uploaded_file($_FILES["file"]["tmp_name"], $targetPath)){
        //Moved successfully, write details to DB
        $sql="INSERT INTO songs (filename, filepath) VALUES ('$fileName','$targetPath')";
        if($conn->query($sql) == true){
            echo "File uploaded and saved to DB";
        }
        else{
            echo "Error: ".$sql."Error Details: ".$conn->error;
        }
    }
    else{
        echo "Error moving the file.";
    }
}
else{
    echo"File not uploaded";
}
$conn->close();