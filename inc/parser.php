<?php
defined('ABSPATH') || exit;
/**
 * Read the config file as a json object
 * @param unknown $filepath
 * @return mixed
 */

global $wp_filesystem;
    
// Initialize the WP filesystem, no more using 'file-put-contents' function
if (empty($wp_filesystem)) {
	require_once (ABSPATH . '/wp-admin/includes/file.php');
	WP_Filesystem();
}

function mcba_parse($filepath){
	$jsonstring = file_get_contents($filepath);
	$config = json_decode($jsonstring, true);
	return $config;
}


function mcba_save_config($config){
	file_put_contents(
		MCBA_TMP_CONFIG, 
		(gettype($config) === 'object' || gettype($config) === 'array') 
			? json_encode($config) : $config);
}


function mcba_backup_config(){
	$count = 0;
	/* Count the backup files saved */
	if ($handle = opendir(MCBA_BACKUP_DIR)) {
		while (($file = readdir($handle)) !== false){
			if (!in_array($file, array('.', '..')) && !is_dir(MCBA_BACKUP_DIR.$file))
				$count++;
		}
	}
	
	$date = getdate();
	$timestamp = $date['weekday']."_".$date['mon']."-".$date['mday']."-".$date['year']."_".
			time();
	$filepath = MCBA_BACKUP_DIR . "config_backup_".$timestamp.".json";
	file_put_contents($filepath, file_get_contents(MCBA_APP_CONFIG));
	return $filepath;
}

/**
 * Get the background with given name
 * @param String $name
 * @return unknown|string
 */
function mcba_get_background($name){
 	$config = mcba_parse(MCBA_APP_CONFIG);
 	$backgrounds = $config["backgrounds"];
	foreach( $backgrounds as $bg ){
		if($bg['name'] == $name){
			return $bg["background"];
		}
	}
	return "Background ".$name." Not found";
}



/**
 * Create a new empty item
 * @param String $name The name of the new item. This will be used to reference it later.
 */
function mcba_make_item($name){
	$config = mcba_parse(MCBA_APP_CONFIG);
	$new_item = array();
	$new_item['name'] = $name;
	$new_item['details'] = array(array('id' => 0, 'title' => $name, 'text' => $name));
	$new_item['id'] =  mcba_get_next_id($config['items']);
	$config['items'][] = $new_item;
	mcba_save_config($config);
	return $new_item['id'];
}

/**
 * Creates a new empty page
 * @param unknown $title
 */
function mcba_make_page($title){
	$config = mcba_parse(MCBA_APP_CONFIG);
	$new_id = $mcba_get_next_id($config['pages']);
	$new_page = array();
	$new_page['title'] = $title;
	$new_page['id'] = $new_id;
	$config["pages"][] = $new_page;
	mcba_save_config($config);
}


/**
 * Add a new detail to the given item
 * 
 * @param String $item_name
 * @param String $title
 * @param String $description
 * @param String $image_path
 * @return 1 on success, -1 if item is not found
 */
function mcba_add_detail($item, $title){
	$config = mcba_parse(MCBA_APP_CONFIG);
	$cat_index = mcba_find_item_index($item);
	
	/* Return error code if the item doesn't exist */
	if($cat_index < 0) return -1;
	
	/* Find the new id */
	$id = 0;
	foreach ($config["items"][$cat_index]['details'] as $detail){
		$id = ($detail['id'] >= $id) ? $detail['id'] + 1 : $id;
	}
	
	$detail = array();
	$detail['title'] = $title;
	$detail['id'] = $id;
	/* Add the new detail */
	$config["items"][$cat_index]['details'][] = $detail;
	mcba_save_config($config);
	return 1;
}



function mcba_attach_item_to_page($page, $item_id, $display_type){
	$config = mcba_parse(MCBA_APP_CONFIG);
	$page_index = mcba_find_page_index($page);
	
	/* Return error code if the item or page doesn't exist */
	if($page_index < 0) return -1;
	if(mcba_find_item((int)$item_id) == null ) return -2;
	
	/* Add the new item */
	if(empty($config['pages'][$page_index]['items'])){
		$config["pages"][$page_index]['items'] = array();
	}
	
	foreach($config["pages"][$page_index]['items'] as $item){
		if($item["id"] == $item_id){
			// Already added
			return 2;
		} 
	} 
	
 	$config["pages"][$page_index]['items'][] = array('id' => $item_id, 'display_type' => $display_type);
	mcba_save_config($config);
	return 1;
}

function mcba_edit_item($itemid, $field, $value, $pageid = -1){
	$config = mcba_parse(MCBA_APP_CONFIG);
	if($pageid != -1){
		$page_index = mcba_find_page_index($pageid);
		
		/* Return error code if the item or page doesn't exist */
		if($page_index < 0) return -1;
		
		/* Find the item and set the field value if exists */
		for($i = 0; $i < count($config['pages'][$page_index]['items']); $i++){
			if($config['pages'][$page_index]['items'][$i]['id'] == $itemid){
				if(empty($config['pages'][$page_index]['items'][$i][$field])) return -2;
				$config['pages'][$page_index]['items'][$i][$field] = $value;
			}
		}
	} else {
		$item_index = mcba_find_item_index($itemid);
		if(empty($config['items'][$item_index][$field])) return -3;
		$config['items'][$item_index][$field] = $value;
	}
	
	mcba_save_config($config);
	return 1;
}



/**
 * Update the keys and values of a specific detail inside a item
 */
function mcba_edit_detail($item_id, $detail_id, $field, $value){
	$config = mcba_parse(MCBA_APP_CONFIG);
	$item_index = mcba_find_item_index($item_id);
	
	/* Return error code if the item doesn't exist */
	if($item_index < 0) return -1;
	
	$detail_index = mcba_find_detail_index($item_id, $detail_id);
	if($detail_index < 0) return -2;
	
	/* Set the new keys/values */
	$config["items"][$item_index]['details'][$detail_index][$field] = $value;

	mcba_save_config($config);
	return 1;
}



/**
 * Delete an detail from given item.
 * 
 * @param unknown $item_name
 * @param unknown $detail_title
 * @return 1 on success, 0 if detail not found in item, -1 if item not found
 */
function mcba_delete_detail($item_name, $detail_id){
	$config = mcba_parse(MCBA_APP_CONFIG);
	$cat_index = mcba_find_item_index($item_name);
	
	/* Return error code if the item doesn't exist */
	if( $cat_index < 0) return -1;
	
	$details = $config['items'][$cat_index]['details'];
	
	/* Search through the details in the parent item for the given detail */
	for($i = 0; $i < count($details); $i++){
		if($details[$i]['id'] == $detail_id){
			// Found the detail, delete it
			array_splice($config['items'][$cat_index]['details'], $i, 1);
			mcba_save_config($config);
			return 1;
		}
	}

	// No detail deleted
	return 0;
}



/**
 * Delete an entire page
 * @param String $page_title
 */
function mcba_delete_page($page_title){
	$config = mcba_parse(MCBA_APP_CONFIG);

	for($i = 0; $i < count($config['pages']); $i++){
		if($config['pages'][$i]['title'] == $page_title){
			array_splice($config['pages'], $i, 1);
		}
	}

	mcba_save_config($config);
}




/**
 * Delete an entire item
 * @param String $item_name
 */
function mcba_delete_item($item){
	$config = mcba_parse(MCBA_APP_CONFIG);
	$arg_type = gettype($item);
	
	
	for($i = 0; $i < count($config['items']); $i++){
		if($arg_type === "string"){
			// Search by name
			if($config['items'][$i]['name'] == $item){
				array_splice($config['items'], $i, 1);
			}
		} else if ( $arg_type === "integer" ){
			// Search by ID
			if($config['items'][$i]['id'] == $item){
				array_splice($config['items'], $i, 1);
			}
		}
	}

	mcba_save_config($config);
}


function mcba_detach_item_from_page($page_id, $item_id){
	$config = mcba_parse(MCBA_APP_CONFIG);
	$page = mcba_get_page($page_id);
	
	for($i = 0; $i < count($page['items']); $i++){
		if($page['items'][$i]['id'] == $item_id){
			// Remove the item
			array_splice($page['items'], $i, 1);
		}
	}
	
	$page_index = mcba_find_page_index($page_id);
 	$config['pages'][$page_index]['items'] = $page['items'];
	mcba_save_config($config);
	return 1;
}




function mcba_find_item($item){
	$config = mcba_parse(MCBA_APP_CONFIG);
	$index = mcba_find_item_index($item);
	if($index == -1){
		return null;
	} else{
		return $config['items'][$index];
	}
}

function mcba_get_page_items($page){
	$config = mcba_parse(MCBA_APP_CONFIG);
	$page_index = mcba_find_page_index($page);
	if($page_index < 0) return $page_index;
	$page_items = $config['pages'][$page_index]['items'];
	if(empty($page_items)){
		$ret  = array();
		return $ret;
	}
	$items = array();
	foreach ($page_items as $page_item){
		$newcat = mcba_find_item((int)$page_item['id']);
		if(!empty($page_item['display_type']))$newcat['display_type'] = $page_item['display_type'];
		$items[] = $newcat;
	}
	return $items;
}

/**
 * Find the index of a given item
 * @param String $name The name of the item to search for.
 * @return The index of the item on success, -1 if not found
 */
function mcba_find_item_index($item){
	$config = mcba_parse(MCBA_APP_CONFIG);
	$arg_type = gettype($item);
	
	for($i = 0; $i < count($config['items']); $i++){
		$next_item = $config['items'][$i];
		if($arg_type === "string"){
			// Find by name
			if($next_item['name'] == $item){
				return $i;
			}
		}else if($arg_type === "integer"){
			// Find by id
			if($next_item['id'] == $item){
				return $i;
			}
		}
	}
	return -1;
}

/**
 * Find the index of given page in array
 * @param mixed $page
 * @return The index of the page on success, -1 if not found
 */
function mcba_find_page_index($page){
	$config = mcba_parse(MCBA_APP_CONFIG);
	$arg_type = gettype($page);
	
	if($arg_type === "string"){
		// Find by title
		for($i = 0; $i < count($config['pages']); $i++){
			if($config['pages'][$i]['title'] == $page){
				return $i;
			}
		}
		return -1;
	}else if ($arg_type === "integer"){
		// Find by id
		for($i = 0; $i < count($config['pages']); $i++){
			if($config['pages'][$i]['id'] == $page){
				return $i;
			}
		}
		return -2;
	}
	return -3;
}

/**
 * Find the index of the given detail inside the given item
 * @param unknown $item_name
 * @param unknown $title
 * @return number
 */
function mcba_find_detail_index($item, $detail){
	$config = mcba_parse(MCBA_APP_CONFIG);
	
	$arg_type = gettype($detail);
	
	if($arg_type === "string"){
		// Find by title
		$details = $config['items'][mcba_find_item_index($item)]['details'];
		for($i = 0; $i < count($details); $i++){
			if($details[$i]['title'] == $detail){
				return $i;
			}
		}
	} else if ($arg_type === "integer"){
		// Find by id
		$details = $config['items'][mcba_find_item_index($item)]['details'];
		for($i = 0; $i < count($details); $i++){
			if($details[$i]['id'] == $detail){
				return $i;
			}
		}
	}
	
	return -1;
}


function mcba_get_option($key){
	$config = mcba_parse(MCBA_APP_CONFIG);
	return $config['options'][$key];
}


function mcba_get_page($page){
	$config = mcba_parse(MCBA_APP_CONFIG);
	return $config['pages'][mcba_find_page_index($page)];
}


/**
 * Get all pages as a JSON array
 * @return mixed
 */
function mcba_get_pages(){
	$config = mcba_parse(MCBA_APP_CONFIG);
	return  $config["pages"];
}

/**
 * Get all items as a JSON array
 * @return mixed
 */
function mcba_get_items(){
	$config = mcba_parse(MCBA_APP_CONFIG);
	return $config["items"];
}


function mcba_set_option($key, $value){
	$config = mcba_parse(MCBA_APP_CONFIG);
	
	/* Add the 'options' object if not yet created */
	if (!key_exists('options', $config)){
		$config['options'] = array();
	}

	/* Add or set the option */
	$config['options'][$key] = $value;

	mcba_save_config(json_encode($config));
}

/**
 * Find the next id value in an array.
 * @param unknown $array
 * @return Ambigous <number, unknown>
 */
function mcba_get_next_id($array){
	$id = -1;
	foreach ($array as $detail){
		if(!empty($detail['id']) && $detail['id'] > $id){
			$id = $detail['id'];
		}
	}
	return ++$id;
}


function mcba_list_items(){
	$items = mcba_get_items();
	$list = "";
	if(! count($items)) return "NULL";
	foreach($items as $item){
		$list .= $item["name"] . "</br>";
	}
	return $list;
}

function mcba_list_pages(){
	$json_pages = mcba_get_pages();
	$list = "";
	if(! count($json_pages)) return "NULL";
	foreach($json_pages as $page){
		$list .= $page["title"] . "</br>";
	}
	return $list;
}

?>