/*
 * TodoItem Component
 */

var TodoItem = {
    template:
    `<li>{{ todo.text }}</li>`,
    props: [ 'todo'],
}

app.component( 'TodoItem', TodoItem ); // define app 1st in html page
