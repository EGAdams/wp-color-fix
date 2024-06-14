
    // create vue application

const objectviewer = Vue.createApp({});

    // define a new component called objectviewer

objectviewer.component( 'objectviewer', {
    template:
        `<ul style="list-style-type: none;">
        <li v-for='property in object'>
        <div>{{ property }}</div>
            </li>
        </ul>
        <button @click="update">Update</button>`,

    data() {
        return {
            object: messageManager
        }
    },

    mounted() {
        messageManager = Vue.reactive(  messageManager ); // all day research
    }

})

    // mount the vue objectviewer

objectviewer.mount( '#app' );
