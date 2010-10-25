<form action="<?php echo $form_action; ?>" method="post" enctype="multipart/form-data">
  <fieldset>
    <legend><?php echo $form_legend; ?></legend>
    <?php
      if(isset($form_message)) 
        echo "<p>".$form_message."</p>";
    ?>
    <p>
      <input name="file" value="" type="file" />
    </p>
    <p>      
      <input name="upload" value="Ladda upp" type="submit" />
    </p>
  </fieldset>
</form>
