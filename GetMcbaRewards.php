<?php
require_once dirname( __FILE__ ) . "/monitored-object-php/monitored-object/LoggerFactory.php";

/** @class GetMcbaRewards */
class GetMcbaRewards {
	private $email, $logger;

	public function __construct( $email ) {
		$this->email = $email;
		$this->logger = LoggerFactory::getLogger( "GetRewardsLogger" );
		$this->logger->logUpdate( "constructed using email: [" . $this->email . "]" ); }

	public function run() {
		$this->logger->logUpdate( "GetMcbaRewards run() called." );
		$url = ADMIN_URL . "?action=get_mcba_rewards&email=";
		$url .= $this->email;
		$ch = curl_init( );
		curl_setopt( $ch, CURLOPT_URL, $url );
		curl_setopt( $ch, CURLOPT_HEADER, false );
		$this->logger->logUpdate( "calling curl_exec() ..." );
		$result = curl_exec( $ch );
		$this->logger->logUpdate( "curl_exec() returned. checking if result is numeric..." );
		if ( is_numeric( $result )) {
			$this->logger->logUpdate( "finished getting result and it is numeric.  echoing result ..." );
		} else { $this->logger->logUpdate( "*** ERROR: result is not numeric. ***" );
			$result = "result is not numeric";}
		echo $result;
		curl_close( $ch ); }
}
