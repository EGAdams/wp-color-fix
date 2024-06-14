/** @class TableManager */
class TableManager {
    constructor( object_id_arg ) {
        this.object_id = object_id_arg;
        this.dataSource = DataSourceFactory.getInstance();
    }

    createObjectRow() {
        // let query_string = "select object_data from monitored_objects where object_view_id='" + this.object_id + "'";  
        let query_string = "insert into monitored_objects( object_view_id, object_data ) values ( '" + this.object_id + "', '' )";
        console.log( "running query: " + query_string );
        let apiArgs = {
            query: query_string,
            trigger: "checkSelectResults",
            thisObject: this
        };
        let target_div = document.createElement( "div" );
        target_div.id = "check_monitor_existence";
        apiArgs.event_object = target_div;
        console.log( "inserting new object: " + this.object_id + "..." );
        this.dataSource.runQuery( apiArgs );
    }

    checkSelectResults( dataArg, args, thirdArg ) {

            //console.log( "checking results of table manager selecting object row... " );
            if ( dataArg.length > 2 ) { // if there no data, the length is 2; ("[]".length = 2)
                // console.log( "got results.  no need for inserting " + this.object_id );
            } else {
                console.log( "no results, inserting new object: " + this.object_id + "..." );
                let query_string = "insert into monitored_objects( object_view_id, object_data ) values ( '" + this.object_id + "', '' )";
                let apiArgs = {
                    query: the_query,
                    trigger: "checkResults"
                };
                console.log( "running query: " + query_string );
                // this.dataSource.runQuery( apiArgs ) }
    }}

    checkResults( insertResultsArg ) {
        if ( insertResultsArg.length > 2 ) { 
            console.error( "*** ERROR: while running query: " + insertResultsArg + " ***" ); }}
}