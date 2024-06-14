<?php
/**
 * Send form page
 */

defined('ABSPATH') || exit;
function mcba_generate_install()
{
    global $wpdb, $current_user;
    require_once('qrcode.php');
?>
<div class="wrap">
    <h2><?php
    _e('Generate app_install');
?></h2>

	<?php
	 // Generate and display a qr that leads to our newly created file
         $dataToEncode = content_url() . "/appinstall.php";
         $a            = new QR(trim($dataToEncode));
         $image1       = $a->image(6); 
         $complete     = true;               
         $option       = get_option('rwpm_option');
    
    $submitOption = sanitize_text_field( $_POST['submit'] );
    if ($_REQUEST['page'] == 'rwpm_send' && isset( $submitOption )) {

        $urlAndroid= sanitize_text_field( $_POST[ 'urlAndroid' ]);         
        $urlAndroid= apply_filters('rwpm_content_send', $urlAndroid);
        $urlAndroid= stripslashes($urlAndroid);
        $urlAndroid= esc_sql($urlAndroid);

	if (empty($android) || empty($ios))
	    $complete = false;
        writeInstallFile($urlAndroid, $urliOS);
    }
?>
	<?php
    do_action('rwpm_before_form_send');
?>
    <form method="post" action="" id="send-form" enctype="multipart/form-data">
	    <input type="hidden" name="page" value="rwpm_send" />
<table>
                   <tr>
                <th scope="row">Play Store URL:</th>
                <td>
		  <input type = "url" name="content" value="<?php echo $urlAndroid;?>" placeholder="https://..."/>
		</td>
            </tr>
            
                    <tr>
                <th scope="row">App Store URL:</th>
                <td>
		  <input type = "url" name="content" value="<?php echo $urliOS;?>" placeholder="https://..."/>
		</td>
            </tr>      

<tr>
<td width="150" height="150"></td>
<td align="center">
<?php
    if (!empty($image1)) {  
        printf('<img src="data:image/gif;base64,%s" width="150" height="150"><br>', base64_encode($image1));        
       	printf('<center>%s</center>', $dataToEncode);
       	printf('<br>');
       	if (!$complete)
       	    printf('<center><b>Warning! Missing URLs will redirect back to main site</b></center>');
       	printf('<center><i>Copy this image and place anywhere on the website</i></center>');
    }
?>
</td>
</table>
     
            	        <?php
    do_action('rwpm_form_send');
?>
        </table>

	    <input type="submit" value="Create File" class="button-primary" id="submit" name="submit">
	    <br><br>
    </form>
	<?php
    do_action('rwpm_after_form_send');
?>
</div>



<?php
    
}

function writeInstallFile($android, $ios) {
        if (empty($android))
            $android = site_url();
        if (empty($ios))
            $ios= site_url();            
	$txt = 
        "<?php" . "\n" .
        "    \$iPod    = stripos(\$_SERVER['HTTP_USER_AGENT'],\"iPod\");" . "\n" .
        "    \$iPhone  = stripos(\$_SERVER['HTTP_USER_AGENT'],\"iPhone\");" . "\n" .
        "    \$iPad    = stripos(\$_SERVER['HTTP_USER_AGENT'],\"iPad\");" . "\n" .
        "    \$Android = stripos(\$_SERVER['HTTP_USER_AGENT'],\"Android\");" . "\n" .
        "    if( \$iPod || \$iPhone || \$iPad){" . "\n" .
        "        header( 'Location: " . $ios."'" .");" . "\n" .
        "    } else if (\$Android) {" . "\n" .
        "        header( 'Location: " . $android."'" .") ;" . "\n" .
        "    }" . "\n" .
        "?>";           
      
        // Same as above, but a path rather than a url
	$dataToEncode = WP_CONTENT_DIR . "/appinstall.php";
	$file = fopen($dataToEncode, "w");
	fwrite($file, $txt);
	fclose($file);	
}

?>