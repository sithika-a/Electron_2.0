/*
 * serverModule module
 */

/** 
 * $.get('http://localhost:7056/?controller=updateStatus&value=Available');
 * $.get('http://localhost:7056/?controller=close&value=12345678');
 * $.get('http://localhost:7056/?controller=dial&value=9994723995');
 * $.get('http://localhost:7056/?controller=msg-to-V2&value=test');
 * $.get('http://localhost:7056/?controller=msg-to-CHAT&value=test');
 * $.get('http://localhost:7056/?controller=msg-to-FULL&value=test');
 *  amplify.publish('serverModule/stop'); // closing server.
 */


(function(R, util) {

    var url = FULLClient.require('url');
    var http = FULLClient.require('http');

    try {
        $.get('http://localhost:7056/isAppUp.do?check=true&value={%22test%22:%22value%22}')
            .done(function() {
                console.error('HTTPPort 7056 Active, We cannot bind onemore time..');
            })
            .fail(function() {
                serverModule.log('serverModule Started');
                serverModule.startIncomingPort();
            });

        var serverModule = {
            instance: null,
            port: 7056,
            name: 'serverModule',
            log: function() {
                util.log.apply(this, arguments);
            },
            isValid: function(msg) {
                return msg && typeof msg == 'object' ? msg : false;
            },
            isIPCMessagingAvailable: function(params) {
                return R['FULLClient'] && FULLClient.ipc && this.isValid(params) ? true : false;
            },
            sendResponse: function(value, res) {
                res.writeHead(200, {
                    'Access-Control-Allow-Origin': '*'
                });
                res.end(value);
            },
            startIncomingPort: function() {
                console.warn("Inside startIncomingPort.js");
                this.instance = http.createServer(function(req, res) {
                    // Obtains the queryString as an object.
                    var queryObject = url.parse(req.url, true);
                    if( queryObject.query['controller'] ){
                        console.warn("url via 127.0.0.1:7056 :: " + req.url);
                        console.log(queryObject.query['controller'],queryObject.query)
                    }
                    // Based on controller we are taking action in router function.
                    this.router(queryObject.query['controller']||queryObject.query['state'], queryObject.query, res);
                }.bind(this));

                this.instance.listen(serverModule.port, function(err, info) {
                    console.warn("Server started at 7056...!");
                    if (err)
                        console.warn("Error in Starting server for 7056:");
                });

            },
            stop: function() {
                this.log("Stoping server in serverModule:");
                return this.instance ? this.instance.close() : false;
            },
            router: function(controller, params, res) {
                var parsedObj;
                try {
                    parsedObj = /(JSON)/.test(controller) ? JSON.parse(params.value) : {};
                } catch (e) {
                    console.error('Error in parsing block of Server : ' + e.message);
                    console.error('Error in parsing block of Server : ', e.stack);
                    res.writeHead(200, {
                        'Access-Control-Allow-Origin': '*'
                    });

                    res.end('JSON Parsing Error : ' + e.message);
                    return;
                }

                switch (controller) {
                    case "msg-to-V2":
                        {
                            if (this.isIPCMessagingAvailable(params))
                                FULLClient.ipc.sendToV2(params);
                            this.sendResponse('Message sent sucessfully to V2.', res);
                            break;
                        }
                    case "msg-to-CHAT":
                        {
                            if (this.isIPCMessagingAvailable(params))
                                FULLClient.ipc.sendToChat(params);
                            this.sendResponse('Message sent Sucessfully to Chat.', res);
                            break;
                        }
                    case "msg-to-FULL":
                        {
                            if (this.isIPCMessagingAvailable(params))
                                FULLClient.ipc.sendToSB(params);
                            this.sendResponse('Message sent Sucessfully to SB/Full.', res);
                            break;
                        }
                    case "oAuth":
                        {
                            this.sendResponse('Oauth request '+JSON.stringify(params), res);
                            break;
                        }
                    case "close":
                        {

                            var tabIndexToClose = params['value'];
                            var statusToPush = params['status'];

                            util.publish('/status/UIController/manual/status/change',params['status']);

                            if (tabIndexToClose === 'current')
                                util.publish('/tab/controller/close/active');
                            else
                                util.publish('/tab/controller/close/tab/', {
                                    source: 'HTTPServerModule',
                                    isForce: false,
                                    tabIndex: tabIndexToClose
                                });

                            this.sendResponse('status updation in progress.', res);
                            
                            break;
                        }
                    case "updateStatus":
                        {
                            this.log('"case:updateStatus" Http Port 7056 recieved : ' + params["value"]);
                            util.publish('/status/UIController/manual/status/change', params['value']);
                            this.sendResponse('status updation in progress.', res);
                            break;
                        }
                    case "dial":
                        {
                            util.publish('/util/v2/dialNumber', params['value']);
                            this.sendResponse('Dial out done for.', res);
                            break;
                        }
                    case "closeJSON":
                        {

                            util.publish('/status/UIController/manual/status/change', params['status'], parsedObj.originalEvent);

                            util.publish('/tab/controller/close/tab/', {
                                source: parsedObj.source,
                                isForce: false,
                                tabIndex: parsedObj.tabIndex
                            });

                            this.sendResponse('tab close', res);
                            break;
                        }
                    case "updateStatusJSON":
                        {
                            /**
                             * params = {
                             *     value = <json>
                             *     controller = <caseName>
                             * }
                             */
                            util.publish('/status/UIController/manual/status/change', parsedObj['status'].pushStatus, parsedObj.originalEvent);

                            this.sendResponse('status updation in progress.', res);
                            break;
                        }

                    case "dialJSON":
                        {
                            util.publish('/util/v2/dialNumber', params['value']);
                            this.sendResponse('Dial out done for.', res);
                            break;
                        }
                    case "loadURL":
                        {
                            util.loadURL(params['url']);
                            util.windowEvents.show(namespace.CONTAINER_SB);
                            this.sendResponse('URL['+params['url']+'] loaded in tab, successfully', res);
                            break;
                        }
                    default:
                        {
                            this.sendResponse('default response executed.', res);
                            break;
                        }
                }
            }
        };
        /*
         *  Receives event to close http server.
         */
        R['serverModule'] = serverModule;
        util.subscribe('serverModule/stop', serverModule, serverModule.stop);
    } catch (serverModuleExcep) {
        console.error("Exception in serverModule.js ", serverModuleExcep);
        console.error("Exception in serverModule.js ", serverModuleExcep.stack);
    }
    module.exports = serverModule;
})(this, util);