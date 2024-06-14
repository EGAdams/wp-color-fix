<?php
defined( 'ABSPATH') || exit;

require_once dirname(__FILE__) . "/monitored-object-php/monitored-object/LoggerFactory.php";

if (!class_exists( 'McbaUtil')) {
	class McbaUtil {
		public function __construct() {}
		public static function writeLog(  $method, $text_to_log ) {
			$format = "%.9s %-37.37s %.700s \r\n";
			$content = sprintf( $format, date( "g:i:s.u"), ":" . substr( $method, -36, 36) . "() ",  "McbaChatMessage:" . $text_to_log);
			file_put_contents(dirname(__FILE__) . "/register.log", $content/*. "\r\n" */, FILE_APPEND | LOCK_EX);
		}
		public function __destruct() {}}}

if (!class_exists( 'MCBAChatMessage')) {
	class MCBAChatMessage {
        private $mcba_chat_message = null;
		private $sender_token = "";
		private $recipient_token = "";
		private $sender = "";
		private $date = "";
		private $message = "";
		private $sender_photo_url = "";
		private $database = null;
		private $admin_email = "";
		private $user_email = "";
		private $logger = null;
		private $mcba_chat_logger = null;
		private $conversation_id = "";
		private $sender_id = 0;
		private $mcba_id = "";
		private $admin_email_alias = "";
		private $email = "";
		private $messageFromAdmin = 0;
		private $from_email = "";

		public function __construct( $sender_token,	$recipient_token, $sender, $date, $message,	$sender_photo_url,
			                         $conversation_id, $mcba_id, $email, $fromEmail ) {
            
            $constructor_logger = LoggerFactory::getLogger( "McbaChatMessageStartup" );
            $constructor_logger->logUpdate( "logger initialized." );
            $constructor_logger->logUpdate( "inside constructor for McbaChatMessage.php..." );
			$constructor_logger->logUpdate( "conversation_id in the constructor: " . $conversation_id );
			$constructor_logger->logUpdate( "sender token length: " . strlen( $sender_token ));
		    $constructor_logger->logUpdate( "email: " . $email );
		    $constructor_logger->logUpdate( "sender: " . $sender );

			$this->setMcba_id( $mcba_id );
			$this->setSenderToken( $sender_token);
			$this->setRecipientToken( $recipient_token);
			$this->setSenderName( $sender );
			$this->setDate( $date );
			$this->setMessage( $message );
			$this->setSenderPhoto( $sender_photo_url );
			$this->setConversationId( $conversation_id );
			$this->setEmail( $email );
			$this->setFromEmail( $fromEmail );
        
			$constructor_logger->logUpdate( "initializing database..." );
			$this->database = $this->initialize_database();
            if ( $this->database == null ) {
                $constructor_logger->logUpdate( "*** ERROR: database not initialized! ***" );
            } else {
                $constructor_logger->logUpdate( "database initialized." );
            }

			if (strlen( $sender_token) == 0 &&       /////////////////////////////////////////////////
				strlen( $recipient_token) == 0 &&    //   almost no information was sent.           //
				strlen( $sender) == 0 &&             //   object must being used for non-chat work. //
				strlen( $date ) == 0 &&               /////////////////////////////////////////////////
				strlen( $message ) == 0 &&
				strlen( $sender_photo_url) == 0 &&
				strlen( $conversation_id ) == 0 &&
				strlen( $mcba_id ) == 0) {
				

				$this->getAdminEmailFromDatabase();

				/*
				* chat object was constructed for something else...  do nothing else.
				* it's probably being used to create a conversation that doesn't exist yet
				* in case you're wondering.
				*/
				$constructor_logger->logUpdate( "only partial construction." );
				$constructor_logger->logUpdate( "admin email set to: " . $this->admin_email );
				$this->mcba_id = $this->getMcbaIdFromDatabase();
				$constructor_logger->logUpdate( "after database call.  getting alias with id: " . $this->mcba_id );
				$this->admin_email_alias = $this->getAdminAlias( $this->mcba_id );
				$constructor_logger->logUpdate( "finished setting email alias to: " . $this->admin_email_alias );

			} else { // ...the normal control flow

				$this->getAdminEmailFromDatabase();

				if ( $this->admin_email != $this->email) {
					$constructor_logger->logUpdate( "this->email: " . $this->email . "... " );
					if (strlen( $this->email) != 0) {
						$this->user_email = $this->email;
					} else {
						$constructor_logger->logUpdate( "this email is blank.  getting user email... " );
						$this->getUserEmailFromDatabase();
						$constructor_logger->logUpdate( "getting user email from database... " );
						$this->email = $this->user_email;
					}
				} else {
					$constructor_logger->logUpdate( "getting user email from database... " );
					$this->getUserEmailFromDatabase();
					$constructor_logger->logUpdate( "finished getting user email from database. " );
				}

				$constructor_logger->logUpdate( "normal control flow:  user: " . $this->user_email . "  admin: " . $this->admin_email );
				if ( $this->user_email == $this->admin_email) {
					$error_message = "*** ERROR: admin email is the same as sender / user email!  exiting process. ***";
					$constructor_logger->logUpdate( $error_message );
					die( $error_message );
				}

				$constructor_logger->logUpdate( "getting id if sender has a name, otherwise use user_email... " );
				$constructor_logger->logUpdate( "sender name: " . $this->getSenderName() . "... " );

				$constructor_logger->logUpdate( "getting from email for anonymous browsers 1st... " );
                $sender_email = "";
				if (strlen( $this->getFromEmail()) != 0) {
                    $constructor_logger->logUpdate( "get from email is not blank... " );
					$constructor_logger->logUpdate( "setting sender user email to: " . $this->getFromEmail() . "... " );
					if ( $this->admin_email == $this->getFromEmail()) {
						$constructor_logger->logUpdate( "This IS a message from admin. " );
                        $sender_email = $this->getFromEmail();
					} else {
						$constructor_logger->logUpdate( "This IS NOT a message from the Administrator." );
						$sender_email = $this->getFromEmail();
                        // if sender email is blank, use this->email instead.
                        if ( $sender_email == "" ) {
                            $constructor_logger->logUpdate( "sender email is blank.  using this->email instead. " );
                            $sender_email = $this->email;
                            if ( $sender_email == "" ) {
                                die( $constructor_logger->logUpdate( "*** ERROR: sender email is blank.  exiting process. ***" ));
                            }
                        } else {
                            $constructor_logger->logUpdate( "sender email is not blank.  using it. " );
                        }
					}
					// $this->getSenderIdFromDatabase();
					$constructor_logger->logUpdate( "setting sender_id and sender to sender_email [" . $sender_email . "]." );
					$this->setSenderName( $sender_email );
					$this->sender_id =    $sender_email;
				} elseif (strlen( $this->getSenderName()) == 0) {
                    if ( $sender_email == "" ) {
                        $constructor_logger->logUpdate( "sender email is blank.  using this->email instead... " );
                        $sender_email = $this->email;
                    }
					$constructor_logger->logUpdate( "setting sender name and sender id to sender_email.  not admin? [" . $sender_email . "]." );
					$this->setSenderName( $sender_email );
					$this->sender_id = $sender_email;
				} else {
					$constructor_logger->logUpdate( "***ERROR: something is wrong. sender has a name: " . $this->getSenderName() . ", getting id... check the logic here. ***" );
					 $this->getSenderIdFromDatabase();
				}
				$constructor_logger->logUpdate( "after last if.  user email is: " . $this->user_email . "... " );
				$constructor_logger->logUpdate( "getting mcba id from database... " );
				$this->mcba_id = $this->getMcbaIdFromDatabase();
				$constructor_logger->logUpdate( "this->mcba_id: " . $this->mcba_id . "." );
				$constructor_logger->logUpdate(  "in the normal flow, getting alias with id: " . $this->mcba_id );
				$this->admin_email_alias = $this->getAdminAlias( $this->mcba_id );
				$constructor_logger->logUpdate(  "email alias set to: " . $this->admin_email_alias );
			}
            $constructor_logger->logUpdate( "finished constructor." );
		}

		public function getAdminAlias( $mcba_id ) {
			$url = 'http://mycustombusinessapp.com/MCBA-MasterServer/proxy.php';
			$data = array( 'mcba_id' => $mcba_id, 'mcba_action' => 'status' );

			// use key 'http' even if you send the request to https://...
			$options = array(
				'http' => array(
					'header' => "Content-type: application/x-www-form-urlencoded\r\n",
					'method' => 'POST',
					'content' => http_build_query( $data),
				),
			);
			$context = stream_context_create( $options );
			$result = file_get_contents( $url, false, $context);

			//$this->mcba_chat_logger->logUpdate( "result = " . $result);

			$jsonBody = json_decode( $result);
			$url = $jsonBody->url;

			//$this->mcba_chat_logger->logUpdate( "url = " . $url );

			/*
			* set the alias!
			*/
			return $this->get_expert_address( $url );
		}

		private function get_expert_address( $url) {
            global $mcba_chat_message_startup;
			//https://www.php.net/manual/en/function.preg-match.php

			// get host name from URL
			preg_match( '@^(?:http://)?([^/]+)@i', $url, $matches );
			$host = $matches[1];
            // $mcba_chat_message_startup->logUpdate( "url: "  . $url  );
            // $mcba_chat_message_startup->logUpdate( "host: " . $host );
		
			preg_match( '/[^.]+\.[^.]+$/', $host, $matches ); // get last two segments of host name
			$size_of_matches = sizeof( $matches );
			// $mcba_chat_message_startup->logUpdate( "size of matches: " . $size_of_matches );

            if ( $size_of_matches != 0 ) { $domain_name = $matches[ 0 ]; } else { $domain_name = "localhost:80"; }
			return "expert@" . $domain_name; }

		private function getSenderIdFromDatabase() {
			// gets sender name which is just the key sender: and is just the email right now.
			// also gets administrative status
            global $mcba_chat_message_startup;
            $sender_name = $this->getSenderName();
			$sql = "SELECT ID, isAdmin FROM `wp_mcba_users` WHERE `email`='" . $sender_name . "'";
			// $mcba_chat_message_startup->logUpdate( "checking if $sender_name is an administrator or not... " );
			$statement = $this->database->prepare( $sql );
			$statement->execute();

			$result = $statement->fetchAll();
            // $mcba_chat_message_startup->logUpdate( "result array size: " . sizeof( $result));
            
            if ( !empty( $result )) {
                $this->sender_id = $result[ 0 ][ 'ID' ];
                $this->setMessageFromAdmin( $result[ 0 ][ 'isAdmin' ]);
            }
			
			if( strlen( $this->sender_id ) == 0 || $this->sender_id == 0 ) {
				// $mcba_chat_message_startup->logUpdate( "*** ERROR: this->sender_id is zero inside getSenderIdFromDatabase! ***" );
			 } else {
				// $mcba_chat_message_startup->logUpdate( "sender is still: " . $this->sender_id );
			 }
			
			if (strlen( $this->sender_id ) == 0) {
				// $mcba_chat_message_startup->logUpdate( "setting id to: " . $this->getSenderName() . "... " );
				if (strlen( $this->getSenderName()) == 0) {
					$error_message = "*** ERROR: no sender name! ***";
					// $mcba_chat_message_startup->logUpdate( $error_message );
					die( $error_message );
				} else {
					$this->sender_id = $this->getSenderName();
				}
			} else {
				// $mcba_chat_message_startup->logUpdate( "sender_id is not being set here because strlen( this->sender_id ) is: " .
				// strlen( $this->sender_id ));
			}
			if( strlen( $this->sender_id ) == 0 || $this->sender_id == 0 ) {
				// $mcba_chat_message_startup->logUpdate( "*** ERROR: this->sender_id is zero again! ***" );
			 } else {
				// $mcba_chat_message_startup->logUpdate( "sender is still: " . $this->sender_id );
			 }
		}

		private function getMcbaIdFromDatabase() {
            global $mcba_chat_message_startup;
			// $mcba_chat_message_startup->logUpdate( "entering getMcbaIdFromDatabase()..." );
			$sql = "SELECT mcba_id from `wp_mcba` WHERE 1 LIMIT 1";
			$statement = $this->database->prepare( $sql );
			$statement->execute();
			$result = $statement->fetchAll();
			// $mcba_chat_message_startup->logUpdate( "mcba_id: " . $result[ 0 ][ 'mcba_id']);
			return $result[ 0 ][ 'mcba_id'];
		}

		private function getAdminEmailFromDatabase() {
            global $mcba_chat_message_startup;
			$sql = "SELECT email FROM `wp_mcba_users` WHERE `isAdmin`='1'";
			$statement = $this->database->prepare( $sql );
			$statement->execute();

			$result = $statement->fetchAll();
			// $mcba_chat_message_startup->logUpdate( "admin: " . $result[ 0 ][ 'email']);
			$this-> admin_email = $result[ 0 ][ 'email'];
		}

		public function getUserEmailFromDatabase() { // recipient could be admin!!!!!!
            $getUserEmailFromDatabase_logger = LoggerFactory::getLogger( "GetUserEmailFromDatabaseLogger" );
			$getUserEmailFromDatabase_logger->logUpdate( "this recipient: ..." . substr ( $this->recipient_token, -5, 5 ));
			if (strlen( $this->recipient_token) == 0) {
                global $mcba_chat_message_startup;
				$getUserEmailFromDatabase_logger->logUpdate( "conversation id: " . $this->getConversationId());
				/*
				* get user from conversation table.  recipient is unknown.  this must be a message from admin.
				* in that case, get the information from the conversation table since we know the id.
				*/
				$this->user_email = $this->getUserEmailFromConversationTable();
			} else {
				$sql = "SELECT email FROM `wp_mcba_users` WHERE `pushid`='" . $this->recipient_token . "'";
				$statement = $this->database->prepare( $sql );
				$statement->execute();
				$result = $statement->fetchAll();
				$recipient = $result[ 0 ][ 'email' ];
				global $mcba_chat_message_startup;

				$getUserEmailFromDatabase_logger->logUpdate( "recipient: " . $recipient);
				if ( strlen( $recipient ) == 0 ) {
					$error = "*** ERROR: no email for push id: ..." . substr( $this->recipient_token, -5, 5 ) . " ***";
					$getUserEmailFromDatabase_logger->logUpdate( $error );
					die( $error );
				}

				if ( $this->admin_email == $recipient ) { // admin is the recipient

					// we can't do anything from here without a sender token.  bail if none...
					if (strlen( $this->sender_token) == 0) {
						$error_message = "*** ERROR:  we can not proceed without a sender_token!  bye... ***";
						// $mcba_chat_message_startup->logUpdate( $error_message );
						die( $error_message );
					}
					$message = "user must be the sender, get the senders email";
					$getUserEmailFromDatabase_logger->logUpdate( $message );
					$sql = "SELECT email FROM `wp_mcba_users` WHERE `pushid`='" . $this->sender_token . "'";
					$getUserEmailFromDatabase_logger->logUpdate( "preparing select email where pushid is: ..." . substr( $this->sender_token, -5, 5));
					$statement = $this->database->prepare( $sql );
					$statement->execute();
					$result = $statement->fetchAll();
					$this->user_email = isset( $result[ 0 ][ 'email'] ) ? $result[  0 ][ 'email'] : "";
					if (strlen( $this->user_email ) == 0 ) {
						$getUserEmailFromDatabase_logger->logUpdate( "no email in database.  using sender_token..." );
						$this->user_email = $this->sender_token;
					}
					$getUserEmailFromDatabase_logger->logUpdate( "user: " . $this->user_email );
					$getUserEmailFromDatabase_logger->logUpdate( "recipient: " . $recipient);
				} else {
                    $getUserEmailFromDatabase_logger->logUpdate( "this recipient (before logic error): " . $this->recipient_token);
					$this->user_email = $recipient; // TODO: regression test this.
					$getUserEmailFromDatabase_logger->logUpdate( "this user email: " . $this->user_email );
				}
			}
            $getUserEmailFromDatabase_logger->logUpdate( "task finished." );
		}

		private function getUserEmailFromConversationTable() {
            global $mcba_chat_message_startup;
			$statement = $this->database->prepare( "SELECT user FROM wp_mcba_chat_conversations WHERE conversation_id = ?" );
			$statement->execute(array( $this->conversation_id ));
			$result = $statement->fetchAll();
			if (empty( $result[ 0 ][ 'user'])) {
				$statement = null;
				$error = "*** ERROR: no user found for conversation id: " . $this->conversation_id . " ***";
				// $mcba_chat_message_startup->logUpdate( $error );
				die( $error );
			} else {
				$statement = null;
				$user = $result[ 0 ][ 'user'];
				// $mcba _chat_message_startup->logUpdate( "got user from database.  it is: " . $user );
				return $user;
			}
		}

		public function getConversationIdFromDatabase() {
            $get_conversation_id_from_database_logger = LoggerFactory::getLogger( "GetConversationIdFromDatabaseLogger" );
			$get_conversation_id_from_database_logger->logUpdate( "the user:  " . $this->email       );
			$get_conversation_id_from_database_logger->logUpdate( "admin: "     . $this->admin_email );
			$get_conversation_id_from_database_logger->logUpdate( "user_email:" . $this->user_email  );

			if ( strlen( $this->user_email ) == 0 ) {
				$error = "*** ERROR: user email is blank! ***";
				$get_conversation_id_from_database_logger->logUpdate( $error );
				die( $error ); }

            $get_conversation_id_from_database_logger->logUpdate( "preparing fetch from database with user: " . $this->user_email );
			$statement = $this->database->prepare( "SELECT conversation_id FROM wp_mcba_chat_conversations WHERE user = ?"           );
			$statement->execute( array( $this->email ));
			$result = $statement->fetchAll();
			
			if ( empty( $result[ 0 ][ 'conversation_id' ])) {
				$get_conversation_id_from_database_logger->logUpdate( "finished fetch.  no id found.  creating new one..." );
                $statement = null;
                return $this->createConversation();
			} else {
				$get_conversation_id_from_database_logger->logUpdate( "conversation id is NOT empty.  It is: " . $result[ 0 ][ 'conversation_id' ]);
				$get_conversation_id_from_database_logger->logUpdate( "conversation id acquired, finished." );
				$statement = null;
				return $result[ 0 ][ 'conversation_id' ]; }}

		private function createConversation() {
            $logger = LoggerFactory::getLogger( "CreateConversationLogger" );
			$logger->logUpdate( "*** Creating Conversation ***" );
			if (strlen( $this->user_email) == 0) {
				$error = "*** ERROR: user email is blank! ***";	$logger->logUpdate( $error ); die( $error ); }

			if (strlen( $this->admin_email) == 0) {
                $error = "*** ERROR: admin email is blank! ***"; $logger->logUpdate( $error ); die( $error ); }

			$this->admin_email_alias = $this->getAdminAlias( $this->getMcbaIdFromDatabase());
			$logger->logUpdate( "got admin email alias: "               . $this->admin_email_alias                       );
			$logger->logUpdate( "admin email alias from construction: " . $this->admin_email_alias                       );
			$logger->logUpdate( "inserting admin email alias "          . $this->admin_email_alias . " into database..." );
			$logger->logUpdate( "this->user_email: "                    . $this->user_email                              );
			$template_query = 'INSERT INTO wp_mcba_chat_conversations (user, admin, admin_unread_messages, user_unread_messages, mcba_chat_system_id ) VALUES(?, ?, ?, ?, ?)';
			$logger->logUpdate( "inserting conversation for user: " . $this->user_email . "..." );
			$statement = $this->database->prepare( $template_query);
			$statement->execute(array( $this->user_email, $this->admin_email_alias, 0, 0, $this->user_email));
			$statement = $this->database->prepare( "SELECT conversation_id FROM wp_mcba_chat_conversations WHERE user = ?" );
			$statement->execute( array( $this->user_email ));
			$logger->logUpdate( "user: " . $this->user_email . "( not used ) admin: " . $this->admin_email );
			$result = $statement->fetchAll();
			if (empty( $result[ 0 ][ 'conversation_id' ])) {
				$error = "*** ERROR: did not write to conversation database! ***"; $logger->logUpdate( $error ); $statement = null; die( $error );
			} else {
				$logger->logUpdate( "this->user_email: [" . $this->user_email . "]" );
                if ( isset ( $result[ 0 ][ 'mcba_chat_system_id' ] )) {
                    $logger->logUpdate( "mcba_chat_system_id: [" . $result[ 0 ][ 'mcba_chat_system_id' ] . "]" );
                } else { $logger->logUpdate( "*** WARNING: mcba_chat_system_id is not set! ***" ); }
				$statement = null;
				$logger->logUpdate( "finished create conversation." );
				return $result[ 0 ][ 'conversation_id' ]; }}

		public function sendMessage( $conversation_id ) {
			$send_message_log = LoggerFactory::getLogger( "SendMessageLog" );
			if ( strlen( $conversation_id ) == 0 ) {
				die( $send_message_log->logUpdate( "*** ERROR: no conversation id sent to sendMessage! *** ")); }
				 
			if (strlen( $this->mcba_id ) == 0) {
				$send_message_log->logUpdate( "*** ERROR: This mcba id is empty! ***" );
				return "*** ERROR: This mcba id is empty! ***";}

			$send_message_log->logUpdate( "sending message with conversation identity: " . $conversation_id );
			$send_message_log->logUpdate( "sending message with mcba id: " . $this->mcba_id );

			$firebase = new MCBAFirebase( $this->mcba_id );

			$send_message_log->logUpdate( "recipient token: " . $this->recipient_token );
			$send_message_log->logUpdate( "test_id: put test id here!" );

			$firebase->addRecipient( $this->recipient_token);
			//$this->mcba_chat_logger->logUpdate( "recipient token: " . $this->recipient_token);

			$type = "activity_chat";
			$message = $this->getMessage();

			//$this->mcba_chat_logger->logUpdate( "message: " . $message );

			$registration_ids = $firebase->getRegistrationIds();
            $send_message_log->logUpdate( "this->sender_id: " . $this->sender_id );
			$sender_id = $this->sender_id;
			if ( $sender_id == 0 ) {
				$send_message_log->logUpdate( "sender_id is still zero.  setting to sender name: " . $this->getSenderName());
			    $sender_id = $this->getSenderName();
			}
            $send_message_log->logUpdate( "sender_id now: " . $sender_id );

			// date_default_timezone_set( $this->getTimeZone()); // THis is causing an error.
			$time = date( "Y-m-d H:i:s" );
			$_test_id = "1";
			$fields = array(
				'registration_ids' => $registration_ids,
				'content_available' => true,
				'notification' => array(
					'type' => $type,
					'body' => $message,
					'sound' => "default",
				),
				'data' => array(
					'message' => $message,
					'type' => $type,
					'sender' => __METHOD__,
					'sender_id' => $sender_id,
					'test_id' => $_test_id,
					'date' => $time,
					'conversation_id' => $conversation_id,
					'sound' => "default",
				),
			);
			$author = $this->sender;
			$message = $this->message;
			$statement = $this->database->prepare( 'INSERT INTO wp_mcba_chat_messages (conversation_id, time, author, message, sender_id, firebase_result, ACK) VALUES(?, ?, ?, ?, ?, ?, ?)' );
			$send_message_log->logUpdate( "statement: " . 'INSERT INTO wp_mcba_chat_messages (conversation_id, time, author, message, sender_id, firebase_result, ACK) VALUES(?, ?, ?, ?, ?, ?, ?)' );
			$send_message_log->logUpdate( "writing time: " . $time );
			$send_message_log->logUpdate( "sender_id: " . $sender_id );
			$send_message_log->logUpdate( "message: " . $message );
			$send_message_log->logUpdate( "conversation_id: " . $conversation_id );
			$send_message_log->logUpdate( "executing insert..." );
			
			$result = $statement->execute(array(
				$conversation_id,
				$time,
				$author,
				$message,
				$sender_id,
				1, /* $firebase_result->{'success'} */
				0, /* ACK */
			));
			
			$statement = null;
            $send_message_log->logUpdate( "checking sender id: [". $sender_id ."] to see if it is an email address..." );
			$send_message_log->logUpdate( "done executing insert.  incrementing unread..." );
            // if sender id contains "@", use the email to get the sender id.
            if ( strpos( $sender_id, "@" )!== false || filter_var( $sender_id, FILTER_VALIDATE_IP )) {
                $send_message_log->logUpdate( "getting sender id from database with email: ". $sender_id );
                $send_message_log->logUpdate( "setting sender name to sender id: ". $sender_id );
                $this->setSenderName( $sender_id );     // the next method needs this value to be set. $sender_id is an email.
                $this->getSenderIdFromDatabase();       // that way we don't need to pass in the sender id as a parameter.
                $send_message_log->logUpdate( "sender id from database: ". $this->sender_id ); // $this->sender_id is the needed number
                if ( strlen( $this->sender_id ) == 0 ) {
                    $send_message_log->logUpdate( "*** ERROR: no sender id for email: [". $this->sender_id . "] ***" );
                    return "*** ERROR: sender id is zero! ***";
                }
                $this->increment_unread( $this->sender_id, $conversation_id ); // $this->sender_id is the needed number
            } else {
                $send_message_log->logUpdate( "calling increment_unread with sender id: ". $sender_id . " and conversation id: ". $conversation_id );
                $this->increment_unread( $sender_id, $conversation_id );  // $sender_id is already a number.  no need to look up.
            }
			
			$send_message_log->logUpdate( "sending push notification..." );
			$firebase->sendPushNotification( $fields ); //  >>------ SEND!------>>
			$firebase_result = 0;
			$this->updateSendResults( $this->sender_id, $conversation_id, $time, $message, $firebase_result);
			$send_message_log->logUpdate( "message send finished." );
			return $result;
		}

		private function increment_unread( $sender_id, $conversation_id ) {
			$increment_logger = LoggerFactory::getLogger( "IncrementLogger" );
			if ( strlen( $conversation_id ) == 0 ) {
				die( $increment_logger->logUpdate( "*** ERROR: no conversation id sent to increment_unread! *** "));
			} elseif ( strlen( $sender_id ) == 0 ) {
				die( $increment_logger->logUpdate( "*** ERROR: no sender id sent to increment_unread! *** "));
			}

			$increment_logger->logUpdate( "calling isAdmin with sender_id: ". $sender_id );
            $is_admin_result = $this->isAdmin( $sender_id );
			if ( str_contains( $is_admin_result, "is an admin" )) {
				$increment_logger->logUpdate( "incrementing admin unread with conversation_id: ". $conversation_id );
				$this->incrementAdminUnread( $conversation_id );
			} else if ( str_contains( $is_admin_result, "is not an admin" )) {
				$increment_logger->logUpdate( "incrementing non-admin unread..." );
				$this->incrementNonAdminUnread( $conversation_id );
			} else {
                $increment_logger->logUpdate( $is_admin_result );
                die();
            }
            $increment_logger->logUpdate( "finished routing to appropriate function." );
		}

		private function updateSendResults( $sender_idArg, $conversation_idArg, $timeArg, $messageArg, $firebase_resultArg) {}

		private function incrementAdminUnread( $conversation_id ) {
            $increment_admin_unread_logger = LoggerFactory::getLogger( "IncrementAdminUnreadLogger" );
			if ( strlen( $conversation_id ) == 0 ) {
				die( $increment_admin_unread_logger->logUpdate( "*** ERROR: no conversation id sent to incrementAdminUnread! *** "));
			} else {
				$increment_admin_unread_logger->logUpdate( "conversation id sent to incrementAdminUnread: [" . $conversation_id ."]" ); }

			$increment_admin_unread_logger->logUpdate( "incrementing admin unread with conversation id: " . $conversation_id . "..." );
			$sql = "SELECT * From `wp_mcba_chat_conversations` WHERE conversation_id='"
				. $conversation_id . "'";

			$statement = $this->database->prepare( $sql );
			$statement->execute();
			$result = $statement->fetchAll();
			$admin_unread_messages = $result[ 0 ][ 'admin_unread_messages' ];
            $increment_admin_unread_logger->logUpdate( "admin unread messages: " . $admin_unread_messages );
            $incremented_unread = $admin_unread_messages + 1;
			$sql = "UPDATE `wp_mcba_chat_conversations` SET admin_unread_messages='" . $incremented_unread .
				"' WHERE conversation_id='" . $conversation_id . "'";

            $increment_admin_unread_logger->logUpdate( "sql wo ticks: UPDATE wp_mcba_chat_conversations SET admin_unread_messages=" . $incremented_unread . " WHERE conversation_id=" . $conversation_id ); 

            $increment_admin_unread_logger->logUpdate( "preparing database statement with incremented unread amount of: " . $incremented_unread );
			$statement = $this->database->prepare( $sql );
			$statement->execute();

            $increment_admin_unread_logger->logUpdate( "verifying admin unread with conversation id: " . $conversation_id . "..." );
			$sql = "SELECT * From `wp_mcba_chat_conversations` WHERE conversation_id='"
				. $conversation_id . "'";

			$statement = $this->database->prepare( $sql );
			$statement->execute();
			$result = $statement->fetchAll();
			if ( $result[ 0 ][ 'admin_unread_messages' ] != $incremented_unread ) {
                $increment_admin_unread_logger->logUpdate( "*** ERROR: incremented unread expected: " . 
                $incremented_unread . " does not match " . $result[ 0 ][ 'admin_unread_messages' ] . "! ***" ); 
                die();
            } else {
                $increment_admin_unread_logger->logUpdate( "successfully incremented unread matches to: " . $result[ 0 ][ 'admin_unread_messages' ]);
            }
            
            $increment_admin_unread_logger->logUpdate( "finished incrementing admin unread.  conversation id: " . $conversation_id );
			$statement = null; 
        }

		private function incrementNonAdminUnread( $conversation_id ) {
            $_logger = LoggerFactory::getLogger( "IncrementNonAdminUnreadLogger" );
            $_logger->logUpdate( "select star from wp_mcba_chat_conversations where conversation_id = ". $conversation_id );
			$sql = "SELECT * From `wp_mcba_chat_conversations` WHERE conversation_id='" . $conversation_id . "'";
			$statement = $this->database->prepare( $sql );
			$statement->execute();
			$result = $statement->fetchAll();

            // check $result for null
            if ( $result == null ) {
                $_logger->logUpdate( "*** ERROR: no conversation found in database with id: ". $conversation_id. " ***" );
                die();
            }

            if ( $result[ 0 ] == null ) {
                $_logger->logUpdate( "*** ERROR: no conversation found in database with id: ". $conversation_id. " ***" );
                die();
            }
            // check $result[ 0 ][ 'user_unread_messages' ] for undefined index
            if ( $result[ 0 ][ 'user_unread_messages' ] == null ) {
                $_logger->logUpdate( "*** ERROR: no user_unread_messages found in database with id: ". $conversation_id. " ***" );
                die();
            }

			$user_unread_messages = $result[ 0 ][ 'user_unread_messages' ];
			$sql = "UPDATE `wp_mcba_chat_conversations` SET user_unread_messages='" . ++$user_unread_messages .
				"' WHERE conversation_id='" . $conversation_id . "'";
			$statement = $this->database->prepare( $sql );
			$statement->execute();
			$statement = null;
            $_logger->logUpdate( "finished incrementing non-admin unread.  conversation id: ". $conversation_id );
		}

		private function isAdmin( $sender_id ) {
			$sql = "SELECT * From `wp_mcba_users` WHERE ID='" . $sender_id . "'";
			$statement = $this->database->prepare( $sql );
			$statement->execute();
			$result = $statement->fetchAll();
            // check for trying to access array offset on value of type null
            if ( $result[ 0 ] == null ) {
                return "*** ERROR: no user found in database with id: ". $sender_id. " ***";
            }
            if ( $result[ 0 ][ 'isAdmin' ]) {
                return "administrator with id ". $sender_id. " is an admin.";
            } else {
                return "non-administrator with id ". $sender_id. " is not an admin.";
            }
		}

		public function getRecipientTokenFromDatabase() {
            $get_recipient_token_logger = LoggerFactory::getLogger( "GetRecipientTokenLogger" );
            // SELECT pushid FROM `wp_mcba_users` WHERE email='jamison@allwebnmobile.com'
			$sql = "SELECT pushid FROM `wp_mcba_users` WHERE email='" . $this->getUser_email() . "'";
            $get_recipient_token_logger->logUpdate( "sql = select pushid from wp_mcba_users where email = [". $this->getUser_email()."]" );
			$get_recipient_token_logger->logUpdate( "getting user recipient token from database." );
			$get_recipient_token_logger->logUpdate( "getting pushid with email: " . $this->getUser_email()."... " );
			$statement = $this->database->prepare( $sql );
			$statement->execute();

			$result = $statement->fetchAll();

            if ( isset( $result [ 0 ][ 'pushid' ])) {
                $get_recipient_token_logger->logUpdate( "got recipient token, it is: " );
			    $get_recipient_token_logger->logUpdate( "..." . substr( $result[ 0 ][ 'pushid' ], -5, 5 ));
                $user_unread_messages = $result[ 0 ][ 'pushid' ];
                $this->setRecipientToken( isset( $result[ 0 ][ 'pushid' ]) ? $result[ 0 ][ 'pushid' ] : "" );
            } else {
                if ( strpos( $this->getUser_email(), "@" )) {
                    $get_recipient_token_logger->logUpdate( "*** ERROR: recipient token is empty.  email: " . $this->getUser_email(). " ***" );
                    die( "*** ERROR: recipient token is empty.  email: " . $this->getUser_email(). " ***" );
                } else {
                    $get_recipient_token_logger->logUpdate( "*** Warning: recipient token is empty. ***" );
                }
            }
            $get_recipient_token_logger->logUpdate( "task finished." );
		}

		private function getTimeZone() {

			$sql = "SELECT timezone FROM `wp_chat_timezones` WHERE `selected`='1'";
			$statement = $this->database->prepare( $sql );
			$statement->execute();
			$result = $statement->fetchAll();
			return $result[ 0 ][ 'timezone'];
		}

		private function initialize_database() {
            global $mcba_chat_message_startup;
			try {
				global $wpdb;
				$db = new PDO( 'mysql:host=' . $wpdb->dbhost . '; dbname=' . $wpdb->dbname, $wpdb->dbuser, $wpdb->dbpassword);
				$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_WARNING);
				// $mcba_chat_message_startup->logUpdate( "returning database object..." );
				return $db;
			} catch (PDOException $pDoException) {
				file_put_contents( "caught exception in McbaChatMessage around line " . __LINE__ . '\r\n', FILE_APPEND | LOCK_EX);
				file_put_contents( 'register.log', $pDoException->getMessage() . '\r\n', FILE_APPEND | LOCK_EX);
				die(json_encode(array( 'error' => $pDoException->getMessage())));}}
		/*
		 * getters / setters
		 */
		public function setSenderToken( $token) {
			$this->sender_token = $token;
		}
		public function setRecipientToken( $token) {
			$this->recipient_token = $token;
		}
		public function setSenderName( $sender) {
			$this->sender = $sender;
		}
		public function getSenderName() {
			return $this->sender;
		}
		public function getSenderToken() {
			return $this->sender_token;
		}
		public function getSenderPhoto() {
			return $this->sender_photo_url;
		}
		public function setDate( $date ) {
			$this->date = $date;
		}
		public function getMessage() {
			return $this->message;
		}
		public function getDate() {
			return $this->date;
		}
		public function setMessage( $message ) {
			$this->message = $message;
		}
		public function getRecipientToken() {
			return $this->recipient_token;
		}
		public function setSenderPhoto( $sender_photo_urlArg) {
			$this->sender_photo_url = $sender_photo_urlArg;
		}
		public function getAdmin_email() {
			return $this->admin_email;
		}
		public function getUser_email() {
			return $this->user_email;
		}
		public function setAdmin_email( $admin_email) {
			$this->admin_email = $admin_email;
		}
		public function setUser_email( $user_email) {
			$this->user_email = $user_email;
		}

		public function setEmail( $emailArg) {
			$this->email = $emailArg;
		}

		public function getEmail() {
			return $this->email;
		}

		public function setFromEmail( $fromEmail) {
			$this->from_email = $fromEmail;
		}

		public function getFromEmail() {
			return $this->from_email;
		}

		public function getConversationId() {
			return $this->conversation_id;
		}
		public function setConversationId( $conversationIdArg) {
			$this->conversation_id = $conversationIdArg;
		}

		public function getMcba_id() {
			return $this->mcba_id;
		}

		public function setMcba_id( $mcba_id ) {
			$this->mcba_id = $mcba_id;
		}

		public function isMessageFromAdmin() {
			return $this->messageFromAdmin;
		}

		public function setMessageFromAdmin( $isAdminArg) {
			$this->messageFromAdmin = $isAdminArg;
		}

		public function __destruct() {$this->database = null;}
	}
}
