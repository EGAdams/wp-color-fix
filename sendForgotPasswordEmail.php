<?php
header("Access-Control-Allow-Origin: *");
require_once('MCBAWriteLog.php');
include '../../../wp-load.php';  // pulls in wp_mail()...

$logger = new MCBAWriteLog();

function send_verification_email($email, $security_token)
{
    global $logger;
    $theUrl = site_url() . "?security_token=" . $security_token;
    $logger->writeLog("send_verification_email()", "sending verification email to " . $email . "...");
    $logger->writeLog("send_verification_email()", "url: " . $theUrl );
    wp_mail(
        $email,
        "Your Password Reset Link",
        "We will be happy to help you reset your password." .
            "\n\nPlease click on the link below to verify your identity:\n\n " . $theUrl
    );
}

if (!function_exists('initialize_database')) {
    function initialize_database()
    {
        global $logger, $wpdb;
        try {
            $db = new PDO( 'mysql:host=' . $wpdb->dbhost . '; dbname=' . $wpdb->dbname, $wpdb->dbuser, $wpdb->dbpassword );
            $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            return $db;
        } catch (PDOException $e) {
            file_put_contents('register.log', $e->getMessage() . '\r\n', FILE_APPEND | LOCK_EX);
            $logger->writeLog("{php} " . __METHOD__, $e->getMessage() . "... ");
            die(json_encode(array('error' => $e->getMessage())));
        }
    }

    if (isset($_GET['email'])) {
        $email = $_GET['email'];
    } else {
        $message = "no information sent.  exiting process... ";
        $logger->writeLog("sendForgotPasswordEmail.php", $message);
        die($message);
    }
}

$email = $_GET['email'];
$security_token = $_GET['security_token'];

$database = initialize_database();
echo "sending email to: " . $email;
send_verification_email($email, $security_token);
echo "done sending email.";

