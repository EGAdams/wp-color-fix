


    // define a new component for the
    // app.component() constructor
    
var objectcomponent = {
    props: [ 'thisObject' ],
    template:
        `<ul style="list-style-type: none;">
            <li v-for='property, index in thisObject'>
                <div>{{ property }} - {{ index }}</div>
            </li>
        </ul>`,

    data() {
        return {
            thisObject: {}
        }
    },

    mounted() {
        this.thisObject = Vue.reactive(  this.thisObject.name ); // all sunday research
    }
}

app.component( 'objectcomponent', objectcomponent );
