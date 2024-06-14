<?php

/**
 * Send form page
 */
function mcba_messaging()
{
    global $security_token;
    echo '<script>const security_token = "' . $security_token . '"</script>';
    echo '<script>const MCBA_CHAT_SECURITY_TOKEN_LENGTH    = ' . MCBA_CHAT_SECURITY_TOKEN_LENGTH . ';</script>';
    echo '<script>const MCBA_CHAT_SECURITY_TOKEN_LIFE_SPAN = ' . MCBA_CHAT_SECURITY_TOKEN_LIFE_SPAN . ';</script>';
    wp_register_script('firebase-app', 'https://www.gstatic.com/firebasejs/7.4.0/firebase.js', null, null, true);
    wp_enqueue_script('firebase-app');
    wp_enqueue_script('dist-firebaseui', plugin_dir_url(__FILE__) . '../mcba_chat_room/dist/firebaseui.js', array(), false, true);
    wp_enqueue_script('MCBA-Wordpress-tool', plugin_dir_url(__FILE__) . '../mcba_chat_room/js/tools.js', array(), false, true);
    wp_enqueue_script('MCBA-Wordpress-app', plugin_dir_url(__FILE__) . '../mcba_chat_room/js/app.js', array(), false, true);
    wp_enqueue_style('chat_configuration_css', plugin_dir_url(__FILE__) . '../mcba_chat_room/chat_configuration/css/chat_configuration.css', array(), '1.0', 'all');
    wp_enqueue_style('chatbot_css', plugin_dir_url(__FILE__) . '../mcba_chat_room/chat_bot/css/chat_bot.css', array(), '1.0', 'all');
    wp_enqueue_style('sign-up-css', plugin_dir_url(__FILE__) . '../mcba_chat_room/sign_up/css/sign_up.css', array(), '1.0', 'all');
    wp_enqueue_style('on_off_switch_css', plugin_dir_url(__FILE__) . '../mcba_chat_room/on_off_switch/css/on_off_switch.css', array(), '1.0', 'all');
    wp_enqueue_style('mcba_chat_style', plugin_dir_url(__FILE__) . '../mcba_chat_room/css/style.css', array(), '1.0', 'all');
    wp_enqueue_style('firebaseappstyle-css', plugin_dir_url(__FILE__) . '../mcba_chat_room/css/firebaseappstyle.css', array(), '1.0', 'all');
    wp_enqueue_style('MCBA-Wordpress-3', plugin_dir_url(__FILE__) . '../css/floating_phone.css', array(), '1.0', 'all');
    
	// Objects for logging
	wp_enqueue_script('MCBA-Wordpress-LoggerFactory-js', plugin_dir_url(__FILE__) . '../logger/LoggerFactory.js', array(), false, true);
	wp_enqueue_script('MCBA-Wordpress-LogObjectFactory-js', plugin_dir_url(__FILE__) . '../logger/LogObjectFactory.js', array(), false, true);
	wp_enqueue_script('MCBA-Wordpress-SourceData-js', plugin_dir_url(__FILE__) . '../logger/SourceData.js', array(), false, true);
	wp_enqueue_script('MCBA-Wordpress-FetchRunner-js', plugin_dir_url(__FILE__) . '../logger/FetchRunner.js', array(), false, true);
	wp_enqueue_script('MCBA-Wordpress-Model-js', plugin_dir_url(__FILE__) . '../logger/Model.js', array(), false, true);
	wp_enqueue_script('MCBA-Wordpress-MonitorLedClassObject-js', plugin_dir_url(__FILE__) . '../logger/MonitorLedClassObject.js', array(), false, true);
	wp_enqueue_script('MCBA-Wordpress-MonitorLed-js', plugin_dir_url(__FILE__) . '../logger/MonitorLed.js', array(), false, true);
	wp_enqueue_script('MCBA-Wordpress-MonitoredObject-js', plugin_dir_url(__FILE__) . '../logger/MonitoredObject.js', array(), false, true);
	//

	wp_enqueue_script('MCBA-Wordpress-VerifyChatId-js', plugin_dir_url(__FILE__) . '../mcba_chat_room/js/VerifyChatId.js', array(), false, true);
	wp_enqueue_script('MCBA-Wordpress-ActiveChatId-js', plugin_dir_url(__FILE__) . '../mcba_chat_room/js/ActiveChatId.js', array(), false, true);
	wp_enqueue_script('MCBA-Wordpress-TableManager-js', plugin_dir_url(__FILE__) . '../mcba_chat_room/js/TableManager.js', array(), false, true);
    wp_enqueue_script('MCBA-Wordpress-Identity-js', plugin_dir_url(__FILE__) . '../mcba_chat_room/js/Identity.js', array(), false, true);
    wp_enqueue_script('MCBA-Wordpress-MessageProcessor-js', plugin_dir_url(__FILE__) . '../mcba_chat_room/js/MessageProcessor.js', array(), false, true);
    wp_enqueue_script('MCBA-Wordpress-LogObjectFactory-js', plugin_dir_url(__FILE__) . '../mcba_chat_room/js/LogObjectFactory.js', array(), false, true);
    wp_enqueue_script('MCBA-Wordpress-PhoneNumberManager-js', plugin_dir_url(__FILE__) . '../mcba_chat_room/phone_number_manager/js/PhoneNumberManager.js', array(), false, true);
    wp_enqueue_script('MCBA-Wordpress-OnOffSwitch-js', plugin_dir_url(__FILE__) . '../mcba_chat_room/on_off_switch/js/OnOffSwitch.js', array(), false, true);
    wp_enqueue_script('MCBA-Wordpress-ChatOnOffManager-js', plugin_dir_url(__FILE__) . '../mcba_chat_room/on_off_switch/js/ChatOnOffManager.js', array(), false, true);
    wp_enqueue_script('MCBA-Wordpress-ChatColorManager-js', plugin_dir_url(__FILE__) . '../mcba_chat_room/js/ChatColorManager.js', array(), false, true);
    wp_enqueue_script('MCBA-Wordpress-PhoneIconColorManager-js', plugin_dir_url(__FILE__) . '../mcba_chat_room/js/PhoneIconColorManager.js', array(), false, true);
    wp_enqueue_script('MCBA-Wordpress-ChatConfiguration-js', plugin_dir_url(__FILE__) . '../mcba_chat_room/chat_configuration/js/ChatConfiguration.js', array(), false, true);
    wp_enqueue_script('MCBA-Wordpress-ChatBot-js', plugin_dir_url(__FILE__) . '../mcba_chat_room/chat_bot/js/ChatBot.js', array(), false, true);
    wp_enqueue_script('MCBA-Wordpress-DataSource-js', plugin_dir_url(__FILE__) . '../mcba_chat_room/js/DataSource.js', array(), false, true);
    wp_enqueue_script('MCBA-Wordpress-KnownIdentityConstructor-js', plugin_dir_url(__FILE__) . '../mcba_chat_room/js/KnownIdentityConstructor.js', array(), false, true);
    wp_enqueue_script('MCBA-Wordpress-AnonymousIdentityConstructor-js', plugin_dir_url(__FILE__) . '../mcba_chat_room/js/AnonymousIdentityConstructor.js', array(), false, true);
    wp_enqueue_script('MCBA-Wordpress-AnonymousIdentity-js', plugin_dir_url(__FILE__) . '../mcba_chat_room/js/AnonymousIdentity.js', array(), false, true);
    wp_enqueue_script('MCBA-Wordpress-AdminIdentityConstructor-js', plugin_dir_url(__FILE__) . '../mcba_chat_room/js/AdminIdentityConstructor.js', array(), false, true);
    wp_enqueue_script('MCBA-Wordpress-AdminIdentity-js', plugin_dir_url(__FILE__) . '../mcba_chat_room/js/AdminIdentity.js', array(), false, true);
    wp_enqueue_script('MCBA-Wordpress-ConversationListManager-js', plugin_dir_url(__FILE__) . '../mcba_chat_room/js/ConversationListManager.js', array(), false, true);
    wp_enqueue_script('MCBA-Wordpress-EasyBox-js', plugin_dir_url(__FILE__) . '../mcba_chat_room/js/EasyBox.js', array(), false, true);
    wp_enqueue_script('MCBA-Wordpress-Message-js', plugin_dir_url(__FILE__) . '../mcba_chat_room/js/Message.js', array(), false, true);
    wp_enqueue_script('MCBA-Wordpress-Guest-js', plugin_dir_url(__FILE__) . '../mcba_chat_room/js/Guest.js', array(), false, true);
    wp_enqueue_script('MCBA-Wordpress-MessageCounter-js', plugin_dir_url(__FILE__) . '../mcba_chat_room/js/MessageCounter.js', array(), false, true);
    wp_enqueue_script('MCBA-Wordpress-MessageManager-js', plugin_dir_url(__FILE__) . '../mcba_chat_room/js/MessageManager.js', array(), false, true);
    wp_enqueue_script('MCBA-Wordpress-VerifySentMessage-js', plugin_dir_url(__FILE__) . '../mcba_chat_room/js/VerifySentMessage.js', array(), false, true);
    wp_enqueue_script('MCBA-Wordpress-MessageSender-js', plugin_dir_url(__FILE__) . '../mcba_chat_room/js/MessageSender.js', array(), false, true);
    wp_enqueue_script('MCBA-Wordpress-Encryption-js', plugin_dir_url(__FILE__) . '../mcba_chat_room/js/Encryption.js', array(), false, true);
    wp_enqueue_script('MCBA-Wordpress-ChatRouter-js', plugin_dir_url(__FILE__) . '../mcba_chat_room/js/ChatRouter.js', array(), false, true);
    wp_enqueue_script('MCBA-Wordpress-ChatBox-js', plugin_dir_url(__FILE__) . '../mcba_chat_room/js/ChatBox.js', array(), false, true);
    wp_enqueue_script('MCBA-Wordpress-Tests-js', plugin_dir_url(__FILE__) . '../mcba_chat_room/js/Tests.js', array(), false, true);
    wp_enqueue_script('MCBA-Wordpress-DatabaseSync-js', plugin_dir_url(__FILE__) . '../mcba_chat_room/js/DatabaseSync.js', array(), false, true);
    wp_enqueue_script('MCBA-Wordpress-DataArg-js', plugin_dir_url(__FILE__) . '../mcba_chat_room/js/DataArg.js', array(), false, true);
    wp_enqueue_script('MCBA-Wordpress-Utils-js', plugin_dir_url(__FILE__) . '../js/Utils.js', array(), false, true);
    wp_enqueue_script('MCBA-Wordpress-mcba_chat_main', plugin_dir_url(__FILE__) . '../mcba_chat_room/js/mcba_chat_main.js', array(), false, true);
    wp_enqueue_script('routerJs', plugin_dir_url(__FILE__) . '../mcba_chat_room/js/router.js', array(), false, true);
    global $wpdb, $current_user;

    // require_once(dirname(__FILE__) . "/../../../../wp-config.php");
    $mysqli = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);
    $query = "SELECT * FROM " . $wpdb->prefix . "mcba_users";

    if ($mysqli->connect_errno) {
        echo 'Unable to connect to DB!';
        die();
    }
    $result = $mysqli->query( $query );

    echo '<div class="wrap">';
    echo '<h2>Ask The Expert</h2>';
?>
    <?php

    if (isset($_POST['enter'])) {
        if ($_POST['name'] != "") {
            $_SESSION['name'] = stripslashes(htmlspecialchars($_POST['name']));
            $fp = fopen("log.html", 'a');
            fwrite($fp, "<div class='msgln'><i>User " . $_SESSION['name'] . " has joined the chat session.</i><br></div>");
            fclose($fp);
        } else {
            echo '<span class="error">Please type in a name</span>';
        }
    }

    // if (isset ( $_GET ['logout'] )) {

    //     // Simple exit message
    //     $fp = fopen ( "log.html", 'a' );
    //     fwrite ( $fp, "<div class='msgln'><i>User " . $_SESSION ['name'] . " has left the chat session.</i><br></div>" );
    //     fclose ( $fp );

    //     session_destroy ();
    //     header ( "Location: index.php" ); // Redirect the user
    // }

    ?>
    <style>
        body {
            font: 12px arial;
            color: #222;
            text-align: center;
            padding: 35px;
        }

        form,
        p,
        span {
            margin: 0;
            padding: 0;
        }

        input {
            font: 12px arial;
        }

        a {
            color: #0000FF;
            text-decoration: none;
        }

        a:hover {
            text-decoration: underline;
        }

        #wrapper,
        #loginform {
            margin: 0 auto;
            padding-bottom: 25px;
            background: #EBF4FB;
            width: 504px;
            border: 1px solid #ACD8F0;
        }

        #loginform {
            padding-top: 18px;
        }

        #loginform p {
            margin: 5px;
        }

        #chatbox {
            text-align: left;
            margin: 0 auto;
            margin-bottom: 25px;
            padding: 10px;
            background: #fff;
            height: 270px;
            width: 430px;
            border: 1px solid #ACD8F0;
            overflow: auto;
        }

        #usermsg {
            width: 395px;
            border: 1px solid #ACD8F0;
        }

        #submit {
            width: 60px;
        }

        .error {
            color: #ff0000;
        }

        #menu {
            padding: 12.5px 25px 12.5px 25px;
        }

        .welcome {
            float: left;
        }

        .logout {
            float: right;
        }

        .msgln {
            margin: 0 0 2px 0;
        }

        ul {
            list-style-type: none;
        }

        .conversation_list li {
            border: 1px solid black;
            padding: 7px;
        }

        .conversation_list {
            width: 20%;
            color: black !important;
        }

        .conversation_list li:hover {
            background-color: darkgrey
        }

        .selected_conversation_list {
            background-color: #F8F8BF;
        }




        /* ////////////////////////////////////////////// */
        .chat-area {
            display: grid;
            grid-template-columns: 1fr;
            grid-template-rows: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
            background: #ffffff;
            border: solid 1px;
            border-color: black;
            border-radius: 3%;
            /* height: var(--chat_area_height); */
            height: 40%;
            overflow: auto;
            /* display: grid;  */
            grid-auto-columns: 1fr;
            /* grid-template-columns: 1fr;  */
            /* grid-template-rows: 1fr 1fr 1fr;  */
            /* gap: 0px 0px;  */
            justify-content: stretch;
            align-content: stretch;
            justify-items: stretch;
            align-items: stretch;
            width: 40%;
            height: 20%;
        }

        .messages_container {
            display: grid;
        }

        /* ////////////////////////////////////////////// */
    </style>

    <body>
        <?php
        $_SESSION['name'] = "Jane Doe";
        if (!isset($_SESSION['name'])) {
            echo ("*** ERROR: session name is not defined! ");
        } else {
            $admin_url = admin_url( 'admin-ajax.php' );
            // define('MCBA_URL', plugin_dir_url(__FILE__));
            echo '<script>const MCBA_URL                           = "' . MCBA_URL                           . '" ;</script>';
            echo "<script>const ADMIN_URL                          =      \"$admin_url\"                          ;</script>";
        ?>
            <!-- //////////////////// config /////////////////////// -->
            <div id="chat-configuration-container" class="chat-configuration-container"></div>

            <!-- The Conversation List -->
            <div class="conversation_list" id="conversation_list_root_div"></div>
            <!-- end conversation list -->


            <!-- //////////////////// start chat area /////////////////////////////////-->
            <div class="container-fluid chat_area" id="chat-box"></div>
            <!-- //////////////////// end chat area ///////////////////////////////////-->

            <link  href="https://unpkg.com/material-components-web@latest/dist/material-components-web.min.css" rel="stylesheet">
            <script src="https://unpkg.com/material-components-web@latest/dist/material-components-web.min.js"    ></script>
            <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js" crossorigin="anonymous"></script>
            <script type="text/javascript">
                //jQuery Document
                $(document).ready(function() {
                    
                    //If user wants to end session
                    $("#exit").click(function() {
                        var exit = confirm("Are you sure you want to end the session?");
                        if (exit == true) {
                            window.location = 'index.php?logout=true';
                        }
                    });
                    init();
                });

                //If user submits the form
                $("#submitmsg").click(function() {
                    var clientmsg = $("#usermsg").val();
                    $.post("post.php", {
                        text: clientmsg
                    });
                    $("#usermsg").attr("value", "");
                    loadLog;
                    return false;
                });

                function loadLog() {
                    var oldscrollHeight = $("#chatbox").attr("scrollHeight") - 20; //Scroll height before the request
                    $.ajax({
                        url: "log.html",
                        cache: false,
                        success: function(html) {
                            $("#chatbox").html(html); //Insert chat log into the #chatbox div

                            //Auto-scroll
                            var newscrollHeight = $("#chatbox").attr("scrollHeight") - 20; //Scroll height after the request
                            if (newscrollHeight > oldscrollHeight) {
                                $("#chatbox").animate({
                                    scrollTop: newscrollHeight
                                }, 'normal'); //Autoscroll to bottom of div
                            }
                        },
                    });
                }

                // setInterval(loadLog, 2500);
            </script>
            </div>
    <?php
        }
    }
