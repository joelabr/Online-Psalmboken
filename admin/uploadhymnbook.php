<?php
  require('authentication.php');
  require('fileuploader.php');
  
  //Form parameters
  $form_action = "uploadhymnbook.php";
  $form_legend = "Ladda upp psalmbok";
  
  if(isset($_FILES["file"])) {
    $uploader = new FileUploader();
    if($uploader->upload($_FILES["file"], "../xml/hymnbooks/", array("text/xml"))) {
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
      <a href="">Ladda upp psalmbok</a>
    </p>
    <?php require('uploadform.php') ?>
  </body>
</html>
