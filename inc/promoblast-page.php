<?php
require_once dirname( __FILE__, 2 ) . "/monitored-object-php/monitored-object/LoggerFactory.php";
defined('ABSPATH') || exit;
/**
 * Send form page
 */
function mcba_promoblast() {
    $logger = LoggerFactory::getLogger( "PromoBlastLogger" );
    $logger->logUpdate( "PromoBlastLogger created... " );
    global $wpdb, $current_user;
    $debug = true;
    $master = false;
    $runasmaster = false;
    $dir = WP_CONTENT_DIR."/../MCBA-MasterServer";
    if (is_dir($dir))
        $master = true;
    if ($master) {
        $phpVar = $_COOKIE['masterRun'];
        if ($phpVar == 'true') { $phpVar = "checked"; $runasmaster = true; }
        else $phpVar = "";
    }
    $runasmaster = false;
    if ($master && $runasmaster) {
        require_once($dir."/config.php");
        $mysqli = new mysqli( $wpdb->dbhost, $wpdb->dbuser, $wpdb->dbpassword, $wpdb->dbname );
        $query = "SELECT * FROM `clients`";  
    } else {
        $mysqli = new mysqli( $wpdb->dbhost, $wpdb->dbuser, $wpdb->dbpassword, $wpdb->dbname );
        $query = "SELECT * FROM wp_mcba_users"; 
    }
    if ($mysqli->connect_errno  || $mysqli == null ) {
        if ( $debug == true ) {
            echo 'Unable to connect to DB!';                
        }
        die();
    }        
    $result = $mysqli->query($query); 

    echo '<div class="wrap">';
    echo '<h2>Send PromoBlast</h2>';
    if ($master)
        echo '<input type="checkbox" id="master" name="master" '.$phpVar.' onclick="postValue(this.value)">Run as master';
    
    $postSubmit = sanitize_text_field( $_POST[ 'submit' ]);
    if ( isset( $postSubmit )) {
        $error = false;
        $status = array();
        $content    = sanitize_text_field( $_POST[ 'content'    ]);
        $recipients = sanitize_text_field( $_POST[ 'recipients' ]);	
        // Remove slash automatically in wp
        $content = stripslashes( $content );
        // Escape sql
        $content = esc_sql( $content );
            // Check that message is entered before sending 
        if ( empty( $content )) {
            $error = true;
            $status[] = __( 'Please enter content of message.', 'pm4wp' );			
        } else if ( !$error ) {		
            $return = mcba_send_promoblast($content, $recipients);
                if (!empty($return['failure'])) {
            echo "Failure!";
            die();
                }
                if( $return['error_code'] === -1 ){
            // Account is not active
            echo 'Account is not active, please sign up to use this feature.';
            die();
            }		
        }
        echo '<div id="message" class="updated fade"><p>', implode( '</p><p>', $status ), '</p></div>';
    }
        echo '<form id="form" method="post">';
        echo '<table class="form-table">';
        echo '<tr><th scope="row">Message to deliver</th>';
        echo '<td>';
	echo '<textarea name="content" rows="2" cols="75" value="<?php echo $content; ?>" placeholder="Enter a valid message to send" required/></textarea>';
	echo '<p class="description">This message will be immediately sent to every user of your Custom Business App.<br>
		  Be sure to keep it short, sweet and only as often as your clients would be happy with.</p>';
        echo '</td>';
        echo '</tr>';
        
        $theClientID = sanitize_text_field( $_GET['clientID'] );

        //<!-- Master Server Use -->
        if ($master && $runasmaster) {       
            echo '<th scope="row">Recipient(s)</th><td>';                
            echo '<select name="id" onchange="updateDB(this)">';                                          
            $counter = 0;
            
            if (isset( $theClientID )) {
                $desired = $theClientID;
            } else {
                $desired = 1;
            }

            while ($row = $result->fetch_assoc()) {
                unset($id, $name);
                $id = $row['_id'];
                $name = $row['name'];
                if ($id == $desired) $selected = "selected"; else $selected = ""; 
                echo '<option value="'.$id.'" '.$selected.'>'.$name.'</option>';
                $counter++;
            }
            echo '</select>';
            if (!empty($phpVar)) echo '  Using <b>OUR</b> database as opposed to the clients';
            //echo '<div id="notification">Client ID '.$desired.' has been selected.</div>';
            echo '<div id="recipients">';

            
            if (isset( $theClientID )) {                          
                $query = "SELECT * FROM `users` WHERE `mcba_id` = " . $theClientID;
                $result = $mysqli->query($query);
                $num_rows = mysqli_num_rows($result);
                $unknowns = 0;
                echo '<br>';
                while($row = $result->fetch_assoc()){
 	   	    if ($row['first_name'] != 'Anonymous') 		        
  		        echo '<input type="checkbox" name="recipients['.$row['row_id'].']" checked/>' .$row['first_name'].' ' .$row['last_name'].' ';
                    else
  		        $unknowns += 1;
  	        } 	                  
	        if ($unknowns > 0)
		    echo ' (plus ' . $unknowns . ' anonymous users)'; 
		if ($num_rows == 0)
		    echo '<br>No users listed';  
            }
            echo '</div></td>';            
  
            ?>
            <script>
                function updateDB(val) {
                    window.location = "admin.php?page=mcba_promoblast&clientID=" + val.value;
                };                
            </script>
            <?php                            
        }                      
        //<!-- Client Use -->
        else {         
            echo '<th scope="row">Recipient(s)</th><td>';                                         
            $unknowns = 0;
            while($row = $result->fetch_assoc()){
 		if ($row['first_name'] != 'Anonymous') 		        
  		    echo '<input type="checkbox" name="recipients['.$row['row_id'].']" checked/>' .$row['first_name'].' ' .$row['last_name'].' ';
  		else
  		    $unknowns += 1;
            }          
	    if ($unknowns > 0)
		echo ' (plus ' . $unknowns . ' anonymous users)';
            echo '<p class="description">Defaults to all registered users</p></td>';    
        }
        //<!-- End Master Client Check -->
   
        echo '</table>';
	echo '<p class="submit"><input type="submit" value="Send" class="button-primary" id="submit" name="submit"></p>';
        echo '</form>';
        echo '</div>';
        
        $mysqli->close();
  
        ?><script>
        function postValue(val){
            var x=document.getElementById("master").checked;
            document.cookie = "masterRun="+x;
            window.location.reload();
        }               
        </script><?php        
}
?>