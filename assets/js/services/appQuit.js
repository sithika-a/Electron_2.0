(function() {
    try {
        var appQuit = {
            canQuit: null,
            _v2Dfd: null,
            previousStatus: null,
            transparentBg: $('.black-screen'),
            getV2Dfd: function() {
                return this._v2Dfd;
            },
            checkStatus: function(status) {
                /*
                    We have to check whether v2 is logged in
                    or not, and previous status belong to 
                    any status rather than offline or null
                    start closing app immedietly
                   */
                if (status && status == 'Offline' && this.canQuit) {
                    /* setting the flag to differentiate
                     * offline signal on App Quit */
                    this._mannuallyResolveDFD();
                } else {
                    this.previousStatus = status;
                }
            },
            _mannuallyResolveDFD: function() {
                this.getV2Dfd() ? this.getV2Dfd().resolveWith(appQuit, ['offline to V2 success']) : false;
            },
            sendOfflineToV2: function() {

                this.removeButtons();

                var dfd = $.Deferred();
                this._v2Dfd = dfd;

                if (!this.previousStatus || this.previousStatus == 'Offline') {
                    this._mannuallyResolveDFD();
                } else {
                    console.log('Pushing V2 to offline');
                    util.publish('/status/UIController/manual/status/change', 'Offline');
                }

                setTimeout(function() {
                    dfd.resolveWith(appQuit, ['Threshold for ofline v2 kicked in !!']);
                }, 3000);

                return dfd;
            },
            appQuitTypetoAnalytics: function() {
                if (!Locstor.get('AppQuitType') && Locstor.get('lastAppLaunchDAIM')) {
                    util.analytics.push(null, analytics.APP_ABNORMAL_QUIT, null, 'Fullclient Abnormal close');
                };

                Locstor.set('lastAppLaunchDAIM', new Date());
                Locstor.remove('AppQuitType');
            },
            waitThenQuit: function() {

                util.analytics.push(null, analytics.APP_CLOSED, null, 'FULLClient Application is quiting');

                util.publish('/app/restore/removeAll', 'tabs');

                function logAndKill() {
                    console.log("Posting message to quit timerWidget:");

                    util.publish('/timer/hwnd/destroy');

                    $('webview').remove();
                    FULLClient.ipc.send({
                        moduleName : namespace.moduleName.appQuit,
                        "actionType": "appQuit",
                        "name": "appQuit"
                    });
                    Locstor.set("AppQuitType", 'normal');
                    window.close();

                }
                /* 
                 * after 3 seconds this will check for V2 Ack,
                 * wait until V2 Ack Deferred
                 * get resolved, quits the app.
                 *
                 */
                try {
                    $.when(this.getV2Dfd())
                        .done(function(value1) {
                            console.debug('Deferred were success, while quitting');
                            logAndKill();
                        })
                        .fail(function(value1) {
                            console.debug('Deferred failed, timeout kicked in, while quitting');
                            logAndKill();
                        });
                } catch (e) {
                    console.log("Fatal error :: ", e.message);
                    console.log("Fatal error :: ", e.stack);
                    Locstor.set("AppQuitType", 'normal');
                    setTimeout(window.close, 0);
                }
            },
            quitV2: function() {
                // v2Container.hideAndKill();
                // v2Container.hide();
            },
            hideChatWindow: function() {
                // if (_clientContainer.appWindow) {
                //     _clientContainer.appWindow.hide();
                // }
            },
            closeAppServer: function() {
                util.publish('serverModule/stop');
            },
            showQuitPopup: function() {
                var isActiveCallTab = false;
                if (util.tabs.getActiveTab()) {
                    // There are active tabs left
                    var activeTabs = util.tabs.getAllTabs()
                    for (var i = 0; i < activeTabs.length; i++) {

                        var params = util.getParameters(activeTabs[i].src);

                        if (!util.isFetch(params)) {
                            // show UI
                            isActiveCallTab = true;

                            // Focusing the live call
                            // in case of some other tab is active
                            var tabIndex = util.getParameterByName("currentTabIndex", activeTabs[i].src);
                            $('#' + tabIndex).trigger('click');

                            break;
                        }
                    };
                }

                // Hide closeTAB UI.
                util.publish('/tabLock/closeUI/hideUI/');

                if (isActiveCallTab) {
                    FULLClient["canQuit"] = false;
                    util.publish('/util/window/events/show', namespace.CONTAINER_SB);
                    this.showTransparentBG()
                    $('.quit-popup-wrapper').show();
                    $('.quit_btn').focus();
                } else {
                    this.start();
                }
            },
            setListeners: function() {
                $('body').on('click', '.quit-popup-wrapper a.cancel_btn', function(event) {
                    /* 
                       * On received 'Cancel' option from popup window
                       * just hide the popup and do nothing.
                       
                       */
                    util.publish('/app/quit/cancel');
                    FULLClient["canQuit"] = false;
                });
                $('body').on('click', '.quit-popup-wrapper a.quit_btn', function(event) {
                    /* 
                     * On received 'Quit' option from popup window
                     * actual Quitting processess starts here.
                     */
                    FULLClient["canQuit"] = true;
                    var label = '<label><img src="http://images.sb.a-cti.com/TC/node-webkit/webview/v0.2.1/images/spinner.gif"></label>';
                    $('.quit-popup-wrapper').prepend(label);
                    util.publish('/app/quit/commence');
                });
                $('.quit_btn')
                    .on('focus', function() {
                        this.highlightQuitBtn();
                    }.bind(this))
                    .on('blur', function() {
                        this.blurQuitBtn();
                    }.bind(this))
            },
            blurQuitBtn: function() {
                $('.quit_btn').css('opacity', '');
            },
            highlightQuitBtn: function() {
                $('.quit_btn').css('opacity', '1');
            },
            highlightCancelBtn: function() {
                $('.cancel_btn').css('opacity', '1');
            },
            isPopUpShown : function(){
                return $('.quit-popup-wrapper').is(':visible');
            },
            hideQuitPopup: function() {
                if(this.isPopUpShown()){
                    $('.quit-popup-wrapper').hide();
                    this.hideTransparentBG();
                }
            },
            showTransparentBG: function() {
                this.transparentBg.show();
            },
            hideTransparentBG: function() {
                this.transparentBg.hide();
            },
            removeButtons: function() {
                /* 
                 * On received 'Quit' option from popup window
                 * replacing popup content, hiding both
                 * quit and cancel buttons and quits the app..
                 */
                var quitDomCache = $('.quit-popup-wrapper');
                var str = "Saving the background process. Please wait for a moment.";
                quitDomCache.find('p').text(str);
                quitDomCache.find('a.quit_btn').hide();
                quitDomCache.find('a.cancel_btn').hide();

                if (!quitDomCache.is(':visible'))
                    quitDomCache.parent().show()

            },
            cancelQuit: function() {
                /* 
                 * Once User click 'cancel' button
                 * Just hide the popup window and do nothing
                 */
                this.hideQuitPopup();

            },
            start: function() {
                console.log('app quitting started')
                this.canQuit = true;

                // reset V2logged flag during appQuit
                Locstor.set('v2', Object.assign(Locstor.get('v2') || {}, {
                    loggedIn: false
                }));

                this.sendOfflineToV2();
                this.waitThenQuit();
                util.unsubscribe('/app/quit/commence', appQuit, appQuit.start);
            }
        };
        util.subscribe('shortcuts/keyPress/escape',appQuit,appQuit.hideQuitPopup);

        util.subscribe('module/controller/onload', appQuit, appQuit.setListeners);
        util.subscribe('/app/quit/offline/check', appQuit, appQuit.checkStatus);
        util.subscribe('/app/quit/commence', appQuit, appQuit.start);
        util.subscribe('/app/quit/popup', appQuit, appQuit.showQuitPopup);
        util.subscribe('/app/quit/cancel', appQuit, appQuit.cancelQuit);
        util.subscribe('/app/quit/remove/buttons', appQuit, appQuit.removeButtons);
        util.subscribe('app/quit/AppQuitTypetoAnalytics/', appQuit, appQuit.appQuitTypetoAnalytics);
    } catch (e) {
        console.error("Exception while sbContainer window closing : ", e);
        process.kill(process.pid);
    }
})();