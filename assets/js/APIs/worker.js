/*
  ---- web Worker Service -2016 ----
  Dependencies  : kDebugLogging.js, FullClientApi.js

var localDB = {
        dbMap: ["logsDB"], // provides the list of db names.
        dbSchemaMap: {
            "logsDB": {
                version: 1, // define version name.
                name: "logsDB", // database name .
                storeList: ["logStoreV4"], // a DB can have multiple store, list of objectstores
                storeIndexes: {
                    "logStoreV4": "timeStamp"
                },
                storeSchema: {
                    "logStoreV4": {
                        // Table schema for each store
                        // Class definition.
                        timeStamp: Number, // Primary key
                        record: Object // Logs object.
                    }
                },
                isDBopen: false,
                connection: undefined // holds the data connection instance, from dexie.
            }
        }
    }
*/
function jsonParse(str) {
    // parse Date String back to Date Object
    var date2obj = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/;

    return JSON.parse(str, function(key, value) {
        if (value && typeof value == 'string' && value.match(date2obj)) return new Date(value);
        return value;
    });
}

function getTypeOf(obj) {
    if (obj && obj.constructor) {

        if (obj.constructor === Date)
            return 'date';
        else if (obj.constructor === String)
            return 'string';
        else if (obj.constructor === Number)
            return 'number';
        else if (obj.constructor === Object)
            return 'object';
        else if (obj.constructor === Array)
            return 'array';
        else if (obj.constructor === Boolean)
            return 'boolean';
        else if (obj.constructor === RegExp)
            return 'regexp';
        else if (obj.constructor === Error)
            return 'error';
        else if (obj.constructor === Function)
            return 'function';
    } else if (obj === null)
        return 'null';
    else if (obj === '')
        return 'emptyString';
    else if (obj === 0)
        return 'numberZero';
    else if (obj === false)
        return 'booleanFalse';
    else
        return 'undefined';
}

function isRootProto(instance) {
    return (instance && (Object.getPrototypeOf(instance) === Object.getPrototypeOf({}))) ? true : false;
};

function isArrayRootProto(instance) {
    return (instance && (Object.getPrototypeOf(instance) === Object.getPrototypeOf([]))) ? true : false;
};

function isEmptyFunction(instance) {
    return (instance && (Object.getPrototypeOf(instance) === Object.getPrototypeOf(Object))) ? true : false;
};

function isRoot(instance) {
    return (isArrayRootProto(instance) || isEmptyFunction(instance) || isRootProto(instance)) ? true : false;
};

/**
 *
 * Creates a json log object, iterates until
 * Root prototype/empty function is reached.
 *
 **/

function getPropertiesOfObjectAsArray(obj) {
    var total = [];

    while (obj) {
        total.push(getProtoInfo(obj));
        if (!isRoot(obj))
            obj = Object.getPrototypeOf(obj);
        else
            obj = false;
    }

    return total;

};

function getProtoInfo(obj) {
    var customObject = {};
    var keys = (obj) ? Object.getOwnPropertyNames(obj) : [];
    for (var index in keys) {

        var typeOf = getTypeOf(obj[keys[index]]);
        // console.check(keys[index],':: ',typeOf,' :: ',obj[keys[index]])
        switch (typeOf) {
            case "object":
                customObject[keys[index]] = getPropertiesOfObjectAsArray(obj[keys[index]]);
                break;
            case "array":
                customObject[keys[index]] = getPropertiesOfObjectAsArray(obj[keys[index]]);
                // customObject[keys[index]] = obj[keys[index]].toString();
                break;
            case "function":
                customObject[keys[index]] = obj[keys[index]].toString();
                break;
            case "string":
                customObject[keys[index]] = obj[keys[index]];
                break;
            case "null":
                customObject[keys[index]] = "null";
                break;
            case "numberZero":
                customObject[keys[index]] = 0;
                break;
            case "emptyString":
                customObject[keys[index]] = "";
                break;
            case "booleanFalse":
                customObject[keys[index]] = false;
                break;
            case "undefined":
                customObject[keys[index]] = "undefined";
                break;
            default:
                customObject[keys[index]] = obj[keys[index]].toString();
                break
        }
    }
    return customObject
}

function WorkerResponse(operation) {
    this.opt = operation ? operation : false,
        this.captureLogs = {
            name: 'captureLogs',
            parentId: null,
            logData: null,
            error: null
        };
    this.getLogsCount = {
        name: 'getLogsCount',
        count: 0,
        error: null
    };
    this.storeLogsToDB = {
        name: 'storeLogsToDB',
        logObject: null,
        error: null
    }
}
var dbService = {
    registerLogsDB: function(dbName, storeName) {
        logsDB = localDB.createDB(dbName, 1); // DBname
        logsDB.setStoreIndexes(storeName, '++id');
        logsDB.setStoreSchema(storeName, {
            record: Object // Logs object.
        }); // optional

        localDB.register(logsDB); // registered asynch.

        return localDB.createDBInstance(logsDB.name, storeName);
    },
    getLogsCount: function(countCB, failCB) {
        var dbname = logsDB.name,
            storename = logsDB.getObjectStoreInUse();
        localDB.getDBinstance(dbname)[storename]
            .count(function(totalRecords) {
                countCB(totalRecords);
            })
            .catch(function(error) {
                failCB(error);
            });
    },
    storeLogsToDB: function(logObject, dbname, storename) {
        localDB.getDBinstance(dbname)[storename].put({
            record: logObject
        }).catch(function(error) {
            var msg = new WorkerResponse('storeLogsToDB');
            msg[msg.opt].error = error;
            msg[msg.opt].logObject = logObject;
            msgModule.post(msg);
            console.check("Error while writing logs in DB : ", error, logObject);
        });
    },
    getDevEntireLogs: function(uniqueId, template, location, referer, successCB, failCB) {
        var logsHTMLString = "",
            DAIM = new Date().getTime(),
            dbname = logsDB.name,
            storename = logsDB.getObjectStoreInUse();

        localDB.getDBinstance(dbname)[storename]
            .reverse() // IndexedDB queried in Descending order
            .each(function(log) {
                // Iterating Each LogRecord from LogsDB.
                logsHTMLString += logService.generateLogHTML(log.record);

            }.bind(this))
            .then(function() {
                // constructing the html feedback.
                logsHTMLString = logService.generateEMailHTML(logsHTMLString, (new Date().getTime() - DAIM), template, location, referer);
                successCB(logsHTMLString);
                logsHTMLString = null;

            }.bind(this)).catch(function(error) {
                failCB(error);
                // catching error while collecting feedback.
                console.check("Error[getLogs] in Db iteration:", error);
            }).finally(function() {
                localDB.clearDbByCount(dbname, storename);
            });

    },
    clearStore: function(dbName, storeName) {
        var dbname = logsDB.name,
            storename = logsDB.getObjectStoreInUse();
        localDB.clearStore(dbname, storename);
    },
    getLogs: function(uniqueId, template, location, referer, successCB, failCB, limit) {
        var logsHTMLString = "",
            DAIM = new Date().getTime(),
            dbname = logsDB.name,
            storename = logsDB.getObjectStoreInUse(),
            queryLimit = limit || localDB.queryLimit;

        localDB.getDBinstance(dbname)[storename]
            .reverse() // IndexedDB queried in Descending order
            .limit(queryLimit) // setting a query retrival limit of 5000
            .each(function(log) {

                // Iterating Each LogRecord from LogsDB
                logsHTMLString += logService.generateLogHTML(log.record);

            }.bind(this))
            .then(function() {
                // constructing the html feedback.
                logsHTMLString = logService.generateEMailHTML(logsHTMLString, (new Date().getTime() - DAIM), template, location, referer);
                successCB(logsHTMLString);
                logsHTMLString = null;

            }.bind(this)).catch(function(error) {
                failCB(error);
                // catching error while collecting feedback.
                console.check("Error[getLogs] in Db iteration:", error);
            }).finally(function() {
                console.check("finally[clear-log] Stopped");
                // localDB.clearStore(dbname, storename);
            });
    }
};
var logService = {
    previousDate: null,
    logs: {
        push: function(arg) {
            dbService.storeLogsToDB(arg, 'logsDB4', 'logStoreV4');
        }
    },
    setLogs: function(msg) {
        var result = jsonParse(msg.args);
        this.logs.push(this.format(result, msg.type, msg.viewName, msg.origin, msg.referer));
    },
    format: function(msg, typeOfLog, view, origin, referer) {
        var tmp = {
            time: new Date().getTime(),
            ref: referer,
            log: [],
            type: typeOfLog,
            description: "",
            view: view || origin
        };
        if (msg && getTypeOf(msg[0]) !== "object" && getTypeOf(msg[0]) !== "undefined") tmp.description = msg[0].toString();
        // else if (msg && getTypeOf(msg[0]) === "undefined") tmp.description = "undefined";
        for (var lArgument in msg) {
            var typeOf = getTypeOf(msg[lArgument]);
            switch (typeOf) {
                case "object":
                    tmp.log.push(getPropertiesOfObjectAsArray(msg[lArgument]));
                    break;
                case "array":
                    tmp.log.push(getPropertiesOfObjectAsArray(msg[lArgument]));
                    // tmp.log.push(msg[lArgument].toString());
                    break;
                case "error":
                    tmp.log.push(getPropertiesOfObjectAsArray(msg[lArgument]));
                    break;
                case "function":
                    tmp.log.push(msg[lArgument].toString());
                    break;
                case "string":
                    tmp.log.push(msg[lArgument]);
                    break;
                case "null":
                    tmp.log.push("null");
                    break;
                case "undefined":
                    tmp.log.push("undefined");
                    break;
                default:
                    tmp.log.push(msg[lArgument].toString());
                    break
            }
        }
        return tmp;
    },
    getTime: function(daim) {
        var str = '',
            _tmp = new Date(daim);

        if (this.previousDate && this.previousDate < _tmp.getDate()) {
            this.previousDate = _tmp.getDate();
            str += '====' +
                _tmp.getFullYear() +
                ':' +
                (_tmp.getDate()) +
                '--'
        }
        return str += _tmp.getHours() + ":" + _tmp.getMinutes() + ":" + _tmp.getSeconds() + ":" + _tmp.getMilliseconds()
    },
    isSingleString: function(array_log, description) {
        if (array_log.length === 1 && description === array_log[0]) return true;
        return false
    },
    spacing: function() {
        return " :: "
    },
    in_button_json: function(raw_obj) {
        var __button = '<button onclick="parse_json(event);">+</button>';
        __button += '<span style="display:none">' + JSON.stringify(raw_obj) + "</span>";
        return __button
    },
    color_quotes: function(type) {
        var __color = false;
        switch (type) {
            case "log":
                __color = "#9400D3";
                break;
            case "info":
                __color = "#006400";
                break;
            case "debug":
                __color = "#4169E1";
                break;
            case "warn":
                __color = "#DAA520";
                break;
            case "error":
                __color = "red";
                break;
            case "custom":
                __color = "#228B22";
                break;
            default:
                __color = "black";
                break
        }
        return __color
    },
    generateLogHTML: function(_log_data) {
        var __time = this.getTime(_log_data.time);
        var __is_json_available = this.isSingleString(_log_data.log, _log_data.description);
        var __html = '<font color="' + this.color_quotes(_log_data.type) + '">';
        __html += "<pre>" + _log_data.view + this.spacing() + _log_data.type + this.spacing() + __time + this.spacing() + _log_data.description;
        if (!__is_json_available) {
            __html += this.spacing() + this.in_button_json(_log_data.log);
        }
        __html += "</pre>";
        __html += "</font>";
        return __html;
    },
    generateEMailHTML: function(generatedHTML, completionTime, template, location, referer) {
        var logsHTML, daim = (new Date).getTime();
        logsHTML = "";
        logsHTML += "<html>";
        logsHTML += "<head>";
        logsHTML += "<title>Logs - " + new Date + "</title>";
        logsHTML += '<script src="http://code.jquery.com/jquery-1.11.0.min.js">\x3c/script>';
        logsHTML += '<script src="http://images.sb.a-cti.com/testing/logging/js/log_viewer.js">\x3c/script>';
        logsHTML += "</head>";
        logsHTML += "<body>";
        logsHTML += '<div style="background-color: #4169E1;">';
        logsHTML += '<font color="white">Frame : ' + location + "<br></font>";
        logsHTML += '<font color="white">Referrer : ' + referer + "<br></font>";
        logsHTML += this.formatTemplate(template);
        logsHTML += '<font color="white">Date : ' + new Date() + "<br></font>";
        logsHTML += "</div>";
        logsHTML += '<iframe id="log_viewer" src="http://images.sb.a-cti.com/testing/logging/html/log_viewer.html" style=" display: none; width: 100%; height: 100%; position:absolute;z-index: 2; "></iframe>';
        logsHTML += '<font color="black"> Time Taken to create log file [Webworker version] : ' + completionTime + "<br></font>";
        logsHTML += generatedHTML;
        logsHTML += "</body>";
        logsHTML += "</html>";
        return logsHTML;
    },
    formatTemplate: function(data) {

        var temp = '';
        if (!data) return temp;
        temp += '<font color="white">Version : ' + (data.userDetail ? 'App - ' + data.appVersion + ' ( UserName : ' + data.userDetail.fullname + ', Email : ' + data.userDetail.email + ' )' : data.appVersion) + '<br></font>';
        temp += '<font color="white">Engine Version : ' + data.engineVersion + '<br></font>';
        temp += '<font color="white">APP JS Version : ' + data.jsVersion + '<br></font>';
        temp += '<font color="white">Mode : ' + data.mode + '<br></font>';
        temp += '<font color="white">User : ' + data.user + '<br></font>';
        temp += '<font color="white">Logname : ' + data.logName + '<br></font>';
        temp += '<font color="white">TMP : ' + data.tempDir + '<br></font>';
        temp += '<font color="white">PATH : ' + data.envPath + '<br></font>';
        temp += '<font color="white">Exec Path : ' + data.execPath + '<br></font>';
        temp += '<font color="white">App upTime : ' + data.appUpTime + 'mins<br></font>';
        temp += '<font color="white">Process Memory : ' + data.memoryUsage + '<br></font>';
        temp += '<font color="white">Config : ' + data.config + '<br></font>';
        return temp;
    }
};
var msgModule = {
    name: 'MessageModule',
    post: function(message) {
        postMessage(message);
    },
    logResponse: function(id, logObj, err) {
        var temp = new WorkerResponse('captureLogs');
        temp[temp.opt].parentId = id;
        temp[temp.opt].logData = logObj || null;
        temp[temp.opt].error = err || null;
        this.post(temp);
    },
    countResponse: function() {
        var temp = new WorkerResponse('getLogsCount');
        dbService.getLogsCount(function countCallBack(LogsCount) {
            temp[temp.opt].count = LogsCount;
            this.post(temp)
        }.bind(this), function failCallBack(error) {
            temp[temp.opt].error = error;
            this.post(temp);
        }.bind(this));
    },
    decider: function(option) {
        dbService[option.name](
            option.uniqueID, option.template, option.location, option.referer,
            function successCB(logObj) {
                this.logResponse(option.uniqueID, logObj, null);
            }.bind(this),
            function failCB(error) {
                this.logResponse(option.uniqueID, null, error);
            }.bind(this), option.queryLimit || null);
    },
    handler: function(e) {
        var msg = e.data;
        switch (msg.opt) {
            case "registerLogsDB":
                {
                    var opt = msg[msg.opt];
                    dbService.registerLogsDB(opt.dbName, opt.storeName);
                    break
                }
            case "getDevEntireLogs":
                {
                    this.decider(msg[msg.opt]);
                    break;
                }
            case "clearLogs":
                {
                    dbService.clearStore();
                    break;
                }
            case "getLogs":
                {
                    this.decider(msg[msg.opt]);
                    break;
                }
            case "setLogs":
                {
                    logService.setLogs(msg[msg.opt]);
                    break;
                }
            case "getCount":
                {
                    this.countResponse();
                    break;
                }
            default:
                {
                    break;
                }
        }
    }
}
window.onmessage = function(e) {
    msgModule.handler(e);
};