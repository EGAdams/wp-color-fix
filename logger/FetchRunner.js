/** @class FetchRunner class */
class FetchRunner {
    url;
    url_encoded_header;
    json_header;
    fetch_options;
    constructor( config ) {
        this.url = config.api_path;
        this.url_encoded_header = { "Content-Type": "application/x-www-form-urlencoded" };
        this.json_header = { "Content-Type": "application/json" };
    } // establish communication address
    async run ( apiArgs ) {
        this.fetch_options = {
            method: apiArgs.type,
            mode: 'no-cors',
            headers: apiArgs.type == "POST" ? /* POST */ this.json_header : /* GET */ this.url_encoded_header,
            body:    apiArgs.type == "POST" ? /* POST */ JSON.stringify( apiArgs ) : /* GET */ undefined
        };
        fetch( this.url, this.fetch_options ).then( res => {
            // console.log( "processing response: " + res + "..." );
            return res.text();
        }).then( data => {
            // console.log( "data: " + data );
        });
    }
}