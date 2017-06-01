/**
*
* Tab LifeCycle
    - open tab
    - close tab
    - events on tab
    - load URL in tab along with webviewController
*
**/
(function(R, util, $) {
function sbARStatusPush(connid, status) {
    if (connid && status && userDAO.getUser() && !/code/.test(FULLClient.getMode()) && !util.hasSpecialCharacters(connid)) {
        $.get(FULLClient.getConfig().sb + '/ActiveResponseAction/updateCustomInteraction.do?connId=' + connid + '&status=' + status + '&emailId=' + userDAO.getUser().email)
            .done(function success_callback() {
                console.debug("sbARStatusPush, connid :: " + connid + ", status :: " + status + ", push success!!!!");
            })
            .fail(function error_callback() {
                console.error("sbARStatusPush, connid :: " + connid + ", status :: " + status + ", FAILED - requeing !!!!");
                setTimeout(function() {
                    sbARStatusPush(connid, status);
                }, 5000);
            });
    }
    console.warn('Discarding[' + connid + '] status push to AR server ' + status);
}
util.subscribe('tab/sbARStatusPush',null,sbARStatusPush);
// function sbARStatusPush(connid, status) {
//     if (connid && status && userDAO.getUser()) {
//         var controller = /chat/i.test(connid) ?
//             '/livechat/updatearinteractionstatus/' :
//             '/livechat/updatechatinteractionstatus/',

//             url = FULLClient.getConfig().ar +
//             controller + new Date().getTime() +
//             "?connectionId=" + connid +
//             "&status=" + status +
//             "&agentLogin=" + userDAO.getUser().email;

//         console.warn('sbARStatusPush URL : '+url);

//         $.get(url)
//             .done(function success_callback() {
//                 console.debug("sbARStatusPush, connid :: " + connid + ", status :: " + status + ", push success!!!!");
//             })
//             .fail(function error_callback() {
//                 console.error("sbARStatusPush, connid :: " + connid + ", status :: " + status + ", FAILED - requeing !!!!");
//                 setTimeout(function() {
//                     sbARStatusPush(connid, status);
//                 }, 5000);
//             });
//     }
// }

var url = FULLClient.require('url'),
    tabHolderDOM = $('ul.v2_tab');

/**
*
* 
    - No/one max Global Variable
    - UI template
    - Life cycle should maintained in this scope
*
**/

/**
 *
 * DOM Events
 *
 **/
$('ul.v2_tab').on('click', 'li', function(event) {
    var _targ;
    event.stopPropagation();

    console.log("[" + event.target.tagName + "]CODE clicked..!");
    switch (event.target.tagName) {
        case "A":
            {
                _targ = event.target.parentElement;
                break;
            }

        case "CODE":
            {
                _targ = event.target.parentElement;
                if (/ico-circle/.test(event.target.classList)) {
                    console.log("X-Closing tab..");
                    util.publish('/tabLock/closeUI/decider/', {
                        source: tabController.sources.getURLbyId(_targ.id),
                        isForce: true,
                        tabIndex: _targ.id
                    });
                    return false;
                }
                break;
            }
        case "I":
            {
                _targ = event.target.parentElement.parentElement;
                if (/active/.test(_targ.classList)) {
                    $(event.target.parentElement).siblings('.dropdown-menu').toggle();
                }
                break;
            }
        case "LI":
            {
                _targ = event.target;
                if (/dropdown-menu/.test(event.target.parentElement.classList)) {
                    $(event.target.parentElement).toggle();
                    _targ = event.target.parentElement.parentElement
                        // var originalText = event.target.innerText;
                        // var status = originalText.slice(12,originalText.length);
                    var params = util.tabs.getOriginalParamById(_targ.id);
                    console.debug("what we are storing:", event.target.innerText);
                    util.publish('/timer/update/connid/info', {
                        connId: params.connId,
                        status: event.target.innerText
                    });
                }
                break;
            }
        case "SPAN":
            {
                // Close Button is clicked
                if (/ico-circle/.test(event.target.classList)) {
                    console.log("X-Closing tab..");
                    _targ = event.target.parentElement.parentElement;
                    util.publish('/tab/closeUI/decider/', {
                        source: tabController.getSrcByTabId(_targ.id),
                        isForce: true,
                        tabIndex: _targ.id
                    });
                    return false;
                } else {
                    _targ = event.target.parentElement;
                    if (/active/.test(_targ.classList)) {
                        $(_targ).siblings('.dropdown-menu').toggle();
                    }
                }
                break;
            }
        default:
            {
                _targ = event.target;
                break;
            }
    }

    // console.log('what is the target : ', _targ);
    if (/LI/.test(_targ.tagName)) {
        tabController.markActiveByElement(_targ);
        tabController.autoFocus(_targ.id);
        /**
         *
         * Send Information about Tab Click to ZOOM Service updater.
         *
         **/
        amplify.publish('webview/service/zoom/UI/update', tabController.getActiveTabSrc(_targ.id));
        /**
         * hide findInPage UI
         */
        util.publish('/find/in/page/hide');
    }
});

jQuery(window).bind('resize', jQuery.debounce(20, false, function(event) {
    // Webview softphone when resized
    // it is bubbling to top, which we dont need
    // that event to resize tabs.
    if (event.target.nodeName == 'WEBVIEW' && event.target.id == 'softphoneWidget') {
        return;
    }
    tabController.resizeAll();
    // Instead of doing asynchronously
    // we are using event loop to defer the 
    // work
    setTimeout(function() {
        util.publish('/tabs/resize/dynamic');
    }, 0);
}));


function Tabs(url, options, cb) {
    this.url = url;
    this.options = options;
    this.name = 'TabModule';
    this._open();
}

Tabs.prototype.getURL = function() {
    return this.url;
};

Tabs.prototype.setURL = function(url) {
    this.url = url;
};

Tabs.prototype.log = function() {
    util.log(this, arguments);
};

Tabs.prototype.getId = function() {
    if (!this.id)
        this.id = Math.floor((Math.random() * 10000000000) + 1);
    return this.id;
};

Tabs.prototype._parseURL = function() {
    // https://nodejs.org/api/url.html#url_url_parse_urlstr_parsequerystring_slashesdenotehost
    if (!this.params && this.url) {
        this.params = url.parse(this.url, true);
    }
    return this.params;
};

Tabs.prototype.getParameters = function() {

    if (!this.params) {
        this._parseURL();
    }

    if (this.params) {
        return this.params.query;
    }
};

Tabs.prototype.getAccountNumber = function() {
    var query = this.getParameters();
    if (query && new RegExp(util.config.getSBurl(), "g").test(this.url)) {
        return query.acctNum || query.accountNumber;
    }
};

Tabs.prototype.getNameOfTab = function() {
    var accountNumber;
    if ((accountNumber = this.getAccountNumber()) && $.isNumeric(accountNumber))
        return accountNumber;
    else if (this.getURL().indexOf('cHZHQnhWZDYwbHhXQjZseHhZM0dKWnc6MA') !== -1)
        return 'Backup Form';
    else
        return namespace.APP_ID == namespace.CONTAINER_CHAT ? namespace.CONTAINER_CHAT : namespace.APP_ID;

};

Tabs.prototype.constructURL = function() {
    /**
     * DemoLine Checks.
     */
    this.isDemoLine();

    var url = this.getURL().replace(/(&currentTabIndex=)[0-9]*/g, '');
    url = url.replace(/(&apavailable=)[a-z]*/g, '');
    url += '&currentTabIndex=' + this.getId() +
        '&apavailable=' + (util.answerPhrase && util.answerPhrase.isAPavailable(this.getAccountNumber()) ? 'true' : 'false')
        /**
         * Save Recent URL
         */
    util.publish('/fetch/save/recentURL', url);
    this.setURL(url);
    return url;
};

Tabs.prototype._setDataAttr = function(dom) {
    if (dom) {
        var params = util.getParameters(this.url);

        if (params.connId) {
            dom.dataset.connId = params.connId
        }

        if (/repeats|epCustom/i.test(params.calltype)) {
            dom.dataset.connIdIsBilled = 'false';
            /** 
             * Run the billAR routine to check
             * the available activeReponses.
             */
            setTimeout(function() {
                util.publish('/tab/controller/billAR/check/inactive/tabs');
            }, 0)
        }
    }
};

Tabs.prototype._constructUI = function() {
    /**
     *  Starting arTimer sequence.
     */
    var commonTabUI,
        tabName = this.getNameOfTab(),
        params = util.getParameters(this.getURL());
            /* 
             * 
             * tabName cannot be set as title attribute which can have default tooltip onhover,
             * to avoid this changed 'title attribute' to 'class att' to hold the tabName which 
             * will be taken on each time a tab gets focused to update tabtitle/ window title 
             * with the website name or tabName created while constructing tab..
             */

     commonTabUI = '<li class="' + tabName + '" id="' + this.getId() + '" >' +
        '<a href="javascript:void(0)">' + tabName + '</a>' +
        '<code class="ico-circle">&times;</code>' +
        '</li>';

    if (/repeats|epCustom/i.test(params['calltype'])) {
        util.publish('/timer/start/', this.getURL());
        commonTabUI = '<li class="' + tabName + '" id="' + this.getId() + '" >' +
            '<span id="timedrop' + this.getId() + '" class="timecount">' +
            '<i class="fa fa-caret-down"></i>' +
            '</span>' +
            '<span class="fa fa-clock-o color_green"></span>' +
            '<ul class="dropdown-menu timer">' +
            '<li class="hint--right" aria-label="On Completion - Available">Available</li>' +
            '<li class="hint--right" aria-label="On Completion - Break">Break</li>' +
            '<li class="hint--right" aria-label="On Completion - Project">Project</li>' +
            '<li class="hint--right" aria-label="On Completion - Meeting">Meeting</li>' +
            '<li class="hint--right" aria-label="On Completion - System">System</li>' +
            '<li class="hint--right" aria-label="On Completion - Personal">Personal</li>' +
            '<li class="hint--right" aria-label="On Completion - Training">Training</li>' +
            '<li class="hint--right" aria-label="On Completion - Offline">Offline</li>' +
            '</ul>' +
            '<a id="tabName" href="javascript:void(0)">' + tabName + '</a>' +
            '<code class="ico-circle">&times;</code>' +
            '</li>';
    }

    // hide find in page.
    util.publish('/find/in/page/hide');
    tabHolderDOM.append(commonTabUI);

    //Resizing tab dynamically adjusting space.
    setTimeout(function() {
        util.publish('/tabs/resize/dynamic');
    }, 0);
};

Tabs.prototype._constructUIView = function() {
    var url, webviewUI, contentViewHolder = '<div id="' + this.getId() + '_content" class="tab-content " ></div>';

    url = this.getURL();

    util.publish('/app/restore/set', 'tabs', {
        key: this.getId(),
        url: url
    });

    tabController.registerMetaInfo(url);

    webviewUI = new WebviewProxy('web' + this.getId(), url, 'FULLClient:tab:' + this.getId());

    // Pushing Tabload to FullAnalytics
    var params = util.getParameters(url);
    util.analytics.push(params['accountNumber'], analytics.TAB_LOAD, params['connId'], url);
    webviewUI.setContentloaded(this.getOnload() || this.onload);
    webviewUI.setDomReady(this.domReady);
    // this.trial(webviewUI.getView());
    util.publish('/link/preview/load/webview',webviewUI.getView());

    /* 
        set the data Attributes 
       - for billing AR changes take look at tabcontroller.billAR
    */
    this._setDataAttr(webviewUI.getView());
    /**
     *
     * NodeIntegration in guest page, via
     * options
     *
     **/
    this.isNodeIntegAvailable() ? webviewUI.setNodeIntegration() : false

    $('div.tab-content-hold')
        .append(contentViewHolder) // appended $('div.tab-content-hold') element
        .find('#' + this.getId() + '_content') // find the contentViewHolder element which now got added.
        .append(webviewUI.getView()); // add webviewUI element inside

    tabController.markActiveByElement(document.getElementById(this.getId()));

    /**
     * Local
     * AnswerPhrase is shown
     *
     **/
    setTimeout(function() {
        util.publish('/answerphrase/compute', this.getId());
    }.bind(this), 0);

    console.debug('Tabload[' + this.getId() + '] = ' + url);
    /**
     *  Setting ActiveConnid Info in timer module. 
     */
    util.publish('/timer/set/active/connid/', this.getId());
};

Tabs.prototype.isDemoLine = function() {
    var regex = /(isDemoLine=true)/g;
    var accNo = util.getParameterByName('acctNum', this.getURL()) || util.getParameterByName('accountNumber', this.getURL());
    if (util.getDemoLines().indexOf(accNo) !== -1 && !regex.test(url))
        this.url += '&isDemoLine=true';
    return this.url;
};

Tabs.prototype._open = function() {
    // this.log('Open TAB for url : ' + this.getURL());
    this.constructURL();
    this._constructUI();
    this._constructUIView();
};

Tabs.prototype.isNodeIntegAvailable = function() {
    var cbObject = this.getOptions()
    if (cbObject && cbObject.nodeintegrations) {
        return cbObject.nodeintegrations
    }
};

Tabs.prototype.getOnload = function() {
    var cbObject = this.getCallBacks();
    if (cbObject) {
        return cbObject.onload
    }
};

Tabs.prototype.getCallBacks = function() {
    var options = this.getOptions();
    if (options && options.callbacks)
        return options.callbacks
};

Tabs.prototype.getOptions = function() {
    return this.options;
};

Tabs.prototype.onload = function(evt) {
    var id = tabController._getIDByElement(evt.target);
    /**
     *
     * Send Init message to target along
     * with DCM User information.
     *
     **/
    console.warn('Onload received : ' + evt.target.src);
    // Pushing onload to google analytics. 
    var params = util.getParameters(evt.target.src);
    util.analytics.push(params['accountNumber'], analytics.TAB_ONLOAD, params['connId'], evt.target.src);
    util.webview.post(tabController.getTabById(id), util.getInitObj(id), 'webapp-init');
};

Tabs.prototype.domReady = function(evt){
    var id = tabController._getIDByElement(evt.target);
    if (util.tabs.getActiveTabId() === id)
        tabController.autoFocus(id);
};

Tabs.prototype.isClosable = function(argument) {
    this.canClose = true // default boolean
};

/**
 *
 * Common Tab Controller for all induvijual tabs.
 *
 **/

var tabController = {
    _initialTab: null,
    UI: {
        holder: $('.tab-content-hold'),
    },
    name: 'tabController',
    log: function() {
        util.log.apply(this, arguments);
    },
    billAR: {
        lastARConnId: null,
        _fetchUnbilledAR: function() {
            /* Gets all the active unbilled connid */
            $('webview[data-conn-id-is-billed=false]')
                .each(function(index, dom) {
                    // probably we have to check original source map
                    // beacuse DS might or might not change the internal
                    // src, so calculating will make sure
                    var src = tabController.sources.getURLbyId(
                        tabController._getIDByElement(dom) // Gets tabId
                    ); // gets original source url while tab construction
                    console.warn('BILL AR original source _fetchUnbilledAR ', src);
                    this.isNotChargeable(util.getParameters(src), dom);
                }.bind(this));
        },
        markARforBilling: function() {
            this._fetchUnbilledAR();
        },
        store: function(params) {
            if (params && params.connId && params.calltype && params.calltype.toLowerCase() != "fetch") {
                return this.lastARConnId = params.connId;
            }
        },
        isNotChargeable: function(params, dom) {
            var connid = params.connId,
                dom = dom || util.tabs.getTabById(params.currentTabIndex);
            if (params.calltype && ['repeats', 'epcustom'].indexOf(params.calltype.toLowerCase()) != -1 && connid && this.lastARConnId) {
                if (!(this.lastARConnId == connid) && !this.isConnIdBilled(dom)) {
                    console.warn('AR : <"' + connid + '"> not charged');
                    sbARStatusPush(connid, 'donot-charge');
                    this.updateDataBillInfo(dom);
                    return true;
                }
            }
        },
        updateDataBillInfo: function(dom) {
            if (dom) {
                return dom.dataset.connIdIsBilled = 'true';
            }
        },
        isConnIdBilled: function(dom) {
            if (dom) {
                return dom.dataset.connIdIsBilled === "true"
            }
        }
    },
    sources: {
        name: 'sourceMap',
        idMap: {},
        getOriginalSrc: function(defectiveSrc) {
            return this.getURLbyId(this.getIDbyUrl(defectiveSrc))
        },
        getURLbyId: function(id) {
            if (id) {
                return this.idMap[id];
            }
        },
        getIDbyUrl: function(lUrl) {
            if (lUrl) {
                var tabId, idRegex, wv = $('webview');
                tabController.log('Original SRC : ' + lUrl);
                for (var i = wv.length - 1; i >= 0; i--) {
                    if (wv[i].src.trim() == lUrl.trim() || (wv[i].src.trim().includes(lUrl.trim()))) {
                        idRegex = new RegExp('[0-9]+', 'g').exec(wv[i].id);
                        tabId = (idRegex && idRegex.length) ? idRegex[0] : false;
                        tabController.log('Successfully got ID : ' + tabId);
                        break;
                    }
                };
                return tabId;
            }
        },
        reclaimMemory: function(key) {
            this.idMap[key] = null;
            delete this.idMap[key];
        },
        /**
         * map, which contains
         * key : tabId/ tabIndex
         * value :  source URL
         *
         * Usage :
         *     Reference map for the connID and params data, for metadata
         *     computation.
         */
        writeInMap: function(key, value, map) {
            if (typeof map == 'object' && key && value)
                map[key] = value;
        },
        checkURLPresence: function(key, url, map) {
            return new RegExp(url, 'ig').test(map[key]);
        },
        store: function(url, params) {
            if (params && params.currentTabIndex) {
                /**
                 * If Array Exits we put url into List.
                 */
                if (!this.checkURLPresence(params.currentTabIndex, url, this.idMap))
                    this.writeInMap(params.currentTabIndex, url, this.idMap);
            }
        }
    },
    interruptible: {
        connIDarray: [],
        isPresent: function(connId) {
            return connId && this.connIDarray.indexOf(connId) !== -1;
        },
        isValid: function(reqParam) {
            return reqParam && (reqParam['connId'] || reqParam['connid']) && reqParam['isInterruptible'] && reqParam['isInterruptible'] == 'true';
        },
        store: function(reqParam) {
            reqParam['connId'] = reqParam['connId'] || reqParam['connid'];
            if (this.isValid(reqParam) && !this.isPresent(reqParam['connId'])) {
                return this.connIDarray.push(reqParam['connId']);
            }
        },
        remove: function(connId) {
            this.connIDarray = this.connIDarray.filter(function(currentConnId) {
                if (!new RegExp(currentConnId, 'i').test(connId)) {
                    return true;
                }
            });
        },
        mergeConnIdTypoProps: function(obj) {
            if (obj && (obj.connId || obj.connid)) {
                var connidValue = obj.connId || obj.connid;
                /**
                 * Either one of the property will hold the
                 * value, we are storing in [connId] property.
                 */
                obj.connId = connidValue;
                return obj;
            }
        },
        check: function(lConnIdObj) {
            var mergedObj = this.mergeConnIdTypoProps(lConnIdObj);
            if (mergedObj && this.isPresent(mergedObj.connId))
                return mergedObj;
        },
        send: function(mergedObj) {
            amplify.publish('/status/controller/push/interruptible/info', mergedObj);
        }
    },
    registerMetaInfo: function(url) {
        if (url && util.isUrl(url)) {
            var reqParam = util.getParameters(url);
            this.sources.store(url, reqParam);
            this.interruptible.store(reqParam);
            this.billAR.store(reqParam);
        }
    },
    _getInitialTab: function() {
        if (!this._initialTab) {
            this._initialTab = $('.v2_tab li#1');
        }
        return this._initialTab;
    },
    _hideInitialTab: function() {
        this._getInitialTab().hide();
    },
    _checkInitialTab: function() {
        if (!this.getAllWebview().length) {
            this._showInitialTab();
        } else {
            this.populateOtherTab();
        }
    },
    _showInitialTab: function() {
        this._getInitialTab().show();
        this.markActiveByElement(this._getInitialTab().get(0));
        util.publish('menuBar/updateTitle');
    },
    resizeAll: function() {
        return this.UI
            .holder
            .height(this.getResizeHeight());
    },
    getResizeHeight: function() {
        return window.innerHeight - 64;
    },
    close: function(targetEl) {
        /**
         *
         * User/programatical Event
         *
         **/
        var id = this._getIDByElement(targetEl)
        this.closeByID(id);
    },
    closeActiveTab: function() {
        this.close(this.getActiveTab());
    },

    closeByID: function(tabId) {
        if (tabId && tabId && tabId != 1) {
            this.removeTab(tabId);
            this._checkInitialTab();
            // App Restoration.
            util.publish('/app/restore/remove', 'tabs', tabId);
        }
    },
    removeTab: function(id) {
        var tmp = this.getAllUIForTab(id);
        util.publish('/link/preview/dispose/webview',tmp.webview.get(0));
        tmp.ui.remove();
        tmp.webview.remove();
        tmp.outerWebviewDiv.remove();
    },
    markActiveByElement: function(ele) {
        if (ele && ele.id) {
            $(ele).addClass('active').siblings().removeClass('active');
            $('#' + ele.id + '_content').addClass('active').siblings().removeClass('active');
        }
    },
    markActiveById: function(id) {
        var ele;
        if (id && (ele = document.getElementById(id))) {
            $(ele).addClass('active').siblings().removeClass('active');
            $('#' + ele.id + '_content').addClass('active').siblings().removeClass('active');
        }
    },
    create: function(url, options, cb) {
        if (url) {
            new Tabs(url, options, cb);
            this._hideInitialTab();
            util.publish('/maxtabcounter/pushNumberOfTabsLoadedInfo');
        }
    },
    closeCompute: function(closeParamObj) {
        /**
         *        
         *  {
                isForce : false, // User click for 'x' button in UI.
                source : <url>,
                tabIndex : <number>
            }
         */
        /**
         * When a Call or ActiveResponse closes, we will be   
         * Checking for active Artimer record to update in timer module.  
         */
        util.publish('/timer/findLastActiveARAndUpdate');
        this.log('closeCompute :: ', closeParamObj);
        util.publish('/tabLock/closeUI/hideUI/');//f8 key pressed when tabLocked with tab-Xclose, hide the popup
        util.publish('/answerphrase/close/active/ap');
        if (closeParamObj) {
            var id, params, originalURL;
            if (closeParamObj.tabIndex) {
                id = closeParamObj.tabIndex;
                params = util.getParameters(closeParamObj.source)
            }

            if (!util.isNumber(id)) {
                params = util.getParameters(closeParamObj.source)
                id = params.currentTabIndex
            }

            if (!util.isNumber(id)) {
                params = this.getOriginalParamFromDSource(closeParamObj.source);
                id = params.currentTabIndex;
            }

            originalURL = this.sources.getURLbyId(id);
            this.log('tabId : ' + id + ' > originalURL : ' + originalURL);
            if (originalURL) {
                params = util.getParameters(originalURL);
                this.log('computed params : ', params);
                //Check whether AR is chargeable.
                this.billAR.isNotChargeable(params);
                // Pushing close to google anlaytics
                util.analytics.push(params['accountNumber'], analytics.TAB_CLOSE, params['connId'], originalURL);
                this.closeAccountByTabId(params);

                // params are send to timer widget
                // for closing.
                this.closeTimerInterval(params);
            };
        }
    },
    closeTimerInterval: function(params) {
        // change all things this code
        if (params.connId && /repeats|epCustom/i.test(params.calltype)) {
            util.publish('/timer/close/', params);
        }
    },
    closeAccountByTabId: function(params) {
        if (params) {
            // Removing from DOM
            this.closeByID(params.currentTabIndex);
            // send resize event for tab resize, resizeTabs.js
            setTimeout(function() {
                util.publish('/tabs/resize/dynamic');
            }, 0);
            // cleanUP in next cycle
            setTimeout(function() {
                // this.log('Reclaim Memory js array : ', params);
                this.sources.reclaimMemory(params.currentTabIndex);
                // util.publish("tabCloseController/reclaimMemory", params.currentTabIndex);
            }.bind(this), 5000);

            return params;
        }
    },
    getOriginalParamFromDSource: function(src) {
        var orignalSource = this.sources.getOriginalSrc(src);
        return orignalSource ? util.getParameters(orignalSource) : false;
    },
    populateOtherTab: function() {
        var id, allViews = this.getAllWebview();
        if (allViews.length && (id = this._getIDByElement(allViews[allViews.length - 1]))) {
            this.markActiveById(id); // tab html
            this.autoFocus(id);
        } else {
            /**
             *
             * Focus Tab 1
             *
             **/
            this.autoFocus('1');
            util.publish('/timer/hwnd/hide');
        }
    },
    reload: function() {
        var activeTab = util.tabs.getActiveTab();
        if (activeTab) activeTab.reload();
    },
    terminate: function() {

    },
    informAllTabs: function(msgInfo) {
        /**
         * When we get any status change all
         * the tabs have to be informed.
         */


        var views = this.getAllWebview();
        for (var i = 0; i < views.length; i++) {
            util.webview.post(views[i], msgInfo, 'webapp-msg');
        };
    },
    getAllWebview: function() {
        return $('webview:not(#processReduce,#LoginModule,#softphoneWidget)');
    },
    getAllUIForTab: function(id) {
        /*
            TODO : regex validation has to be done for numbers.
        */
        return id ? {
            ui: $('#' + id), // removing the tab UI
            webview: $('#web' + id), // removing webview tag
            outerWebviewDiv: $('#' + id + '_content') // removing the webview outer div.
        } : false;
    },
    _getIDByElement: function(ele) {
        if (!ele)
            return;

        var matcher = ele.id.match('[0-9]+');
        return matcher && matcher.length ? matcher[0] : 1;
    },
    getActiveTabSrc: function(id) {
        var tab = this.getActiveTab(id);
        return tab ? tab.src : false
    },
    getSrcByTabId: function(id) {
        var tab = this.getActiveTab(id);
        return tab ? tab.src : false
    },
    getActiveTabId: function() {
        return this._getIDByElement(this.getActiveTab())
    },
    getActiveTab: function(id) {
        return id ? this.getTabById(id) : this.getTabByCss()
    },
    getTabByMatchingParams: function(queryInfo) {
        if (queryInfo && queryInfo.paramValue) {
            // TODO : spec
            var webviews = this.getAllWebview();
            for (var i = webviews.length - 1; i >= 0; i--) {
                var view = webviews[i];
                if (new RegExp(queryInfo.paramValue, 'i').test(view.src)) {
                    return view.src;
                }
            };
        }
    },
    getTabByCss: function() {
        var wrapperView = document.querySelector('.tab-content.active');
        if (wrapperView && wrapperView.children && wrapperView.children.length > 0 && wrapperView.children[0].id != 'LoginModule') {
            return wrapperView.children[0]
        }
    },
    getTabById: function(id) {
        return id ? document.querySelector('#web' + id) : false
    },
    _shadowRootFocus : function( webView ){
        return util.document.shadowRootFocus(webView)
    },
    _focusById: function(id) {
        if (id && id != 1 && util.isNumber(id)) {
            /**
             * Focus is a tricky beast with `webview` tags, as we have to dodge a bunch
             * of Chromium bugs. We don't focus the `webview` itself to avoid an
             * apparently unstylable focus rectangle. In addition, we need the host page
             * to release document focus in order for focus to propagate to any of its
             * `webview` children. Refer to
             * https://github.com/javan/electron-webview-ime-fix for details.
             */
            this._shadowRootFocus(document.querySelector('#web' + id))
            /* 
             * update tabName and window title with the website name or tabName created while constructing tab
             * tabName cannot be set as title attribute which can have default tooltip onhover,
             * to avoid this changed 'title attribute' to 'class att' to hold the tabName which 
             * will be taken on each time a tab gets focused.
             */
             util.publish('menuBar/updateTitle', $('#' + id)[0].classList[0]);
        }
    },
    _focusByActivity: function() {
        var toActivate = this.getTabByCss()
        if (toActivate) {
            this._shadowRootFocus(toActivate)
        }
    },
    autoFocus: function(id) {
        this._focusById(id);
        util.publish('/answerphrase/compute', id);

        setTimeout(function() {
            if (util.tabs.getTabById(id)) {
                util.publish('/timer/set/active/connid/', id);
            }
        }, 0);
    },
    debug: {
        _activateDebug: function() {
            this.log('Globals activated, added named a.[TabController] = Tab control manager, b.[Tabs] = Tab Creator');
            R['TabController'] = this;
            R['Tabs'] = Tabs;
        },
        _deActivateDebug: function() {
            this.log('Globals deactivated, added named a.[TabController] = Tab control manager, b.[Tabs] = Tab Creator');
            R['TabController'] = null;
            R['Tabs'] = null;
            delete window['TabController'];
            delete window['Tabs'];
        }
    },
    loadWorkURL: function(url) {
        // If url is present take it 
        // or generate fullwork skill
        // url , check tabs and load 
        // em up.
        var availableTabs = this.getAllWebview()
        if (!url) {
            // getFULLWork URL
            var fullWorkSkill = userDAO.getSkillByName('FullWork');
            if (fullWorkSkill && fullWorkSkill.url)
                url = fullWorkSkill.url;
        };

        if (url) {
            // Check for already active tab with fullwork url
            for (var i = 0; i < availableTabs.length; i++) {
                if (availableTabs[i].src.indexOf(url) !== -1) {
                    // FullWork URL is already active.
                    this.markActiveByElement(availableTabs[i].parentElement);

                    this.markActiveByElement( // marking it active
                            document.getElementById( // tab div element
                                tabController._getIDByElement(availableTabs[i].parentElement))) // RandomNumber id for tab
                    return true;
                }
            };
            // If there is not active tab load one.
            util.loadURL(url);
        }
    },
    restore: {
        recoverTabs: function(restoreInfo) {
            util.publish('/app/restore/removeAll', 'tabs');
            console.warn('Restore INFO : ', restoreInfo);
            for (var i = 0; restoreInfo && i < restoreInfo.length; i++) {
                var url = restoreInfo[i].url;
                setTimeout(function(url) {
                    console.log('original URL : ' + url);
                    if (!/&isCrashed/.test(url)) {
                        url += '&isCrashed=true';
                        console.log('appending crash parame : ' + url);
                    }
                    util.loadURL(url);
                }.bind(null, url), 0);
            };

            FULLClient.ipc.send({
                eType: 'isRestored',
                container: namespace.CONTAINER_SB
            });

        },
        eventRecieved: function() {
            util.publish('/app/restore/get', 'tabs', this.recoverTabs);
        }
    },
    clickTab: function(tabs, i) {
        var tabId = tabs[i].id.slice(3);
        $('#' + tabId).trigger('click');
    },
    switchTab: function() {

        var tabs = util.tabs.getAllTabs();

        if (typeof(tabs[0]) == "undefined")
            return;

        var ct = util.tabs.getActiveTab().id;
        for (var i = 0; i < tabs.length; i++) {
            if (tabs[i].id == ct) {
                if ((i = i + 1) < tabs.length) {
                    this.clickTab(tabs, i);
                    return;
                } else if (i + 1 > tabs.length) {
                    this.clickTab(tabs, 0);
                    return;
                }
            }
        }
    }
}

// var closeTabDecider = {
//     tabIdToClose: null,
//     domCache: {
//         // properties will appended after adding to dom.
//     },
//     executeOptions: function(text, optionsToShow, optionsToHide, optionToFocus) {
//         this.domCache['closeTabUI']
//             .show()
//             .children() // wrapper Div
//             .children('p').text(text)
//             .siblings(optionsToShow).show()
//             .siblings(optionsToHide).hide()
//             .siblings(optionToFocus).focus();
//     },
//     decider: function(tabInfoObj) {
//         this.tabIdToClose = tabInfoObj.tabIndex;
//         var msg = tabCloseController.isTabAvailable(this.tabIdToClose)[0];
//         if (!msg) {
//             /* Closing the Tab without Lock*/
//             util.publish('/tab/controller/close/tab/', tabInfoObj);
//         } else {
//             if (msg.options && msg.options.text) {
//                 (msg.options.informational) ?
//                 this.executeOptions(msg.options.text, '#closeTabOk', '#closeTabNo,#closeTabYes'):
//                     this.executeOptions(msg.options.text, '#closeTabNo,#closeTabYes', '#closeTabOk');
//             }
//         }
//     },
//     hideUI: function() {
//         this.domCache['closeTabUI'].hide();
//     },
//     setListeners: function() {
//         $('body').on('keydown', '#closeTabUI', function(e) {
//             if (e.keyCode == 27) this.hideUI();
//         }.bind(this));
//         $('#closeTabYes').click(function() {
//             this.domCache['closeTabUI'].hide();
//             util.publish('/tab/controller/close/tab/', {
//                 source: tabController.getSrcByTabId(this.tabIdToClose),
//                 isForce: true,
//                 tabIndex: this.tabIdToClose
//             });
//         }.bind(this));
//     },
//     appendUIoptions: function() {
//         var str = '<div id="closeTabUI" class="quit-popup-hold">' +
//             '<div class="quit-popup-wrapper">' +
//             '<p id="closeTabInfoText"></p>' +
//             '<a id="closeTabNo" href="javascript:void(0);" class="cancel_btn">No</a>' +
//             '<a id="closeTabOk" href="javascript:void(0);" class="cancel_btn">Ok</a>' +
//             '<a id="closeTabYes" href="javascript:void(0);" class="tab_quit_btn">Yes</a>' +
//             '</div>' +
//             '</div>';
//         $("body").prepend(str);
//         this.domCache['closeTabUI'] = $('#closeTabUI');
//         this.setListeners();
//     }
// }

var tabCloseController = {
    tabCloseMap: [],
    lockTabOnClose: function(msg) {
        /*  
            Object Structure received ..
             function tabLock() {
                this.name = 'tabLock';
                this.url = location.href;
                this.enableLock = false;
                this.dialog = {
                    informational: false,
                    text: ''
                }
               }
                 informational = true; // okay button
                 informational = false; // yes & no options
           
            */
        var map = {
            tabId: util.getParameterByName('currentTabIndex', msg.url),
            options: msg.dialog
        }
        this.tabCloseMap.push(map);
    },
    reclaimMemory: function(tabID) {
        this.tabCloseMap.removeItem('tabId', tabID);
    },
    isTabAvailable: function(id) {
        return this.tabCloseMap.filterObjects("tabId", id);
    }

}

//markActiveById for timer module
util.subscribe('/timer/markActiveById', tabController, tabController.markActiveById);
//swtich tab
util.subscribe('/switch/tab/shortcut', tabController, tabController.switchTab);

util.subscribe("tabCloseController/reclaimMemory", tabCloseController, tabCloseController.reclaimMemory);
util.subscribe("tabCloseController/lockTabOnClose", tabCloseController, tabCloseController.lockTabOnClose);

// util.subscribe('module/controller/onload', closeTabDecider, closeTabDecider.appendUIoptions);
// util.subscribe('/tab/closeUI/decider/', closeTabDecider, closeTabDecider.decider);
// util.subscribe('/tab/closeUI/hideUI/', closeTabDecider, closeTabDecider.hideUI);

// Asynchronous Functions.
util.subscribe('/tab/controller/create', tabController, tabController.create);
util.subscribe('/tab/controller/close/active', tabController, tabController.closeActiveTab);
util.subscribe('/tab/controller/close/by/element', tabController, tabController.close);
util.subscribe('/tab/controller/close/by/id', tabController, tabController.closeByID);
util.subscribe('/tab/controller/close/tab/', tabController, tabController.closeCompute);

/* called from messageListener from unload block */
util.subscribe('/tab/controller/close/billAR', tabController.billAR, tabController.billAR.isNotChargeable);
util.subscribe('/tab/controller/billAR/check/inactive/tabs', tabController.billAR, tabController.billAR.markARforBilling);

util.subscribe('/tab/controller/load/fullwork', tabController, tabController.loadWorkURL);

util.subscribe('/tab/controller/status/to/tabs', tabController, tabController.informAllTabs);

util.subscribe('/debug/switch/global/on', tabController, tabController.debug._activateDebug);
util.subscribe('/debug/switch/global/off', tabController, tabController.debug._deActivateDebug);

util.subscribe('/tab/restore/check', tabController.restore, tabController.restore.eventRecieved);
// Intial resize for tabs to work.
util.subscribe('module/controller/onload', tabController, tabController.resizeAll);
/**
 *
 * Synchronous functions,
 * public availability, we use them in
 * utilities, in case of ashynchronous
 * and response is not needed we will publish
 * based on channel or router name.
 *
 **/
util.tabs = {
    getLastARConnId : function() {
             return tabController.billAR.lastARConnId;
        },
        getOriginalTabSrc : function(id){
            return id ? tabController.sources.getURLbyId(id):false;
         },
    isInterruptible: function(connId) {
        return tabController.interruptible.isPresent(connId)
    },
    removeInterruptibleConnId: function(connId) {
        return tabController.interruptible.remove(connId)
    },
    getTabByParam: function(queryInfo) {
        return tabController.getTabByMatchingParams(queryInfo);
    },
    getActiveTabId: function() {
        return tabController.getActiveTabId();
    },
    getTabById: function(id) {
        return id ? tabController.getTabById(id) : false
    },
    getActiveTab: function() {
        return tabController.getActiveTab();
    },
    getAllTabs: function() {
        return tabController.getAllWebview();
    },
    getOriginalParam: function(src) {
        return tabController.getOriginalParamFromDSource(src);
    },
    getOriginalParamById: function(id) {
        var sourceUrl = tabController.sources.getURLbyId(id);
        return sourceUrl ? util.getParameters(sourceUrl) : null;
    },
    getActiveTabSrc: function(id) {
        return id ? tabController.getActiveTabSrc(id) : false
    },
    focusActiveTab: function() {
        tabController._focusByActivity();
        return true;
    }
};
// data

R.tabController = tabController;
R.Tabs = Tabs;

if (module && module.exports) {
    module.exports.tabController = tabController;
    module.exports.Tabs = Tabs;
}})(this, util, jQuery);