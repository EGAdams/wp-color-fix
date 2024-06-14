
MCBA.loadScript("js/jquery.min.js");
MCBA.loadStyle("css/custom.css");

MCBA.getOption = function( key ){ 
	var option = {};
	var logoURL = ((MCBA.config.options.logo.value == "" || MCBA.config.options.logo.value == undefined) ? MCBA.rootDir + "images/awm-logo-default.png" : ('images/'+MCBA.config.options.logo.value));
	
	for( subkey in MCBA.config.options[key]){ 
		option[subkey] = MCBA.config.options[key][subkey];
	}
	
	option['default'] = MCBA.config.options[key].value ? false : true; 
	
	switch( key ){
	case 'logo':
		option.value = 
				(  option['default'] ?
						MCBA.rootDir + "images/awm-logo-default.png" 
					:  
						logoURL 
				);
		break;
	}
	
	return option;
}

function MCBALoaded(){
}
 

function DynamicImage(attrs){
	this.element = $(document.createElement('div'))
	.attr({ 
		'rel' : 'external',
		'class' : 'mcba_image'
	})
	.css({
		'display' : 'block',
		'width' : ( attrs.size ? attrs.size + "px" : '35px'),
		'height' : ( attrs.size ? attrs.size + "px" : '35px'),
		'border-radius' : '6px', // rounds the corners slightly
		'font-size' : '20px',
		'color' : '#fff',
		'line-height':( attrs.size ? attrs.size + "px" : '35px'),
		'text-align':'center',
		'text-decoration':'none',
		'background' : MCBA.config.options.base_color.value
	})	
	.hover({ 
		'color':'#ccc',
		'text-decoration':'none',
		'background': shade(MCBA.config.options.base_color.value, 10)
	})
	.append(
			(attrs.img) ? 
		    	$(document.createElement('img'))
		    	.attr({
		    		'src' : attrs.img,
		    		'alt' : (attrs.alt ? attrs.alt : '' ),
		    		'border' : '0'
		    	})
		    :
		    	null
	);
	
}


function Button(attrs){
	this.element = $(document.createElement('a'))
	.attr({
		'rel' : 'external',
		'class' : 'mcba_button',
		'href' : attrs.href,
		'id' : attrs.id,
	})
	.css({
		'display' : 'block',
		'width' : '35px',
		'height' : '35px',
		'border-radius' : '6px', // rounds the corners slightly
		'font-size' : '20px',
		'color' : '#fff',
		'line-height':'35px',
		'text-align':'center',
		'cursor' : 'pointer',
		'text-decoration':'none',
		'background' : MCBA.config.options.base_color.value,
	})	
	.hover({
		'color':'#ccc',
		'text-decoration':'none',
		'background': shade(MCBA.config.options.base_color.value, 10)
	})
	.append(
			(attrs.img) ? 
		    	$(document.createElement('img'))
		    	.attr({
		    		'src' : attrs.img,
		    		'alt' : (attrs.alt ? attrs.alt : '' ),
		    		'border' : '0'
		    	})
		    	.css({
		    		'margin-top' : attrs['margin-top'],
		    	})
		    :
		    	null
	);
	
	if( typeof attrs.action !== 'undefined'){
		this.element
		.click( attrs.action ); 
	}
}

function Html(item){
	this.element =  $(document.createElement('div'))
	.css({
		'position' : 'relative',
		'width' : '100%',
	})
	.append( item.html );
}


function Space(item){
	this.element = $(document.createElement('div'))
	.css({
		'position' : 'relative',
		'width' : '100%',
	});
	
	for( var i = 0; i < item.height; i++){
		this.element.append( document.createElement('br') );
	}
}



function Text(item){
 
/*	this.text = item.value.replace(/\n/g, "<br/>")
                        .replace(/&/g, '&amp;')
                       .replace(/</g, '&lt;')
                       .replace(/>/g, '&gt;')
                       .replace(/"/g, '&quot;')
                       .replace(/'/g, '&apos;');
	this.element =  $(document.createElement('p'))
*/
	this.element =  $(document.createElement('div'))
	.css({
		'position' : 'relative',
		'width' : '100%',
	})
	.append( item.value );
}



function Background(item){
  this.unique = true;
  this.run = function(){
    var img = ((item.image=="" || item.image==undefined)? "":"url(images/" + item.image + ")");
    $('body')
    .css({
      'background-color' : ( typeof item.color === 'undefined' || item.color === "" ? MCBA.getOption('background_color').value : item.color),
      'background-image' : img,
      'background-size' : item.size + "%",
      'background-repeat' : item.repeat,
    })
  }
}
 

function List(item){
	var self = this;
	this.element = null;
	this.childElements = [];
	
	var listElem = $(document.createElement('ul'))
	.css({
		'position' : 'relative',
		'width' : '100%',
	})
	.attr({
		'class' : item['bullet_style']
	});
	
	item.values.forEach(function(detail){
		var child = $(document.createElement('li'))
			.append(
				detail.value
			);
		self.childElements.push(child);
		listElem.append(child);
	});
	this.element = listElem;
}

function Image(item){
	var imgSRC = ((item['src'] == "" || item['src'] == undefined) ? "": ('images/'+item['src']));
	
//	console.log('Width Percentage:'+item['Width Percentage']);
//	console.log('percentage:'+item['percentage']);
	console.log('item:'+JSON.stringify(item))
	
	this.img = $(document.createElement('img'))
	.attr({
		'src' : imgSRC,
/*		'width'	 : item['width'],
		'height' : item['height'],
*/	})
	.css({
		'width' : item['percent']+'%',
		'height' : item['percent']+'%',
	});
	
	if( typeof item['position'] !== 'undefined'){
	  switch( item['position'] ){
	    case 'Left':
	      break;
	    case 'Right':
	      this.img.css({
	        'margin-left' : 'auto',
	      })
	      break;
	    case 'Center':
	      this.img.css({
	        'margin-right' : 'auto',
	        'margin-left' : 'auto',
	      })
	      break;
	    case 'Span':
	      this.img.css({
	        'margin-right' : 'auto',
	        'margin-left' : 'auto',
	        'width' : '100%',
	      })
	      break;
	  }
	}
	
	this.element =  $(document.createElement('div'))
	.css({
		'display' : 'flex',
		'position' : 'relative',
		'width' : '100%',
	})
	.append( this.img );
}

function Menu(item){
	var self = this;
	this.childElements = [];
	var listElem = $(document.createElement('ul'))
	.css({
		'position' : 'relative',
		'width' : '100%',
	})
	.attr({
		'class' : 'mcba_menu center'
	});
	
	for( var i = 0; i < item.values.length; i++){
		var detail = item.values[i];
		var pageName = detail.page;
		var pageNum = -1;
		for( var x = 0; x < MCBA.config.pages.length; x++ ){
			if( MCBA.config.pages[x].title === pageName ){
				pageNum = x;
				break;
			}
		}
		
		var child = 
			$(document.createElement('li'))
			.css({
				'cursor' : 'pointer'
			})
			.append(
				$(document.createElement('a'))
				.attr({
					'rel' : 'external'
				})
				.data('page' , pageNum )
				.click(function(){
					MCBA.load( parseInt($(this).data('page')) );
				})
				.append(
					$(document.createElement('div'))
					.attr({
						'width' : '100%',
						'height' : '100%'
					})
					.append(detail.page)
				)
			);
		self.childElements.push( child );
		listElem.append(child);
	}
	this.element = listElem;
}




function Slider(item){
  var self = this;
  this.unique = true;

  this.run = function(){
  	$(document.createElement('div'))
	.css({
		'position' : 'relative',
		'width' : '100%',
	})
  	.attr({
  		'id' : 'homepage',
  	})
  	.append(
  		$(document.createElement('div'))
  		.attr({
  			'class' : 'slider-text'
  		})
  		.append(
  			$(document.createElement('div'))
  			.attr({
  				'id' : 'slidecaption'
  			})
  		)
  	)
  	// Left, Right Arrow Buttons Starts
  	.append(
  		$(document.createElement('a'))
  		.attr({
  			'id' : 'prevslide',
  			'class' : 'load-item'
  		})
  	)
  	.append(
  		$(document.createElement('a'))
  		.attr({
  			'id' : 'nextslide',
  			'class' : 'load-item'
  		})
  	)
  	// Time Bar
  	.append(
  		$(document.createElement('div'))
  		.attr({
  			'id' : 'progress-back',
  			'class' : 'load-item'
  		}) 
  		.append(
  			$(document.createElement('div'))
  			.attr({
  				'id' : 'progress-bar'
  			})
  		)
  	)
  	.appendTo($('body'));
  	$('body').append('<div id="supersized-loader"></div><ul id="supersized"></ul>');
  	MCBA.loadScript("js/supersized/supersized.3.2.7.js", function(){
  		MCBA.loadScript("js/supersized/supersized.shutter.js", function(){
  		  var sliderConfig = {
              		// Functionality
              		slideshow         		: 1,			// Slideshow on/off
              		autoplay				: 1,			// Slideshow starts playing automatically
              		start_slide       		: 1,			// Start slide (0 is random)
              		stop_loop				: 0,			// Pauses slideshow on last slide
              		random					: 0,			// Randomize slide order (Ignores start slide)
              		slide_interval    		: Number(item["slide interval"]) > 0 ? Number(item['slide interval']) * 1000 : 3000,		// Length between transitions
              		transition        		: 6, 			// 0-None, 1-Fade, 2-Slide Top, 3-Slide Right, 4-Slide Bottom, 5-Slide Left, 6-Carousel Right, 7-Carousel Left
              		transition_speed		: 1000,		// Speed of transition
              		new_window				: 1,			// Image links open in new window/tab
              		pause_hover       		: 0,			// Pause slideshow on hover
              		keyboard_nav      		: 1,			// Keyboard navigation on/off
              		performance				: 1,			// 0-Normal, 1-Hybrid speed/quality, 2-Optimizes image quality, 3-Optimizes transition speed // (Only works for Firefox/IE, not Webkit)
              		image_protect			: 1,			// Disables image dragging and right click with Javascript
              												   
              		// Size & Position						   
              		min_width		      	: 0,			// Min width allowed (in pixels)
              		min_height		    	: 0,			// Min height allowed (in pixels)
              		vertical_center   		: 1,			// Vertically center background
              		horizontal_center 		: 1,			// Horizontally center background
              		fit_always				: 0,			// Image will never exceed browser width or height (Ignores min. dimensions)
              		fit_portrait      		: 1,			// Portrait images will not exceed browser height
              		fit_landscape			: 0,			// Landscape images will not exceed browser width
              												   
              		// Components							
              		slide_links				: 'blank',// Individual links for each slide (Options: false, 'num', 'name', 'blank')
              		thumb_links				: 1,			// Individual thumb links for each slide
              		thumbnail_navigation    : 0,			// Thumbnail navigation
              		slides 					:  	(function(array){
              										item.slides.forEach(function(slide){
              											array.push( {
              												'image' : MCBA.images_dir + slide['image file'], 
              												'title' : slide.text, 
              												'thumb' : '', 
              												'url' : MCBA.images_dir + slide['image file'],
              											});
              										});
              										return array;
              									})(new Array()),
              									
              		// Theme Options			   
              		progress_bar			: 1,			// Timer for each slide							
              		mouse_scrub				: 0
              		
              	}
          $.supersized(sliderConfig);
  		});
  	});
  }
}


function Header(){
	var self = this;
	var logoURL = MCBA.getOption( 'logo' ).value;
	if (logoURL == "" || logoURL == undefined) logoURL = ((MCBA.config.options.logo.value == "" || MCBA.config.options.logo.value == undefined) ? MCBA.rootDir + "images/awm-logo-default.png": 'images/'+MCBA.config.options.logo.value);
	var pageColor = (MCBA.config.pages[MCBA.currentPage].pageColor ? MCBA.config.pages[MCBA.currentPage].page_color : MCBA.config.options.page_color.value);
	
	this.element = $(document.createElement('div'))
	.attr({
		id : 'header'
	})
	.css({  
		'position' : 'relative',
	  'text-align': 'center',
    'margin-top': '0',
    'margin-bottom': '0',
    'padding-top': '14px',
    'padding-bottom': '6px',
    'background-repeat': 'repeat-x',
    'background-position': 'center bottom',
    'z-index': '100',
    'overflow': 'auto',
    'margin-right': 'auto',
    'margin-left': 'auto',
    'width': '100%',
		'height' : '10vh',
		'background': '-webkit-linear-gradient(transparent, '+pageColor+')', /* For Safari 5.1 to 6.0 */
		'background': '-o-linear-gradient(transparent, '+pageColor+')', /* For Opera 11.1 to 12.0 */
		'background': '-moz-linear-gradient(transparent, '+pageColor+')', /* For Firefox 3.6 to 15 */
		'background': 'linear-gradient(transparent, '+pageColor+')', /* Standard syntax */
	})
	.append(
	  
	 /* Left button */
  	new Button({ 
  		'img' : MCBA.rootDir + 'images/awm-img-menu.png',
  		'alt' : 'menu',
  		'action' : function() {
    		$('.navigation').slideToggle('fast');
    		return false;
    	}
  	}).element
  	.css({
  	  'float' : 'left',
  	  'margin-left' : '6px',
  	  
  	})
	)
  .append(
    
    /* Right button */
  	new Button({ 
  		'img' : MCBA.rootDir + 'images/awm-img-phone.png',
  		'alt' : 'phone',
		'href' : 'tel:'+config_data.options['phone'].value,
  		//'action' : function(){/*MCBA.load(attrs.page)*/}
  	}).element
  	.css({
  	  'float' : 'right',
  	  'margin-right' : '6px',
  	})	
  )
  .append(
    	
    /* LOGO + home button */
  	$(document.createElement('div'))
  	.css({
  		'cursor' : 'pointer',
  		'display' : 'inline-block',
  		'height' : '10vh',
  		'width' : '33vh'
  	})
  	.append(
  		$(document.createElement('a'))
  		.attr({
  			'rel' : 'external'
  		})
  		.click(function(){ 
  			MCBA.load(0);
  		})
  		.append(
  		  $(document.createElement('img'))
  		  .attr({
  				'src' : logoURL,
  				'alt' : 'Logo',
  		  })
  		  .css({
  		    'max-height' : '100%',
  		    'max-width' : '100%',
  		  })
  		)
  	)
	)
	
	
}


function Footer(){
  var self = this;
	this.element = $(document.createElement('div'))
	.attr({
		'id' : 'footer'
	})
	.css({
		'position' : 'relative',
	  'width' : '100%',
	  'padding-top' : '6px',
	})
	.append(
		$(document.createElement('div'))
		.css({
		  'width' : '100%',
		  'text-align' : 'center',
		})
		.append(
			$(document.createElement('strong'))
			.append( MCBA.config.options['companyname'].value )
		)
		.append($(document.createElement('br')))
		.append( MCBA.config.options['address'].value)
		.append($(document.createElement('br')))
		.append( MCBA.config.options['city'].value + ", " + MCBA.config.options['state'].value + " " + MCBA.config.options['zip'].value)
		.append($(document.createElement('br')))
		.append(
			$(document.createElement('div'))
			.append(
				new Button({ 
					'img' : MCBA.rootDir + 'images/awm-img-phone_small.png',
					'alt' : 'phone-small',
					'size' : 15,
					'href' : 'tel:'+config_data.options['phone'].value,
				}).element
				.css({
				  'float' : 'left',
				  'margin-left' : '16px',
				})
			)
			.append(
				new Button({ 
					'img' : MCBA.rootDir + 'images/awm-img-email_small.png',
					'alt' : 'email-small',
					'size' : 15,
					'href' : 'mailto:'+MCBA.config.options.email.value,
				}).element
				.css({
				  'float' : 'right',
				  'margin-right' : '16px',
				})				
			)		
/*			.append(
					new Button({ 
						'img' : MCBA.rootDir + 'images/awm-img-arrow_up.png',
						'alt' : 'to-top',
						'href' : '#top',
						// 'id' : 'top-link',
					}).element
			)	
*/ 
		.append($(document.createElement('br')))
		.append($(document.createElement('br')))
		.append("<a href='http://mycustombusinessapp.com/'>MCBA</a> © 2015 <a href='http://allwebnmobile.com'>" + MCBA.config.options.legalname.value + "</a> | ")
		.append(
			$(document.createElement('a'))
			.attr({
				'href' : 'http://allwebnmobile.com/privacy-policy/',
				'rel' : 'external'
			})
			.append('Privacy Policy')
		)			
		)
	)
	// .append(
		// $(document.createElement('div'))
		// .attr({
			// 'class' : 'clear'
		// })
	// )
	.on('DOMNodeInserted', function(event){
      $(self.element)
      .css({
/*        'bottom' : "-" + $(self.element).outerHeight() + "px",*/
      })
	  }
	)
}


function Navigation(){
	
	this.element =  $(document.createElement('div'))
	.attr({
		'class' : 'navigation center'
	})
	.css({
		'top' : '0px',
		'display' : 'none' // Hide the menu for now
	})
	.append( 
		// Navigation list
		(function(elem){
			var keepCountForIOS = 0;
			for( index in MCBA.config.pages ){
				newIndex = keepCountForIOS++;
				elem.append(
					$(document.createElement('li'))
					.css({
						'cursor' : 'pointer',
					})
					.append(
						$(document.createElement('a'))
						.attr({
							'rel'  : 'external',
						})
						.data( 'page', newIndex )
						.click(function(){
							var liindex = $('.navigation li').index($(this).parent());
							var parsedPage = parseInt($(this).data('page'));
							//alert(parsedPage:"+parsedPage+" liindex:"+liindex);
							if (isNaN(parsedPage)) parsedPage = liindex;
							MCBA.load( parsedPage );
						})
						.append(
								$(document.createElement('div'))
								.attr({
									'width' : '100%',
									'height' : '100%'
								})
								.append(MCBA.config.pages[index].title.replace(/_/g, ' ').toUpperCase())
						)
						
					)
				);
			}
			return elem;
		})( $(document.createElement('ul')) )
		
		// Social Like Buttons
		// .append(
		// 	$(document.createElement('div'))
		// 	.attr({
		// 		'class' : 'ui-grid-b social-like'
		// 	})
		// 	// Facebook Like button
		// 	.append( 
		// 		$(document.createElement('div'))
		// 		.attr({
		// 			'class' : 'ui-block-a'
		// 		})
		// 		.append(
		// 			$(document.createElement('div'))
		// 			.attr({
		// 				'id' : 'fb-root'
		// 			})
		// 		)
		// 		.append(
		// 			function() {
		// 				var d = document;
		// 				var s = 'script';
		// 				var id = 'facebook-jssdk';
		//                 var js, fjs = d.getElementsByTagName(s)[0];
		//                 if (d.getElementById(id)) return;
		//                 js = d.createElement(s); js.id = id;
		//                 js.src = 'http://connect.facebook.net/en_US/all.js#xfbml=1';
		//                 fjs.parentNode.insertBefore(js, fjs);
		//             }
		// 		)
		// 		.append(
		// 			$(document.createElement('div'))
		// 			.attr({
		// 				'class' : 'fb-like',
		// 				'data-href' : 'http://www.facebook.com/envato',
		// 				'data-send' : 'false',
		// 				'data-layout' : 'button_count', 
		// 				'data-width' : '',
		// 				'data-show-faces' : 'false'
		// 			})
		// 		)
		// 	)
		// 	// Google Plus Button
		// 	.append(
		// 		$(document.createElement('div'))
		// 		.attr({
		// 			'class' : 'ui-block-b'
		// 		})
		// 		.append(
		// 			'<g:plusone href="http://envato.com/" size="Medium"></g:plusone>'
		// 		)
		// 		.append(
		// 			'<script src="https://apis.google.com/js/plusone.js"></script>'
		// 		)
		// 	)
		// 	// Twitter like button 
		// 	.append(
		// 		$(document.createElement('div'))
		// 		.attr({
		// 			'class' : 'ui-block-c'
		// 		})
		// 		.append( 
		// 			$(document.createElement('a'))
		// 			.attr({
		// 				'href' : 'https://twitter.com/share',
		// 				'class' : 'twitter-share-button',
		// 				'data-url' : 'http://twitter.com/#!/envato',
		// 				'data-text' : 'http://twitter.com/#!/envato',
		// 				'data-via' : 'envato', 
		// 				'data-related' : 'envato',
		// 				'data-hashtags' : 'envato'
		// 			})
		// 		)
		// 	)
		// )
	)
}





