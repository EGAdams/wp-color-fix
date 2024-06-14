// class Space {

//     constructor( itemArg ) {
//         if ( !itemArg ) { return; }
//         this.item = itemArg;
//         this.element = jQuery( document.createElement( 'div' ) )
//             .css( {
//                 'position': 'relative',
//                 'width': '100%',
//             });

//             this.setHeight();
//             this.subject = BlockListSubject.getInstance();
//             this.subject.subscribe( this.update );
//     }

//     setHeight() {
//         for ( var i = 0; i < this.item.height; i++ ) {
//             this.element.append( document.createElement( 'br' ) );
//         }
//     }

//     update( newData ) {
//         if ( newData.type != this.constructor.name )
//             return;
//         while ( this.element[ 0 ].lastElementChild ) {
//             this.element[ 0 ].removeChild( this.element[ 0 ].lastElementChild );
//         }
//         if ( newData !== undefined )
//             this.item.height = newData.height;
//         this.setHeight();
//     }

//     getSubject() {
//         return this.subject;
//     };
// }
