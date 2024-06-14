<?php
require_once 'WriteLog.php';
$logger = new WriteLog();
$logger->writeLog(__METHOD__, "In messaging.php ...");

if ($_POST['messaging'] === 'get_admins') {
    get_admins();
} elseif ($_POST['messaging'] === 'get_admin_token') {
    get_admin_token();
} elseif ($_POST['messaging'] === 'get_admin') {
    get_admin(); }

function get_admins() {
    global $logger, $wpdb;
    $logger->writeLog( __METHOD__,   "in get_admins()... " );
    $db = new mysqli( $wpdb->dbhost, $wpdb->dbuser, $wpdb->dbpassword, $wpdb->dbname );
    if ($db->connect_errno) {
        printf("Connect failed: %s\n", $db->connect_error);
        exit(); }
    $query = "SELECT uid FROM wp_mcba_users WHERE isAdmin";
    if ($result = mysqli_query($db, $query)) {
        $regids = array();
        while ($row = mysqli_fetch_assoc($result)) { $regids[] = $row['uid']; }}
    echo json_encode(array(
        "result" => "success",
        "regids" => $regids
    )); }

function get_admin() {
    /*
     * the get_admin() method was written because swift doesn't
     * seem to understand arrays.  this is very frustrating.
     */
    global $logger, $wpdb;
    $logger->writeLog(__METHOD__,   "in get_admin()... ");
    $db = new mysqli( $wpdb->dbhost, $wpdb->dbuser, $wpdb->dbpassword, $wpdb->dbname );
    if ($db->connect_errno) {
        printf("Connect failed: %s\n", $db->connect_error);
        exit();
    }
    $query = "SELECT ID FROM wp_mcba_users WHERE isAdmin LIMIT 1";
    if ($result = mysqli_query($db, $query)) {
        while ($row = mysqli_fetch_assoc($result)) {
            $regid = $row['ID'];
        }
    }
    echo json_encode(array(
        "result" => "success",
        "regid" => $regid,
        "query" => $query
    ));
}

function get_company_name( $mcba_id ) {
    global $logger;
    $logger->writeLog(__METHOD__,   "in get_company_name()... ");
    $fields = array( 'mcba_id' => $mcba_id, 'mcba_action' => 'status' );
    $logger->writeLog(__METHOD__, "mcba_id: " . $mcba_id);
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, 'http://mycustombusinessapp.com/MCBA-MasterServer/proxy.php');
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HEADER, false);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $fields);
    $result = curl_exec($ch);
    $result = json_decode($result, true);
    $logger->writeLog(__METHOD__,   "result[error]: " . $result['error']);
    if (isset($result['error'])) {
        echo "Error: <br>";
        echo '<pre>' . var_dump($result) . "</pre>", PHP_EOL;
        return $result; }
    $name = $result['name'];
    $logger->writeLog(__METHOD__, "result[name] = " . $result["name"]);
    return $name; }

function get_admin_token() {
    /*
     * The contents of this internal buffer may be copied into a string variable using ob_get_contents().
     * To output what is stored in the internal buffer, use ob_end_flush().
     * Alternatively, ob_end_clean() will silently discard the buffer contents.
     */

    /*
     * also grabs admin email as of january 16, 2019 -EG
     * while we're at it, lets get the expert name too.  june 21, 2019 -EG
     */
    ob_start();
    global $logger, $wpdb;

    $logger->writeLog(__METHOD__,   "in get_admin_token()... ");
    $logger->writeLog(__METHOD__, "dbhost: " .     $wpdb->dbhost     );
    $logger->writeLog(__METHOD__, "dbname: " .     $wpdb->dbname     );
    $logger->writeLog(__METHOD__, "dbuser: " .     $wpdb->dbuser     );
    $logger->writeLog(__METHOD__, "dbpassword: " . $wpdb->dbpassword );
    $db = new mysqli( $wpdb->dbhost, $wpdb->dbuser, $wpdb->dbpassword, $wpdb->dbname );
    if ($db->connect_errno) {
        printf("Connect failed: %s\n", $db->connect_error);
        exit(); }
    $query = "SELECT ID, first_name, last_name, pushid, email FROM wp_mcba_users WHERE isAdmin";
    $logger->writeLog(__METHOD__, "getting data with query: " . $query);

    if ($result = mysqli_query($db, $query)) { $row = $result->fetch_assoc(); }
    $regid = $row["ID"];
    $logger->writeLog(__METHOD__, "regid = " . $regid);
    $expert_name = "";
    $json_encoded = json_encode(array(
        "result"        => "success",
        "ID"            => $regid,
        "token"         => $row['pushid'],
        "email"         => $row['email'],
        "expert_name"   => $expert_name,
        "first_name"    => $row['first_name'],
        "last_name"     => $row['last_name']
    ));
    $logger->writeLog(__METHOD__, "json encoded: " . $json_encoded);
    ob_flush();
    echo $json_encoded;
}
