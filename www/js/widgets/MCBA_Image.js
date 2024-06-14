/** class MCBA_Image */
function MCBA_Image( item ) {
    if ( !item ) {
        console.log( "*** WARNING: Image constructor called with no item argument. ***" ); return; }

    let self = this;
    let imgSRC = "";
    if ( item[ 'src' ] === "" || item[ 'src' ] === undefined ) {
        imgSRC = "";
    } else {
        if ( MCBA.smartphone ) {
            imgSRC = item[ 'www_url' ] + "templates/" + config_data.template + '/images/' + item[ 'src' ];
        } else {
            imgSRC = '../wp-content/plugins/MCBA-Wordpress/www/templates/' + config_data.template + '/images/' + item[ 'src' ];
        }}

    this.img = jQuery( document.createElement( 'img' ) )
        .attr( {
            'src': imgSRC,
        })
        .css( {
            'width': item[ 'percent' ] + '%',
            'height': item[ 'percent' ] + '%',
        });

    if ( typeof item[ 'position' ] !== 'undefined' ) {
        switch ( item[ 'position' ] ) {
            case 'Left':
                break;
            case 'Right':
                this.img.css( {
                    'margin-left': 'auto',
                });
                break;
            case 'Center':
                this.img.css( {
                    'margin-right': 'auto',
                    'margin-left': 'auto',
                });
                break;
            case 'Span':
                this.img.css( {
                    'margin-right': 'auto',
                    'margin-left': 'auto',
                    'width': '100%',
                });
                break; }}

    this.removeImage = function ( fileItem, www_url ) {
        fileItem.element[ 0 ].children[ 1 ].children[ 0 ].value = "upload.png";
        fileItem.element[ 0 ].children[ 1 ].children[ 2 ].src = www_url + "images/" + "upload.png";
        this.element[ 0 ].children[ 0 ].src = ""; }

    this.element = jQuery( document.createElement( 'div' )).css( {
            'display': 'flex',
            'position': 'relative',
            'width': '100%' }).append( this.img );

    this.update = function ( item ) {
        if ( this != self )
            return;
        if ( item.data.percent == "" )
            item.data.percent = "95";
        if ( item.data.www_url == undefined )
            item.data[ "www_url" ] = "";
        this.img[ 0 ].src = item.data.www_url + "images/" + item.data.src;
        if ( item.data.position == "Right" ) {
            this.img.css( {
                'margin-left': 'auto'
            });
            this.img.css( {
                'margin-right': ''
            });
        } else if ( item.data.position == "Center" ) {
            this.img[ 0 ].style.marginLeft = "auto";
            this.img[ 0 ].style.marginRight = "auto";
        } else if ( item.data.position == "Left" ) {
            this.img.css( {
                'margin-left': ''
            });
            this.img.css( {
                'margin-right': 'auto'
            }); }
        this.img[ 0 ].style.width = item.data.percent + "%"; }

    self.subject = BlockListSubject.getInstance();
    self.subject.subscribe( self.update );
    this.getSubject = function () { return self.subject; }}
