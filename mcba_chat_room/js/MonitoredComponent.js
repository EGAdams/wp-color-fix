
/*
 *  message manager component
 */

var messageManagerComponent = {
    template:
        `<ul style="list-style-type: none;">
            <li v-for='property, index in thisObject' v-bind:key='property.id'>
                <div>{{ property }} - {{ index }}</div>
            </li>
        </ul>`,

    data() {
        return {
            test: "test",
            thisObject: {}
        }
    },

    mounted() {
        this.thisObject = Vue.reactive(  messageManager ); // all day research
    }
}

app.component( 'messageManagerComponent', messageManagerComponent );
