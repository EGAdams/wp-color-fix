<?php
// include '../../../../wp-load.php';  // pulls in wp_mail()...
require_once( ABSPATH . 'wp-load.php' ); // pulls in wp_mail()...
require_once dirname( __FILE__ ) . '/../monitored-object-php/monitored-object/LoggerFactory.php';

/*
 * class SecurityTokenMailer
 */
class SecurityTokenMailer {
    private $logger;
    public function __construct() { 
        $this->logger = LoggerFactory::getLogger( "SecurityTokenMailerLog" );
        $this->logger->logUpdate( "SecurityTokenMailerLog constructed." ); }

    function send_verification_email() {
        $theUrl = site_url() . "?security_token=" . $_POST[ "security_token" ];
        $this->logger->logUpdate( "send_verification_email()", "sending verification email to " . $_POST[ "email" ] . "..." );
        $this->logger->logUpdate( "send_verification_email()", "url: " . $theUrl );
        wp_mail( $_POST[ "email" ], "Your Password Reset Link", "We will be happy to help you reset your password." .
                "\n\nPlease click on the link below to verify your identity:\n\n " . $theUrl ); }
}  // end class SecurityTokenMailer 
?>
