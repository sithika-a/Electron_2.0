console.log('Chat container...', nwUserAgent);

/**
 * Developer shortcut
 */

// TODO : 1 , Add Shortcuts code

((R, util, FULLClient) => {

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
                            util.publish('/clientlistener/handler/', msg);
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
    var chat = {
        name : 'chatModule',
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
                moduleName: namespace.moduleName.chat,
                actionType: 'getState',
                opt: namespace.channel.CONTAINER_CHAT
            }
            sendMessage.toMain(commObj)
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
            util.publish('/util/window/events/show', namespace.channel.CONTAINER_CHAT);
            var chatView = this.getView()
            if (chatView) chatView.reload();
        },
        registerMouse: function() {
            util.mouse.registerCB(this.mouseMenu, this);
        },
        onbeforeunload: function(e) {
            function onQuit() {
                if (util.platform.isWin()) {
                    console.log('minimizing window...')
                        // windows should minimize
                    util.publish('/util/window/events/minimize', namespace.channel.CONTAINER_CHAT);
                } else {
                    // All other platforms
                    console.log('Hiding window...')
                    util.publish('/util/window/events/hide', namespace.channel.CONTAINER_CHAT);
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
                return chat.isQuitable; // false
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
                .done(() => {
                    console.log('Posting to webview ... ',obj)
                    var dom = chat.getView();
                    if (dom && obj) {
                        dom.send('webapp-msg', obj);
                    }
                });
        },
         postToBackground(message) {
            if (message && message.actionType) {
            sendMessage.toMain(message)
            }
        },
        setBadge(count) {
            if (util.platform.isWin()) {
                msg[msg.opt].count ? util.showBadgeLabel(msg[msg.opt].count.toString()) : util.showBadgeLabel('');
            } else {
                this.postToBackground({
                    moduleName: this.name,
                    title: namespace.channel.CONTAINER_CHAT,
                    actionType: `setBadge`,
                    opt: null,
                    count: count || 0
                })
            }
        },
        bounce(isContinuous) {
            this.postToBackground({
                moduleName: this.name,
                title: namespace.channel.CONTAINER_CHAT,
                actionType: `windowEvents`,
                opt: `bounce`,
                paramObj: {
                    isContinuous: isContinuous,
                    platform: util.platform.isMac() ? `darwin` : `win`
                }
            })
        },
        sendToHost: function() {
            messenger.broadCast(namespace.channel.Mediator, msg);
        },
        init() {
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
        createChatFrame(url) {
            var chatDom = new WebviewProxy("chat_webview", url, "FULLClient:Chat");
            chatDom.setContentloaded(chat.onload);
            this.getOuterDiv().html(chatDom.getView());
        },
        messageListener(event) {

            console.log('Message received as ', event);
            if (event && event.data && event.data.info) {
                msgModule.handler.call(msgModule, event.data.info)
            }
        }
    }


    emitter.subscribe(namespace.channel.CHAT, chat.messageListener);

    util.subscribe('/chat/postToWebview', chat, chat.postToWebview);
    util.subscribe('/chat/reloadChat', chat, chat.reloadchat);
    util.subscribe('/chat/getState', chat, chat.send_state);

    util.subscribe(`chat/setBadge`, chat, chat.setBadge);
    util.subscribe(`chat/bounce`, chat, chat.bounce);

    util.subscribe('/chat/quit/flag', chat, chat._canQuit);
    util.subscribe('/chat/start', chat, chat.init);

})(this, util, FULLClient);