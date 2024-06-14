/** @class GoogleMap */
class GoogleMap {
    constructor( map_configuration ) {
        console.log( "constructing GoogleMap from inside the google_map directory... " );
        this.center_of_map = {
            lat: map_configuration.latitude,
            lng: map_configuration.longitude };
        this.circle_radius = map_configuration.circle_radius;
        this.map = new google.maps.Map( document.getElementById( "map" ), {
            zoom: 16,
            center: this.center_of_map,
            legend: "none",
            disableDefaultUI: true });
        this.marker = new google.maps.Marker({
            position: this.center_of_map,
            map: this.map,
            draggable: true,
            title: "Drag me to easily set your lat/lng. Grab the circle to easily set your radius." });

        this.initializeEventListeners();
        setTimeout( () => { this.initializeCircle(); }, 500 ); }

    initializeEventListeners () {
        google.maps.event.addListener( this.marker, "dragend", function ( event ) {
            document.getElementById( "latbox" ).value = Number(
                this.getPosition().lat()
            ).toFixed( 6 );
            document.getElementById( "lngbox" ).value = Number(
                this.getPosition().lng()
            ).toFixed( 6 ); }); }

    initializeCircle () {
        this.circle = new google.maps.Circle({
            map: this.map,
            radius: this.circle_radius,
            editable: true,
            strokeColor: '#0000FF',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#00BFFF',
            fillOpacity: 0.35 });
        this.circle.bindTo( 'center', this.marker, 'position' );
        google.maps.event.addListener( this.circle, 'radius_changed', function () {
            document.getElementById( "radius" ).value = this.circle.getRadius(); }); }
}
