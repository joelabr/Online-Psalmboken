<?php
  require('authentication.php');
?>

<!DOCTYPE html>
<html>
  <head>
    <title>Online-Psalmboken</title>
    <link href="../css/reset.css" rel="stylesheet" type="text/css" />
    <link href="../css/site.css" rel="stylesheet" type="text/css" />
    <link href="http://fonts.googleapis.com/css?family=Crimson+Text" rel="stylesheet" type="text/css">
    <link href='http://fonts.googleapis.com/css?family=Neuton' rel='stylesheet' type='text/css'>
    <link href="../css/text.css" rel="stylesheet" type="text/css" />
  </head>
  <body>
    <h6>Administrationsverktyg</h6>
    <div class="box">
      <p>
        <a href="../xml/hymnbooks/">Ladda ner psalmbok</a><br/>
        <a href="uploadhymnbook.php">Ladda upp psalmbok</a>
      </p>
      <p>
        <a href="../hymns">Ladda ner psalm</a><br/>
        <a href="uploadhymn.php">Ladda upp psalm</a>
      </p>
    </div>
  </body>
</html>
