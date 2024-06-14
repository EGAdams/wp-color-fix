<?php
defined('ABSPATH') || exit;
/*
 * PHP: Recursively Backup Files & Folders to ZIP-File
 * (c) 2012-2014: Marvin Menzerath - http://menzerath.eu
*/
global $wp_filesystem;
    
	// Initialize the WP filesystem, no more using 'file-put-contents' function
if (empty($wp_filesystem)) {
	require_once (ABSPATH . '/wp-admin/includes/file.php');
	WP_Filesystem();
}

// Make sure the script can handle large folders/files
ini_set('max_execution_time', 600);
ini_set('memory_limit','1024M');
   
function zipData($source, $destination) {
	global $wp_filesystem;
	$destination = $destination.date('Gi').'.zip';
	if (extension_loaded('zip')) {
		if (file_exists($source)) {
			$zip = new ZipArchive();
			if ($zip->open($destination, ZIPARCHIVE::CREATE)) {
				$source = realpath($source);
				if (is_dir($source)) {
                        		$iterator = new RecursiveDirectoryIterator($source);
                        		// skip dot files while iterating 
                        		$iterator->setFlags(RecursiveDirectoryIterator::SKIP_DOTS);
                        		$files = new RecursiveIteratorIterator($iterator, RecursiveIteratorIterator::SELF_FIRST);
					foreach ($files as $file) {
						$file = realpath($file);
						$path_parts = pathinfo($file);
                        if ( isset ( $path_parts[ 'extension'])) {
                            if (strcmp($path_parts['extension'], "zip") !== 0) {						
                                if (is_dir($file)) {
                                    $zip->addEmptyDir(str_replace($source . '/', '', $file . '/'));
                                } else if (is_file($file)) {
                                    $zip->addFromString(str_replace($source . '/', '', $file), $wp_filesystem->get_contents($file));
                                }
                            }
                        }
					}
				} else if (is_file($source)) {
					$zip->addFromString(basename($source), $wp_filesystem->get_contents($source));
				}
			}
			return $zip->close();
		}
	}
	return false;
}
?>