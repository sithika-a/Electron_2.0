/**
 
 Resources : 
    Dexie : http://dexie.org/
            https://github.com/dfahlander/Dexie.js/wiki/Dexie.js
    call : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call
    Fn prototype : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/prototype
    
 **/

/**
     *
     * Indexed DB wrapped with dexie
     * Dexie js is used as an api
     *

     example :

        dbNameList: ["DBRegister"], // provides the list of db names.
            dbSchemaMap: {
                "DBRegister": {
                    version: 1, // define version name.
                    name: "DBRegister", // database name .
                    storeList: ["DBRegisterStore"], // a DB can have multiple store, list of objectstores
                    storeIndexes: {
                        "DBRegisterStore": "DBName"
                    },
                    storeSchema: {
                        "DBRegisterStore": {
                            // Table schema for each store
                            // Class definition.
                            DBName: String, // Primary key
                            Schema: Object // Logs object.
                        }
                    },
                    isDBopen: false,
                    connection: undefined // holds the data DB connection instance, from dexie.
                }
            }


        example  =  {
                        "name": "DBRegister",
                        "version": 1,
                        "storeNameList": ["DBRegisterStore"],
                        "storeIndexes": {
                            "DBRegisterStore": "DBName"
                        },
                        "storeSchema": {
                            "DBRegisterStore": {
                                "DBName" : String,
                                "Schema" : Object
                            }
                        },
                        "connection": null,
                        "isDBopen": false
                    }

     **/

(function(root, undefined) {

    console.check = function() {};

    var accessModifier = {
        "mask": {
            enumerable: false,
            writable: true,
            configurable: false
        },
        "protected": {
            enumerable: true,
            writable: false,
            configurable: false
        },
        "private": {
            enumerable: false,
            writable: false,
            configurable: false
        }
    };

    function DBSchemaMap(dbName, v) {
        this.name = dbName; // mandatory
        this.version = v || 1; // mandatory
        this.storeNameList = []; // mandatory, store list name ex: "feedbackStore"
        this.storeIndexes = {}; // mandatory
        this.storeSchema = {}; // Optional, for mapping class object in dexiedb
        this.connection = null; // connection instance holder
        this.objectStoreInUse = ""; // points to current object store in use
        this.isDBopen = false; // mannual flag.
    };

    DBSchemaMap.prototype = {
        setVersion: function(version) {
            if (version && typeof version == 'number') {
                this.version = version;
                return true;
            }
        },
        setStoreIndexes: function(storeName, storeIndexesValue) {
            if (storeName && storeIndexesValue) {
                this.storeIndexes[storeName] = storeIndexesValue;
                this.setStoreList(storeName);
                return true;
            }
        },
        setStoreObject: function(obj) {
            if (typeof obj == 'object') {
                this.storeIndexes = obj;
                return true;
            }
            throw new Error('StoreObject is not valid');
        },
        setStoreList: function(storeName) {
            if (storeName && typeof storeName == 'string' && this.storeNameList.indexOf(storeName) == -1) {
                storeName = storeName.trim();
                this.storeNameList.push(storeName);
                this.setObjectStoreInUse(storeName);
                return true;
            }
        },
        setStoreSchema: function(storeName, schemaObject) {
            if (storeName && this.storeNameList.indexOf(storeName) !== -1 && typeof schemaObject == 'object') {
                this.storeSchema[storeName] = schemaObject;
                return true;
            }
        },
        setObjectStoreInUse: function(storeName) {
            if (storeName && this.storeNameList.indexOf(storeName) !== -1) {
                this.objectStoreInUse = storeName.trim();
                return true;
            }
        },
        getObjectStoreInUse: function() {
            return this.objectStoreInUse || this.storeNameList[0];
        },
        getStoreIndex: function() {
            return this.storeIndexes;
        }
    };

    // Expose public api
    // Bind private scope 
    var localDB = {
        dbNameList: [], // provides the list of db names.
        dbSchemaMap: {},
        queryLimit: 5000,
        createDB: function(dbName, version) {
            dbName = (typeof dbName == 'string') ? dbName.trim() : false;
            version = (typeof version == 'number') ? version : null;
            if (dbName) {
                return new DBSchemaMap(dbName, version);
            }
        },
        register: function(dbObject) {
            if (dbObject instanceof DBSchemaMap && this.dbNameList.indexOf(dbObject.name) == -1) {
                this.dbNameList.push(dbObject.name);
                this.dbSchemaMap[dbObject.name] = dbObject;

                // Storing in internal register.
                //_internalDB.storeInRegisteredDB(dbObject);

                return true;
            } else if (this.dbNameList.indexOf(dbObject.name) !== -1) {
                console.check(' Already registered, db[' + dbObject.name + '] - ', dbObject);
                return true;
            }
            return false;
        },
        /**
         *
         * Open a database by name.
         *
         **/
        getDB: function(name) {
            if (name && localDB['dbSchemaMap'][name.trim()])
                return localDB['dbSchemaMap'][name.trim()];
            /**
             *
             * Each DB has to register to get this
             * Service layer to work.
             *
             **/

            throw new Error('DB not registered:' + name);
        },
        /**
         *
         * check whether db is opened
         * with an connection
         **/
        isDBAvailable: function(name) {
            if (name)
                return localDB.getDB(name).connection ? true : false;
            return false;
        },
        /**
         *
         * Returns an handle for DB
         * for operation to be performed.
         **/

        getDBinstance: function(name) {
            /**
             *
             * If DB is open, return the connection
             * instance for operation, else create/open instance.
             **/
            if (localDB.isDBAvailable(name) && localDB.getDB(name).isDBopen) {
                return localDB.getDB(name).connection
            } else {
                /**
                 * Open the database and give the instance
                 **/
                return localDB.openDBInstance(name);
            }
        },
        openDBInstance: function(name) {

            if (localDB.getDB(name).connection && !localDB.getDB(name).isDBopen) {

                localDB.getDB(name).isDBopen = true;
                localDB.getDB(name).connection.open();
                console.check('openDBInstance, connection to DB opened !!');

                return localDB.getDB(name).connection;
            } else if (localDB.getDB(name).connection && localDB.getDB(name).isDBopen) {
                console.check('openDBInstance, connection to already open !!');
                return localDB.getDB(name).connection;
            }
            return false;

        },
        createDBInstance: function(dbName, storename) {
            /** 
             * Creating an database.
             * i/p ex :
             * name : logsDB ,
             * storename : logStore ,
             * storeindexes : 'timeStamp,logs'
             **/

            if (!dbName || !storename)
                return;


            console.check('createDBInstance, dbName : ' + dbName + ', ObjectStoreName : ' + storename);
            /**
             *
             * Intiating a indexedDB database
             * connection is created.
             **/
            localDB.getDB(dbName).connection = new Dexie(dbName);

            console.check('createDBInstance, StoreIndex for dixie : ', localDB.getDB(dbName).getStoreIndex());
            /**
             *
             * version and object store are initialized.
             *
             **/
            localDB.getDB(dbName)
                .connection
                .version(localDB.getDB(dbName).version)
                .stores(localDB.getDB(dbName).getStoreIndex());

            /**
             * Opening the Database, when db is
             * created successfully.
             **/
            return localDB.openDBInstance(dbName);
        },
        getClearCount: function(recordCount) {
            if (recordCount)
                return Math.trunc(recordCount / localDB.queryLimit) * localDB.queryLimit;
        },
        clearDbByCount: function(dbname, storename) {
            this.getDBinstance(dbname)[storename]
                .count(function successCallback(noOfRecords) {
                    console.check('ObjectStore[' + storename + '], total Record : ' + noOfRecords + ' limit : ' + localDB.queryLimit);
                    localDB.clearStoreByLimit(dbname, storename, localDB.getClearCount(noOfRecords) || localDB.queryLimit);
                })
                .catch(function errorCallback(error) {
                    console.check('Error while counting ObjectStore[' + storename + ']', error);
                });
        },
        startUpClear: function(dbname, storename) {
            this.getDBinstance(dbname)[storename]
                .count(function successCallback(noOfRecords) {
                    console.check(' startup clear ObjectStore[' + storename + '], total Record : ' + noOfRecords + ' limit : ' + localDB.queryLimit);
                    if (localDB.getClearCount(noOfRecords)) {
                        console.check('startup clearing....')
                        localDB.clearStoreByLimit(dbname, storename, localDB.getClearCount(noOfRecords));
                    }
                })
                .catch(function errorCallback(error) {
                    console.check('Error while counting ObjectStore[' + storename + ']', error);
                });
        },
        clearStoreByLimit: function(dbname, storename, count) {
            console.check('Will Delete only : ' + count);
            this.getDBinstance(dbname)[storename]
                .limit(count || localDB.queryLimit) // setting a query retrival limit of 5000
            .delete(function() {
                console.check('Success while clearStoreByLimit ObjectStore[' + storename + ']');
            })
                .catch(function(err) {
                    console.check('Error while clearStoreByLimit ObjectStore[' + storename + ']', err);
                });
        },
        clearStore: function(dbname, storename) {
            this.getDBinstance(dbname)[storename]
                .clear(function successCallback() {
                    console.check('ObjectStore[' + storename + '] is cleared successfully');
                })
                .catch(function errorCallback(error) {
                    console.check('Error while clearing ObjectStore[' + storename + ']', error);
                });
        },
        deleteDB: function(dbname) {
            this.getDBinstance(dbname).delete();
        },
        closeDBInstance: function(name) {
            if (localDB.getDB(name) && localDB.getDB(name).connection) {
                // DB.getDBinstance(name).close();
                localDB.getDB(name).connection.close();
                localDB.getDB(name).isDBopen = false;
                console.check("================= closeDBInstance ================= START");
                console.check(" IS CONNECTION CLOSE :  " + localDB.getDB(name).isDBopen);
                console.check("================= closeDBInstance ================= END");
            }
        }
    }

    for (var prop in localDB) {
        if (localDB.hasOwnProperty(prop)) {
            Object.defineProperty(localDB, prop, accessModifier.protected);
        }
    }

    root['localDB'] = localDB;

}(this));