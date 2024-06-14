<?php
class DatabaseInitializer {
    public function initialize_database() {
        global $logger;
        try {
            global $wpdb;
            $db = new PDO( 'mysql:host=' . $wpdb->dbhost . '; dbname=' . $wpdb->dbname, $wpdb->dbuser, $wpdb->dbpassword );
            $db->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION );
            return $db;
        } catch ( PDOException $e ) {
            file_put_contents( 'register.log', $e->getMessage() . '\r\n', FILE_APPEND | LOCK_EX );
            $logger->writeLog( "{php} " . __METHOD__, $e->getMessage() . "... " );
            die( json_encode( array( 'error' => $e->getMessage()))); }}
}
?>
