/**
 *
 * softphone message
 * listeners
 *
 * API : http://amplifyjs.com/api/pubsub/
 **/

/**
 *
 * Test routine written for embedding iframe
 * with blob URL generated from response text after authorization
 *
 **/


// 1. Automatically detect inner app and send the status
// to application and quit it.

/**
*
* Todo :

a. communication api
b. eventing passage - done
c. inter communication
d. UI functionality - done
e. timer 
f. dom - done
g. start - done
h. stop switch - done
*
**/

(function(root, undefined) {
    var ipc = FULLClient.require('electron').ipcRenderer;
    try {
        function SoftPhoneComm(opt) {
            if (opt) {
                this.name = 'SoftPhoneComm';
                this.opt = opt;
                this.constructOperation(opt);
            }
        };

        SoftPhoneComm.prototype.constructOperation = function(opt) {
            /* body... */
            this[opt] = {};
            switch (opt) {
                case "init":
                    {
                        this[opt].name = 'init';
                        break;
                    }
                case "showWidget":
                    {
                        this[opt].name = 'showWidget';
                        break;
                    }
                case "hideWidget":
                    {
                        this[opt].name = 'hideWidget';
                        break;
                    }
                case "disconnectCall":
                    {
                        this[opt].name = 'disconnectCall';
                        break;
                    }
                case "adjustBackgroundColor":
                    {
                        this[opt].name = 'adjustBackgroundColor';
                        break;
                    }
                case "initiatingService":
                    {
                        this[opt].name = 'initiate';
                        break;
                    }
                case "restartService":
                    {
                        this[opt].name = 'restart';
                        break;
                    }
                case "terminateService":
                    {
                        this[opt].name = 'terminate';
                        break;
                    }
                default:
                    {
                        break;
                    }
            }
        };


        var logoutUI = {
            dom: {
                reloadV2: $('#reloadV2'),
                panel: $('.logoutPopup'),
                confirmation: $('#logout_confirmation'),
                out: $('#logging_out'),
                transparentBg: $('.black-screen')
            },
            logoutV2: function() {
                util.publish('/softphone/softPhoneStop');
                // when V2 is reloaded ,setFlag in LocStore
                Locstor.set('v2', Object.assign(Locstor.get('v2') || {}, {
                    loggedIn: false
                }));

                FULLClient.ipc.send({
                    "eType": "reloadV2",
                    "name": "reloadV2"
                });

                util.publish('/clear/status/timer');
                util.analytics.push(null, analytics.RELOAD_V2, null, 'v2Container getting Reloaded');

                return this.hideLogout();
            },
            showLoggingOutUI: function() {
                this.showBg();
                return this.dom
                    .panel
                    .show()
                    .children('#logging_out')
                    .removeClass('hide')
            },
            hideLoggingOutUI: function() {
                this.hideBg();
                return this.dom
                    .panel
                    .show()
                    .children('#logging_out')
                    .addClass('hide');
            },
            getLogoutDFD: function() {
                return this.logoutDFD;
            },
            setLogoutDFD: function(dfd) {
                return this.logoutDFD = dfd;
            },
            startLoggingOutDFD: function() {
                var self = this;
                var offlineDFD = $.Deferred();

                setTimeout(function() {
                    offlineDFD.resolve('timeout');
                }, (5 * 1000));

                this.setLogoutDFD(offlineDFD);
                this.hideLogout();
                this.showLoggingOutUI();

                util.publish('/status/UIController/manual/status/change', 'Offline');

                return $.when(offlineDFD)
                    .done(function() {
                        // updating v2login in localstorage
                        // just in case if in case of failure
                        // to collect new login for user
                        // it will take older/previous login
                        // and logs in v2.
                        userDAO.setV2Login({});
                        // new v2 switch.
                        v2Handler.setNewV2Flag(false);
                        self.logoutV2();
                        self.hideLoggingOutUI();
                    })
                    .fail(function() {
                        self.hideLoggingOutUI();
                    });
            },
            hideBg: function() {
                return this.dom
                    .transparentBg
                    .hide();
            },
            showBg: function() {
                return this.dom
                    .transparentBg
                    .show();
            },
            hideLogout: function() {
                this.hideBg();

                return this.dom
                    .panel
                    .hide()
                    .children('#logout_confirmation')
                    .addClass('hide');
            },
            updateText: function(text) {
                text = text || 'Are you sure, you want to logout?';
                var btnName = /reload/i.test(text) ? 'Reload' : 'Logout';
                this.dom
                    .panel
                    .show()
                    .children('#logout_confirmation')
                    .removeClass('hide')
                    .find('p')
                    .text(text)
                    .siblings()
                    .find('#logout')
                    .text(btnName);
                $('.btnRed').focus();
            },
            isOnCall: function(status) {
                if (status && /busy|pendingbusy|callingcustomer/.test(status.toLowerCase()))
                    return true;
            },
            restrictReloadV2: function(status) {
                if (this.isOnCall(status)){
                    this.dom.reloadV2.css("opacity", 0.3);
                }
                else{
                    this.dom.reloadV2.css("opacity", "");
                }
            },
            showConfirmation: function(text) {
                if (this.isOnCall(util.v2.getV2LastReceivedStatus())) {
                    /* 
                     * Restrict Users from reloading V2 when they are on Call ,
                     * cuz, reloading V2 push them offline ,will affect their stats
                     * if reloaded mistakenly.
                     */
                    return;
                }
                this.showBg();

                this.updateText(text);

                return this.dom
                    .panel
                    .show()
                    .children('#logout_confirmation')
                    .removeClass('hide');
            },
            popup: function(text) {
                if (v2Handler.isNewV2On) {
                    return this.showConfirmation(text)
                }
                this.logoutV2();
            },
            addListener: function() {
                this.dom
                    .confirmation
                    .children()
                    .find('#logout')
                    .click(this.startLoggingOutDFD.bind(this))
                    .siblings('#logout_cancel')
                    .click(this.hideLogout.bind(this));
            }
        }

        var v2Handler = {
            name: 'v2MsgHandler',
            isNewV2On: false,
            log: function() {
                util.log.apply(this, arguments);
            },
            setNewV2Flag: function(flag) {
                this.isNewV2On = flag
            },
            colorList: util.v2.getStatusList(),
            handler: function(msg) {
                switch (msg.opt) {
                    case "getStatus":
                        {
                            console.log('We can here.' + msg[msg.opt]);
                            var status = msg[msg.opt];
                            var colorCode = status && this.colorList.indexOf(status) !== -1 ? status : 'busy';

                            if (new RegExp(colorCode, 'ig').test(['Active Response', 'Video Call', 'Book Time']))
                                colorCode = 'away';

                            util.UI.v2
                            .removeClass()
                            .addClass('io')
                            .addClass(colorCode);

                            util.publish('/app/quit/offline/check', status);
                            util.publish('/check/audio/ping/status', status);
                            util.publish('/status/UIController/auto/status/change', status);

                            if (status == 'CallingCustomer' && util.platform.isWin())
                                util.notification.create({ title: 'Outbound Call', body: 'Dialing...' });
                            
                            logoutUI.restrictReloadV2(status);

                            // whenever we receive any signal from V2 ,
                            //consider V2 logged in store this info and status in LocStorage
                            Locstor.set('v2', Object.assign(Locstor.get('v2') || {}, {
                                lastReceivedStatus: status,
                                loggedIn: true
                            }));

                            // Send the message to AWW chat frame
                            var toChat = new Thinclient('v2Status');
                            toChat[toChat.opt].status = status;
                            FULLClient.ipc.sendToChat(toChat);

                            // new-v2 is on.
                            if (/offline/.test(status.trim().toLowerCase())) {
                                var dfd = logoutUI
                                    .getLogoutDFD();

                                dfd ? dfd.resolve('logout') : false;
                            }
                            softPhone.dailerUI(status);

                            break;
                        }
                    case "resizeContainer":
                        {
                            softPhone.resizeContainer(msg);
                            break;
                        }
                    case "visibility":
                        {
                            if (msg[msg.opt].isShow)
                                softPhone.showWidget();
                            else
                                softPhone.hideWidget();
                            break;
                        }
                    case "logout":
                        {
                            // Implementing force logout
                            // when we are recieving session
                            // timeout information from 
                            // v2
                            if (msg.isForce) {
                                console.warn('Force Logging out v2');
                                logoutUI.logoutV2();
                            } else {
                                logoutUI.popup();
                            }
                            break;
                        }

                    case "queryAndGetTabSource":
                        {
                            var src = util.tabs.getTabByParam(msg[msg.opt]);
                            var obj = new Thinclient('tabSourceQueryResult');
                            obj[obj.opt]['query'] = msg[msg.opt];
                            obj[obj.opt]['result'].src = src;
                            obj[obj.opt]['result'].params = util.getParameters(src);
                            console.warn('queryAndGetTabSource : ', obj);
                            softPhone.postMessage(obj);
                            break;
                        }
                    case "pageRedirect":
                        {
                            util.publish('/softphone/showSpinner'); // showing a spinner untill new V2 webview loads
                            util.publish('/softphone/hideOldV2');   // hiding old v2 window
                            //util.publish('/softphone/showWidget');

                            util.publish('/clear/status/timer');
                            /**
                             * In lily project, v2 starts with this event.

                             * We will check whether v2 url points to staging-v2.appspot.com
                             * if so we will not enable new softphone.
                             */
                            if (!this.isNewV2On && !/staging-v2/.test(util.config.getOldV2url())) {
                                this.setNewV2Flag(true);
                                softPhoneStartCallBack.call(softPhone);
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



        var softPhone = {
            spWidgetContentWindow: null,
            spWidgetIFrame: null,
            autoAnswer: true,
            skillName: 'SoftPhoneInbuilt',
            container: $('#softPhoneContainer'),
            colorIndicator: $('#softPhoneContainer > div.call-time-drop'),
            calltime: $('#softPhoneContainer > div > span '),
            dropdown: $('#softPhoneContainer > div > a > i '),
            spWidgetContainer: $('#softPhoneContainer > div.softPhoneFramecover'),
            containerSpinner : $('.status_loaderCircle'),
            // getV2Login: function(msg) {
            //     if (msg && msg.v2login && msg.v2login.login && msg.v2login.email ) {
            //         userDAO.setV2Login(msg.v2login);
            //         return msg.v2login;
            //     }
            //     throw new Error('v2Login is not available ' + JSON.stringify(msg));
            // },
            showSpinner:function(){
                this.containerSpinner.show();
            },
            hideSpinner:function(){
                this.containerSpinner.hide();
            },
            embedWidget: function(msg) {
                // Removes the iframe if it already present.
                // if (msg) {
                    // Embeds the spWidget url into iframe.
                    var config = FULLClient.getConfig();
                    // var v2Login = this.getV2Login(msg);
                    if (config && config.v2.new) {
                        this.removeWidget();

                        var url = config.v2.new;
                        url += '?auto_answer=true&email=' + userDAO.getEmail();

                        var tabWebview = new WebviewProxy('softphoneWidget', url, 'SoftPhoneComm:PSTN');
                        tabWebview.setDomReady(function(){
                            util.publish('/softphone/softPhoneOnload', event.srcElement);
                        });
                        softPhone.spWidgetContainer.append('<div class="webviewFix"></div>');
                        softPhone.spWidgetContainer.find('.webviewFix').append(tabWebview.getView())

                        this.spWidgetIFrame = this.spWidgetContainer.find('webview#softphoneWidget');
                    }
                // }
            },
            removeWidget: function() {
                this.spWidgetContentWindow = null;
                this.spWidgetIFrame = null;
                this.spWidgetContainer.find('.webviewFix').remove();
                this.container.addClass('hide');
            },

            isWidgetAvailable: function() {
                return this.spWidgetContentWindow ? true : false;
            },

            handShake: function() {
                /**
                 *
                 * Init an handshake
                 * establish an communication with
                 * the sp router.
                 *
                 **/
                this.postMessage(util.getInitObj('softphone'));
            },
            hideOldV2: function() {
                // hide phone icon
                console.log('Hiding v2 phone icon, because starting in-built new v2 softphone.');
                //$('#v2_Phone').hide();

                // close v2 container
                var v2Close = new Application('close');
                v2Close[v2Close.opt].appname = v2Close.apps.v2;
                FULLClient.ipc.sendToV2(v2Close);

                FULLClient.ipc.send({
                    eType: 'activateNewV2'
                });

                util.getCurrentWindow().show();

            },
            // animateTest: function() {
            //     function getByParts(no, totaNoOfParts, nthPart) {
            //         var onePart = (no / totaNoOfParts).toPrecision(4);
            //         var remainingParts = totaNoOfParts - nthPart;
            //         return Math.round(onePart * remainingParts);
            //     }

            //     function animate() {
            //         var bounds = util.caching.windows.getV2().getBounds();
            //         console.log(bounds);
            //         for (var i = 1; i < 9; i++) {

            //             var calBounds = {
            //                 x: bounds.x,
            //                 y: bounds.y,
            //                 width: getByParts(bounds.width, 8, i),
            //                 height: getByParts(bounds.height, 8, i)
            //             }

            //             setTimeout(function(b) {
            //                 util.caching.windows.getV2().setBounds(b)
            //             }.bind(null, calBounds), (i * 5))
            //         };
            //     }


            //     var bounds = util.getCurrentWindow().getBounds();
            //     var v2Bounds = util.caching.windows.getV2().getBounds();
            //     util.caching.windows.getV2().setAlwaysOnTop(true);
            //     util.caching.windows.getV2().setPosition(((bounds.x + bounds.width) - 128), bounds.y + 54)
            //     setTimeout(function() {
            //         util.caching.windows.getV2().setAlwaysOnTop(false);
            //     }, 0)

            //     setTimeout(function() {
            //         animate();
            //     }, 0);

            //     setTimeout(function(){
            //         util.caching.windows.getV2().hide();
            //         util.caching.windows.getV2().setBounds(v2Bounds);
            //     });
            // },
            spWidgetOnload: function(webview) {
                // hiding old v2 icon
                $('#v2_Phone').hide(); 
                util.publish('/softphone/hideSpinner'); // Once new v2 spinner in available we have to stop showing spinner. 
                this.container.removeClass('hide');
                // this == softphone object context.
                // iframe == iframe#softphoneWidget
                if (webview) {
                    this.spWidgetContentWindow = webview;
                    this.handShake();
                    this.showWidget();
                    return true;
                }
                // send init with dcm object to v2
                util.webview.post(webview, util.getInitObj('softphoneWidget'));
                return false;
            },
            showWidget: function() {
                if (this.spWidgetIFrame) {
                    this.container.addClass('showSoftPhone');
                    // var showWidget = new SoftPhoneComm('showWidget');
                    // this.postMessage(showWidget);
                    this.spWidgetIFrame.focus();
                }
            },
            hideWidget: function() {},
            resizeContainer: util.debounce(function(msg) {
                var opt;
                if (msg && (opt = msg[msg.opt]) && opt.h) {
                    // console.log('Resize container : ' + opt.h);
                    if (opt.h == 67) {
                        opt.h = 77;
                    };

                    softPhone.spWidgetContainer.css({
                        height: (opt.h) + 'px'
                    });
                } else {
                    softPhone.spWidgetContainer.removeClass('dailpad_height').addClass('call_height');
                }
            }, 150),
            registerUIevents: function() {

                if (!this.spWidgetContainer.hasClass('call_height'))
                    this.spWidgetContainer.addClass('call_height');

                this.container.click(function(evt) {
                    if (this.container.hasClass('showSoftPhone')) {
                        softPhoneHideCallBack.call(this);
                    } else {
                        softPhoneShowCallBack.call(this);
                    }
                }.bind(this));
            },
            postMessage: function(msg) {
                if (this.isWidgetAvailable() && msg) {
                    this.spWidgetContentWindow.send('webapp-msg', msg);
                    return true;
                }
                return false;
            },
            dailerUI: function(status) {
                switch (status) {
                    case 'CallingCustomer':
                    case 'PendingBusy':
                        {
                            if (this.container.hasClass('showSoftPhone'))
                                this.colorIndicator.removeClass('dialing on-call');
                            else
                                this.colorIndicator.addClass('dialing').removeClass('on-call');
                            break;
                        }
                    case 'AfterCallWork':
                    case 'Busy':
                        {
                            this.colorIndicator.addClass('on-call').removeClass('dialing');
                            break;
                        }
                    default:
                        {
                            this.colorIndicator.removeClass('dialing on-call');
                            break;
                        }
                }
            }
        }

        softPhone.registerUIevents();

        function softPhoneStopCallBack(param) {

            FULLClient.ipc.send({
                eType: 'activateOldV2'
            });

            v2Handler.setNewV2Flag(false);
            console.log('Showing v2 phone icon, because stopping in-built new v2 softphone.');
            $('#v2_Phone').show()
            this.removeWidget();
            console.log('Removed event listeners');
        };

        function softPhoneStartCallBack(param) {
            /**
             * param1 : route
             * param2 : skillName
             * param3 : callBack function
             * param4 : context/scope
             **/
            this.embedWidget(param);
        };

        function softPhoneShowCallBack(param) {
            this.showWidget();
        };

        function softPhoneHideCallBack(param) {
            this.hideWidget();
        };

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

        var application = {
            handler: function(msg) {
                switch (msg.opt) {
                    case "close":
                        {
                            if (msg[msg.opt].appname == 'v2container') {
                                util.publish('/util/window/events/hide', namespace.CONTAINER_V2);
                            }
                            break;
                        }
                    default:
                        // statements_def
                        break;
                }
            }
        }

        var msgHandler = {
            name: 'MessageModule',
            handler: function(e) {
                var msg = arguments[0] && arguments[0].name ? arguments[0] : arguments[1];
                switch (msg.name) {
                    case "v2Communication":
                        {
                            softPhone.postMessage(msg);
                            break;
                        }
                    case "Application":
                        {
                            application.handler(msg);
                            break;
                        }
                    case "chromeAppAPI":
                        {
                            apiHandler.handler(msg);
                            break;
                        }
                    default:
                        {
                            console.warn('Default Sequence Capture this : ', msg);
                            break;
                        }
                }
            }
        }

        util.subscribe('/softphone/softPhoneStart', softPhone, softPhoneStartCallBack);
        util.subscribe('/softphone/softPhoneStop', softPhone, softPhoneStopCallBack);
        util.subscribe('/softphone/softPhoneShow', softPhone, softPhoneShowCallBack);
        util.subscribe('/softphone/softPhoneHide', softPhone, softPhoneHideCallBack);
        util.subscribe('/softphone/softPhoneOnload', softPhone, softPhone.spWidgetOnload);
        util.subscribe('/softphone/postMessage', msgHandler, msgHandler.handler);

        util.subscribe('/v2Handler/new/v2/switch', v2Handler, v2Handler.setNewV2Flag);
        util.subscribe('/v2Handler/msg/handler', v2Handler, v2Handler.handler);

        util.subscribe('/v2/logout/confirmation', logoutUI, logoutUI.popup);
        util.subscribe('/v2/logout/hide', logoutUI, logoutUI.hideLogout);
        util.subscribe('module/controller/onload', logoutUI, logoutUI.addListener);

        //hide old v2 while getting pageRedirect message and showing/hiding spinner.
        util.subscribe('/softphone/hideOldV2', softPhone, softPhone.hideOldV2);
        util.subscribe('/softphone/showSpinner',softPhone, softPhone.showSpinner);
        util.subscribe('/softphone/hideSpinner',softPhone, softPhone.hideSpinner);


        util.subscribe('/app/restore/check', softPhone, function() {
            // Switchboard call window got crashed,
            // so we are reloading the v2 frame with existing login data.
            if (!this.isNewV2On && !/staging-v2/.test(util.config.getOldV2url())) {
                 v2Handler.setNewV2Flag(true);
                softPhoneStartCallBack.call(this, {
                    v2login: userDAO.getV2Login()
                });
            }
        });

        root['softPhone'] = softPhone; //used during testing.
        ipc.on('msg-to-' + namespace.CONTAINER_V2_SOFTPHONE, msgHandler.handler.bind(msgHandler));

        module.exports = {
            logoutUI: logoutUI
        };
    } catch (softPhoneException) {
        console.error(" softPhoneException :: message - " + softPhoneException.message);
        console.error(" softPhoneException :: stack - ", softPhoneException.stack);
    }
}(this));