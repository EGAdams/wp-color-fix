<?php error_reporting(E_ALL & ~E_NOTICE); ?>
<!DOCTYPE html>
<html>

<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />

	<!--  Mobile Specific Metas -->
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
	<meta http-equiv="cache-control" content="no-cache" />
	<title>My Custom Business App</title>

	<script type="text/javascript">
		function loadjscssfile(filename, filetype) {
			if (filetype == "js") {
				var fileref = document.createElement('script');
				fileref.setAttribute("type", "text/javascript");
				fileref.setAttribute("src", filename);
			} else if (filetype == "css") {
				var fileref = document.createElement("link");
				fileref.setAttribute("rel", "stylesheet");
				fileref.setAttribute("type", "text/css");
				fileref.setAttribute("href", filename);
			}
			if (typeof fileref != "undefined")
				document.getElementsByTagName("head")[0].appendChild(fileref);
		}
	</script>
	<?php
	if ($_GET['mobile'] === 'true') {

		// Mobile side
		echo '<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>';
		echo '<script type="text/javascript" src="app_config.json"></script>
	    <script> 
	    var templateDir = "templates/" + config_data.template + "/";
		loadjscssfile( "templates/" + config_data.template + "/css/all.min.css", "css" );
		loadjscssfile( "templates/" + config_data.template + "/css/font-awesome.min.css", "css" );
		</script>';
	} else if ($_GET['template']) {
		//! Web side  *** Left Column! ***
		echo '<script type="text/javascript" src="app_config.json"></script>';
		echo '<script>';

		echo 'console.log( config_data.template )';
		echo 'console.log( "templates/" + config_data.template + "/template.json" );';
		echo 'loadjscssfile( "templates/" + config_data.template + "/template.json", "js" );';
		echo 'loadjscssfile( "templates/" + config_data.template + "/template.json", "js" );';
		echo 'loadjscssfile( "templates/" + config_data.template + "/css/all.min.css", "css" );';
		echo 'var templateDir = "templates/" + config_data.template + "/";';
		echo '</script>';
	} ?>
	<script type="text/javascript" src="init.js"></script>
	<?php

	if ($_GET['mobile'] != 'true') {
		echo '<script type="text/javascript"> 
      		indexFile = "index.php"; 
      		isMockup = true; 
			  </script>';
	}

	?>
</head>

<body>
</body>

</html>