<?php
 
/**
 * @author EG August 9, 2018
 */
class Util {
	public function __construct() {}

	public static function writeLog( $method, $text_to_log ) {
		date_default_timezone_set('EST');
		$format = "%.9s %-37.37s %s \r\n";
        $content = sprintf($format, date("g:i:s.u"), ":" . $method . "() ", $text_to_log);
		file_put_contents ( dirname ( __FILE__ ) . "/register.log", $content /*. "\r\n" */, FILE_APPEND | LOCK_EX );
	}

	public function __destruct() {}
}



/**

	https://stackoverflow.com/questions/7039010/how-to-make-alignment-on-console-in-php

	fixed width
	$mask = "|%5.5s |%-30.30s | x |\n";
	printf($mask, 'Num', 'Title');
	printf($mask, '1', 'A value that fits the cell');
	printf($mask, '2', 'A too long value the end of which will be cut off');

	The output is

	|  Num |Title                          | x |
	|    1 |A value that fits the cell     | x |
	|    2 |A too long value the end of wh | x |

*/





