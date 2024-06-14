var Counter = {
    template:
    `<div id="counter">
        Counter: {{ counter }}
    </div>`,

    data() {
        return {
            counter: 0
        }
    },

    mounted() {
        // this.thisObject = Vue.reactive( manager ) \ all day sunday research.  finally found way to get external js.
        setInterval(() => {
            this.counter++
        }, 1000)
    }
}

var app = Vue.createApp( Counter );
app.component( 'Counter', Counter );
app.mount( '#counter ');
