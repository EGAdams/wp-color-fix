var config_data = {
	"location_of_this_file": ".../wp-content/plugins/MCBA-Wordpress/www",
	"pages": [ {
			"title": "Home",
			"items": [ {
					"height": "2",
					"type": "Space"
				}, {
					"src": "flcarwashlogo.png",
					"position": "Center",
					"percent": "95",
					"type": "MCBA_Image",
					"www_url": "https://floridascarwash.com/wp-content/plugins/MCBA-Wordpress/inc/../../../uploads/MCBA/www/"
				}, {
					"width": "40",
					"lineHeight": "80",
					"background_color": "#ff7e00",
					"left_button_text": " Geo",
					"right_button_text": " Gift",
					"left_button_image": "",
					"right_button_image": "",
					"text_color": "#ffffff",
					"font": "Times New Roman",
					"font_size": "24",
					"left_button_action": "mcba://proxidemo",
					"right_button_action": "mcba://rewards",
					"type": "Buttonrow",
					"www_url": "https://floridascarwash.com/wp-content/plugins/MCBA-Wordpress/../../uploads/MCBA/www/",
					"left_button_icon": "fas fa-globe",
					"right_button_icon": "fas fa-gift",
					"left_button_icon_category": "maps",
					"right_button_icon_category": "shopping",
					"action": "https://www.google.com/maps/place/All+Web+n+Mobile+LLC/@27.9389784,-82.5378151,16.75z/data=!4m5!3m4!1s0x88c2a07383a1c143:0x316ec8aa00248d6!8m2!3d28.4621326!4d-82.5372695"
				}, {
					"height": "1",
					"type": "Space"
				}, {
					"width": "40",
					"lineHeight": "80",
					"background_color": "#ff7e00",
					"left_button_text": " Chat",
					"right_button_text": " Call",
					"left_button_image": "",
					"right_button_image": "",
					"text_color": "#ffffff",
					"font": "Times New Roman",
					"font_size": "24",
					"left_button_action": "mcba://chat",
					"right_button_action": "tel:+13525563926",
					"type": "Buttonrow",
					"www_url": "https://floridascarwash.com/wp-content/plugins/MCBA-Wordpress/../../uploads/MCBA/www/",
					"left_button_icon": "fas fa-comments",
					"right_button_icon": "fas fa-phone",
					"left_button_icon_category": "chat",
					"right_button_icon_category": "maps",
					"action": "mcba://chat"
				},
				{
					"height": "1",
					"type": "Space"
				},
				{
					"width": "45",
					"lineHeight": "80",
					"background_color": "#ff7e00",
					"left_button_text": " Maps",
					"right_button_text": " Link",
					"text_color": "#ffffff",
					"font": "Times New Roman",
					"font_size": "24",
					"left_button_action": "https://www.google.com/maps/place/All+Web+n+Mobile+LLC/@28.4619845,-82.5396737,16.75z/data=!4m5!3m4!1s0x88c2a07383a1c143:0x316ec8aa00248d6!8m2!3d28.4621326!4d-82.5372695",
					"right_button_action": "",
					"left_button_icon_category": "maps",
					"left_button_icon": "fas fa-map-marker-alt",
					"right_button_icon_category": "editors",
					"right_button_icon": "fas fa-link",
					"type": "Buttonrow"
				},
				{
					"width": "94",
					"lineHeight": "26",
					"button_text": "Privacy Policy",
					"left_button_image": "",
					"right_button_image": "",
					"background_color": "#ff7e00",
					"text_color": "#ffffff",
					"font": "Times New Roman",
					"font_size": "17",
					"action": "https://floridascarwash.com/privacy-policy/",
					"button_icon": "left button text:",
					"type": "Singlebutton"
				}
			]
		},
		{
			"title": "Map",
			"items": [ {
				"latitude": "28.0250434",
				"longitude": "-82.5115966",
				"circle_radius": "300",
				"type": "GoogleMap"
			} ]
		}, {
			"title": "Background",
			"items": [ {
				"height": 1,
				"type": "Space"
			}, {
				"value": "Background Location permission text here.",
				"type": "Text"
			}, {
				"height": 1,
				"type": "Space"
			}, {
				"src": "mcba-display-demo.png",
				"position": "Left",
				"percent": "95",
				"type": "MCBA_Image",
				"www_url": "https://mycustombusinessapp.com/wp-content/plugins/MCBA-Wordpress/inc/../../../uploads/MCBA/www/"
			}, {
				"height": 1,
				"type": "Space"
			}, {
				"width": "47",
				"lineHeight": "60",
				"background_color": "#eae55d",
				"left_button_text": "ACCEPT",
				"right_button_text": "DENY",
				"text_color": "fefefe",
				"font": "",
				"font_size": "30",
				"left_button_action": "",
				"right_button_action": "",
				"left_button_icon_category": "editors",
				"left_button_icon": "",
				"right_button_icon_category": "maps",
				"right_button_icon": "",
				"type": "Buttonrow"
			} ]
		}
	],
	"options": {
		"logo": {
			"text": "Logo",
			"type": "file",
			"value": ""
		},
		"companyname": {
			"text": "Company Name",
			"type": "text",
			"value": "All Web N Mobile"
		},
		"legalname": {
			"text": "Legal Company Name",
			"type": "text",
			"value": "All Web N Mobile"
		},
		"textcolor": {
			"text": "Text Color",
			"type": "color",
			"value": "#000000"
		},
		"website": {
			"text": "Website",
			"type": "text",
			"value": "https//:mycustombusinessapp.com"
		},
		"facebook": {
			"text": "Facebook",
			"type": "text",
			"value": "https:\/\/www.facebook.com"
		},
		"linkedin": {
			"text": "LinkedIn",
			"type": "text",
			"value": "https:\/\/www.linkedin.com"
		},
		"twitter": {
			"text": "Twitter",
			"type": "text",
			"value": ""
		},
		"email": {
			"text": "Email",
			"type": "text",
			"value": "info@mycustombusinessapp.com"
		},
		"address": {
			"text": "Street Address",
			"type": "text",
			"value": "11213 Spring Hill Dr"
		},
		"city": {
			"text": "City",
			"type": "text",
			"value": "Spring Hill"
		},
		"state": {
			"text": "State",
			"type": "text",
			"value": "FL"
		},
		"zip": {
			"text": "Zip Code",
			"type": "text",
			"value": "34609"
		},
		"phone": {
			"text": "Phone Number",
			"type": "text",
			"value": "+13525563926"
		},
		"longitude": {
			"text": "Office Longitude",
			"type": "text",
			"value": "-82.539673"
		},
		"latitude": {
			"text": "Office Latitude",
			"type": "text",
			"value": "28.461984"
		},
		"pushgreeting": {
			"text": "Promoblast Greeting",
			"type": "text",
			"value": "Promoblast!"
		},
		"google_map_address": {
			"text": "Google Map Address",
			"type": "text",
			"value": "https://www.google.com/maps/place/All+Web+n+Mobile+LLC/@28.4619845,-82.5396737,16.75z/data=!4m5!3m4!1s0x88c2a07383a1c143:0x316ec8aa00248d6!8m2!3d28.4621326!4d-82.5372695"
		},
		"base_color": {
			"text": "Main Color",
			"type": "color",
			"value": "#0000ff"
		},
		"background_color": {
			"text": "Background Color",
			"type": "color",
			"value": "#ffffff"
		},
		"page_color": {
			"text": "Page Color",
			"type": "color",
			"value": "#ffffff"
		},
		"menu_text": {
			"text": "Menu Text",
			"type": "color",
			"value": "#ffffff"
		},
		"singlebutton": {
			"text": "Menu Text",
			"type": "color",
			"value": "#ffffff",
			"width": "75",
			"lineHeight": "60",
			"background_color": "#408080",
			"text_color": "#e2cc86",
			"font": "cursive"
		},
		"buttonrow": {
			"text": "Menu Text",
			"type": "color",
			"value": "#ffffff",
			"width": "45%",
			"lineHeight": "58px",
			"background_color": "#012af9",
			"text_color": "#e2cc86",
			"font": "cursive",
			"font_size": "30",
			"background": "#001eff"
		}
	},
	"template": "TemplateTwo"
};
