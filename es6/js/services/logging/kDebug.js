//kDebug API -2016 with Web workers
/**
 * kDebug Logging System makes a copy of console logger
 * Helps in way to get the logs printed in javascript
 * console
 * kDebug.getLogs('logsDB','logStoreV4'); will result in collected Logs,
 * Note : By default logs will not show in console, if kDebug is
 * initialized successfully , switch flag "isShowLogsInConsole = false",
 * to view logs in console.
 **/

/**
 * TODO:
 * a. Dexie should provide wrapper around indexedDB
 * b. Use chrome app api to communicational purpose
 * d. use webworkers to create the feedback
 * e. on the whole collect the data and store in applications
 * Indexed in case of failure scenarios.
 * f. Send the data back when internet gets connected/application start.
 **/

/**

Dependencies : 
 
 - dbDAO.js, FullClientAPi.js , webworker.js

<---- Log-Retrieval Time-Estimation-Test: ----->

var collectCount = 10000; tested Till 80000
var daim = new Date().getTime();
            kDebug.getLogs('uniqueID', function(logObj) {
                console.check('Time to Retrieve ', collectCount, ' Logs from DB is: ', (new Date().getTime() - daim) / 1000, 'Secs');
                util.copy(logObj.value);
            }, null, collectCount);
-------------------------------------------------
LOGGING-TEST-CASE: Passing this test log ensure all format of log will be saved !!!

console.log(['array', -1, false, undefined, '', new Function, new Date,new Object,new Number,String, Number], function loggingMockTest() {
    console.log(function loggingMockTest() {

    }, 0, -1, {
        kamesh: false
    }, false, {
        testing: -81312312,
        beta: function test() {
            //show the comments in the arguments
            console.bay('what the heck is this')
        }
    });
}, 0, -1, {
    kamesh: false
}, false, {
    20:[{onmessages:function(){}}],
    testing: -81312312,
    beta: function test() {
        //show the comments in the arguments
        console.bay('crutial test case, if this passes all logging will pass')
    }
},undefined,null,false,new Function);


var test = setInterval(function(){
    console.log(['array', -1, false, undefined, '', new Function, new Date,new Object,new Number,String, Number], function loggingMockTest() {
    console.log(function loggingMockTest() {

    }, 0, -1, {
        kamesh: false
    }, false, {
        testing: -81312312,
        beta: function test() {
            //show the comments in the arguments
            console.bay('what the heck is this')
        }
    });
}, 0, -1, {
    kamesh: false
}, false, {
    20:[{onmessages:function(){}}],
    testing: -81312312,
    beta: function test() {
        //show the comments in the arguments
        console.bay('crutial test case, if this passes all logging will pass')
    }
},undefined,null,false,new Function);

},2)




clearInterval(test);


result = [["array",-1,false,null,"","2015-02-07T14:02:22.249Z",null],"function loggingMockTest() {\n    console.log(function loggingMockTest() {\n\n    }, 0, -1, {\n        kamesh: false\n    }, false, {\n        testing: -81312312,\n        beta: function test() {\n            //show the comments in the arguments\n            console.bay('what the heck is this')\n        }\n    });\n}","0","-1",[{"kamesh":false}],"false",[{"testing":"-81312312","beta":"function test() {\n        //show the comments in the arguments\n        console.bay('what the heck is this')\n    }"}],"undefined","null","false","function anonymous() {\n\n}"]
 */

(function(root) {

    function LogsCapture(origin, value, feedbackId) {
        this.name = 'logs';
        this.host = origin || 'FULLClient';
        this.value = value;
        this.parentId = feedbackId;
    }

    function jsonStringify(obj) {
        // Will check for Functions or RegExp in Object Properties and strigify them
        return JSON.stringify(obj, function(key, value) {
            if (value instanceof Function || typeof value == 'function') {
                return value.toString();
            }
            if (value instanceof RegExp) {
                return '_PxEgEr_' + value;
            }
            return value;
        });
    }

    var webworker, logsDB = null;

    function WorkerRequest(operation) {
        this.opt = operation ? operation : false,
            this.registerLogsDB = {
                name: 'registerLogsDB', // change
                dbName: 'logsDB4',
                storeName: 'logStoreV4'
            };
        this.getCount = {
            name: 'getCount'
        };
        this.setLogs = {
            name: 'setLogs',
            args: null,
            type: null,
            origin: location.origin,
            referer: document.referrer,
            viewName: null
        };

        this.clearLogs = {
            name: 'clearLogs'
        };

        this.getDevEntireLogs = {
            name: 'getDevEntireLogs',
            uniqueID: null,
            location: location.href,
            referer: document.referrer,
            template: {}
        };
        this.getLogs = {
            name: 'getLogs',
            uniqueID: null,
            queryLimit: null,
            location: location.href,
            referer: document.referrer,
            template: {}
        };
    }
    var dbMediator = {
        getCount: function() {
            var msg = new WorkerRequest('getCount');
            messageService.sender(msg);
        },
        registerDB: function() {
            var msg = new WorkerRequest('registerLogsDB');
            messageService.sender(msg);
        },
        getViewName: function() {
            if (/Electron/.test(navigator.userAgent))
                return document.title;
            else if (/Tc-webkit/.test(navigator.userAgent))
                return (typeof self_window === 'object' && self_window.name) ? self_window.name : false;
        },
        setLogs: function(args, type) {
            var msg = new WorkerRequest('setLogs');
            msg[msg.opt].args = jsonStringify(args);
            msg[msg.opt].type = type;
            msg[msg.opt].viewName = this.getViewName();
            messageService.sender(msg);
        },
        isElectron: function() {
            return (!/Electron/.test(navigator.userAgent) || /Tc-webkit/.test(navigator.userAgent)) ? false : true;
        },
        isNodeWebKit: function() {
            return (/Tc-webkit/.test(navigator.userAgent)) ? false : true;
        },
        getTemplateInfo: function() {
            if (typeof process == 'object', typeof userDAO !== 'undefined') {
                return {
                    engineVersion: process.versions['electron'] || process.versions['node-webkit'],
                    jsVersion: jsVersion,
                    userDetail: userDAO.getUser() ? userDAO.getUser() : null,
                    user: process.env.USER,
                    logName: process.env.LOGNAME,
                    tempDir: util.getTempDirectory(),
                    envPath: process.env.PATH,
                    execPath: process.execPath,
                    appUpTime: Math.round(process.uptime() / 60),
                    memoryUsage: JSON.stringify(process.memoryUsage()),
                }
            }
            return {};
        },
        getNwTemplate: function() {
            if (!this.isNodeWebKit()) return '';
            var temp = this.getTemplateInfo();
            if (typeof gui !== 'undefined' && typeof _appConfig !== 'undefined') {
                temp.appVersion = gui.App.manifest.version;
                temp.mode = _appConfig.mode;
                temp.config = JSON.stringify(_appConfig);
                return temp;
            }
        },
        getElectronTemplate: function() {
            /* 
             * This Extra Informations will be added only to the Containers : 
             * Based on Platform Webkit or Electron 
             */
            if (!this.isElectron()) return null;
            var temp = this.getTemplateInfo();
            temp.appVersion = FULLClient.manifest.version;
            temp.mode = FULLClient.getMode();
            temp.config = JSON.stringify(FULLClient.getConfig());
            return temp;
        },
        clearLogsReq: function() {
            var msg = new WorkerRequest('clearLogs');
            messageService.sender(msg);
        },
        getLogsReq: function(uniqueID, queryLimit) {
            var optName = queryLimit ? 'getLogs' : 'getDevEntireLogs';
            var msg = new WorkerRequest(optName);
            msg[msg.opt].uniqueID = uniqueID;
            msg[msg.opt].queryLimit = queryLimit || null;
            msg[msg.opt].template = this.getElectronTemplate() || this.getNwTemplate();
            messageService.sender(msg);
        }
    };
    var callBackHandler = {
        cbMap: {
            // "uniqueId" : {
            //     cb : function(){},
            //     context : null
            // }
        },
        isCallBackValid: function(callBack) {
            return (callBack && typeof callBack == 'function') ? true : false;
        },
        store: function(id, callBack, context, queryLimit) {
            var uniqueId = id;
            this.cbMap[uniqueId] = {};
            this.cbMap[uniqueId]['cb'] = callBack;
            this.cbMap[uniqueId]['context'] = context || null;
            dbMediator.getLogsReq(uniqueId, queryLimit);
        },
        handler: function(option) {
            if (option.error) return console.check('Error while Getting Logs : ', error);
            var uniqueId = option.parentId;
            var map = this.cbMap[uniqueId];
            map['cb'].call(map['context'] || null, new LogsCapture(location.host, option.logData, uniqueId));
            setTimeout(function() {
                this.reclaimMemory(uniqueId);
            }.bind(this), 0);
        },
        reclaimMemory: function(key) {
            delete this.cbMap[key];
        }
    }

    var messageService = {
        countDfd: null,
        init: function() {
            // Initializing the Worker.
            if (typeof webworker_script == "undefined") return;
            setTimeout(function() {
                var blobURL = window.URL.createObjectURL(new Blob(["(" + webworker_script.toString() + ")()"], {
                    type: 'text/javascript'
                }));
                webworker = new Worker(blobURL);
                dbMediator.registerDB();
                webworker.onmessage = function(arg) {
                    messageService.receiver(arg);
                }
            }, 0);
        }(),
        sender: function(data) {
            if (webworker) {
                webworker.postMessage(data);
            }
        },
        receiver: function(msg) {
            var msg = msg.data,
                opt = msg && msg[msg.opt] ? msg[msg.opt] : null;
            if (opt) {
                switch (opt.name) {
                    case 'captureLogs':
                        {
                            callBackHandler.handler(opt);
                            break;
                        }
                    case 'getLogsCount':
                        {
                            this.countDfd.resolve(opt.error || opt.count);
                            break;
                        }
                    default:
                        {
                            console.check('Default Sequence in worker response')
                            break;
                        }
                }
            }
        }
    };

    /* 
              <---- Error Log Intimation ----> 
              Its a Service Given with Chrome App API 
              to trigger mail with Logs of that Particular Requested Frame.
              USAGE : uniqueID -->  kDebug.errorLogTrigger(queryLimit);
              queryLimit : optional ,default : 5000 Logs
              Result : Mail Will be sent with Collected Logs to Dev
    */

    var errorLog = {
        user_name: "SB Devs",
        user_email: "sithika.abdhul@a-cti.com",
        loopKey: 'agtzfmxvb3BhYmFja3IRCxIETG9vcBiAgICi28uSCQw',
        loopUrl: 'http://test.loopaback.appspot.com//forms/getBlobUploadUrl?type=feedback',
        getUniqueId: function() {
            return new Date().valueOf();
        },
        trigger: function(queryLimit) {
            console.check('reached err Log with Limit : ', queryLimit);
            callBackHandler.store(this.getUniqueId(), function(logData) {
                this.processLogObj(logData);
            }, errorLog, queryLimit || 1000);
        },
        getLogBlb: function(logObj) {
            return new Blob([logObj], {
                type: 'text/html'
            });
        },
        processLogObj: function(logData) {
            this.createFormData(this.getLogBlb(logData), location.host);
        },
        getUploadUrl: function() {
            console.check('Getting Blob Url ...')
            return $.ajax({
                url: this.loopUrl,
                type: 'POST',
                crossDomain: true,
                data: {
                    time: new Date().getTime()
                }
            }).pipe(
                function doneFilter(r) {

                    /**
                    *   Ex: response object.
                    * 
                        r = {
                            blobUrl : <url to upload>,
                            response : 'success'
                        } 
                    *
                    **/
                    if (r.blobUrl) {
                        console.check('getUploadUrl :: blob url successfully Recieved ', r.blobUrl);
                        return r.blobUrl;
                    } else {
                        console.check('getUploadUrl :: doneFilter ::blob url failure :: requeued ');
                        return this.getUploadUrl();
                    }
                },
                function failFilter() {
                    // Recursion until we get the BlobURL and 
                    console.check('failed request  :', arguments);
                    // return this.getUploadUrl();
                }.bind(this)
            );
        },

        getBlobUrlAndSend: function(formdata) {
            var step1 = this.getUploadUrl().pipe(function(uploadUrl) {
                console.check('Sending Feedback ...');
                return {
                    'url': uploadUrl,
                    'FormData': formdata
                };
            });
            var step2 = step1.pipe(this.sendFeedback);
            return step2;
        },
        sendFeedback: function(uploadInfo) {
            return $.ajax({
                    url: uploadInfo.url,
                    type: 'POST',
                    processData: false,
                    contentType: false,
                    enctype: 'multipart/form-data',
                    data: uploadInfo.FormData
                })
                .pipe(function doneFilter(r) {
                    return "sent";
                }, function failFilter() {
                    console.check('FeedBack Failed to sent for ErroIntimation Mail Sequence :: ', arguments)
                        // Recursion Until Sent successfully
                        // TODO : We need to specify Time Limit to trigger
                    return this.sendFeedback(uploadInfo);
                });
        },
        createFormData: function(logBlb, logHost) {
            console.check('Form data creation in Error log Intimation Mail Sequence');
            var data = new FormData();
            data.append("card_title", "ErrorLog Message !!!");
            data.append("feedbackAttachment", logBlb, logHost);
            data.append("t", new Date().getTime());
            data.append("tag", "suggestion");
            data.append("loopKey", this.loopKey);
            data.append("user_name", this.user_name);
            data.append("user_email", this.user_email);
            this.getBlobUrlAndSend(data);
        }
    }

    /* 
        <-- USAGE -->
        syntax :  kDebug.getLogs(uniqueId, callBack, context, queryLimit)
        uniqueID :- must,
        callBack : must ,
        context :- optional ,
        queryLimit :- optional , default :5000 Logs
     */

    var ARFrame = {
        isEmbedded: null,
        wrap: function(args) {
            return jsonStringify({
                action: 'logs',
                source: location.href,
                logs: args
            });
        },
        isEmbeddedAR: function() {
            if (typeof this.isEmbedded == 'boolean') {
                return this.isEmbedded;
            } else {
                var regex = /(IndependentRouting.html)/i;
                var href = location.href;
                this.isEmbedded = (href && regex.test(href) && window != window.parent);
            }
            console.check('is it embedded : ', this.isEmbedded);
            return this.isEmbedded;
        },
        sendLogsCopy: function(args) {
            try {
                if (args) {
                    var wrapped = this.wrap(args);
                    window.parent.postMessage(wrapped, '*')
                }
            } catch (e) {
                console.check('Error log in ARFRAME :', e.message);
                console.check('Error log in ARFRAME :', e.stack);
            }
        }
    };


    var kDebug = {

        handler: {
            log: console.log,
            debug: console.debug,
            info: console.info,
            warn: console.warn,
            error: console.error
        },
        isShowLogsInConsole: true,
        check: {
            /**
             *
             * Shows logs in console for kDebugging purpose
             * But will not capture the logs.
             *
             **/
            handler: console.debug,
            setLogs: function(args) {
                this.handler.apply(console, args)
            }
        },
        enableConsoleView: function() {
            this.isShowLogsInConsole = true;
        },
        disableConsoleView: function() {
            this.isShowLogsInConsole = false;
        },
        getLogs: function(uniqueId, callBack, context, queryLimit) {
            /* Request to Web Workers to get Logs*/
            callBackHandler.isCallBackValid(callBack) ?
                callBackHandler.store(uniqueId, callBack, context, queryLimit || 5000) :
                console.check('Callback is not a function');
        },
        clearLogs: function() {
            dbMediator.clearLogsReq();
        },
        getDevEntireLogs: function(uniqueId, callBack, context) {
            callBackHandler.isCallBackValid(callBack) ?
                callBackHandler.store(uniqueId, callBack, context, null) :
                console.check('Callback is not a function');
        },
        getCount: function(cb) {
            if (callBackHandler.isCallBackValid(cb)) {
                messageService.countDfd = $.Deferred();
                dbMediator.getCount();
                $.when(messageService.countDfd).done(function(result) {
                    cb(result)
                });
            } else console.check('Callback is not a function');
        },
        setLogs: function(type, args) {
            dbMediator.setLogs(args, type);
            if (!ARFrame.isEmbeddedAR() && this.isShowLogsInConsole)
                this.handler[type].apply(console, args);
            else
                ARFrame.sendLogsCopy(args);
        },
        extend: function() {
            var arr = ['log', 'debug', 'info', 'warn', 'error', 'check'];
            for (var i = 0; i < arr.length; i++) {
                var type = arr[i];
                console[type] = (function(logType) {
                    return function() {
                        (logType == 'check') ?
                        kDebug[logType].setLogs(arguments):
                            kDebug.setLogs(logType, arguments);
                    }
                }(type));
            }
        }()
    };
    // Expose only necessary Functions To Public and Restrict to Modify these fns,.
    root['kDebug'] = {
        errorLogTrigger: errorLog.trigger.bind(errorLog),
        enableConsoleView: kDebug.enableConsoleView.bind(kDebug),
        disableConsoleView: kDebug.disableConsoleView.bind(kDebug),
        clearLogs: kDebug.clearLogs.bind(kDebug),
        getLogs: kDebug.getLogs.bind(kDebug),
        getDevEntireLogs: kDebug.getDevEntireLogs.bind(kDebug),
        getCount: kDebug.getCount.bind(kDebug)
    };

})(this);