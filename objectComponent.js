


    // define a new component for the
    // app.component() constructor
    
var objectcomponent = {
    props: [ 'groceryList' ],
    // template_bak:
    //     `<ul style="list-style-type: none;">
    //         <li v-for='property, index in groceryList'>
    //             <div>{{ property }} - {{ index }}</div>
    //         </li>
    //     </ul>`,

    template:
        `<li>{{ groceryList.text }}</li>`,

    mounted() {
        // console.log( "need to set " + this.thisObject.name + " reactive." );
    // this.thisObject = Vue.reactive( messageManager ); // all sunday research
    }
}

app.component( 'objectcomponent', objectcomponent );
