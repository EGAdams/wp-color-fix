if ( typeof GoogleMap == "undefined" ) {
/** @class GoogleMap */
class GoogleMap {
    constructor(map_configuration) {
        if (!map_configuration) {
            return;
        }
        console.log("constructing GoogleMap from inside mockup_elements... ");
        this.center_of_map = {
            lat: parseFloat(map_configuration.latitude),
            lng: parseFloat(map_configuration.longitude),
        };
        this.circle_radius = parseFloat(map_configuration.circle_radius);
        this.element = document.getElementById("map");
        if (!this.element) {
            this.element = document.createElement("div");
            this.element.setAttribute("id", "map");
        }
        this.radius_div = document.createElement("div");
        this.radius_div.setAttribute("id", "radius");
        this.radius_div.innerHTML = map_configuration.circle_radius;
        this.element.appendChild(this.radius_div);
        this.map = new google.maps.Map(this.element, {
            zoom: 16,
            center: this.center_of_map,
            legend: "none",
            disableDefaultUI: true,
            scrollwheel: true,
        });

        this.marker = new google.maps.Marker({
            position: this.center_of_map,
            map: this.map,
            draggable: true,
            title: "Drag me to set your lat/lng.  Grab the circle to set your radius.",
        });
        //this.subject = BlockListSubject.getInstance();
        //this.subject.subscribe( this.update );
        let labelText = "1";
        let myOptions = {
            content: labelText,
            boxStyle: {
                border: "none",
                textAlign: "center",
                fontSize: "10pt",
                width: "50px",
            },
            disableAutoPan: true,
            pixelOffset: new google.maps.Size(-25, -5),
            position: this.center_of_map,
            closeBoxURL: "",
            isHidden: false,
            pane: "floatPane",
            enableEventPropagation: true,
        };

        let ibLabel = new InfoBox( myOptions );
        ibLabel.visible = true;
        // ibLabel.open( this.map );
        this.initializeEventListeners();
        setTimeout(() => {
            this.initializeCircle();
        }, 500);
    }

    initializeEventListeners() {
        google.maps.event.addListener(this.marker, "dragend", function (event) {
            document.getElementById("latbox").value = Number(
                this.getPosition().lat()
            ).toFixed(6);
            document.getElementById("lngbox").value = Number(
                this.getPosition().lng()
            ).toFixed(6);
        });
    }

    initializeCircle() {
        this.circle = new google.maps.Circle({
            map: this.map,
            radius: this.circle_radius,
            editable: true,
            strokeColor: "#0000FF",
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: "#00BFFF",
            fillOpacity: 0.35,
        });
        this.circle.bindTo("center", this.marker, "position");
        google.maps.event.addListener(
            this.circle,
            "radius_changed",
            function () {
                console.log(
                    "*** Radius changed.  might want to do something here... ***"
                );
                document.getElementById("radius").value =
                    this.circle.getRadius();
            }
        );
    }

    update(newData) {
        if (newData.type != this.constructor.name) {
            return;
        }
    }

    getSubject() {
        return this.subject;
    }
}}
