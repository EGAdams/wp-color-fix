<?php

/** @class MCBAFirebase */
class MCBAFirebase {
		private $regids = array();
		private $id, $firebase_logger, $logger;
        public $authorizationKey;

		public function __construct( $idArg ) {
			$this->id = $idArg;
			$this->authorizationKey = $this->get_gcm_key( $idArg );
			// $this->logger = new MCBAWriteLog();
			// $this->logger->writeLog( "{php} " . __METHOD__, " firebase object constructed. " );
        }

		public function setAuthorizationKey( $authorizationKeyArg ) {	$this->authorizationKey = $authorizationKeyArg;	}

		public function addRecipient( $id ) {	array_push( $this->regids, $id ); }

		public function sendPushNotification( $fields ) {
			$url = 'https://fcm.googleapis.com/fcm/send';
			// $this->logger->writeLog( __METHOD__, "sending push notification with key: " . $this->authorizationKey );
			// $this->logger->writeLog( __METHOD__, "sending push notification with url: " . $url                    );
			$headers = array( 'Authorization: key=' . $this->authorizationKey, 'Content-Type: application/json'   );
			$ch = curl_init();	                    // Open connection
			curl_setopt( $ch, CURLOPT_URL, $url );	// Set the url, number of POST vars, POST data
			curl_setopt( $ch, CURLOPT_POST, true );
			curl_setopt( $ch, CURLOPT_HTTPHEADER, $headers );
			curl_setopt( $ch, CURLOPT_RETURNTRANSFER, true );
			curl_setopt( $ch, CURLOPT_SSL_VERIFYPEER, false );	    // Disabling SSL Certificate support temporarily
			curl_setopt( $ch, CURLOPT_POSTFIELDS, json_encode( $fields ));
			// $this->logger->writeLog( __METHOD__, json_encode( $fields ));
			$result = curl_exec( $ch );	                                   // Execute post
			if ( $result === false ) {
				// $this->logger->writeLog( __METHOD__, 'Curl failed: ' . curl_error( $ch ));
				die( 'Curl failed: ' . curl_error( $ch )); }

			// $this->logger->writeLog( __METHOD__, "curl result in sendPushNotification: " . $result );
			$json_decoded = json_decode( $result );
			if ( isset( $json_decoded->results[ 0 ]->error )) {
				$error =  "*** ERROR: " . $json_decoded->results[ 0 ]->error . " *** "; 
            } elseif( $json_decoded->success == 1 ) {
                //
			} else { 
                //
            }
			
			curl_close( $ch );	// Close connection
			return $result;	}

		public function getRegistrationIds() { return $this->regids; }

		private function get_gcm_key( $mcba_id ) {
			$args = array(
				'method' => 'POST',
				'headers' => array(
					'Content-type: application/x-www-form-urlencoded',
				),
				'sslverify' => false,
				'body' => array(
					'mcba_id' => $mcba_id,
					'mcba_action' => 'get_push_keys',
				),);

			$result = wp_remote_post( 'http://mycustombusinessapp.com/MCBA-MasterServer/proxy.php', $args );

			if ( is_wp_error( $result )) { echo "Something went wrong: " . $result->get_error_message(); }

			if ( isset( $result[ 'error' ])) {
				echo "Error: <br>";
				echo '<br>RESULT: <pre>' . var_dump( $result ) . "</pre>", PHP_EOL;
				return $result;	}

			$jsonBody = json_decode( $result['body']);
			$gcmKey = $jsonBody->gcm_key;

			if ( strlen( $gcmKey ) == 0) { die( "<br><h1>No gcm key!</h1><br>" ); }

			// $logger = new MCBAWriteLog();
			// $logger->writeLog( __METHOD__, "gcmKey from wp_remote_host call: " . $gcmKey );
			return $gcmKey;	}
} // end of MCBAFirebase class 
