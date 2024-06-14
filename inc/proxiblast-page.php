<?php
defined('ABSPATH') || exit;
$GOOGLE_MAP_KEY = "";
/**
 * Send form page
 */
function mcba_proxiblast() {
	global $wpdb, $current_user;
	?>
<div class="wrap">
    <h2><?php _e('Update ProxiBlast', 'pm4wp'); ?></h2>
	<?php
    global $wp_filesystem;
	if (empty($wp_filesystem)) {	// Initialize the WP filesystem, no more using 'file-put-contents' function
		require_once ABSPATH . '/wp-admin/includes/file.php';
		WP_Filesystem(); }
        
	$source = $wp_filesystem->get_contents(MCBA_MAIN_CONFIG);
	$config = json_decode(str_replace("var config_data = ", "", substr($source, 0, strlen($source) - 1)), true);
	$latitude = $config['options']['latitude']['value'];
	$longitude = $config['options']['longitude']['value'];
	if (empty($latitude)) {
		$latitude = 0;
	}

	if (empty($longitude)) {
		$longitude = 0;
	}

	$option = get_option('rwpm_option');
	$postSubmit = sanitize_text_field($_POST['submit']);
	if ($_REQUEST['page'] == 'rwpm_send' && isset($postSubmit)) {
		$error = false;
		$status = array();

		$content = sanitize_text_field($_POST['content']);
		$radius = (int) sanitize_text_field($_POST['radius']);
		$expires = (int) sanitize_text_field($_POST['expires']);
		$latitude = (float) sanitize_text_field($_POST['lat']);
		$longitude = (float) sanitize_text_field($_POST['lon']);

		// Allow to filter content
		$content = apply_filters('rwpm_content_send', $content);

		// Remove slash automatically in wp
		$content = stripslashes($content);

		// Escape sql
		$content = esc_sql($content);

		/* Check that message is entered before sending */
		if (empty($content)) {
			$error = true;
			$status[] = __('Please enter content of message.', 'pm4wp');

		} else if (!$error) {

			$result = mcba_send_proxiblast($content, $latitude, $longitude, $radius, $expires);

			if ($result['error_code'] === -1) {
				// Account is not active
				echo "Account is not active, please sign up to use this feature.";
				die();
			}
			//echo "Sent message: '" . $content . "' to " . $result['count'] . " user(s)";
		}
		echo '<div id="message" class="updated fade"><p>', implode('</p><p>', $status), '</p></div>';
	}
	?>
	<?php
do_action('rwpm_before_form_send');
	?>
    <style>
      #map {
        width: 650px;
        height: 450px;
        background-color: grey;
      }
    </style>
    <script>
      function initMap() {
        var center_of_map = {lat: <?php echo $latitude; ?>, lng: <?php echo $longitude; ?>};
        var map = new google.maps.Map(document.getElementById('map'), {
          zoom: 16,
          center: center_of_map,
          legend: 'none',
          disableDefaultUI: true
        });
        var marker = new google.maps.Marker({
          position: center_of_map,
          map: map,
          draggable: true,
          title:"Drag me to easily set your lat/lng. Grab the circle to easily set your radius."
        });
        // Add circle overlay and bind to marker
        var circle = new google.maps.Circle({
          map: map,
          radius: <?php echo ($radius == '') ? '100' : $radius; ?>,
          strokeColor: '#0000FF',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: '#00BFFF',
          fillOpacity: 0.35,
          editable: true
        });
        circle.bindTo('center', marker, 'position');
        google.maps.event.addListener(marker, 'dragend', function (event) {
          $latitude = Number(this.getPosition().lat()).toFixed(6);
          $longitude = Number(this.getPosition().lng()).toFixed(6);
          document.getElementById("latbox").value = $latitude;
          document.getElementById("lngbox").value = $longitude;
        });
        google.maps.event.addListener(circle, 'radius_changed', function() {
          $radius=circle.getRadius();
          document.getElementById("radius").value = $radius;
        });
      }

    </script>
    <script async defer src="https://maps.googleapis.com/maps/api/js?key=" . $GOOGLE_MAP_KEY_test . "&callback=initMap">
    </script>
    <?php
    $longitude = "-82.8268466";
	$latitude = "27.9849748";
	?>
    <form method="post" action="" id="send-form" enctype="multipart/form-data">
	    <input type="hidden" name="page" value="rwpm_send" />
        <table class="form-table">
            <caption></caption><!-- hush warning -->
            <tr>
                <th scope="row">Coordinates</th>
                <td>
                   <input type="number" id="latbox" name="lat" maxlength="10" size="10" value="<?php echo $latitude; ?>" placeholder="Enter the latitude" step="any" required/>
                   <input type="number" id="lngbox" name="lon" maxlength="10" size="10" value="<?php echo $longitude; ?>" placeholder="Enter the longitude" step="any"  required/>
                   <p class="description">Defaults to the values stored in company info</p>
                   <div id="map"></div>
		</td>
            </tr>
            <tr>
                <th scope="row">Perimeter entrance message</th>
                <td>
		  <textarea name="content" rows="5" cols="100" value="<?php echo $content; ?>" placeholder="Enter a valid message to send" required/></textarea>
		  <p class="description">Enter a message to be sent to any user of your app that travels into the radius around your business location.</p>
		</td>
            </tr>
            <tr>
                <th scope="row">Perimeter radius in meters</th>
                <td>
		   <input type="number" id="radius" name="radius" size="5" value="<?php echo ($radius == '') ? '100' : $radius; ?>" placeholder="Enter a valid radius in meters" step="any" required/>
		   <p class="description">Specify the radius of the perimeter around your business location that you want to trigger the perimeter message. Recommended: 100</p>
		</td>
            </tr>
            <tr>
                <th scope="row">Expiration in hours</th>
                <td>
		  <input type="number" name="expires" size="5" value="<?php echo ($expires == '') ? '12' : $expires; ?>" placeholder="Enter a valid expiration in hours" step="1" required/>
		  <p class="description">Specify the number of hours before this message expires and they will no longer receive this message when entering the perimeter. Recommended: 12. (No expiration use -1)<br/>Time starts at the moment the users phone receives this update. </p>
		</td>
            </tr>
            <?php _e('Content', 'pm4wp');?>
            <?php wp_editor($content, 'rw-text-editor', $settings = array('textarea_name' => 'content'));?>
	        <?php do_action('rwpm_form_send');?>
        </table>
	    <p class="submit"><input type="submit" value="Update" class="button-primary" id="submit" name="submit"></p>
    </form>
	<?php do_action('rwpm_after_form_send');?>
</div>
<?php
}?>
