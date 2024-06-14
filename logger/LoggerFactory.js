/** @class LoggerFactory */ 
class LoggerFactory { 
    static FACTORY_ID = "2021";

    static getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift(); }

    static OBJECT_STORAGE_URL = this.getCookie( "OBJECT_STORAGE_URL" ) || "";

    static createLogger( target_object ) {
        if ( this.OBJECT_STORAGE_URL.length == 0 ) { 
            const ConsoleLogger = new Function('return new class ' + target_object + ' { logUpdate( text_to_log ) { console.log( text_to_log ); }}');
            const logger = new ConsoleLogger();
            return logger; }  // if there's no source data set in the cookie, create default and exit.
                              // otherwise, keep going and build the logger...
        const config = {
            runner: "FetchRunner",
            url:    "https://" + this.OBJECT_STORAGE_URL + "/libraries/local-php-api/index.php/",
            new_id: target_object + "_" + this.FACTORY_ID } // that "_" will indicate that it is from this factory

        const logger = new MonitoredObject( config );
        return logger; }
}
