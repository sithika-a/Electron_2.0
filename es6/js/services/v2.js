$(document).ready(function() {

    window.addEventListener("dragover", function(e) {
        event.preventDefault();
        return false;
    }, false);

    window.addEventListener("drop", function(e) {
        event.preventDefault();
        return false;
    }, false);

    process.on('uncaughtException', function(err) {
        console.log(err);
    });

    console.debug('Onload event is fired in v2 window !!! ');
    v2.init();

    util.publish('module/controller/onload');
});

jQuery(window).bind('resize', jQuery.debounce(20, false, function(event) {
    v2.getOuterDiv().height(window.innerHeight);
}))


var newV2 = {
    isOn: false,
    // mouseMenu: function(evt) {
    //     if (evt && evt.menu) {
    //         document.querySelector('#v2webviewNew')[evt.menu]();
    //     }
    // },
    // registerMouse: function() {
    //     util.mouse.registerCB(this.mouseMenu, this);
    // },
    init: function() {

        // v2.hideOldV2Frame();

        // var v2View = document.querySelector('#v2webviewNew');
        // if (v2View) {
        //     v2View.reload();
        // } else {
        //     var c3Webview = new WebviewProxy('v2webviewNew', v2.getV2Url(FULLClient.getConfig().v2.new), 'FULLClient:v2');
        //     v2.getOuterDiv().height(window.innerHeight);
        //     v2.getOuterDiv().html(c3Webview.getView());
        //     // c3Webview.setNodeIntegration();
        //     newV2.registerMouse();
        // }
    }
}

var v2 = {
    outerDiv: null,
    isQuitable: false,
    name: 'v2MsgHandler',
    log: function() {
        util.log.apply(this, arguments);
    },
    getOuterDiv: function() {
        if (!this.outerDiv)
            this.outerDiv = $('#v2Container');
        return this.outerDiv;
    },
    clearAmazonCookies: function() {
        return util.cookies.remove('amazon.com');
    },
    stopV2Notification: function() {
        // write a exectue script function to handle
        // this injection into their frame.
        function executeScript() {
            console.warn('Execute script : ' + location.href);
            var c = document.querySelectorAll('iframe')[0]
            c.contentWindow
                .document
                .body
                .querySelectorAll('iframe#embeddedSoftphoneIframe')[0]
                .contentWindow
                .Notification = function() { console.warn('We have prevented the Notification') };
        }
        document.querySelector('webview#v2webview')
            .executeJavaScript('(' + executeScript.toString() + '())');
    },
    getV2Url: function(str) {
        str = str.replace(/^http:/, 'https:');
        str += str.includes('?') ? '&' : '?';
        str += 'mode=' + FULLClient.getMode();
        return str;
    },
    embedWebview: function() {
        var v2View = document.querySelector('#v2webview');
        if (v2View) {
            v2View.reload();
        } else {
            var c3Webview = new WebviewProxy('v2webview', v2.getV2Url(FULLClient.getConfig().v2.old), 'FULLClient:v2');
            v2.getOuterDiv().height(window.innerHeight);
            v2.getOuterDiv().html(c3Webview.getView());
            c3Webview.setNodeIntegration();
            v2.registerMouse();
            v2.addListener();
            v2.onClose();
        }
    },
    init: function() {
        /**
         * We should clear the cache,
         * before closing instead doing at the start
         * TODO.
         */
        this.removeOldV2Frame();
        this.clearAmazonCookies();

        function init() {
            var v2View = document.querySelector('#v2webview');
            if (v2View) {
                v2View.reload();
            } else {
                var c3Webview = new WebviewProxy('v2webview', v2.getV2Url(FULLClient.getConfig().v2.old), 'FULLClient:v2');
                v2.getOuterDiv().height(window.innerHeight);
                v2.getOuterDiv().html(c3Webview.getView());
                c3Webview.setNodeIntegration();
                v2.registerMouse();
                v2.addListener();
                v2.onClose();
            }
        }
        util.subscribe('/app/cookies/cleared', init);
    },
    addListener: function() {
        var webview = document.querySelector('#v2webview');
        webview.addEventListener('did-get-redirect-request', function(evt) {
            webview.style.width = webview.style.height = '0%';
            $('#v2Container').css({ background: 'grey' });
            $('.popup').show();
            FULLClient.ipc.sendToSB({
                name: 'v2Communication',
                opt: 'pageRedirect',
                isMainFrame: evt.isMainFrame
            });
        });
    },
    openNewWindow: function(e) {
        console.log('Warn : ', e);
        if (e && e.url) {
            // we will by default load them up in browser
            util.loadWebSiteInBrowser(e.url);
            return true;
        }
    },
    reloadV2: function() {
        this.log('reloading v2');
        newV2.isOn = false;
        this.removeOldV2Frame();
        this.clearAmazonCookies();
        this.showOldV2Frame();
        this.embedWebview();
        util.caching.windows.getV2().focus();
        // show chat container
        util.windowEvents.show(namespace.CONTAINER_V2);
        if (/win/.test(process.platform))
            util.windowEvents.focus(namespace.CONTAINER_V2);
    },
    mouseMenu: function(evt) {
        if (evt && evt.menu) {
            document.querySelector('#v2webview')[evt.menu]();
        }
    },
    registerMouse: function() {
        util.mouse.registerCB(this.mouseMenu, this);
    },
    removeOldV2Frame: function() {
        $('#v2webview').remove();
    },
    hideOldV2Frame: function() {
        $('#v2webview')
            .css({ 'visibility': 'hidden' })
    },
    showOldV2Frame: function() {
        $('#v2Container').siblings('.popup').hide();
        $('#v2webview')
            .css({ 'visibility': '' })
    },
    onbeforeunload: function(e) {
        if (!v2.isQuitable) {
            util.publish('/util/window/events/hide', namespace.CONTAINER_V2);
            return v2.isQuitable;
        } else return undefined;
    },
    onClose: function() {
        /**
         *
         * OnBeforeUnload will stop the window from closing in Electron.
         * http://electron.atom.io/docs/v0.28.0/api/browser-window/
         **/
        window.onbeforeunload = this.onbeforeunload;
    },
    postToC3: function(obj) {
        var dom;
        if (newV2.isOn) {
            dom = document.getElementById('v2webviewNew');
        } else {
            dom = document.getElementById('v2webview')
        }
        if (dom) dom.send('webapp-msg', obj);
    }
};


(function(R, util) {

    var apiHandler = {
        name: 'apiHandler',
        log: function() {
            util.log.apply(this, arguments);
        },
        passOrginalEvent: function(obj) {
            util.publish('/util/v2/push/original/event', obj);
        },
        dial: function(dialInfo) {
            if (dialInfo && dialInfo.phoneNumber) {
                util.publish('/util/v2/dialNumber', dialInfo.phoneNumber);
            }
        },
        pushStatus: function(sInfo) {
            if (sInfo && sInfo.pushStatus) {
                util.publish('/util/v2/statusPush', {
                    status: sInfo.pushStatus
                });
            }
        },
        handler: function(msg) {
            switch (msg.opt) {
                case "status":
                    {
                        msg.originalEvent ?
                        this.passOrginalEvent(msg.originalEvent) : this.pushStatus(msg['status']);
                        break;
                    }
                case "outbound":
                    {
                        msg.originalEvent ?
                        this.passOrginalEvent(msg.originalEvent) : this.dial(msg['outbound']);
                        break;
                    }
                default:
                    {
                        break;
                    }
            }
        }
    };

    // Inter process messaging.
    var application = {
        handler: function(msg) {
            console.log(' application ipc  ', msg);
            switch (msg.opt) {
                case "close":
                    {
                        if (msg[msg.opt].appname == 'v2container') {
                            // remove the webview and hide the container.
                            v2.hideOldV2Frame();
                            // v2.stopV2Notification();
                            util.caching.windows.getV2().hide();
                        }
                        break;
                    }
                default:
                    // statements_def
                    break;
            }
        }
    }

    var msgModule = {
        name: 'MessageModule',
        log: function() {
            util.log.apply(this, arguments);
        },
        proxy: function() {
            msgModule.handler.apply(msgModule, arguments);
        },
        handler: function() {
            var msg = arguments[0].name ? arguments[0] : arguments[1];
            var name = msg.name ? msg.name.toLowerCase() : false;
            switch (msg.name) {
                case "v2Communication":
                    {
                        if (/statusPush/.test(msg.opt)) {
                            console.debug('setting v2 status to [' + msg[msg.opt] + ']');
                        }
                        v2.postToC3(msg);
                        break;
                    }
                case "Application":
                    {
                        application.handler(msg);
                        break;
                    }
                case "reLogin":
                    {
                        v2.isQuitable = true;
                        window.close();
                        break;
                    }
                case "captureLogs":
                    {
                        v2.postToC3(msg);
                        break;
                    }
                case "reloadV2":
                    {
                        v2.reloadV2();
                        break;
                    }
                case "chromeAppAPI":
                    {
                        apiHandler.handler(msg);
                        break;
                    }
                case "appQuit":
                    {
                        $('webview').remove();
                        window.removeEventListener("beforeunload", v2.onbeforeunload);
                        v2.isQuitable = true;
                        //pushing V2closed event to analytics
                        util.analytics.push(null, analytics.V2_CLOSED, null, 'v2Container is closed');
                        window.close();
                        break;
                    }
                case "crashReporter":
                    {
                        util.publish('/util/crashreporter/set/port', msg.port);
                        break;
                    }
                default:
                    {
                        msgModule.log('Default Sequence Capture this : ', msg);
                        break;
                    }
            }
        }
    }
    var ipc = FULLClient.require('electron').ipcRenderer;
    ipc.on('msg-to-V2', msgModule.handler);

    util.subscribe('/msgModule/handler/', msgModule, msgModule.handler);
    util.subscribe('/open/browse/private/window', v2, v2.openNewWindow);

})(this, util);