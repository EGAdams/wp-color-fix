<?php
file_put_contents( 'register.log', 'building logger...' . '\r\n', FILE_APPEND | LOCK_EX);
defined('ABSPATH') || exit;
file_put_contents( 'register.log', 'building logger...' . '\r\n', FILE_APPEND | LOCK_EX);
// require_once plugin_dir_url( __FILE__ ) . "../monitored-object-php/monitored-object/LoggerFactory.php";
// $mcba_logger = LoggerFactory::getLogger( "MockupLogger" );
// $mcba_logger->logUpdate( "mockup.php logger initialized." );
file_put_contents( 'register.log', 'logger built.' . '\r\n', FILE_APPEND | LOCK_EX);

//

function mcba_mockup() {
	global $wpdb, $current_user;
	$current_mockup_page = "index.html";
	$option = get_option('mcba_option');
	mcba_getTemplates();?>
    <div class="wrap">
        <h2><?php _e(MCBA_MAIN_HEADER, 'mcba');?></h2>
        <style>
            .row * {
                vertical-align: middle;
            }

            .wp-submenu.wp-submenu-wrap {
                margin: 0px;
            }
        </style>
        <?php wp_enqueue_style('jquery-ui.css', plugin_dir_url(__FILE__) . '../css/themes/smoothness/jquery-ui.css');?>
        <?php wp_enqueue_style('style.css', plugin_dir_url(__FILE__) . '../css/style.css');?>
        <?php wp_enqueue_style('all.min.css', plugin_dir_url(__FILE__) . '../css/all.min.css');?>
        <?php wp_enqueue_script('jquery-ui-droppable');?>
		<?php wp_enqueue_script('jquery-ui-accordion');?>
        <?php wp_enqueue_script('jquery-ui-resizable');?>
        
        <!-- <?php //wp_enqueue_script('MCBA-Wordpress-Space-js', plugin_dir_url(__FILE__) . '../mcba_widgets/Space.js', array(), false, true);
	?> -->

        <?php
            // &callback=initMap
            // echo '<script src="https://cdn.jsdelivr.net/npm/google-maps-infobox@2.0.0/infobox-module.min.js"></script>';
            echo "<script async defer src=\"https://maps.googleapis.com/maps/api/js?key=\"></script>";
            // wp_enqueue_script('MCBA-Wordpress-GoogleMap-js', plugin_dir_url(__FILE__) . '../mockup_elements/GoogleMap/js/GoogleMap.js', array(), false, true);
            // wp_enqueue_script('MCBA-Wordpress-google_map-js', plugin_dir_url(__FILE__) . '../mockup_elements/GoogleMap/js/google_map.js', array(), false, true);
        ?>

        <script type="text/javascript">
            try {
                jQuery(document).ready(function() {
                    mcba_init("<?php echo MCBA_URL ?>", "<?php echo MCBA_URL . 'www/' ?>", "<?php echo admin_url('admin-ajax.php'); ?>");
            }); 
            } catch ( e ) { console.log( e );}
        </script>
        <div style="display:none;"><?php mcba_get_editor("", "mynewid");?></div>
        <?php mcba_get_base_editor("", "mcba_this_current_id");?>

        <!-- Title -->
        <div style="display: flex;"> All Web n Mobile - <?php $data = get_plugin_data(MCBA_DIR . 'mcba.php');
	echo 'v' . $data['Version'];?> </div>
        <div id="col_left" style="float: left; height: 80vh; width: 33%">

            <!-- Mockup -->
            <!-- <link type="text/css" rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">				 -->
            <!-- <link type="text/css" rel="stylesheet" href="../mockup_elements/mockup_element_styles.css"> -->
            <div style="border-style: solid; border-width: 2px; height: 100%; width: 95%; position: relative;" id="mcba_frame">
                <div id="mcba_loading_overlay" class="mcba_loading_overlay" style="display: none; text-align: center; position: absolute; width: 100%; height: 100%; z-index: 2; background-color: rgba(160, 160, 160, 0.5)">
                    <!-- <img style="width: 75px; top: 50%; position: absolute; transform: translate(-50%, -50%);" src="<?php //echo MCBA_URL
	?>www/images/clock_dial.png" alt="Loading..." /> -->
                </div>
                <script>
                    // MCBA.mockupAddress = "<?php echo MCBA_WWW_INDEX ?>";
                </script>
                <div style="top: 0px; position: absolute; width: 100%; height: 100%; z-index: 1">
                    <div seamless id="mcba_mockup" name="mcba_mockup" style="top: 0px; position: absolute; width: 100%; height: 100%;">
                        <script type="text/javascript" src="<?php echo plugin_dir_url(__FILE__) . "../www/js/tools.js"; ?>"></script>
                        <script type="text/javascript" src="<?php echo plugin_dir_url(__FILE__) . "../www/app_config.json"; ?>"></script>
                        <script type="text/javascript">
                            var directory = "<?php echo plugin_dir_url(__FILE__) . "../www/templates/"; ?>";
                            loadjscssfile(directory + config_data.template + "/template.json ", "js");
                        </script>
                        <script type="text/javascript" src="<?php echo plugin_dir_url(__FILE__) . "../www/init.js"; ?>"></script>
                    </div>
                </div>
            </div>
            <div style="padding-top: 56.25%"></div>
        </div>

        <!--  MIDDLE COLUMN -->
        <div id="col_middle" style="float: left; height: 80vh; width: 33%">

            <!-- Item overview -->
            <div style=" height: 100%; width: 95%; position: relative;">
                <!-- Item panel -->
                <div id="mcba_item_overview">

                </div>
                <div style="padding-top: 56.25%"></div>
            </div>

        </div>

        <!--  RIGHT COLUMN  -->
        <div id="col_right" style="float: left; height: 80vh; width: 33%">
            <div id="button-panel" style="display: inline-table"> <!-- changed from flex on 042624 -->
                <input type="button" value="TMP" class="button-primary" id="button_TMP" onclick="alert(get_color_int(color_textcolor))" /> <input type="button" value="Save" class="button-primary" id="button_save" onclick="saveConfig()" />
                <input type="button" value="Launch" class="button-primary" id="button_launch" onclick="confirmAndLaunch()" />
                <input type="button" value="Undo save" class="button-primary" id="button_revert" onclick="confirmAndRevert()" />
                <input type="button" value="Clear all" class="button-primary" id="button_clear" onclick="clearAll()" />
                <select id="select_template" value="<?php echo MCBA_TEMPLATE_NAME; ?>" onchange="setTemplate( jQuery(this).val(), function(resp){console.log(resp); location.reload();} );">
                    <?php
foreach (mcba_getTemplates() as $tpl) {
		$selected = $tpl === MCBA_TEMPLATE_NAME;
		echo "<option " . ($selected ? "selected='selected'" : "") . " value=\"" . $tpl . "\">" . $tpl . "</option>";
	}
	?>
                <!-- </select> -->
    <?php if (ACTIVE !== "1") {
		// echo '<form method="post" action="http://allweb-n-mobile.com/projectmcba/register.php">
    	// 	<input type="hidden" name="mcba_id" value="' . MCBA_ID . '"></input> <input type="hidden" name="mcba_register" value="signup_form"></input>
    	// 	<input type="submit" value="Sign Up" style="background-color: #2ECC84" class="button-primary" id="button_signup" >
    	// </form>	';
	}?>
            </div>
            <div id="tbl_options" style="height:100%; position: relative;" class="accordion">
                <h3>Pages</h3>
                <div><input style="margin-bottom: 6px" type="button" value="Add Page" class="button-primary" id="button_add_page" onclick="addPage('New Page')" />
                    <div id="mcba_page_container"></div>
                </div>
                <h3>Widgets</h3>
                <div id="mcba_item_container"></div>
                <h3>Colors</h3>
                <div>
                    <table id="options_colors"></table>
                </div>
                <h3>Files</h3>
                <div>
                    <table id="options_files"></table>
                </div>
                <h3>Company Info</h3>
                <div>
                    <table id="options_info"></table>
                </div>
            </div>
        </div>

    </div>
<?php
} ?>