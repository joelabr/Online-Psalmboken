<?php
  require('authentication.php');
  require('fileuploader.php'); 

  //Take value from associative array, or return "".
  function take($array, $value) {
    if(isset($array[$value]))
      return $array[$value];
    else
      return "";
  }
 
  //Form parameters
  $form_action = "uploadhymn.php";
  $form_legend = "Ladda upp psalm";
  
  if(isset($_FILES["file"])) {
    $dirs = array("audio/mpeg" => "mp3", "video/ogg" => "ogg", "audio/midi" => "midi");
    $target_dir = "../hymns/".take($dirs, $_FILES["file"]["type"])."/";
    $formats = array("video/ogg", "audio/midi", "audio/mpeg");
    $uploader = new FileUploader();
    
    if($uploader->upload($_FILES["file"], $target_dir, $formats)) {
      $form_message = "Filen har laddats upp.";
    }
    else
      $form_message = $uploader->error();
  }

?>

<html>
  <head>
    <title>Online-Psalmboken</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  </head>
  <body>
    <p>
      <a href="index.php">Start</a> &raquo;
      <a href="">Ladda upp psalm</a>
    </p>
    <?php require('uploadform.php') ?>
  </body>
</html>
