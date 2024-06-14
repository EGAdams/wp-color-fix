
/*
 * ObjectList App
 */

const ObjectListApp = {
    data() {
        return {
            object: objectlist
        }
    },

    mounted() {                                                                                  
        for ( let key in objectlist ) { // 2 days research and debug. this is the golden loop that connects everything.
            window[ objectlist[ key ].my_object_name ] = Vue.reactive( window[ objectlist[ key ].my_object_name ]);
        }
    }                                                  
}

const app = Vue.createApp( ObjectListApp );
