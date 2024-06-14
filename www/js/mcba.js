$(document).ready(function () {
    console.log("document ready");
    mcba_load();
});

var template_dir = "TemplateOne/";
var page_history = [];
var currentPageId = 0;
var indexFile = 'index.html?page=';


var DisplayType = {
    MENU: 'menu',
    TEXT: 'text',
    LIST: 'list',
    MAP: 'map',
    BUTTON: 'button',
    IMAGE: 'image'
};

function Button(attrs) {
    var attrIMG = ((attrs.img === "" || attrs.img === "undefined") ? "" : (template_dir + 'images/' + attrs.img));
    var newelement = $(document.createElement('a'))
        .attr({
            'href': attrs.href,
            'rel': 'external',
            'class': 'mcba_button'
        })
        .css({
            'display': 'block',
            'width': '35px',
            'height': '35px',
            'border-radius': '50px',
            'font-size': '20px',
            'color': '#fff',
            'line-height': '35px',
            'text-align': 'center',
            'text-decoration': 'none',
            'background': config_data.options.base_color.value
        })
        .hover({
            'color': '#ccc',
            'text-decoration': 'none',
            'background': shade(config_data.options.base_color.value, 10)
        })
        .append(
            (attrs.img) ?
                $(document.createElement('img'))
                    .attr({
                        'src': attrIMG,
                        'alt': 'back',
                        'border': '0'
                    })
                :
                null
        );
    alert(newelement.toString());
    return newelement;
}

function List(attrs) { }

function Image(attrs) { }

function Menu(attrs) { }

function mcba_load(nohistory) {
    // get page from query string
    var match,
        pl = /\+/g,  // Regex for replacing addition symbol with a space
        search = /([^&=]+)=?([^&]*)/g,
        decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
        query = window.location.search.substring(1);

    var urlParams = {};
    while (match = search.exec(query)) {
        urlParams[decode(match[1])] = decode(match[2]);
    }

    var pageID = urlParams.page;

    if (typeof pageID === "undefined") {
        return;
    }

    /* Push history */
    if (!nohistory) {
        page_history.push(currentPageId);
    }

    if (typeof MCBA !== "undefined") {
        MCBA.setHistoryCount(page_history.length);
    }

    var footerItems;
    var options;
    var page;

    currentPageId = pageID;
    options = config_data.options;
    footerItems = config_data['footer-items'];

    /* Find and populate the current page info */
    $.each(config_data.pages, function (index, nextpage) {
        if (nextpage.id == pageID) {
            // copy the page from the file
            var items = (nextpage.items) ? nextpage.items.slice(0) : [];
            var catids = [];
            page = nextpage;

            // save the item ids and display data
            page.items = [];
            if (items) {
                items.forEach(function (pageitem) {
                    // Copy the actual item data
                    config_data.items.forEach(function (item) {
                        if (parseInt(item.id, radix) === parseInt(pageitem.id, radix)) {

                            // This item belongs on the page
                            var newitem = extract(items, 'id', item.id);
                            for (var key in item) {
                                newitem[key] = item[key];
                            }
                            page.items.push(newitem);
                        }
                    });
                });
            }
            return;
        }
    });

    var _pageName = page.title.replace(/_/g, ' ').capitalize();
    var color_light = shade(options.base_color.value, 20);
    var color_dark = shade(options.base_color.value, -20);
    var contentElem = $(document.createElement('div'))
        .attr({
            'id': 'index',
            'data-role': 'index',
            'data-theme': 'a'
        })
        .appendTo($("body"));


    /******** Create Navigation *********/
    $(document.createElement('div'))
        .attr({
            'class': 'navigation center'
        })
        .css({
            'top': '0px',
            'display': 'none' // Hide the menu for now
        })
        .append(
            // Navigation list

            (function (elem) {
                config_data.pages.forEach(function (curPage) {
                    elem.append(
                        $(document.createElement('li'))
                            .append(
                                $(document.createElement('a'))
                                    .attr({
                                        'href': indexFile + curPage.id,
                                        'rel': 'external'
                                    })
                                    .append(
                                        $(document.createElement('div'))
                                            .attr({
                                                'width': '100%',
                                                'height': '100%'
                                            })
                                            .append(curPage.title.replace(/_/g, ' ').toUpperCase())
                                    )

                            )
                    );
                });
                return elem;
            })($(document.createElement('ul')))

                // Social Like Buttons
                .append(
                    $(document.createElement('div'))
                        .attr({
                            'class': 'ui-grid-b social-like'
                        })
                        // Facebook Like button
                        .append(
                            $(document.createElement('div'))
                                .attr({
                                    'class': 'ui-block-a'
                                })
                                .append(
                                    $(document.createElement('div'))
                                        .attr({
                                            'id': 'fb-root'
                                        })
                                )
                                .append(
                                    function () {
                                        var d = document;
                                        var s = 'script';
                                        var id = 'facebook-jssdk';
                                        var js, fjs = d.getElementsByTagName(s)[0];
                                        if (d.getElementById(id)) return;
                                        js = d.createElement(s); js.id = id;
                                        js.src = 'http://connect.facebook.net/en_US/all.js#xfbml=1';
                                        fjs.parentNode.insertBefore(js, fjs);
                                    }
                                )
                                .append(
                                    $(document.createElement('div'))
                                        .attr({
                                            'class': 'fb-like',
                                            'data-href': 'http://www.facebook.com/envato',
                                            'data-send': 'false',
                                            'data-layout': 'button_count',
                                            'data-width': '',
                                            'data-show-faces': 'false'
                                        })
                                )
                        )
                        // Google Plus Button
                        .append(
                            $(document.createElement('div'))
                                .attr({
                                    'class': 'ui-block-b'
                                })
                                .append(
                                    '<g:plusone href="http://envato.com/" size="Medium"></g:plusone>'
                                )
                                .append(
                                    '<script src="https://apis.google.com/js/plusone.js"></script>'
                                )
                        )
                        // Twitter like button 
                        .append(
                            $(document.createElement('div'))
                                .attr({
                                    'class': 'ui-block-c'
                                })
                                .append(
                                    $(document.createElement('a'))
                                        .attr({
                                            'href': 'https://twitter.com/share',
                                            'class': 'twitter-share-button',
                                            'data-url': 'http://twitter.com/#!/envato',
                                            'data-text': 'http://twitter.com/#!/envato',
                                            'data-via': 'envato',
                                            'data-related': 'envato',
                                            'data-hashtags': 'envato'
                                        })
                                )
                        )
                )
        )
        .appendTo(contentElem);

    if (!page.hide_header_nav || page.hide_header_nav != 1) {
        var logoURL = (config_data.options.logo.value === "" || config_data.options.logo.value === "undefined") ? (MCBA.rootDir + "images/awm-logo-default.png") : (template_dir + 'images/' + config_data.options.logo.value);

        $(document.createElement('div'))
            .attr({
                id: (pageID === 0 ? 'header-index' : 'header') // non index pages add a haze to the bottom of the header
            })
            .css({
                'top': '0px'
            })
            .append(
                $(document.createElement('div'))
                    .attr({
                        'class': 'strip'
                    })
                    .append(
                        $(document.createElement('div'))
                            .attr({
                                'class': 'icons f_left'
                            })
                            .append(new Button({ href: "#", 'img': 'phone_large.png' })
                            )
                    )
                    .append(
                        $(document.createElement('span'))
                            .append(
                                $(document.createElement('a'))
                                    .attr({
                                        'href': indexFile + '0',
                                        'rel': 'external'
                                    })
                                    .append(
                                        $(document.createElement('img'))
                                            .attr({
                                                'src': logoURL,
                                                'alt': 'Logo',
                                                'width': '215',
                                                'height': '70'
                                            })
                                    )
                            )
                    )
                    .append(
                        $(document.createElement('div'))
                            .attr({
                                'class': 'icons f_right',
                                'id': 'navigation'
                            })

                            .append(new Button({ href: "#", 'img': 'menu.png' }))
                    )
            )
            .appendTo(contentElem);
        contentElem.append($(document.createElement('div')).attr({ 'class': 'clear' }));
    }

    //Home page
    if (pageID === 0) {
        $(document.createElement('div'))
            .attr({
                'id': 'homepage',
            })
            .append(
                $(document.createElement('div'))
                    .attr({
                        'class': 'slider-text'
                    })
                    .append(
                        $(document.createElement('div'))
                            .attr({
                                'id': 'slidecaption'
                            })
                    )
            )
            // Left, Right Arrow Buttons Starts
            .append(
                $(document.createElement( 'a' ))
                    .attr({
                        'id': 'prevslide',
                        'class': 'load-item'
                    })
            )
            .append(
                $(document.createElement( 'a' ))
                    .attr({
                        'id': 'nextslide',
                        'class': 'load-item'
                    })
            )
            // Time Bar
            .append(
                $( document.createElement( 'div' ))
                    .attr({
                        'id': 'progress-back',
                        'class': 'load-item'
                    })
                    .append(
                        $( document.createElement( 'div' ))
                            .attr({
                                'id': 'progress-bar'
                            })
                    )
            )
            .appendTo( contentElem );

    } else {


        /******* Create Content *******/
        $(document.createElement('div'))
            .attr({
                'class': 'white-bg'
            })
            .append(

                (function (elem) {

                    page.items.forEach(function (item) {
                        if (!item.details) return;

                        /* Default style */
                        if (!item.display_type) {
                            item.details.forEach(function (detail) {
                                elem.append(detail.text);
                            });
                            return;
                        }

                        switch (item.display_type) {

                            /** Navigation MENU **/
                            case DisplayType.MENU:
                                var listElem = $(document.createElement('ul'))
                                    .attr({
                                        'class': 'mcba_menu center'
                                    });
                                item.details.forEach(function (detail) {
                                    listElem.append(
                                        $(document.createElement('li'))
                                            .append(
                                                $(document.createElement('a'))
                                                    .attr({
                                                        'href': indexFile + detail.pagelink,
                                                        'rel': 'external'
                                                    })
                                                    .append(
                                                        $(document.createElement('div'))
                                                            .attr({
                                                                'width': '100%',
                                                                'height': '100%'
                                                            })
                                                            .append(detail.title)
                                                    )
                                            )
                                    );
                                });
                                elem.append(listElem);
                                break;

                            case DisplayType.TEXT:
                                item.details.forEach(function (detail) {
                                    elem.append("<h2>" + detail.title + "</h2>");
                                    elem.append(detail.text);
                                });
                                break;

                            /** LIST **/
                            case DisplayType.LIST:
                                listElem = $(document.createElement('ul'))
                                    .attr({
                                        'class': item.bullet_style
                                    });
                                elem.append($(document.createElement('h2')).append(item.name));
                                item.details.forEach(function (detail) {
                                    listElem.append(
                                        $(document.createElement('li'))
                                            .append(
                                                detail.text
                                            )
                                    );
                                });
                                elem.append(listElem);
                                break;


                            /** IMAGE **/
                            case DisplayType.IMAGE:
                                var data = item.details[0];
                                var imgURL = ((data.src === "" || data.src === "undefined") ? "" : (template_dir + 'images/' + data.src));
                                elem.append(
                                    $(document.createElement('div'))
                                        .attr({
                                            'class': 'f_left col-2'
                                        })
                                        .append(
                                            $(document.createElement('h2'))
                                                .append(data.title)
                                        )
                                        .append(
                                            $(document.createElement('div'))
                                                .attr({
                                                    'class': 'f_left'
                                                })
                                                .append(
                                                    $(document.createElement('img'))
                                                        .attr({
                                                            'src': imgURL,
                                                            'width': data.width,
                                                            'height': data.height,
                                                            'align': 'left'
                                                        })
                                                        .css({
                                                            'margin': '5px'
                                                        })
                                                )
                                                .append(data.text)
                                        )
                                );
                                elem.append($(document.createElement('div')).attr({ 'class': 'clear' }));
                                break;

                            case DisplayType.BUTTON:
                                break;
                        }
                        elem.append(jQuery(document.createElement('br')));
                    });

                    return elem;
                })(
                    $(document.createElement('div'))
                        .attr({
                            'data-role': 'content'
                        })
                )

            )
            .appendTo(contentElem);
        contentElem.append($(document.createElement('div')).attr({ 'class': 'clear' }));
    }

    /************ Add footer ************/
    if (!page.hidefooter || page.hidefooter != 1) {


        $(document.createElement('div'))
            .attr({
                'id': 'footer'
            })
            .append(
                $(document.createElement('div'))
                    .attr({
                        'class': 'strip'
                    })
                    .append(
                        $(document.createElement('strong'))
                            .append("Envato")
                    )
                    .append($(document.createElement('br')))
                    .append("PO Box 21177")
                    .append($(document.createElement('br')))
                    .append("Little Lonsdale St, Melbourne")
                    .append($(document.createElement('br')))
                    .append("Victoria 8011 Australia")
                    .append($(document.createElement('br')))
                    .append($(document.createElement('br')))
                    .append(
                        $(document.createElement('div'))
                            .attr({
                                'class': 'f_left'
                            })
                            .append(
                                $(document.createElement('img'))
                                    .attr({
                                        'src': template_dir + 'images/icon-footer-phone.png',
                                        'alt': '',
                                        'border': '0'
                                    })
                            )
                    )
                    .append(
                        $(document.createElement('div'))
                            .attr({
                                'class': 'f_left'
                            })
                            .append("+61 (0) 3 8376 6284")
                    )
                    .append($(document.createElement('br')))
                    .append(
                        $(document.createElement('div'))
                            .attr({
                                'class': 'clear'
                            })
                    )
                    .append(
                        $(document.createElement('div'))
                            .attr({
                                'class': 'f_left'
                            })
                            .append(
                                $(document.createElement('img'))
                                    .attr({
                                        'src': template_dir + 'images/icon-footer-contacts.png',
                                        'alt': '',
                                        'border': '0'
                                    })
                            )
                    )
                    .append(
                        $(document.createElement('div'))
                            .attr({
                                'class': 'f_left'
                            })
                            .append(
                                $(document.createElement('a'))
                                    .attr({
                                        'href': 'email@email.com',
                                        'target': '_blank',
                                    })
                                    .append('email@email.com')
                            )
                    )
                    .append($(document.createElement('br')))
                    .append($(document.createElement('br')))
                    .append("© 2013 Mobile Website | ")
                    .append(
                        $(document.createElement('a'))
                            .attr({
                                'href': 'privacy-policy.html',
                                'rel': 'external'
                            })
                            .append('Privacy Policy')
                    )
                    .append($(document.createElement('br')))
                    .append($(document.createElement('br')))
                    //ToTop
                    .append(
                        $(document.createElement('div'))
                            .attr({
                                'id': 'scroll-to-top'
                            })
                            .append(
                                $(document.createElement('a'))
                                    .attr({
                                        'href': '#top',
                                        'id': 'top-link',
                                    })
                                    .append(
                                        $(document.createElement('img'))
                                            .attr({
                                                'src': template_dir + 'images/to-top.png',
                                                'alt': '',
                                                'border': '0'
                                            })
                                    )
                            )
                    )
            )
            .append(
                $(document.createElement('div'))
                    .attr({
                        'class': 'clear'
                    })
            )
            .appendTo($('#index'));
    }

    $(".mcba_menu li")
        .css({ 'background-color': config_data.options.base_color.value });

    $(".navigation ul li")
        .css({ 'background-color': config_data.options.base_color.value });

    $("*").css({ 'color': options.textcolor.value });
}

function addscript(file, type) {
    if (type == "js") {
        var cachebuster = Math.round(new Date().getTime() / 1000); 
        var script = document.createElement('script');
        script.id = "dynamic_js";
        script.type = "text/javascript";
        script.src = file + "?cb=" + cachebuster;
        document.head.appendChild(script);

    } else if (type == "css") {
        var style = document.createElement('style');
        style.id = "dynamic_css";
        style.type = "text/css";
        style.rel = "stylesheet";
        style.innerHTML = file;
        document.getElementsByTagName('head')[0].appendChild(style);

    }
}

function removescript(filename, filetype) {
    var targetelement = (filetype == "js") ? "script"
        : (filetype == "css") ? "link" : "none"; // determine element type to
    // create nodelist from
    var targetattr = (filetype == "js") ? "src" : (filetype == "css") ? "href"
        : "none"; // determine corresponding attribute to test for
    var allsuspects = document.getElementsByTagName(targetelement);
    for (var i = allsuspects.length; i >= 0; i--) { // search backwards
        // within nodelist for
        // matching elements to
        // remove
        if (allsuspects[i]
            && allsuspects[i].getAttribute(targetattr) !== null
            && allsuspects[i].getAttribute(targetattr).indexOf(filename) != -1)
            allsuspects[i].parentNode.removeChild(allsuspects[i]); // remove
        // element
        // by
        // calling
        // parentNode.removeChild()
    }
    console.log("Removed " + filename);
}

function extract(array, key, value) {
    for (var i = 0; i < array.length; i++) {
        if (array[i][key] == value) {
            array[i].extracted_index = i;
            return array[i];
        }
    }
}

function shade(col, amt) {

    var usePound = false;

    if (col[0] == "#") {
        col = col.slice(1);
        usePound = true;
    }

    var num = parseInt(col, 16);
    var r = (num >> 16) + amt;

    if (r > 255) r = 255;
    else if (r < 0) r = 0;

    var b = ((num >> 8) & 0x00FF) + amt;

    if (b > 255) b = 255;
    else if (b < 0) b = 0;

    var g = (num & 0x0000FF) + amt;

    if (g > 255) g = 255;
    else if (g < 0) g = 0;

    return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16);

}

String.prototype.capitalize = function (lower) {
    return (lower ? this.toLowerCase() : this).replace(/(?:^|\s)\S/g, function (a) { return a.toUpperCase(); });
};