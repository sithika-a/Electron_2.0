try {

    var crashReporter,
        url,
        http,
        formidable,
        fs,
        FormData,
        request,
        socks,
        getPort;

    try {

        crashReporter = require('electron').crashReporter
        url = require('url');
        http = require('http');
        formidable = require('formidable');
        fs = require('fs');
        FormData = require('form-data');
        request = require("request");
        getPort = require('get-port');

    } catch (e) {
        // Throw New Error and stop and reporter
        // module.
        // 
        // Module Controller render will automatically
        // check dependencies and update system back

        console.log("Required module not found : " + e.message);
        throw new Error('Stop all Crash service ' + e.message);
    }


    getPort(function(err, port) {
        crashReportServer.port = port;
        crashReportServer.startCrashReporter();
        crashReportServer.startIncomingPort();
    });

    var crashReportServer = {
        instance: null,
        port: null,
        name: 'CrashReportServer',
        log: function() {
            console.log.apply(console, arguments);
        },
        checkCharacterLimit: function(UserInfo) {
            this.log("Reached checkCharacterLimit function : UserInfo len:", UserInfo.length);
            if (UserInfo && UserInfo.length <= 500) {
                this.log("UserInfo less than 500.");
                return UserInfo;
            } else {
                this.log("UserInfo >500. So truncating..!", UserInfo.substring(0, 499));
                return UserInfo.substring(0, 499);
            }
        },
        startCrashReporter: function() {
            crashReporter.start({
                productName: 'FULLClient-Electron',
                companyName: 'FULLCreative',
                autoSubmit: true,
                submitURL: 'http://localhost:' + this.port + '/crashreporter',
                extra: {
                    "githuburl": "https://github.com/kamesh-a",
                    "email": "kamesh.arumugam@a-cti.com",
                    "contact": "+919884228421",
                }
            });
        },
        logInfoInSpreadSheet: function(attachmentURL) {   
            if (userInfo && userInfo.crashInfo && userInfo.login) {
                var config = WindowManager.getConfig();
                var mode = config.mode;
                var crashInfo = userInfo.crashInfo;
                var url = config[mode].crashAnalytics + '?userEmailId=' + userInfo.login +
                    '&mode=' + crashInfo.mode +
                    '&appVersion=' + crashInfo.appVersion +
                    '&engine=' + crashInfo.engine +
                    '&platform=' + crashInfo.platform +
                    '&os=' + crashInfo.os +
                    '&dumpfilelink=' + attachmentURL || 'N/A';
                console.log("URL:", url);
                request(url, function(error, response, body) {        
                    if (!error && response.statusCode == 200) {          
                        console.log('Crash for user has been logged : ' + userInfo ? userInfo.login : "unknown");        
                    }       
                });
            }

        },
        getdumpfileurl: function(cardId, cb) {
            /**
             *  - After crashdata has been sent to looptodo as feedback, we will be getting loopkey as response. 
             *  - using that loopkey we will hit another loop service to get dumpfile attachmentURL. 
             *  - url : "http://my.loopto.do/loop/{loopId}/cards/{cardId}"
             */
            var url = "http://my.loopto.do/loop/agtzfmxvb3BhYmFja3IRCxIETG9vcBiAgICzrN3bCgw/cards/" + cardId;
            request(url, function(error, response, body) {  
                var respbody;  
                if (error)
                    this.logInfoInSpreadSheet(null);    
                if (!error) {  
                    respbody = response.body;
                    var responseArray = (new Function("return [" + respbody + "];")()); // getting array from string. 
                    cb.call(this, responseArray[0][0].attachmentURL); // cb = this.logInfoInSpreadSheet(); and responseArray[0][0].attachmentURL = dumpfile attachment url.
                }       
            }.bind(this));
        },
        startIncomingPort: function() {
            crashReportServer.log("Inside crashReportServer.startIncomingPort function:");
            this.instance = http.createServer(function(req, res) {
                // change start
                if (req && req.url.indexOf('/crashreporter') !== -1) {

                    var config = WindowManager.getConfig();
                    var mode = config.mode;

                    var form = new formidable.IncomingForm();
                    form.parse(req, function(err, fields, files) {
                        this.log("JSON:", JSON.stringify({
                            fields: fields,
                            files: files
                        }));
                        var filePathToLoopTodo = files.upload_file_minidump.path;
                        this.log("Dump file path : ", filePathToLoopTodo);
                        this.log("Dump file name:", files.upload_file_minidump.name);

                        var UserInfo = 'Date & Time     : ' + new Date() + '<br>' +
                            'GUID            : ' + fields.guid + '<br>' +
                            'Process_Type    : ' + fields.process_type + '<br>' +
                            'Prod            : ' + fields.prod + '<br>' +
                            'Engine Version  : ' + fields.ver + '<br>';

                        // this userInfo object is obtained from module controller
                        // via ipc message.
                        var form = new FormData();
                        form.append("t", new Date().getTime());
                        form.append("tag", "CrashReporter");
                        form.append("loopKey", "agtzfmxvb3BhYmFja3IRCxIETG9vcBiAgICzrN3bCgw");
                        form.append("user_name", (userInfo ? userInfo.login : "CrashReporter"));
                        form.append("user_email", (userInfo ? userInfo.login : "unknown"));
                        form.append("card_title", this.checkCharacterLimit(UserInfo));
                        form.append("feedbackAttachment", fs.createReadStream(filePathToLoopTodo), {
                            filename: files.upload_file_minidump.name,
                            "content-type": "application/octet-stream"
                        });
                        console.log('LoopURL : ', config[mode].loopURL)
                        request.post(config[mode].loopURL + '/forms/getBlobUploadUrl?type=feedback', function(err, resp, body) {
                            if (err) {
                                // TODO : write to local 
                                // file system, and send the reports
                                // on next application startup.
                                this.logInfoInSpreadSheet(false);
                            } else if (resp && resp.statusCode == 200) {
                                this.log("Blob url: ", JSON.parse(body).blobUrl)
                                var localURL = JSON.parse(body).blobUrl;
                                var b = request.post(localURL, function(err, resp, body) {
                                    this.log('Error : ', err);
                                    if (err) {
                                        this.logInfoInSpreadSheet(false);
                                    } else if (resp.body) {
                                        this.getdumpfileurl(resp.body, this.logInfoInSpreadSheet);
                                    }
                                }.bind(this));
                                b._form = form;
                            }
                        }.bind(this));
                    }.bind(this));
                    return;
                };
                res.writeHead(200, {
                    'Access-Control-Allow-Origin': '*'
                });
                res.end('Crashreport service is active.');

            }.bind(this));

            this.instance.listen(this.port, function(err, info) { /* log data in file*/ });
        }
    };
} catch (e) {
    console.error("Exception in CrashReportServer:", e);
    console.error("Error is:", e.stack);
}

var crashManager = {
    name: 'crashManager',
    track: {
        isSB: false,
        isChat: false,
        isV2: false
    },
    log: function() {
        util.log.apply(this, arguments);
    },
    proxy: function() {
        crashManager.notify.apply(crashManager, arguments);
    },
    reload: function(windowInfo) {
        switch (windowInfo.title) {
            case namespace.CONTAINER_V2:
                {
                    this.track.isV2 = true;
                    if (/^win32/.test(process.platform) && /1.4/.test(process.versions.electron)) {
                        ipcController.getContainer(namespace.CONTAINER_V2).close();
                        Emitter.emit('/windowManager/open/v2/container', true);
                    } else {
                        ipcController.getContainer(namespace.CONTAINER_V2).webContents.reloadIgnoringCache();
                    }
                    console.log("V2 Window got crashed.");
                    break;
                }
            case namespace.CONTAINER_SB:
                {
                    this.track.isSB = true;
                    if (/^win32/.test(process.platform) && /1.4/.test(process.versions.electron)) {
                        ipcController.getContainer(namespace.CONTAINER_SB).close();
                        Emitter.emit('/windowManager/open/sb/container', true);
                    } else {
                        ipcController.getContainer(namespace.CONTAINER_SB).webContents.reloadIgnoringCache();
                    }
                    console.log("FULL Window got crashed.");
                    break;
                }
            case namespace.CONTAINER_CHAT:
                {
                    this.track.isChat = true;
                    if (/^win32/.test(process.platform) && /1.4/.test(process.versions.electron)) {
                        ipcController.getContainer(namespace.CONTAINER_CHAT).close();
                        Emitter.emit('/windowManager/open/chat/container', true);
                    } else {
                        ipcController.getContainer(namespace.CONTAINER_CHAT).webContents.reloadIgnoringCache();
                    }
                    console.log("Chat Window got crashed");
                    break;
                }
            default:
                {
                    console.log('What title i recieved : ', windowInfo)
                    break;
                }
        }
    },
    notify: function(title) {
        this.log('recieved crash on window : ' + title);
        if (title) {
            this.reload(title);
        }
    }
}

Emitter.on('RendererCrash', crashManager.proxy);