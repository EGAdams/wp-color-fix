let DataSourceFactory = (function(){
    let instance;
    return {
        getInstance: function(){
            if (instance == null) {
                instance = new DataSource();
                // Hide the constructor so the returned object can't be new'd...
                instance.constructor = null;
            }
            return instance;
        }
   };
})();
