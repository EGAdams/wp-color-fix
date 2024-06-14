<?php
defined('ABSPATH') || exit;
function handle_skeleton_dir() {

   $file1  = MCBA_DIR . 'www';
   $file2  = MCBA_UPLOADS_DIR . '/MCBA/www';
   $folder = MCBA_UPLOADS_DIR . '/MCBA/www';

   zipData($folder, $file2); // will autorename with datestamp         
   if (!file_exists($folder)) {
       //echo($folder. " doesn't exist");
       mkdir($folder, 0755, true); // ensures the top level dir is created
       xcopy($file1, $file2);
   } 
}

// removes files and non-empty directories
function rrmdir($dir) {
  if (is_dir($dir)) {
    $files = scandir($dir);
    foreach ($files as $file)
    if ($file != "." && $file != "..") rrmdir("$dir/$file");
    rmdir($dir);
  }
  else if (file_exists($dir)) unlink($dir);
} 

function xcopy($source, $dest, $permissions = 0755)
{
    // Check for symlinks
    if (is_link($source)) {
        return symlink(readlink($source), $dest);
    }

    // Simple copy for a file
    if (is_file($source)) {
        return copy($source, $dest);
    }

    // Make destination directory
    if (!is_dir($dest)) {
        //mkdir($dest, $permissions);
        if(! @mkdir($dest, $permissions)){
    		$mkdirErrorArray = error_get_last();
    		throw new Exception('cant create directory ' .$mkdirErrorArray['message'], 1);
	    }
    }
    // Loop through the folder
    $dir = dir($source);
    while (false !== $entry = $dir->read()) {
        // Skip pointers
        if ($entry == '.' || $entry == '..') {
            continue;
        }
        // Deep copy directories
        xcopy("$source/$entry", "$dest/$entry", $permissions);
    }
    // Clean up
    $dir->close();
    return true;
}
