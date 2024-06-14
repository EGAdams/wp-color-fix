/*
 * ObjectItem Component
 */

var ObjectItem = {
    template:
    `<div style="padding: 6%; width: 550px;">
        <div style=" background: #efefef; border-style: solid; border-width: thin; padding: 3%">
            <h3 style="color: black; ">{{ object.my_object_name }}</h3>
            <ul style="list-style-type: none;">
                <li v-for="property, index in object">
                    <div v-if="typeof property != 'object' && index != 'my_object_name' && index != 'terminal_text'">     
                        <div class="form-group" style="margin: 7px;">
                            <input style="width: 260px;" v-bind:value="index + ': ' + property" class="" id="" name="">
                        </div>
                    </div>
                </li>
            </ul>
            <div class="">
                <label>Log</label>
                <div class="screen-area" id="message_manager_screen" name="guest_screen">
                    <span v-html="object.terminal_text"></span>
                </div>
            </div>
        </div>  
    </div>`,
    props: [ 'object' ],
}

app.component( 'ObjectItem', ObjectItem ); // define app 1st in html page
