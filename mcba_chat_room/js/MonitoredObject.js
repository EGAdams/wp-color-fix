/** @class  MonitoredObject */
class MonitoredObject {
    constructor() {
        this.construction_name = this.constructor.name;
        this.logObjects        = [];
        this.logObjectFactory  = new LogObjectFactory();
        this.monitorLed        = new MonitorLedData(); 
        this.RUNNING_COLOR     = "lightyellow";
        this.PASS_COLOR        = "lightgreen";
        this.FAIL_COLOR        = "#fb6666";     // lightred is not understood by CSS.  Whaaa... ??
        this.dataSource        = DataSourceFactory.getInstance();  // if message manager has an id, set it here.
        if ( window[ "messageManager" ] && window[ "messageManager" ].object_id  ) { 
            this.setMonitorId( window[ "messageManager" ].object_id );   // if message manager has an id, set it.
            this.registerMonitor(); }
        document.addEventListener( "got-valid-runtime-id", function( event ) {
            if ( !this.object_id ) { this.setMonitorId( event.detail.object_id ); this.registerMonitor(); }
            this.setLedBackgroundColor( this.RUNNING_COLOR );
            this.setLedText( "initializing..." );
            this.logUpdate( "initializing..." );
        }.bind( this )); }

    logUpdate( message ) {
        if ( !this.object_id ) {  console.log( "*** ERROR: object needs an id to log. ***" ); return; }
        if ( message.includes( "ERROR" )) { 
            this.setLedBackgroundColor( this.FAIL_COLOR ); 
            this.setLedTextColor( "white" ); } else if ( message.includes( "finished" )) {
                this.setLedBackgroundColor( this.PASS_COLOR ); 
                this.setLedTextColor( "black" ); }
           
        this.setLedText( message );
        const logObject = this.logObjectFactory.createLogObject( message, this );
        this.logObjects.push( logObject );
        let nextFunction = "checkMessageResults";
        jQuery( document ).one( nextFunction, this[ nextFunction ] );
        let args = {
            query: "update monitored_objects set object_data='" + JSON.stringify( this ) + "' where object_view_id='" + this.object_view_id + "'",
            trigger: nextFunction,
            thisObject: this };
        this.dataSource.runQuery( args ); }

    checkMessageResults( _event, results ) { if ( results.data.length > 0 ) { console.log( results.data ); }}
    log( message ) { console.log( message ); }
    getMonitorId() { return this.construction_name + "_" + this.object_id; }
    setMonitorId( newId ) { 
        if ( this.construction_name.includes( "_" )) { 
            console.error( "ids can not contain underscores." ); 
            // set error flag and return...
        }
        this.object_id = newId;
        this.object_view_id = this.construction_name + "_" + newId;  }

    register() { 
        let tableManager = new TableManager( this.object_view_id );
        tableManager.createObjectRow( this.object_view_id ); }

    setLedBackgroundColor( newColor ) { this.monitorLed.    classObject.background_color = newColor; }
    setLedTextColor(       newColor ) { this.monitorLed.    classObject.color            = newColor; }
    setLedText(            newText  ) { this.monitorLed.    ledText                      = newText ; }
}
