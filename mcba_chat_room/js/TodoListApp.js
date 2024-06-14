
/*
 * TodoList App
 */

const TodoListApp = {
    data() {
        return {
            groceryList: [
                { id: 0, text: 'Vegetables' },
                { id: 1, text: 'Cheese' },
                { id: 2, text: 'Whatever else humans are supposed to eat' }
            ]
        }
    },
}

const app = Vue.createApp( TodoListApp );
