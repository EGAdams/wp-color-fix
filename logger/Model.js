/** @class Model */
/**
 * Creates a new Model instance and hooks up the sourceData.
 *
 * @constructor
 * @param {object} sourceData A reference to the client side sourceData class
 */
 class Model {
    sourceData;
    constructor(sourceData) { this.sourceData = sourceData; }
    /**
         * selects one object from the database
         *
         * @param { function } [ callback ] The callback to fire after the object has been retrieved
         */
    selectObject(data_config, callback) { this.sourceData.selectObject(data_config, callback); }
    /**
         * Gets all objects from the database
         *
         * @param { function } [ callback ] The callback to fire after the objects have been retrieved
         */
    selectAllObjects(callback) { this.sourceData.selectAllObjects(callback); }
    /**
         * Will insert an object into the database.
         *
         * @param {object} data_config The call type, object id and object data
         * @param {function} callback The callback to fire after inserting new data
         */
    insertObject(data_config, callback) { this.sourceData.insertObject(data_config, callback); }
    /**
         * Will update an existing object in the database.
         *
         * @param {object} data_config The call type, object id and object data
         * @param {function} callback The callback to fire after the update
         */
    updateObject(data_config, callback) { this.sourceData.updateObject(data_config, callback); }
}
