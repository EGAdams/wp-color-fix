<?php

$config = file_get_contents( dirname(__FILE__) . "/app_config.json" );
$config = substr($config, strpos($config, "=") + 1, -1);
$config = json_decode( $config, true);
$templateDir = $config['template'];

$files = ListIn("./templates/" . $templateDir);
for( $i = 0; $i < count($files); $i++ ){
	$files[$i] = "templates/".$templateDir."/".$files[$i];
}

$js = ListIn( "./js");
for( $i = 0; $i < count($js); $i++ ){
	$files[] = "js/" . $js[$i];
}

$css = ListIn( "./css");
for( $i = 0; $i < count($css); $i++ ){
	$files[] = "css/" . $css[$i];
}

$img = ListIn( "./images");
for( $i = 0; $i < count($img); $i++ ){
	$files[] = "images/" . $img[$i];
}

$webfonts = ListIn( "./webfonts" );
for( $i = 0; $i < count( $webfonts ); $i++ ) {
	$files[] = "webfonts/" . $webfonts[ $i ];
}

$files[] = "app_config.json";
$files[] = "index.php";
$files[] = "init.js";


echo json_encode(
		array(
			"version" => intval( file_get_contents(dirname(__FILE__).'/version.txt' )),
			"map" => $files
		)
	);

function ListIn( $dir, $prefix = '' ) {
	$dir = rtrim ( $dir, '\\/' );
	$result = array ();
	
	
	if( basename ( $dir ) == "backup" ){
		return $result;
	}
	
	foreach ( scandir ( $dir ) as $f ) {
		if ($f !== '.' && $f !== '..' && strpos ( $f, '~' ) === false && strpos ( $f, 'sitemap' ) === false) {
			
			if (is_dir ( "$dir/$f" )) {
				$result = array_merge ( $result, ListIn ( "$dir/$f", "$prefix$f/" ) );
			} else {
				$result [] = $prefix . $f;
			}
		}
	}
	return $result;
}
?>