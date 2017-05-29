/**
 * WebApplication communication api
 * @param  {[type]} root      [description]
 * @param  {[type]} undefined [description]
 * @return {[type]}           [description]
 */
(function(root, undefined) {
    /**
     *
     * Captilizing the first word in the character
     * extending it to string prototype object.
     **/
    root.onkeydown = function keyDownCB(e) {
        if (navigator.userAgent.indexOf("Tc-webkit") !== -1 && navigator.userAgent.indexOf("Electron") == -1) {
            switch (e.keyCode) {
                case 8:
                    {
                        var el = e.view.document.activeElement;
                        if (!el.isContentEditable && (["input", "textarea"].indexOf(el.tagName.toLowerCase()) === -1 || ['button', 'checkbox', 'radio'].indexOf(el.type.toLowerCase()) !== -1)) {
                            e.cancelBubble = true;
                            e.preventDefault();
                            e.defaultPrevented = true
                        };
                        break;
                    }
                default:
                    {
                        // if in case needed push all the events to top frame, based on embedded check.
                        break;
                    }
            }
        }
    };

    String.prototype.initCap = function() {
        return this.toLowerCase().replace(/(?:^|\s)[a-z]/g, function(m) {
            return m.toUpperCase();
        });
    };

    function generateRandomId() {
        return Math.floor(Math.random() * 1E10 + 1);
    }

    /**
     *
     * Check whether argument 'n'
     * is a number, ganked from jquery.
     **/

    function isNumber(nVal) {
        nVal = (typeof nVal == 'string') ? parseInt(nVal) : nVal;
        return typeof nVal === "number" && isFinite(nVal) && nVal > -9007199254740992 && nVal < 9007199254740992 && Math.floor(nVal) === nVal;
    }

    /**
     *
     * Trigger events.
     *
     **/

    function trigger_events(key_code) {
        if ($) {
            var _trigger_event = $.Event("keydown", {
                keyCode: key_code
            });
            $(document).trigger(_trigger_event);
        }
    }

    /**
     *
     * Provides a object, based on argument
     * 'url' returns {url,param} object.
     **/

    function getCompleteRequest(url) {
        var location = {},
            keyValue = {};
        if (url.indexOf('?') !== -1) {
            var lUrl = url.split('?');
            location.url = lUrl[0]; // href URL.
            lUrl = lUrl[1].split('&');
            for (var i = lUrl.length - 1; i >= 0; i--) {
                var key, value;
                key = lUrl[i].split('=')[0]
                value = lUrl[i].split('=')[1]
                if (key)
                    keyValue[key] = value;
            };
        } else
            location.url = url;

        if (Object.keys(keyValue).length)
            location.param = keyValue;
        return (location);
    }

    /**
     *
     * Access modifier, names are given
     * based on assuming knowledge of oops.
     * protecting the public objects and properties
     * which is exposed in API.
     **/

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

    /**d
     *
     * Available Operation types.
     *
     **/

    var operationTypes = {
        status: "status",
        outbound: "outbound",
        close: "close"
    };

    /**
     *
     * Communication container object
     * namespace in object, helps in identifying
     * the operation to be performed on
     * fullclient container.
     **/

    var containerApi = {
        name: "chromeAppAPI",
        opt: operationTypes,
        applicationName: window.location.hostname,
        status: {
            name: "status",
            pushStatus: null
        },
        outbound: {
            name: "outbound",
            phoneNumber: null
        },
        close: {
            name: "close",
            tabIndex: null
        },
        logACK: {
            name: 'logACK',
            ack: true,
            host: window.location.hostname
        },
        logs: {
            name: 'logs',
            logObj: null
        }
    };

    /**
     *
     * Private object, facade pattern
     * behind the public api chromeAppApi object.
     **/

    var communicationAPI = {
        port: 7056,
        container: {
            source: null,
            tabIndex: null,
            origin: '*'
        },
        initializeContainer: function(source, origin, init) {

            if (!this.isContainerHandleAvailable()) {
                this.container.source = source || null;
            }

            if (init.opt && (init[init.opt] && init[init.opt].tabIndex)) {
                this.container.tabIndex = init[init.opt].tabIndex;
            };

            this.container.origin = origin || '*';

        },
        init: function(event) {
            this.initializeContainer(event.source, event.origin, event.data);
        },
        isContainerHandleAvailable: function() {
            return this.container.source ? true : false;
        },
        isHttps: function() {
            if (location.protocol === "https:") return true;
            else if (location.protocol === "http:") return false
        },
        ajaxCall: function(url) {

            if (!url) {
                return false;
            }

            if (this.isHttps()) {
                /**
                 *
                 * Mixed mode content, in firefox
                 * is restricted to do a ajax call from https
                 * protocol to http
                 *
                 * workaround.
                 **/
                var randomVal = generateRandomId();
                console.log(" Mixed Content routine is working....." + randomVal);
                var script = document.createElement("img");
                script.setAttribute("src", url);
                script.setAttribute("id", "_mixedMode" + randomVal);
                document.body.appendChild(script);
                document.body.removeChild(document.getElementById("_mixedMode" + randomVal));
                return true;
            }

            var xmlhttp = new XMLHttpRequest;
            xmlhttp.open("GET", url, true);
            xmlhttp.send()


            console.info('XMLHttp Call : ' + url);

            return true;
        },
        xul_routines: function(operation, operationValue) {
            var url;
            if (operation && operationValue) {
                switch (operation) {
                    case 'status':
                        {
                            /**
                             * This is how XUL TC accepts 'Available' to 'available'
                             * :( patch. all other status are with initCap.
                             **/
                            url = 'http://127.0.0.1:7055/?isC3call=true&status=';
                            (operationValue == 'Available') ? url += 'available' : url += operationValue;
                            break;
                        }
                    case 'dial':
                        {
                            url = 'http://127.0.0.1:7055/?isC3call=true&status=Dail&c3DialNumber=' + operationValue;
                            break;
                        }
                    case 'close':
                        {
                            url = 'http://127.0.0.1:7055/?isC3call=true&status=close';
                            /**
                             *
                             * XUL only accepts only two calls.
                             * kept this method just in case.
                             *
                             **/
                            if (operationValue !== 'dummy')
                                this.xul_routines('status', operationValue);
                            break;
                        }
                    default:
                        {
                            break;
                        }
                }
                this.ajaxCall(url);

                return true;
            }
            return false;
        },
        browser_routines: function(operation, operationValue) {
            var url;
            if (operation && operationValue) {
                switch (operation) {
                    case 'status':
                        {
                            url = 'http://localhost:' + this.port + '/?controller=updateStatus&value=';
                            url += operationValue.initCap();
                            break;
                        }
                    case 'dial':
                        {
                            url = 'http://localhost:' + this.port + '/?controller=dial&value=';
                            url += operationValue;
                            break;
                        }
                    case 'close':
                        {
                            /**
                             *
                             * Intercept has to be done and changes
                             * should be present in close block.
                             **/

                            url = 'http://localhost:' + this.port + '/?controller=close&value=';
                            url += operationValue;
                            break;
                        }
                    default:
                        {
                            break;
                        }
                }
                this.ajaxCall(url);

                return true;
            }
            return false;
        },
        postMessage: function(message) {
            if (this.isContainerHandleAvailable() && message) {
                this.container.source.postMessage(message, this.container.origin);
                return true;
            }
            return false;
        },
        statusPush: function(status) {
            if (!status)
                return false;

            containerApi.opt = "status";
            containerApi[containerApi.opt].pushStatus = status;

            if (this.isContainerHandleAvailable()) {
                this.postMessage(containerApi);
            } else if (Electron.isElectron()) {
                Electron.post(containerApi, 'v2');
            }
            // URLFetch routine to the port.
            else {
                // webBrowser url fetch routine.
                this.browser_routines('status', status);
                // XUL routine
                this.xul_routines('status', status);
            }
            return true;
        },
        dial: function(phoneNumber) {

            if (!isNumber(phoneNumber))
                return false;

            containerApi.opt = "outbound";
            containerApi[containerApi.opt].phoneNumber = phoneNumber;

            if (this.isContainerHandleAvailable()) {
                this.postMessage(containerApi);
            } else if (Electron.isElectron()) {
                Electron.post(containerApi, 'v2');
            } else {
                this.browser_routines('dial', phoneNumber);
                this.xul_routines('dial', phoneNumber);
            }
            return true;
        },


        closeTab: function(optionalStatus) {
            var tabIndex = null;

            /**
                *
                * Get TabIndex from

                  - URL_queryString
                  - parent ObjmessageSystemObject
                  - or default to 'current'

                *
                **/

            // TabIndex taken from init message
            (!tabIndex && this.container.tabIndex) ? tabIndex = this.container.tabIndex: false;

            // queryString has to be written
            if (!tabIndex && location.href) {
                var tmp = getCompleteRequest(location.href);
                tabIndex = (tmp.param) ? tmp.param.currentTabIndex : false;
            }

            // TabIndex obtained from parent window messave object.
            if (!tabIndex && window.parent && (window.parent.location.origin &&
                    (window.parent.location.origin.indexOf("sb.a-cti.com") !== -1 && window.parent.ObjmessageSystem))) {
                tabIndex = window.parent.ObjmessageSystem.getCurrentTabIndex();
            }

            // defaults to 'current'
            (tabIndex) ? false: tabIndex = 'current';

            containerApi.opt = "close";
            if (optionalStatus) {
                containerApi['status'].pushStatus = optionalStatus;
            }
            containerApi['close'].tabIndex = tabIndex;

            if (this.isContainerHandleAvailable()) {
                this.postMessage(containerApi);
            } else if (Electron.isElectron()) {
                Electron.post(containerApi, 'sb');
            } else {

                if (optionalStatus) {
                    tabIndex += '&status=' + optionalStatus
                }

                this.browser_routines('close', tabIndex); // normal routine
                this.xul_routines('close', optionalStatus || 'dummy'); // XUL routine

            }

            return true;
        },
        proxy: function(event) {
            // console.check('FULLClientAPI received a Message ',event.data);
            communicationAPI.listener(event);
        },
        listener: function(event) {
            /**
             *
             * Incoming message listener
             * TODO
             **/
            var evt = event;
            switch (evt.data.name) {
                case 'init':
                    {
                        /**
                         *
                         * Initialization is accomplished
                         * save the source and origin from
                         * the message information.
                         *
                         **/
                        this.init(evt);
                        break;
                    }
                case 'setV2status':
                    {
                        chromeAppApi._setV2Status(evt.data);
                        break;
                    }
                case 'FULLClient':
                    {
                        this.init(evt);
                        break;
                    }
                case '_event':
                    {
                        trigger_events(evt.data.keyCode);
                        break;
                    }
                case 'captureLogs':
                    {
                        if (!this.isContainerHandleAvailable()) {
                            this.init(evt);
                        }
                        var uniqueId = evt.data[evt.data.opt].uniqueId;

                        /**
                         *
                         * a. Immediate handshake response should be sent back.
                         * b. Logs should be collected from indexed DB
                         * c. logJson should be sent to FULLClient Listener
                         *
                         **/

                        console.check(' - Received captureLogs request - ' + location.host + ', unique:  ' + uniqueId);
                        // call logDB api to collect logs.
                        if (typeof kDebug == 'object' && uniqueId) {

                            containerApi.opt = 'logACK';
                            containerApi['logACK'].id = uniqueId;
                            this.postMessage(containerApi); // Handshake sent.

                            console.check(' - SentSuccess captureLogs request ACK - ' + location.host);
                            /**
                             *
                             * param1 = uniqueId for each feedback
                             * param2 = callback function
                             * param3 = context for invocation
                             *
                             **/

                            kDebug.getLogs(uniqueId /* unqiueId */ , function cb(_logObj) {
                                containerApi.opt = 'logs';
                                // original
                                // containerApi['logs'].id = uniqueId;
                                // containerApi['logs'].logObj = _logObj;


                                containerApi['logs'] = _logObj


                                this.postMessage(containerApi); // send the parsed logs to app.
                                //original
                                // containerApi['logs'].logObj = null;
                                containerApi['logs'] = null;

                            } /* callback */ , communicationAPI /* context */ );
                        }

                        break;
                    }
                default:
                    {
                        break;
                    }
            }
        }
    };

    var Electron = {
        name: "ElectronAPI",
        log: function() {
            // var tmp = [];
            // for (var i = arguments.length - 1; i >= 0; i--) {
            //     tmp[i] = arguments[i];
            // };
            // tmp.splice(0, 0, '[' + this.name + '] : ');
            console.debug.apply(console, tmp);
        },
        isElectron: function() {
            return navigator.userAgent.indexOf('Electron') !== -1
        },
        isValid: function(msg) {
            return msg && typeof msg == 'object' ? msg : false;
        },
        getContainer: function(title) {
            /**
             * We are directly passing messages to respective containers
             * in electron we have defined a preload which can directly
             * send  messages to container via main
             *
             * ex : main.js -> <container-name> -> <webview> -> <webApp>
             *
             * status : v2Container
             * account :{
             *      load -> sbContainer
             *      unload -> sbContainer
             * }
             */
            var containerName, ipcName;
            switch (title) {
                case "v2":
                    {
                        containerName = "msg-to-V2";
                        ipcName = "sendToV2";
                        break;
                    }
                case "chat":
                    {
                        containerName = "msg-to-CHAT";
                        ipcName = "sendToCHAT";
                        break;
                    }
                default:
                    {
                        containerName = "msg-to-FULL";
                        ipcName = "sendToSB";
                        break;
                    }
            }
            return {
                ipcFnName: ipcName,
                channel: containerName
            };
        },
        post: function(msg, title) {
            if (!this.isElectron() || typeof msg !== "object") {
                /**
                 * Application is not running in Electron container,
                 * So browser based postmessage will work.
                 */
                return false;
            }
            var lContainer = this.getContainer(title);
            /**
             * via IPC
             * Directly we could send this info to v2Container, instead of
             * loop around between containers.
             *
             * IPC between containers are possible , but messaging would follow
             * "main" -> <container> -> pushedMessage
             *
             * Check preload.js in Tc-Webkit project, "Electron" branch
             *
             * https://github.com/Adaptavant/TC-Webkit/tree/electron
             *
             */
            if (window.FULLClient && FULLClient.ipc && this.isValid(msg)) {
                /**
                 * sbContainer fn would be "sendToFULL" -> FULLClient.ipc.sendToFULL(<jsMessageObject>);
                 * v2Container fn would be "sendToV2" -> FULLClient.ipc.sendToV2(<jsMessageObject>);
                 * chatContainer fn would be "sendToCHAT" -> FULLClient.ipc.sendToCHAT(<jsMessageObject>);
                 */
                FULLClient.ipc[lContainer.ipcFnName](msg);
            }
            /**
             * via node-js and Electron IPC
             * more direct way
             */
            else if (window.require && window.process) {
                var ipc = require('electron').ipcRenderer;
                ipc.send(lContainer.channel, msg);
            }
            /**
             * via PORT 7056
             */
            else {
                console.debug('FALLBack Mechanism 7056 port !!!! ');
                $.post('http://localhost:7056/controller=' + lContainer.channel + '&value=' + JSON.stringify(msg));
            }
        },
        proxy: function() {
            Electron.messageHandler.apply(Electron, arguments);
        },
        messageHandler: function(message) {
            var e = message.detail;
            switch (e.name) {
                case 'init':
                    {
                        this.log('init msg : ', e);
                        break;
                    }
                case 'setV2status':
                    {
                        chromeAppApi._setV2Status(e);
                        break;
                    }
                case '_event':
                    {
                        trigger_events(e.keyCode);
                        break;
                    }
                default:
                    break;
            }
        }
    };

    root.addEventListener('message', communicationAPI.proxy)
    root.addEventListener('ElectronMessage', Electron.proxy)
        /**
         *
         * Public api exposed to window
         * object for the users.
         **/

    var chromeAppApi = {
        _status: false,

        getV2Status: function() {
            return this._status;
        },

        _setV2Status: function(msg) {
            var state = (msg && msg[msg.opt]) ? msg[msg.opt].status : false;
            if (state) {
                this._status = state;
                return true
            }
        },
        push: function(actionValue, action) {
            /**
            *
            * Status : 'Available,Break,Outbound,Break3'
            * Action : 'close/status/dial'

            status action , perform status push to application
            close action , perform close tab action based on tabIndex or currentActiveTab
            dial action , perform dial out's

            **/
            if (action)
                action = action.toLowerCase();

            switch (action) {
                case 'status':
                    {
                        communicationAPI.statusPush(actionValue)
                        break;
                    }
                case 'dial':
                    {
                        communicationAPI.dial(actionValue);
                        break;
                    }
                case 'close':
                    {
                        communicationAPI.closeTab(actionValue);
                        break;
                    }
                case 'post':
                    {
                        communicationAPI.postMessage(actionValue);
                        break;
                    }
                default:
                    {
                        /**
                        *
                            - actionValue number = dial
                            - actionValue status = push status
                        *
                        **/

                        if (isNumber(actionValue)) {
                            communicationAPI.dial(actionValue);
                        } else {
                            communicationAPI.statusPush(actionValue)
                        }
                        break;
                    }
            }
        },
        getDevBackDoorContext: function() {
            return {
                communication: communicationAPI,
                queryUrl: getCompleteRequest,
                messagePassingApi: containerApi,
                modifiers: accessModifier
            }

            /**
             *
             * Experimental
             * give a backdoor access to modify
             * methods to find a bug routine or fix Test
             *
             **/

            // var _a = prompt();
            // var _t = '';

            // for (var i = 0; i < _a.length; i++) {
            //     _t += _a.charCodeAt(i).toString(2);
            // }

            // if (Number(_t).valueOf() === 1000000100100100100) {
            //     return {
            //         communication: communicationAPI,
            //         queryUrl: getCompleteRequest,
            //         messagePassingApi: containerApi,
            //         modifiers: accessModifier
            //     }
            // }
        }
    }

    /**
     *
     * Public exposed api,
     * modification of public methods in
     * api is stopped.
     **/

    root['chromeAppApi'] = chromeAppApi;

    Object.defineProperty(root, 'chromeAppApi', accessModifier.protected);

    Object.defineProperties(chromeAppApi, {
        'push': accessModifier.protected,
        'getV2Status': accessModifier.protected,
        'getDevBackDoor': accessModifier.private
    });

    // console.log("chrome_app_api version 0.1.6 Mar_09_2015 11:45 AM IST\nUSAGE:\n * chromeAppApi.push( 'Available' , 'close' ); // Changes status and closes tab in container.\n * chromeAppApi.push( 'Break/Offline/System/Available','status' ) // Changes status to break without closing tab in container.\n * chromeAppApi.push( '1234567890' , 'dial' ); // Outbound dial out from v2 controll panel.")

}(this));