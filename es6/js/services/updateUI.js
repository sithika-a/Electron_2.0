/**
 *
 * updateUI - UI for Container and GuestPage updates.
 *  -- updateType - EngineUpdate ,appUpdate , or GuestUpdate 
 *  -- Dynamic Button UI btn listners will be added when ther is a req to show PopUp
 *  -- PopUp information provided from Guest, or container will get updated in UI
 *  -- signal send to requested guestpage with UI actions (like btn click).
 *  -- GuestPage will send Information to host Container (SB/Chat) ,webview will be
 *      identified to communicated later with UI response in container.
 *  -- this module will work only if user has Chat skill,UI will be shown in chat window for now.
 **/
(function(R, mediator) {

    function hideCancelButtons() {
        $('.btnDarkblue').hide();
        $('.closeAct').hide();
    }

    hideCancelButtons();

    function showCancelButtons() {
        $('.btnDarkblue').show();
        $('.closeAct').show();
    }


    function checkButtons() {
        var v2Obj = util.storage.get('v2');
        if (v2Obj && v2Obj.lastReceivedStatus && (new RegExp(v2Obj.lastReceivedStatus, 'ig').test(['ActiveResponse', 'Active Response', 'Default', 'Busy', 'Repeat', 'Chat', 'PendingBusy', 'CallingCustomer', 'Video Call']))) {
            showCancelButtons();
        } else
            hideCancelButtons();
    }

    var popUpVersion = {
        headingVersion: $('.updateRt').find('h1'),
        isAlpha: function(version) {
            return /[a-z]/i.test(version)
        },
        isValidTagVersion: function(version) {
            // this is only to check alphabets in version 
            // any tag-version with text in it will not be shown in UI for Guest update
            if (version && !this.isAlpha(version))
                return version
        },
        show: function(version) {
            if (version) {
                return $('.updateLf')
                    .find('p:eq(1)')
                    .text('v' + version);
            }
        },
        hide: function() {
            return $('.updateLf')
                .find('p:eq(1)')
                .text('');
        },
        getHeadingText: function() {
            return "What's new in this update?";
        },
        changeHeadingVersion: function(version) {
            var headingTxt;
            if (version)
                headingTxt = "What's new in v" + version + "?";
            else
                headingTxt = this.getHeadingText()
            return this.headingVersion.text(headingTxt)
        },
        update: function(version) {
            if (version && this.isValidTagVersion(version)) {
                this.changeHeadingVersion(version);
                this.show(version);
            } else {
                this.changeHeadingVersion();
                this.hide();
            }
        }
    }

    var popUpText = {
        gitAccessToken: 'e18284d04c7da26a960909d4f0ff9632f749c3f2',
        defaultMsg: "<p>AnyWhereWorks have some Updates, Restart to apply the changes.</p>",
        marked: null, // module to convert TagText into MarkDown format
        releaseDetails: $('.updateRt').find('div'),
        makeLinkFunctional: function() {
            if (this.addTargetToLinks()) this.setListenersToLinks();
        },
        addTargetToLinks: function() {
            var links = this.getLinks();
            if (links && links.length) return links.attr('target', '_blank');
        },
        getLinks: function() {
            return $('.updateRt').find('div').find('a');
        },
        setListenersToLinks: function() {
            util.getCurrentWindow().webContents.on('new-window', function(event, urlToOpen) {
                /*
                 * new-window Open cannot be prevented from renderer process
                 * this has to be prevented synchronously from main process
                 * check mainMessaging.js setChatHandler fn.
                 * Ref - https://github.com/electron/electron/issues/2770
                 */
                event.preventDefault();
                util.loadWebSiteInBrowser(urlToOpen);
            });
        },
        init_markDown_module: function() {
            this.marked = FULLClient.require('marked');
            this.marked.setOptions({
                gfm: true,
                breaks: true
            });
            return this.marked;
        },
        update: function(updateType, metaInfo) {
            this.fetchDetailsAndUpdateInUI(updateType, metaInfo, this.updateDetailsAndShowUI, this);
        },
        updateErrorHandler: function(updateType, metaInfo, isPeriodicCheck) {
            /** 
             * If failed to get git tag details ,like invalid url/ some error 
             * in getting release Details, [container updates] will be shown with
             * "default update Message" and [Guest update] will be cancelled followed
             * with ..
             * 1, releasing Active Update, for getting new updates.
             * 2, Clearing guest update localStorage info.
             * 3, Starting Engine updater Routine 
             *       (no need to trigger engine update in next interval ie,.after one hour, 
             *       if its been cancelled with guest Update, so triggering engine update here 
             *       if Guest Update been cancelled by any means.)
             **/
            if (updateUI.isContainerUpdate(updateType)) {
                this.attachDefaultMsg();
                this.showPopUp(metaInfo, updateType);
            } else {
                // release Guest Update since no tag url found
                console.warn('1. Lock released for getting new updates');
                updateUI.setProgressFlag(false);
                updateUI.releaseActiveUpdate();
                console.warn('2. Cleared guest update localStorage info.');
                guestPage.clearInfo();
                console.warn('3. Starting Engine updater');
                util.publish('/start/engine/updater/', isPeriodicCheck);
            }
        },
        showPopUp: function(metaInfo, updateType) {
            checkButtons();
            updateUI.show.call(updateUI, metaInfo, updateType);
            updateUI.focusWindow();
        },
        updateDetailsAndShowUI: function(updateType, metaInfo, tagInfo) {
            var releaseMsg = tagInfo.body;
            if (releaseMsg) {
                this.formatAndAppendText(releaseMsg);
                this.showPopUp(metaInfo, updateType);
            } else {
                this.updateErrorHandler(updateType, metaInfo, true);
            }
        },
        getVersionByUpdate: function(version, updateType) {
            if (version && updateType) {
                if (updateType == 'appUpdate')
                    return version = 'v' + version;
                else if (updateType == 'engineUpdate')
                    return version = 'engineV' + version;
                else return version;
            }
        },
        getReqUrl: function(metaInfo) {
            if (metaInfo && metaInfo.updateVersion) {
                var repo, tag_name;
                if (metaInfo.gitRepoName)
                    repo = metaInfo.gitRepoName
                else
                    repo = 'FULLClient-Electron';
                return 'https://api.github.com/repos/Adaptavant/' + repo + '/releases/tags/' + metaInfo.updateVersion + '?access_token=' + this.gitAccessToken;
            }
        },
        fetchDetailsAndUpdateInUI: function(updateType, metaInfo, callBack, context) {
            if (updateType && metaInfo && callBack) {
                metaInfo.updateVersion = this.getVersionByUpdate(metaInfo.version, updateType);
                console.debug('update version in meta info ', metaInfo.updateVersion);
                console.debug('git url :', this.getReqUrl(metaInfo))
                return this.getReleaseText(this.getReqUrl(metaInfo))
                    .done(function successCB(tagInfo) {
                        console.log('successCB in fetch details : ', tagInfo)
                        if (callBack) callBack.call(context || null, updateType, metaInfo, tagInfo);
                    }.bind(this))
                    .fail(function failCB(r) {
                        console.log('Error in Fetching ReleaseDetails :', r);
                        this.updateErrorHandler(updateType, metaInfo, true);
                    }.bind(this));
            }
        },
        getReleaseText: function(gitReleaseUrl) {
            if (gitReleaseUrl) {
                return $.ajax({
                    url: gitReleaseUrl,
                    type: 'GET',
                    dataType: 'json',
                    processData: false,
                    contentType: false
                });
            }
            throw new Error('git ReleasesUrl Not found' + gitReleaseUrl);
        },
        attachDefaultMsg: function() {
            this.attach(this.defaultMsg);
        },
        formatToMarkDown: function(releaseText) {
            if (releaseText) {
                var result = this.marked(releaseText);
                return result;
            }
        },
        formatAndAppendText: function(releaseText) {
            if (releaseText) {
                this.attach(this.formatToMarkDown(releaseText));
                this.makeLinkFunctional();
            }
        },
        attach: function(formattedTxt) {
            if (formattedTxt) {
                this.clear();
                this.releaseDetails.append(formattedTxt);
            }
        },
        clear: function() {
            return this.releaseDetails.text('');
        }
    }
    popUpText.init_markDown_module();

    var updateUI = {
        updateInProgress: false, // this is to make sure ,Updation should not start more than once 
        updatePanel: $('.updatePanel'),
        xClose: $('.updatePanel').find('code'),
        downloadBtn: $('.updatePanel').find('.btnGreen'),
        closeBtn: $('.updatePanel').find('.btnDarkblue'),
        updateFailPanel: $('.updateFailedPopup'),
        transparentBg: $('#transparentBg'),
        activeUpdate: null,
        cbDfd: null,
        cbInfo: {
            cb: null,
            context: null,
            metaInfo: null,
            uType: null,
        },
        clearDfd: function() {
            this.cbDfd = null;
        },
        clearCbInfo: function() {
            this.cbInfo = {};
        },
        cacheCbInfo: function(updateType, metaInfo, cb, cbContext) {
            if (this.isValidCB(cb)) {
                this.cbInfo['cb'] = cb;
                if (updateType) this.cbInfo['uType'] = updateType;
                this.cbInfo['info'] = metaInfo;
                this.cbInfo['context'] = cbContext;
            } else {
                this.clearCbInfo();
            }
        },
        isValidCB: function(callBack) {
            if (callBack && typeof callBack == 'function') {
                return true;
            }
        },
        show: function(metaInfo, updateType) {
            this.updatePanel.focus();
            this.setActiveUpdate(updateType);
            this.transparentBg.show();
            if (this.isGuestUpdate(updateType) && metaInfo.cancelBtnName && /close/i.test(metaInfo.cancelBtnName)) {
                /* 
                 * Hide Download/ Restart Btn while showing Guest Update Details
                 * alone in Next Restart, when there is two update clash at same time.
                 */
                this.downloadBtn.hide();
            } else {
                /* 
                 * Show Download/ Restart Btn if only one update comes.
                 */
                this.downloadBtn.show();
            }
            this.updatePanel.show();
        },
        hide: function(updateStillActive) {
            // why this flag refer callee updateUI.hideDownloadWinandshowProgress fn
            if (!updateStillActive)
                this.releaseActiveUpdate();
            this.transparentBg.hide()
            this.updatePanel.hide();
        },
        focusWindowOnUpdateCheck: function() {
            if (util.checkForUpdates.isFromMenu()) {
                this.focusWindow();
            }
        },
        showFailPopuUp: function() {
            this.updateFailPanel.show();
        },
        hideFailPopuUp: function() {
            this.updateFailPanel.hide();
        },
        hideDownloadWinandshowProgress: function() {
            this.hide(true); // flag to mention update is still Active
            progressUI.show();
        },
        manualClearCache: function() {
            this.hide();
            progressUI.hide();
        },
        renameDownloadBtn: function(btnName) {
            if (btnName)
                this.downloadBtn.text(btnName);
            else
                this.downloadBtn.text('Restart');
        },
        renameCancelBtn: function(btnName) {
            if (btnName)
                this.closeBtn.text(btnName);
            else
                this.closeBtn.text('Later');
        },
        isContainerUpdate: function(updateType) {
            if (updateType && updateType == 'appUpdate' || updateType == 'engineUpdate')
                return true;
        },
        isGuestUpdate: function(updateType) {
            if (updateType && /guest/.test(updateType))
                return true
        },
        updatePopUpInfo: function(updateType, metaInfo) {
            if (this.isContainerUpdate(updateType)) {
                this.renameDownloadBtn('Update');
            } else {
                // Guest update : rename Download btn n cancel btn names if provided
                this.renameDownloadBtn(metaInfo.restartBtnName);
                this.renameCancelBtn(metaInfo.cancelBtnName);
            }
            popUpText.update(updateType, metaInfo)
            popUpVersion.update(metaInfo.version)
        },
        focusWindow: function() {
            util.getCurrentWindow().show();
            util.getCurrentWindow().focus();
        },
        isOtherUpdateActive: function() {
            if (updateUI.activeUpdate)
                return true
        },
        setActiveUpdate: function(updateType) {
            if (updateType) this.activeUpdate = updateType;
        },
        releaseActiveUpdate: function() {
            this.activeUpdate = null;
        },
        isValidVersion: function(version) {
            /*
             * only space given for version, first check itself it will fail 
             * first check - version is number or not
             * second check for two dots in given Version and every digit is a number 
             */
            if (/[0-9]/i.test(version)) {

                var arr = version.split('.');
                var len = arr.length;
                if (arr && len && len == 3) {
                    for (var i = 0; i < len; i++) {
                        var num = parseInt(arr[i]);
                        if (isNaN(num)) return false;
                        else {
                            if (i == len - 1)
                                return true
                        }
                    }
                } else return false;
            } else return false;
        },
        validateVersionForContainer: function(updateType, metaInfo) {
            // This version validation only for container updates 
            if (this.isContainerUpdate(updateType)) {
                if (metaInfo.version && this.isValidVersion(metaInfo.version)) {
                    return true;
                } else return false;

            } else return true;
        },
        cacheCBAndShowUI: function(updateType, metaInfo, cb, context) {
            this.setActiveUpdate(updateType);
            this.cacheCbInfo(updateType, metaInfo, cb, context);
            this.updatePopUpInfo(updateType, metaInfo);
        },
        showUpdateInfo: function(updateType, metaInfo, cb, context) {
            /*
             * App Updater module is in chat container, if we have Fullwork skill
             * only start App updates , else ignore it.
             */
            if (this.validateVersionForContainer(updateType, metaInfo)) {
                if (!this.isOtherUpdateActive()) {
                    console.log('********* other update not active ********* so proceed ', updateType)
                    this.cacheCBAndShowUI(updateType, metaInfo, cb, context);

                } else {
                    console.log('!!!!!! other update is active !!!!! ,so cancel ', updateType);
                    this.focusWindowOnUpdateCheck();
                    if (this.isGuestUpdate(updateType)) {
                        guestPage.cancelUpdate(metaInfo);
                    }
                }
            }
        },
        showGuestUpdateInfo: function(metaInfo, onLoadClosBtnCB, context) {
            var guestInfo = metaInfo;
            guestInfo.cancelBtnName = 'Close';
            this.cacheCBAndShowUI('guest', guestInfo, onLoadClosBtnCB, context);
        },
        setProgressFlag: function(bool) {
            this.updateInProgress = bool;
        },
        isUpdateInProgress: function() {
            return this.updateInProgress;
        },
        commenceUpdate: function() {
            if (!this.isUpdateInProgress()) {
                // this is to make sure ,Updation should not start more than once 
                this.setProgressFlag(true)
                util.checkForUpdates.setFlag(false);
                if (this.cbInfo['cb']) {
                    this.cbInfo['cb'].apply(this.cbInfo['context'] || this, [this.cbInfo['info'], true]);
                    this.clearCbInfo();
                } else {
                    this.setProgressFlag(false);
                    console.warn('Callback is not provided for commencing Update..', this.cbInfo['cb'])
                }
            }
        },
        cancelUpdate: function() {
            util.checkForUpdates.setFlag(false);
            this.hide(); // hidding downloadUI. 
            if (this.cbInfo['uType'] && this.isGuestUpdate(this.cbInfo['uType']) && this.cbInfo['cb']) {
                this.cbInfo['cb'].apply(this.cbInfo['context'] || this, [this.cbInfo['info'], false]);
            };
        },
        sendMessageToMain: function(obj) {
            if (FULLClient && obj) {
                FULLClient.ipc.sendToSB(obj);
            }
        },
        setListenersOnLoad: function() {
            if (this.updatePanel) {
                console.log('setting Listeners OnLoad ..')
                if (this.downloadBtn) {
                    this.downloadBtn.click(function() {
                        this.sendMessageToMain({
                            name: 'analytics',
                            accountNumber: null,
                            eventAction: analytics.UPDATE_BTN_CLICKED,
                            connId: FULLClient.getMode() + ' ' + FULLClient.getManifest().version + ' ' + process.platform,
                            metaInfo: 'User clicking download btn in updater'
                        });
                        this.commenceUpdate();
                    }.bind(this));
                }

                if (this.closeBtn) {
                    this.closeBtn.click(function() {
                        this.sendMessageToMain({
                            name: 'analytics',
                            accountNumber: null,
                            eventAction: analytics.UPDATE_LATER_CLICKED,
                            connId: FULLClient.getMode() + ' ' + FULLClient.getManifest().version + ' ' + process.platform,
                            metaInfo: 'User clicking download Later btn in updater'
                        });
                        this.cancelUpdate();
                    }.bind(this));
                }

                if (this.xClose) {
                    this.xClose.click(function() {
                        this.cancelUpdate();
                    }.bind(this));
                }
            }
            guestPage.onModuleLoad();
        }
    }
    mediator.subscribe('module/controller/onload', updateUI, updateUI.setListenersOnLoad);
    mediator.subscribe('updateUI/cancelUpdate', updateUI, updateUI.cancelUpdate);

    mediator.subscribe('updateUI/ShowUI/container', updateUI, updateUI.showUpdateInfo);
    mediator.subscribe('updateUI/hideDownloadWinandshowProgress', updateUI, updateUI.hideDownloadWinandshowProgress);
    // This loginModule/onload/recieved - will listen when clear cache done-login page emerges
    mediator.subscribe('/app/loginModule/onload/recieved', updateUI, updateUI.manualClearCache);

    var progressUI = {
        processPanel: $('.updating'),
        percentage: $('.updating').find('p'),
        progbarBelow50: $('.updating').find('.circle_bar.below50.updatedSuccess1'),
        progbarAbove50: $('.updating').find('.circle_bar.above50.updatedSuccess1'),
        below50css: 'linear-gradient(90deg, #cccccc 50%, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0)), linear-gradient(91deg, #00cd93 50%, #cccccc 50%, #cccccc)',
        above50css: 'linear-gradient(-90deg, #00cd93 50%, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0)), linear-gradient(270deg, #00cd93 50%, #cccccc 50%, #cccccc)',
        show: function() {
            updateUI.transparentBg.show();
            this.processPanel.show();
        },
        hide: function() {
            updateUI.transparentBg.hide();
            this.processPanel.hide();
        },
        circlebarUI: function(percent) {
            if (percent < 50) {
                var degree = Math.floor(3.6 * percent);
                return this.progbarBelow50.css('background-image', this.below50css.replace(/91/, 90 + degree))[0];
            } else {
                this.progbarBelow50.hide();
                this.progbarAbove50.show();
                var degree = Math.floor(3.6 * (percent - 50));
                return this.progbarAbove50.css('background-image', this.above50css.replace(/-90/, -90 + degree))[0];
            }
        },
        updatePercentage: function(percent) {
            this.circlebarUI(percent);
            this.percentage.text(percent + "% - Completed ...");
        }

    }
    mediator.subscribe('progressUI/updatePercentage', progressUI, progressUI.updatePercentage);
    mediator.subscribe('progressUI/showProgress', progressUI, progressUI.show);
    mediator.subscribe('progressUI/hideProgress', progressUI, progressUI.hide);
    /*
       *** ===== Guest Update Trigger Example for chat - liveFullSpectrum ====== ***

       function ClientListener(lOperation) {
        var operation = (lOperation) ? lOperation : false;
        this.name = 'clientlistener';
        this.opt = operation;
        this.showUpdatePopup = {
            name: 'showUpdatePopup',
            domain: location.origin,
            gitRepoName: null, // mandatory
            version: null, // mandatory, must be numerical to show version in UI
            restartBtnName: null, // optional : default - Restart
            cancelBtnName: null // optional : default - Later
        };
        this.hideUpdatePopup = {
            name: 'hideUpdatePopup',
        };
       };

            var test = new ClientListener('showUpdatePopup');
            test[test.opt].gitRepoName = 'FULLClient-Electron';
            test[test.opt].version = 'v2.15.1';
            FULLClient.ipc.sendToHost(test);
     */
    var guestPage = {
        checkForUpdates: false,
        setFlag: function(bool) {
            this.checkForUpdates = bool;
        },
        getViewByUrl: function(lUrl) {
            if (lUrl) {
                var wv = $('webview');
                for (var i = wv.length - 1; i >= 0; i--) {
                    if (wv[i].src.trim() == lUrl.trim() || (wv[i].src.trim().includes(lUrl.trim()))) {
                        return wv[i];
                    }
                };
            }
        },
        getBtnClickOption: function(restartBtn) {
            if (restartBtn)
                return "restartBtnClick"
            else
                return "cancelBtnClick"
        },
        reloadChatWebview: function(view) {
            if (view) {
                view.reloadIgnoringCache();
            }
        },
        commenceUpdate: function(view) {
            console.warn('reloading guest page...');
            /*
             * clearing progresFlag ,it should not block other updates
             * wich will not start functioning if this flag is true 
             * cuz just webview is getting restarted. not app.
             * if app restarts setProgressFlag variable would be destroyed.
             */
            updateUI.setProgressFlag(false);
            // Restart the chat ie,. 'liveSpectrum' webview, clear guestInfo from LocStore and Hide popUp
            this.clearInfo();
            updateUI.hide();
            this.reloadChatWebview(view);
        },
        cancelUpdate: function(metaInfo) {
            // store guestInfo in LocStore and show poUp again after one hour
            this.storeInfo(metaInfo);
            setTimeout(function() {
                console.debug('calling guest update with metaInfo :after one hour', metaInfo)
                this.showUpdateDetailsWithRestart(metaInfo);
            }.bind(this), FULLClient.getMode() == 'test' ? 20000 /* 20 secs */ : 3600000 /* 1 hour */ );
        },
        postMessageToGuestPage: function(metaInfo, btnClkBoolean, isForce) {

            var view = this.getViewByUrl(metaInfo.domain);
            if (view) {
                var infoObj = new ClientListener(this.getBtnClickOption(btnClkBoolean));
                console.log('Posting message to guest as :', infoObj);
                util.webview.post(view, infoObj);
                if (!isForce) {
                    if (btnClkBoolean) {
                        this.commenceUpdate(view);
                        /* 
                         * Disable this GuestUpdate flag,
                         * once started commencing Update, we dont want it anymore
                         */
                        this.setFlag(false);
                        // Restart Btn clicked 
                    } else {
                        // Later Btn clicked // check for EngineUpdate
                        this.cancelUpdate(metaInfo);
                        if (this.checkForUpdates) {
                            this.setFlag(false);
                            util.publish('/start/engine/updater/');
                        } else {
                            util.publish('/start/engine/updater/', true);
                        }
                    }
                }
            }
        },
        isValidMsg: function(msg) {
            // update version and Repository name must be given
            if (msg && msg.version && msg.gitRepoName) {
                return true;
            }
        },
        isEmptyObj: function(obj) {
            return Object.keys(obj).length === 0;
        },
        retrieveInfo: function() {
            var guestInfo = util.storage.get('guestUpdate');
            if (guestInfo && !this.isEmptyObj(guestInfo))
                return guestInfo;
            else
                return false
        },
        storeInfo: function(metaInfo) {
            if (metaInfo) util.storage.set('guestUpdate', metaInfo);
        },
        clearInfo: function() {
            util.storage.set('guestUpdate', {});
        },
        onLoadClosBtnCB: function(msg) {
            popUpText.updateErrorHandler('guest');
            this.postMessageToGuestPage(msg, true, true);
        },
        showUpdateDetailsOnly: function(msg) {

            updateUI.showGuestUpdateInfo(msg, this.onLoadClosBtnCB, this);
        },
        showUpdateDetailsWithRestart: function(msg) {
            console.log('Show details with restart', msg)
            updateUI.showUpdateInfo('guest', msg, this.postMessageToGuestPage, this);
        },
        checkUpdateOnMenuClick: function() {
            console.log('#checking GuestUpdate on menuClick');
            /*
             * setting this flag to check again in GuestUpdate callBack, 
             * cuz, checkForUpdate in LocStore will get altered with 
             * setListeners irrespective of updates
             */
            var guestInfo = this.retrieveInfo()
            if (guestInfo) {
                this.setFlag(true);
                console.log('#GuestUpdte available in LocStore')
                this.showUpdateDetailsWithRestart(guestInfo);
            } else {
                console.log('#GuestUpdte not available in LocStore')
                this.setFlag(false);
                util.publish('/start/engine/updater/');
            }
        },
        onModuleLoad: function() {
            var guestInfo = this.retrieveInfo()
            if (guestInfo) {
                /*
                 * app startUP -If guest Information is stored in Local Storage,
                 * then show GuestUpdate Release Details with close button alone.
                 * if not found any gusetInfo do nothing 
                 */
                this.showUpdateDetailsOnly(guestInfo);
            }
        },
        showGuestUpdate: function(msg) {
            if (updateUI.isOtherUpdateActive()) {
                console.warn('other update is active cancelling Guest Update and StoreInfo in LocStore');
                updateUI.focusWindowOnUpdateCheck();
                /*
                 * Before starting Guest Update, check for container updates,
                 * if any of them active just store guestInformation in LocStore 
                 * to show them on next restart
                 */
                this.cancelUpdate(msg)
            } else {
                /*
                 * Before starting Guest Update, check for container updates,
                 * if no container updates active, then validate the message 
                 * and show GuestUpdate UI with Restart Btn
                 */
                if (this.isValidMsg(msg))
                    this.showUpdateDetailsWithRestart(msg)
            }
        },
        msgHandler: function(msg) {
            console.log('POPUI guest update : ', msg);
            switch (msg.name) {
                case "showUpdatePopup":
                    {
                        this.showGuestUpdate(msg);
                        break;
                    }
                default:
                    {
                        console.warn('CAPTURE IT popUI module ', msg);
                        break;
                    }
            }
        }
    }
    mediator.subscribe('guestPage/checkUpdate/onMenuClick', guestPage, guestPage.checkUpdateOnMenuClick);
    // mediator.subscribe('module/controller/onload', guestPage, guestPage.onModuleLoad);
    mediator.subscribe('updateUI/guestPage/msgHandler', guestPage, guestPage.msgHandler);
    module.exports.UI = R['updateUI'] = updateUI;
    module.exports.progressUI = progressUI;
    module.exports.popUpVersion = popUpVersion;
    module.exports.popUpText = popUpText;
    module.exports.guestPage = guestPage;

})(this, util);