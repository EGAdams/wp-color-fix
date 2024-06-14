<?php
defined('ABSPATH') || exit;
function mcba_createrewards() {
	require_once( 'phpqrcode/qrlib.php' );
    global $wpdb, $current_user;
?>
<div class="wrap"><h2><?php _e('Create Rewards Codes');?></h2>
	<?php
	$logger = LoggerFactory::getLogger( "CreateRewardCodes" );
    $logger->logUpdate( "logger created." );
    $option = get_option('rwpm_option');
    $postSubmit = sanitize_text_field( $_POST['submit'] );
    if ( $_REQUEST['page'] == 'rwpm_send' && isset( $postSubmit )) {
        $error  = false;
        $status = array();
        $content  = sanitize_text_field( $_POST[ 'content'  ]);  $logger->logUpdate( "content: "  . $content  );
        $content2 = sanitize_text_field( $_POST[ 'content2' ]);  $logger->logUpdate( "content2: " . $content2 );
        $content3 = sanitize_text_field( $_POST[ 'content3' ]);  $logger->logUpdate( "content3: " . $content3 );
        $content4 = sanitize_text_field( $_POST[ 'content4' ]);  $logger->logUpdate( "content4: " . $content4 );
        $content = apply_filters('rwpm_content_send', $content);
        $content = stripslashes( $content) ;
        $content = esc_sql( $content ) ;
        $content2 = apply_filters('rwpm_content_send', $content2);
        $content2 = stripslashes( $content2 );
        $content2 = esc_sql( $content2 );
        $content3 = apply_filters('rwpm_content_send', $content3);
        $content3 = stripslashes( $content3 );
        $content3 = esc_sql( $content3 );
        $content4 = apply_filters('rwpm_content_send', $content4);
        $content4 = stripslashes( $content4 );
        $content4 = esc_sql( $content4 );

        /* Check that message is entered before sending */
        if (empty( $content) ) {
            $error    = true;
            $status[] = __('Please enter content of code.', 'pm4wp');
            
        } elseif ( !$error ) {
                $result = mcba_generate_qr( $content ) ;
                if ( isset( $result[ 'error_code']) && $result[ 'error_code' ] === -1 ) {
                    echo "Account is not active, please sign up to use this feature."; die();
                } else {
                    if ( !empty( $content) ) {
						$logger->logUpdate( "encoding content: " . $content );
                        $dataToEncode = $result[ 'gcm_id' ] . "MCBA" . $content;
						$image1 = "image1.png";
                        QRcode::png( trim( $dataToEncode ), $image1, 'L', 10, 10 ); }
                    if ( !empty( $content2 )) {
						$logger->logUpdate( "encoding content: " . $content2 );
                        $dataToEncode = $result[ 'gcm_id' ] . "MCBA" . $content2;
						$image2 = "image2.png";
                        QRcode::png( trim( $dataToEncode ), $image2, 'L', 10, 10 ); }
                    if ( !empty( $content3 )) {
						$logger->logUpdate( "encoding content: " . $content3 );
                        $dataToEncode = $result[ 'gcm_id' ] . "MCBA" . $content3;
						$image3 = "image3.png";
                        QRcode::png( trim( $dataToEncode ), $image3, 'L', 10, 10 ); }
                    if ( !empty( $content4 )) {
						$logger->logUpdate( "encoding content: " . $content4 );
                        $dataToEncode = $result[ 'gcm_id' ] . "MCBA" . $content4;
						$image4 = "image4.png";
                        QRcode::png( trim( $dataToEncode ), $image4, 'L', 10, 10 ); }
                }
        }
    } else {
		$logger->logUpdate( "_REQUEST[ page ]:    [" . $_REQUEST[ 'page']   . "]" );
		$logger->logUpdate( "isset( postSubmit ): [" . isset( $postSubmit ) . "]" ); }
?>
	<?php
    do_action( 'rwpm_before_form_send' );
?>
    <form method="post" action="" id="send-form" enctype="multipart/form-data">
	    <input type="hidden" name="page" value="rwpm_send" />
        <table class="form-table">
                   <tr>
                <th scope="row">Data to encode:</th>
                <td>
		  <input type = "number" name="content" value="<?php echo $content;?>" placeholder="Enter value" required/>
		  <p class="description">How many points is this code worth? <br>Negative numbers for redemption codes...</p>
		</td>
            </tr>
                   <tr>
                <th scope="row">Data to encode:</th>
                <td>
		  <input type = "number" name="content2" value="<?php echo $content2;?>" placeholder="Enter value"/>
		  <p class="description">(Optional) Additional codes on the same page</p>
		</td>
            </tr>
                   <tr>
                <th scope="row">Data to encode:</th>
                <td>
		  <input type = "number" name="content3" value="<?php echo $content3;?>" placeholder="Enter value"/>
		  <p class="description">(Optional) Additional codes on the same page</p>
		</td>
            </tr>
            
                    <tr>
                <th scope="row">Data to encode:</th>
                <td>
		  <input type = "number" name="content4" value="<?php echo $content4;?>" placeholder="Enter value"/>
		  <p class="description">(Optional) Additional codes on the same page</p>
		</td>
            </tr>
            	        <?php
    do_action('rwpm_form_send'); ?>
        </table>
	    <input type="submit" value="Generate" class="button-primary" id="submit" name="submit">
	    <br><br>
    </form>
	<?php
    do_action('rwpm_after_form_send'); ?>
</div>
<div id="printable">
<table>
<tr>
<td width="150" height="150"></td>
<td align="center">
<?php
    if ( !empty( $image1)) {
        printf('<img src="%s" width="150" height="150"><br>', $image1 );
    	if ( $content  > 0 ) { printf('<center>Reward Value %s</center>', $content );
		} else{ printf( '<center>Reward Cost %s</center>', abs( $content)); }} ?>
</td>
<td width="150" height="150"></td>
<td>
<?php
    if ( !empty( $image2)) {
        printf('<img src="%s" width="150" height="150"><br>', $image2 );
    	if ( $content2  > 0) { printf('<center>Reward Value %s</center>', $content2);
		} else { printf('<center>Reward Cost %s</center>', abs( $content2 )); }} ?>
</td>
</tr>
<tr>
<td width="150" height="150"></td>
<td>
<?php
    if ( !empty( $image3)) {
        printf('<img src="%s" width="150" height="150"><br>', $image3 );
    	if ( $content3  > 0 ) { printf('<center>Reward Value %s</center>', $content3 );
		 } else { printf('<center>Reward Cost %s</center>', abs( $content3 )); }} ?>
</td>
<td width="150" height="150"></td>
<td>
<?php
    if ( !empty( $image4)) {
        printf('<img src="%s" width="150" height="150"><br>', $image4 );
    	if ( $content4  > 0 ) {
			printf('<center>Reward Value %s</center>', $content4 );
		} else { printf( '<center>Reward Cost %s</center>', abs( $content4 )); }} ?>
</td>
</tr>
</table>
</div>
<button type="button" class="button-primary" onClick="printDiv('printable')">Print Results</button>
<script type="text/javascript">
   function printDiv(divId) {
       var printContents = document.getElementById(divId).innerHTML;
       var originalContents = document.body.innerHTML;
       document.body.innerHTML = "<html><head><title></title></head><body>" + printContents + "</body>";
       window.print();
       document.body.innerHTML = originalContents;
   }
</script>
<?php } ?>
