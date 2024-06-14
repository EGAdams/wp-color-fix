<?php

/** @class MCBAWriteLog */
class MCBAWriteLog {
    private $time, $class_method, $message, $database;

    public function __construct() {
        $this->database = $this->initialize_database();
        $this->time = date( "Y-m-d H:i:s" ); }

    public function writeLog( $class_methodArg, $messageArg) {
        $statement = $this->database->prepare( 'INSERT INTO debug_log (time, class_method, message ) VALUES(?, ?, ?)' );
        $result = $statement->execute( array( $this->time, $class_methodArg, sprintf( "[%-300.300s]", $messageArg)));
        return $result; }

    private function initialize_database() {
        try {
            global $wpdb;
            $db = new PDO( 'mysql:host=' . $wpdb->dbhost . '; dbname=' . $wpdb->dbname, $wpdb->dbuser, $wpdb->dbpassword);
            $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_WARNING);
            return $db;
        } catch ( PDOException $pDoException ) {
            file_put_contents( 'register.log', 'init db failure in McbaChatMessage.php' . '\r\n', FILE_APPEND | LOCK_EX);
            file_put_contents( 'register.log', $pDoException->getMessage() . '\r\n', FILE_APPEND | LOCK_EX);
            die( json_encode( array( 'error' => $pDoException->getMessage()))); }
    }
    public function __destruct() {}
} 
