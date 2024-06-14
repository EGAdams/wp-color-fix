class PhoneNumberManager {
    constructor() { console.log( "constructing phone number manager" ); }

    setPhoneNumber( newPhoneNumber ) {
        const dataSource = DataSourceFactory.getInstance();
        var nextFunction = 'checkPhoneNumber';
        jQuery( document ).one( nextFunction, this[ nextFunction ] );
            var args = {
                query: "update wp_mcba_chat_configuration set configuration_value='" + newPhoneNumber + "' where configuration_name='phone_number'",
                trigger: nextFunction,
                thisObject: this           
        }
        console.log( "making api call..." );
        dataSource.runQuery( args ); }

    checkPhoneNumber( _event, result ) { console.log( result.thisObject.data ); }
}
