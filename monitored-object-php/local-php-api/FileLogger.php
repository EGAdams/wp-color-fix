<?php
/** @class FileLogger */
class FileLogger {
    public function __construct() {}
    
    public static function writeLog( $method, $text_to_log ) {
        date_default_timezone_set( 'EST' );
        $format = "%.9s %-37.37s %.3000s \r\n";
        $content = sprintf( $format, date( "g:i:s.u" ), ":" . substr( $method, -36, 36 ) . "() ", $text_to_log );
        file_put_contents ( dirname ( __FILE__ ) . "/file_logger_php.log", $content /*. "\r\n" */, FILE_APPEND | LOCK_EX ); }
    
    public function __destruct() {}
}