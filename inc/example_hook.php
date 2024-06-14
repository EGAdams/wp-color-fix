


<?php
/*
Plugin Name: Add Text To Footer
*/
 
// Hook the 'wp_footer' action hook, add the function named 'mfp_Add_Text' to it
add_action("wp_footer", "mfp_Add_Text");

// Hook to the 'init' action, which is called after WordPress is finished loading the core code
add_action( 'init', 'add_Cookie' );
 
// Set a cookie with the current time of day
function add_Cookie() {
  setcookie("last_visit_time", date("r"), time()+60*60*24*30, "/");
}

// Hook the 'init' action, which is called after WordPress is finished loading the core code, add the function 'remove_My_Meta_Tags'
add_action( 'init', 'remove_My_Meta_Tags' );

// Remove the 'add_My_Meta_Tags' function from the wp_head action hook
function remove_My_Meta_Tags()
{
  remove_action( 'wp_head', 'add_My_Meta_Tags');
}

// Hook the 'wp_footer' action, run the function named 'mfp_Add_Text()'
add_action("wp_footer", "mfp_Add_Text");
 
// Hook the 'wp_head' action, run the function named 'mfp_Remove_Text()'
add_action("wp_head", "mfp_Remove_Text");
 
// Define the function named 'mfp_Add_Text('), which just echoes simple text
function mfp_Add_Text()
{
  echo "<p style='color: #FFF;'>After the footer is loaded, my text is added!</p>";
}
 
// Define the function named 'mfp_Remove_Text()' to remove our previous function from the 'wp_footer' action
function mfp_Remove_Text()
{
  if (date("l") === "Monday") {
    // Target the 'wp_footer' action, remove the 'mfp_Add_Text' function from it
    remove_action("wp_footer", "mfp_Add_Text");
  }
}