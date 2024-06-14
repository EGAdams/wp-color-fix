<?php
require_once dirname( __FILE__ ) . "/monitored-object-php/monitored-object/LoggerFactory.php";

/** @class SetMcbaRewards */
class SetMcbaRewards {
	private $email, $total_rewards, $logger;

	public function __construct( $email, $total_rewards ) {
		$this->email = $email;
		$this->total_rewards = $total_rewards;
		$this->logger = LoggerFactory::getLogger( "SetRewardsLogger" );
		$this->logger->logUpdate( "constructed using email: [" . $this->email . "]" ); }

	public function run() {
		$this->logger->logUpdate( "SetMcbaRewards run() called." );
		$url = "http://localhost:8080/wp-admin/admin-ajax.php?action=set_mcba_rewards&email=";
		$url .= $this->email;
		$url .= "&total_rewards=" . $this->total_rewards;
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
