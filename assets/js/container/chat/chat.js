console.log('Chat container...', nwUserAgent);
/**
 * Developer shortcut
 */

// TODO : 1 , Add Shortcuts code

(function(R, util) {

    var clientlistener = {
        handler: function(msg) {
            console.log('handler :',msg)
            var val = msg.opt.trim();
            switch (val) {
                case 'accessToken':
                    {
                        console.log('Setting Access Token ', msg[msg.opt].token);
                        userDAO.setAccessToken(msg[msg.opt].token)
                        break;
                    }
                case "showUpdatePopup":
                    {
                        util.publish('updateUI/guestPage/msgHandler', msg[msg.opt])
                        break;
                    }
                case "readFromClipboard":
                    {
                        chat.postToWebview(util.clipboard.read());
                        break;
                    }
                case "getv2status":
                    {
                        // when chat frame requesting for status
                        // of v2, we will get it from localstorage
                        // and send chatcontainer -> chatframe
                        var toChat = new Thinclient('v2Status');
                        toChat[toChat.opt].status = util.v2.getV2LastReceivedStatus();
                        chat.postToWebview(toChat);

                        break;
                    }
                case 'showsbcontainer':
                    {
                        util.publish('/util/window/events/show', namespace.channel.CONTAINER_SB);
                        break;
                    }
                case 'toGuestPage':
                    {
                        chat.postToWebview(msg);
                        break;
                    }
                case 'setv2status':
                    {
                        //Forwarding status to SB container...
                        FULLClient.emitter.sendToSB(msg);
                        break;
                    }
                case 'feedback':
                    {
                        var feedbackSend = new Application('collectfeedback');
                        console.log('Feedback text:', msg[msg.opt].text);
                        feedbackSend[feedbackSend.opt].userFeedback = msg[msg.opt].text;
                        feedbackSend[feedbackSend.opt].isFromChatModule = true;
                        feedbackSend[feedbackSend.opt].token = msg[msg.opt].token
                        FULLClient.emitter.sendToSB(feedbackSend);
                        break;
                    }
                case 'notify':
                    {
                        // route this msg to Notification API.
                        util.publish('/notification/create/show', msg);
                        break;
                    }
                case "clearCache":
                    {
                        console.log("ClearCache: user doing sign-out in chat window.");
                        FULLClient.emitter.sendToSB({
                            name: "analytics",
                            accountNumber: null,
                            eventAction: analytics.APP_CLEAR_CACHE,
                            connId: FULLClient.getMode() + " " + FULLClient.getManifest().version + " " + process.platform,
                            metaInfo: "Clearing Cache for App from chatwindow"
                        });
                        util.clear();
                        break;
                    }
                case 'show':
                    {
                        chat.postToBackground(namespace.channel.CONTAINER_CHAT, 'windowEvents', 'show');

                        break;
                    }
                case 'hide':
                    {
                        chat.postToBackground(namespace.channel.CONTAINER_CHAT, 'windowEvents', 'hide');

                        break;
                    }
                case "restart":
                    {
                        chat.reloadchat();
                        break;
                    }
                case 'quit':
                    {
                        /* Request from chat application to quit FC App*/
                        var commObj = {
                            name: 'appQuit',
                            sender: namespace.channel.CONTAINER_CHAT
                        };
                        FULLClient.emitter.sendToSB(commObj);
                        break;
                    }
                case 'getstate':
                    {
                        chat.send_state();
                        break;
                    }
                case "download":
                    {
                        util.publish('/file/download/Start/', msg[msg.opt]);
                        break;
                    }
                case 'badgelabel':
                case 'count':
                    {
                        if (/^win32/.test(process.platform))
                            msg[msg.opt].count ? util.showBadgeLabel(msg[msg.opt].count.toString()) : util.showBadgeLabel('');
                        else
                            chat.postToBackground(namespace.channel.CONTAINER_CHAT, 'setBadge', '', msg[msg.opt].count);
                        break;
                    }
                case 'requestattention': //needed for showing counts on new messsage arrived
                    {
                        if (/^darwin/.test(process.platform)) {
                            // var obj = {
                            //     eType: 'bounce',
                            //     opt: msg[msg.opt].isContinuous
                            // };
                            chat.postToBackground(namespace.channel.CONTAINER_CHAT, 'bounce', msg[msg.opt].isContinuous);
                        } else {
                            chat.postToBackground(namespace.channel.CONTAINER_CHAT, 'windowEvents', 'bounce');
                        }
                        break;
                    }

                case 'enableOnTop':
                    {
                        chat.postToBackground(namespace.channel.CONTAINER_CHAT, 'windowEvents', 'enableontop');
                        break;
                    }
                case 'restore':
                    {
                        chat.postToBackground(namespace.channel.CONTAINER_CHAT, 'windowEvents', 'restore');

                        break;
                    }
                case 'maximize':
                    {
                        chat.postToBackground(namespace.channel.CONTAINER_CHAT, 'windowEvents', 'maximize');
                        break;
                    }
                case 'disableOnTop':
                    {
                        chat.postToBackground(namespace.channel.CONTAINER_CHAT, 'windowEvents', 'disableontop');
                        break;
                    }
                case 'loadwebsite':
                    {
                        // send to sb
                        FULLClient.emitter.sendToMediator(msg);
                        break;
                    }
                default:
                    {
                        console.warn("Unknown routine in channel listener ", msg);
                        break;
                    }
            }
        }
    };

    var application = {
        handler: function(msg) {
            if (msg.opt) {
                switch (msg.opt) {
                    case "onFocus":
                        {
                            util.zoom.updateUIOnFocus(chat.getView());
                            break;
                        }
                    case "zoomIn":
                        {
                            util.zoom.zoomIn(chat.getView());
                            break;
                        }
                    case "resetZoom":
                        {
                            util.zoom.resetZoom(chat.getView());
                            break;
                        }
                    case "zoomOut":
                        {
                            util.zoom.zoomOut(chat.getView());
                            break;
                        }
                    case "checkForUpdates":
                        {
                            console.log('checkForUpdates');
                            util.publish('guestPage/checkUpdate/onMenuClick');
                            util.storage.set('update', {
                                checkForUpdates: true
                            });
                            break;
                        }
                    case "default":
                        {
                            console.log('Default capture in Application event', msg)
                            break;
                        }
                }
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
        handler: function(e) {
            var msg = arguments[0].name ? arguments[0] : arguments[1];
            var name = msg.name ? msg.name.toLowerCase() : false;
            console.log('Message Recieved asa: ',msg)
            switch (name) {
                case "fulloauth":
                    {
                        this.log('Recieved message on fulloauth block : ', msg);
                        util.publish('/app/loginModule/msg/recieved', msg);
                        break;
                    }
                case "oauth":
                    {
                        this.log('NEW oAuth implementation ', msg);
                        util.publish('/services/fullauth/get/user', msg.code, function cb(user) {
                            console.log('new oAuth callback called ', user);
                            util.publish('/app/loginModule/msg/recieved', {
                                contact: user
                            });
                        });
                        break;
                    }
                case "wipedata":
                    {
                        util.publish('/app/user/data/wipe');
                        break;
                    }
                case "relogin":
                    {
                        console.log('No Operation');
                        break;
                    }
                case "crashreporter":
                    {
                        util.publish('/util/crashreporter/set/port', msg.port);
                        break;
                    }
                case "capturelogs":
                    {
                        chat.postToWebview(msg);
                        break;
                    }
                case "application":
                    {
                        application.handler(msg);
                        break;
                    }
                case 'thinclient':
                    {
                        chat.postToWebview(msg);
                        break;
                    }
                case 'windowstate':
                    {
                        // Response from main Process which contains chat Window state object 
                        chat.postToWebview(msg);
                        break;
                    }
                case "appquit":
                    {
                        $('webview').remove(); // Removing all webview to fasten up app quit.
                        window.removeEventListener("beforeunload", chat.onbeforeunload);
                        chat.isQuitable = true;
                        window.close(); // Sync works faster, because
                        // next tick in event loop was causing 
                        // slow app close
                        break;
                    }
                case 'clientlistener':
                    {
                        clientlistener.handler(msg);
                        break;
                    }
                case 'setmode':
                    {
                        FULLClient.setMode(msg.mode);
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
    // var ipc = FULLClient.require('electron').ipcRenderer
    // ipc.on('msg-to-Chat', msgModule.handler.bind(msgModule));
    util.subscribe('/msgModule/handler/', msgModule, msgModule.handler);


})(this, util);

var chat = {
    toDropEvent: false,
    isQuitable: false,
    outerDiv: null,
    appurl: null,
    onloadDFD: $.Deferred(),
    initObj: {
        name: "init",
        opt: "chat",
        dcm: null,
    },
    name: 'chatMsgHandler',
    setZoomLevelLimits: function() {
        util.getCurrentWindow()
            .webContents
            .setZoomLevelLimits(1, 1);
    },
    onload: function() {
        chat.setZoomLevelLimits();
        chat.onloadDFD.resolve('Webview onload success');
        chat.postToWebview(chat.initObj);

        chat.registerMouse();

        // Experimental Implementation for changing terminal-notifier file permission. 
        // console.log("Checking terminal-notifier permission..!");
        util.publish("/notification/create/checkNotificationDependency");

        jQuery(window).bind('resize', jQuery.debounce(20, false, function(event) {
            console.log('On resize')
            chat.getOuterDiv().height(window.innerHeight);
        }));

        // window.addEventListener("drop", function(e) {
        //     console.log('*********** Drop ***********');
        //     // Keep a boolean workaround.
        //     chat.toDropEvent = true;
        // }, false);

        window.onfocus = function() {
            var webView = chat.getView();
            if (webView) {
                util.document.shadowRootFocus(webView)
                util.zoom.updateUIOnFocus(webView);
            }
        };
    },
    log: function() {
        util.log.apply(this, arguments);
    },
    _canQuit: function(flag) {
        this.isQuitable = flag;
    },
    getView: function() {
        return document.querySelector('webview#chat_webview')
    },
    send_state: function(opt) {
        var commObj = {
            eType: 'getState',
            opt: namespace.channel.CONTAINER_CHAT
        }
        util.publish(`/util/sendMessage/toMain`,commObj);
    },
    getOuterDiv: function() {
        if (!this.outerDiv)
            this.outerDiv = $('#chatContainer');
        return this.outerDiv;
    },
     getUrl: function() {
        if (this.appurl)
            return this.appurl
        else {
            console.log('getting url for chat  ? ', FULLClient.getConfig());
            // if (userDAO.getUser() && userDAO.getUser().email && FULLClient.getConfig() && FULLClient.getConfig().chat) {
                this.appurl = FULLClient.getConfig().chat + userDAO.getUser().email + '&uniquepin=' + userDAO.getCompanyId() + '&isSingleWindow=false';
                return this.appurl;
            // }
        }
    },
     mouseMenu: function(evt) {
        if (evt && evt.menu) {
            this.getView()[evt.menu]();
        }
    },
    reloadchat: function() {
        chat.postToBackground(namespace.channel.CONTAINER_CHAT, 'windowEvents', 'show');
        var chatView = this.getView()
        if (chatView) chatView.reload();
    },
    registerMouse: function() {
        util.mouse.registerCB(this.mouseMenu, this);
    },
    onbeforeunload: function(e) {
        console.log('onbefore unload is getting trigger ');

        function onQuit() {
            if (/^win/.test(process.platform)) {
                console.log('minimizing window...')
                    // windows should minimize
                chat.postToBackground(namespace.channel.CONTAINER_CHAT, 'windowEvents', 'minimize');
            } else {
                // All other platforms
                console.log('Hiding window...')
                chat.postToBackground(namespace.channel.CONTAINER_CHAT, 'windowEvents', 'hide');
            }
        };

        /* 
            Removed this code, bcoz event for page reloadin is not firing
            when drag and drop initiated on webview window.
        */

        // if (chat.toDropEvent) {
        //     onQuit();
        //     return (chat.toDropEvent = false);
        // } 

        if (!chat.isQuitable) {
            onQuit();
            return chat.isQuitable;
        } else {
            console.log('We are letting window to close ');
            return undefined;
        }
    },
    onClose: function() {
        /**
         *
         * OnBeforeUnload will stop the window from closing in Electron.
         * http://electron.atom.io/docs/v0.28.0/api/browser-window/
         **/
        // window.addEventListener("beforeunload", this.tmp);
        window.onbeforeunload = this.onbeforeunload;
    },
    postToWebview: function(obj) {
        this.onloadDFD
            .done(function() {
                console.log('Posting to webview ... ',obj)
                var dom = chat.getView();
                if (dom && obj) {
                    dom.send('webapp-msg', obj);
                }
            });
    },
    postToBackground: function(title, eType, opt, count) {
        var commObj = {
            title: title ? title : namespace.channel.CONTAINER_CHAT,
            eType: eType ? eType : false,
            opt: opt ? opt : false,
            count: count ? count : 0
        };
        if (commObj && commObj.eType) {
            FULLClient.emitter.sendToMain(commObj);
        }
    },
    sendToHost: function() {
        messenger.broadCast(namespace.channel.Mediator, msg);
    },
    init: function() {
        console.log('chat init ')
        chat._canQuit(false);
        this.initObj.dcm = JSON.stringify(userDAO.getUserDcmResponse());
        this.createChatFrame(this.getUrl());
        // this.onClose();
        // Making v2 object for laststatus
        // received null, we are getting status
        // from this object to send to chat.
        Locstor.set('v2', null);
    },
     createChatFrame: function(url) {
        var chatDom = new WebviewProxy("chat_webview", url, "FULLClient:Chat");
        chatDom.setContentloaded(chat.onload);
        this.getOuterDiv().html(chatDom.getView());
    },
    messageListener: function(event) {
        
        console.log('Message received as ', event);
    }
}


FULLClient.emitter.subscribe(namespace.channel.CHAT, chat.messageListener);

util.subscribe('/chat/quit/flag', chat, chat._canQuit);
util.subscribe('/chat/start', chat, chat.init);