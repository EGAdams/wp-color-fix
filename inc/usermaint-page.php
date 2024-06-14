<?php
defined('ABSPATH') || exit;

function mcba_mobile_user_maint() { global $wpdb, $current_user;  ?>

<div class="wrap">
    <h2>User Maintenance</h2>
    <i>Admin user will become visible in the </i>"<b>Ask The Experts</b>"<i> feature</i>
	<?php
     $mysqli = new mysqli( $wpdb->dbhost, $wpdb->dbuser, $wpdb->dbpassword, $wpdb->dbname );
    if ( $mysqli->connect_errno ) { echo json_encode(array( "result" => "failed to connect to MySQL: " . $mysqli->connect_error )); }
    // admin is a late comer... check if the DB has it or not
    $query = "SELECT `isAdmin` FROM " . $wpdb->prefix . "mcba_users";
    $result = $mysqli->query( $query );
    if ( !$result ){ $mysqli->query( "ALTER TABLE " . $wpdb->prefix . "mcba_users ADD `isAdmin` BOOLEAN NOT NULL" ); }
    $query = "SELECT * FROM " . $wpdb->prefix . "mcba_users";
    $result = $mysqli->query( $query );
        echo "<h1>TABLE</h1>";
        echo '<br><br><table>';
        echo '<tr><th style="15px;">User ID</th><th style="15px;">Admin</th><th style="15px;">Name</th><th style="15px;">Rewards</th>
			<th style="padding: 10px; 50px;">Email</th><th style="padding: 10px; 50px;">Device</th></tr>';
		while( $row = $result->fetch_assoc()) {
            $id = $row[ 'ID' ];
            $isAdmin = $row[ 'isAdmin' ] ? "checked" : "";
  			echo '<tr>';
            echo '<td style="padding: 10px; 50px;">' . $row[ 'ID' ] .'</td>';
            if ( $row[ "first_name" ] != "Anonymous") {
                echo '<td style="padding: 10px; 50px;"><input type="radio" ';
                echo $isAdmin . ' name="AdminButtons" onclick="updateAdmin( this, ' . $id . ')"/></td>';
                echo '<input type="hidden" name="isAdmin" value="' . $row[ 'isAdmin' ] .'"/>';
                echo '<td style="15px;">' . $row[ 'first_name' ] .' '  . $row[ 'last_name' ] .'</td>';
                echo '<td style="15px;"><input type="hidden" name="ID" value="' . $row[ 'ID' ] .'"/>
                    <input type="number" style="width: 6em" name="rewardValue" onchange="updateDB(this, ' . $id . ')" value="' . $row[ 'rewards' ] .'"/></td>';
                echo '<input type="hidden" name="rewards" value="' . $row[ 'rewards' ] .'"/>';
            } else {
                echo '<td style="padding: 10px; 50px;"></td>';
                echo '<td style="15px;"><i>' . $row[ 'first_name' ] .' '  . $row[ 'last_name' ] .'</i></td>';
                echo '<td style="padding: 10px; 50px;"></td>';
            }
            echo '<td style="padding: 10px; 50px;">' . $row[ 'email'  ] .'</td>
                    <td style="padding: 10px; 50px;">' . $row[ 'device' ] .'</td>
            </tr>'; }

		echo '</table>';
		echo '<p id="notification"></p>';
        
        // $query = "SELECT * FROM " . $wpdb->prefix . "chat_timezones";
        // $result = $mysqli->query( $query );
        // echo '<br><b>Chat TimeZone</b><br>';
        // echo '<select  onchange="selectTimeZone(this, 0)">';
        // while( $row = $result->fetch_assoc()){
        //     $timezone       = $row[ 'timezone'];
        //     $selected       = $row[ 'selected'];
            
        //     if ( $selected) {
        //         echo '<option value=' . $timezone . ' selected>' . $timezone . '</option>';
        //     }else{
        //         echo '<option value=' . $timezone . '>' . $timezone . '</option>';
        //     }
        // }
        // echo'</select>';?>
<script>
function updateDB( val, id ) {
    var reward_value = val.value;
    jQuery.ajax({ type: "POST", url: location.href, data: { "ID" : id, "rewards" : reward_value }});
    document.getElementById( "notification" ).innerHTML = "User ID " + id + " has been updated."; }

function updateAdmin( administrator_checkbox, admin_id ) {
    var isAdmin = administrator_checkbox.checked;
    jQuery.ajax({ type: "POST", url: location.href, data: {  "isAdmin" : isAdmin, "ID" : admin_id }});
    document.getElementById( "notification" ).innerHTML = "User ID " + admin_id + " has been updated."; }
</script></div>
<?php
    if ( isset( $_POST[ 'ID'      ])) { $userID  = sanitize_text_field( $_POST[ 'ID'      ]); echo "userID: "  . $userID . "; "; }
    if ( isset( $_POST[ 'rewards' ])) { $rewards = sanitize_text_field( $_POST[ 'rewards' ]); echo "rewards: " . $rewards . "; "; }
    if ( isset( $_POST[ 'isAdmin' ])) { $isAdmin = sanitize_text_field( $_POST[ 'isAdmin' ]); echo "isAdmin: " . $isAdmin . "; "; }

    if ( isset( $userID ) && isset ( $rewards )) {
        $query = 'UPDATE ' . $wpdb->prefix . 'mcba_users SET `rewards` = ' . $rewards . ' WHERE ID = ' . $userID;
        $result = $mysqli->query( $query ); }

    if ( isset( $userID ) && isset( $isAdmin )) {
        $query = 'UPDATE ' . $wpdb->prefix . 'mcba_users SET `isAdmin` = 0 WHERE 1';
        $result = $mysqli->query( $query );
        $query = 'UPDATE ' . $wpdb->prefix . 'mcba_users SET `isAdmin` =' . sanitize_text_field( $_POST[ 'isAdmin' ] ) . ' WHERE ID = ' . sanitize_text_field( $_POST[ 'ID' ] );
        $result = $mysqli->query( $query );
        $query = "SELECT `pushid` FROM `" . $wpdb->prefix . "mcba_users` WHERE 1";
        $result = $mysqli->query( $query );
        $regids = array();
        while( $row = mysqli_fetch_assoc( $result)){ $regids[] = $row[ 'pushid' ]; }
        mcba_send_admin( "Admin status change", $regids ); }                         // send a push notification to all users !!
    // $timezone = sanitize_text_field( $_POST[ 'timeZone' ]);
    // if ( isset( $timezone )) {
    //     $query = 'UPDATE ' . $wpdb->prefix . 'chat_timezones SET `selected` = 0 WHERE 1';
    //     $result = $mysqli->query( $query );
    //     $query = 'UPDATE ' . $wpdb->prefix . 'chat_timezones SET `selected` =\'1\' WHERE timezone=\'' . $timezone . "'";
    //     $result = $mysqli->query( $query );
    // }
    $mysqli->close();
}?>
