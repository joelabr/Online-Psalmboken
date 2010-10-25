<?php
  //Helper class to DRY out file uploads.
  class FileUploader
  {
    /*
      Uploads a file described by $file into
      $target_dir (using the same filename),
      if it's of any of the file types specified
      in $formats.
    */
    function upload($file, $target_dir, $formats) {
      if($this->valid_format($file['type'], $formats)) {
        $full_path = $target_dir . basename($file['name']);
        if(move_uploaded_file($file['tmp_name'], $full_path)) {
          return true;
        }
        else
        {
          $this->error = "Ett okänt problem uppstod.";
        }  
      }
      else
        $this->error = "Felaktigt format.";

      return false;
    }
    
    //Returns the last reported error
    function error() {
      return $this->error;
    }
    
    /*
      Returns true if $type is a valid format according to $types.
    */
    function valid_format($type, $types)
    {
      while(list(, $t) = each($types)) {
        if($t == $type)
          return true;
      }
      return false;
    }
  }
?>
