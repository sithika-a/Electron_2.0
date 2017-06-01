/*==========  Webview Controller  ==========*/
/**
*
* 
    We have to write a common controller, which would create
    webview dom, manage listener , and calling appropriate registered
    callbacks.

    URL : https://developer.chrome.com/apps/tags/webview
*
**/


(function(root, util, undefined) {
    var urlParser = FULLClient.require('url');

    function getExeScript(srcInWebview) {

        var url = 'images.sb.a-cti.com/chrome/js/webviewAPI.js'

        var _scriptString = 'var _webivewSupport=document.createElement("script");';

        if (srcInWebview && /^https/.test(srcInWebview))
            _scriptString += '_webivewSupport.src="https://commondatastorage.googleapis.com/' + url + '";';
        else
            _scriptString += '_webivewSupport.src="http://' + url + '";';

        _scriptString += '_webivewSupport.type="text/javascript";';
        _scriptString += 'document.body.appendChild(_webivewSupport);';

        return _scriptString;
    }

    root['getExecuteScript'] = getExeScript;


    var isNWCompatible = function() {
        return true;
    }

    function WebviewProxy(id, sourceUrl, partitionName) {
        this._createWebviewDom(id, sourceUrl, partitionName);
    }

    WebviewProxy.prototype = {
        constructor: WebviewProxy,
        _createWebviewDom: function(id, sourceUrl, partitionName) {
            if (this.isNWCompatible()) {
                var webPage = document.createElement('webview');
                webPage.src = sourceUrl;
                webPage.id = id;
                this.id = id.replace(/[a-z]*/, '');
                this.callbackRegister = {};
                // webPage.partition = partitionName;
                this._webview = webPage;
                this.setWidth('100%');
                this.setHeight('100%');
                this.setUserAgent();
                 // this.setPreload(FULLClient.getAsarPath() + '/webPreload.min.js');

                
                this.setPreload('../assets/js/preload/preloadWebview.js');
                this.setNewWinPolicy(webviewController.checkBrowserCompatible);
                // this.setNewWinPolicy(webviewController.openNewWindow);
                this.setMediaControl();
                this.setLoadRedirect();
                this.setDisableWebSecurity();
                this.setMessageListener();
                this.setCrashListeners();
                this.setLoadAborted(webviewController.loadAbort);
                /* Zoom services indicates the zoom factor */
                this.setContentloaded(this.setContextMenu.bind(this));
                this.setFindInPage();
            }
        },
        setCB: function(eventName, cb) {
            if (eventName) {
                return this.callbackRegister[eventName] = cb;
            }
        },
        getCB: function(eventName) {
            if (eventName) {
                return this.callbackRegister[eventName]
            }
        },
        setCB: function(eventName, cb) {
            if (eventName) {
                return this.callbackRegister[eventName] = cb;
            }
        },
        getCB: function(eventName) {
            if (eventName) {
                return this.callbackRegister[eventName]
            }
        },
        isNWCompatible: function() {
            return true;
        },
        getView: function() {
            return this._webview;
        },
        setHidden: function() {
            this.getView()
                .removeAttribute('style')
            this.getView()
                .setAttribute('class', 'webview_hide');
        },
        setContextMenu: function() {
            if (this.isNWCompatible() && !this.getView().dataset.contextMenuEnabled) {
                // should auto route the request to the tabtemplate.....
                this.getView().getWebContents().on('context-menu', function(event, param) {
                    util.publish('/context/menu/event/', event, param);
                });
                // Adding in dataset, in-order to not to add the listener 
                // again for same webview, even with multiple
                // content-load event in case of re-direction
                this.getView().dataset.contextMenuEnabled = true;
            }
        },
        setHeight: function(width) {
            if (this.isNWCompatible()) {
                this.getView().style.width = width;
            }
        },
        setWidth: function(height) {
            if (this.isNWCompatible()) {
                this.getView().style.height = height;
            }
        },
        setUserAgent: function() {
            if (this.isNWCompatible()) {
                this.getView().setAttribute('useragent', nwUserAgent);
            }
        },
        setDisableWebSecurity: function() {
            if (this.isNWCompatible()) {
                this.getView().setAttribute('disablewebsecurity', true);
            }
        },
        setMediaControl: function() {
            if (this.isNWCompatible()) {
                this.getView().addEventListener('permissionrequest', function(e) {
                    if (e.permission) {
                        e.request.allow();
                    }
                });
            }
        },
        setLoadRedirect: function() {
            if (this.isNWCompatible()) {
                var self = this;
                this.getView().addEventListener('did-get-redirect-request', function(evt) {
                    /**
                     *
                     * Compute the old and new domain and register in map
                     *
                     * 'url' to 'URL' : https://github.com/atom/electron/releases/tag/v0.35.0
                     **/
                    if (evt.isMainFrame) {
                        var oldUrlObject = urlParser.parse(evt.oldUrl || evt.oldURL); // compatbility for 0.35.0 'url' to 'URL' change
                        var newUrlObject = urlParser.parse(evt.newUrl || evt.newURL); // compatbility for 0.35.0 'url' to 'URL' change
                        console.debug('[' + self.id + '] [mainframe = ' + evt.isMainFrame + '] LoadRedirect : oldUrl: ' + oldUrlObject.host + ', newUrl : ' + newUrlObject.host);
                        /**
                         *
                         * Send both these domain to Domain register for internal Map
                         *
                         **/
                        util.publish('webview/service/domain/redirect', self.id, newUrlObject);
                    }
                });
            }
        },
        setPreload: function(preloadScriptPath) {
            if (this.isNWCompatible()) {
                this.getView().setAttribute('preload', preloadScriptPath || '../asar/full.asar/webPreload.min.js');
            }
        },
        setLoadstart: function(cb) {
            if (cb && this.isNWCompatible()) {
                this._webview.addEventListener('did-start-loading', cb)
                this.setCB('did-start-loading', cb);
            }
        },
        setLoadstop: function(cb) {
            if (cb && this.isNWCompatible()) {
                this._webview.addEventListener('did-stop-loading', cb)
                this.setCB('did-stop-loading', cb);
            }
        },
        setContentloaded: function(cb) {
            if (cb && this.isNWCompatible()) {
                this._webview.addEventListener('did-finish-load', cb)
                this.setCB('did-finish-load', cb)
            }
        },
        setFrameFinishLoad: function(cb) {
            if (cb && this.isNWCompatible()) {
                this._webview.addEventListener('did-frame-finish-load', cb)
                this.setCB('did-frame-finish-load', cb)
            }
        },
        setDomReady: function(cb) {
            if (cb && this.isNWCompatible()) {
                this._webview.addEventListener('dom-ready', cb)
                this.setCB('dom-ready', cb)
            }
        },
        setDialogController: function(cb) {
            if (cb && this.isNWCompatible()) {
                this._webview.addEventListener('dialog', cb)
                this.setCB('dialog', cb)
            }
        },
        setNewWinPolicy: function(cb) {
            if (cb && this.isNWCompatible()) {
                this._webview.addEventListener('new-window', cb)
                this.setCB('new-window', cb)
            }
        },
        setLoadAborted: function(cb) {
            if (cb && this.isNWCompatible()) {
                this._webview.addEventListener('did-fail-load', cb)
                this.setCB('did-fail-load', cb)
            }
        },
        setResponsive: function(cb) {
            if (cb && this.isNWCompatible()) {
                this._webview.addEventListener('responsive', cb)
                this.setCB('responsive', cb)
            }
        },
        reload: function() {
            // reloading will stop the view 
            // instead we can create another src.
            // this.getView().reload();
            var src = this.getView().src;
            var view = new WebviewProxy(this.getView().id, src, this.partition);
            view.setContentloaded(this.getCB('did-finish-load'));

            var parent = $(this.getView())
                .parent();

            parent.children()
                .remove('webview');

            parent.append(view.getView());
        },
        restore: function() {
            if (/&currentTabIndex=/.test(this.getView().src) && !/&isCrashed/.test(this.getView().src)) {
                /* 
                 * Only URL with TabId ie,. FULL window will get Data Restoration on Crash.
                 */
                this.getView().src += '&isCrashed=true';
                console.log('Appending crash param : ' + this.getView().src);
            } else this.reload();
        },
        setCrashListeners: function() {
            function listener(e) {
                console.error('Crashed : ', e);
                util.preventEvent(e);
                this.restore();
            }

            this._webview.addEventListener('crashed', listener.bind(this));
            this._webview.addEventListener('gpu-crashed', listener.bind(this));
            this._webview.addEventListener('plugin-crashed', listener.bind(this));
            this._webview.addEventListener('destroyed', listener.bind(this));
        },
        setUnresponsive: function(cb) {
            if (cb && this.isNWCompatible()) {
                this.getView().addEventListener('crashed', cb)
            }
        },
        setMessageListener: function() {
            /**
             *
             * constant "ipc-message" check docs
             * https://github.com/atom/electron/blob/master/docs/api/web-view-tag.md
             **/
             console.log('view : ',this.getView())
            this.getView().addEventListener('ipc-message', function(event) {
                console.log('Message from Webview ...',event.channel,':',event.args[0])
                util.publish('/msgModule/handler/', event.args[0], event.channel);
            });
        },
        setNodeIntegration: function() {
            this.getView().setAttribute('nodeintegration', true);
        },
        setFindInPage: function() {
            this.getView()
                .addEventListener('found-in-page', function(e) {
                    util.publish('/webview/found/in/page/', e);
                });
        }
    }

    root['WebviewProxy'] = WebviewProxy;
    root['webviewController'] = webviewController;

    var webviewController = {
        counter: 1,
        backUpDomain: ['jersey', 'setmore'], // blacklisted domains to load link in browser
        urlFetchedDomain: [],
        errList: ["ERR_ABORTED", "ERR_CONNECTION_CLOSED", "ERR_BLOCKED_BY_CLIENT", "ERR_ADDRESS_UNREACHABLE", "ERR_EMPTY_RESPONSE", "ERR_FILE_NOT_FOUND", "ERR_UNKNOWN_URL_SCHEME"],
        loadAbort: function(event, errorCode, errorDescription, validatedURL, isMainFrame) {
            var e = event;
            console.check('did failed to load : ', event, errorCode, errorDescription, validatedURL, isMainFrame)
            console.debug('\n LoadAbort url: ' + e.url +
                '\n LoadAbort toplevel : ' + e.isTopLevel +
                '\n LoadAbort code: ' + e.code +
                '\n LoadAbort reason: ' + e.reason);

            if (e.isTopLevel && !e.target.getAttribute('isReloaded') && webviewController.errList.indexOf(e.reason) == -1) {
                console.warn('Reloading the Webview !!! ');
                e.target.stop ? e.target.stop() : false;
                e.target.reload ? e.target.reload() : false;
                e.target.setAttribute('isReloaded', true);
            }
        },
        getDomainsLoadableInBrowser: function() {
            if (this.urlFetchedDomain.length)
                return this.urlFetchedDomain;
            else
                return [];
        },
        initialCallForSpreadSheetUrl: function() {
            this.getUrlFromSpreadSheet(this.addUrls);
        },
        getUrlFromSpreadSheet: function(cb) {
            $.post('https://script.google.com/macros/s/AKfycbxg0brhayGhgksKPdn9_Ku379GehCIRiMDiNhYkA3jrHftF1RU/exec').done(function(response) {
                if (response) {
                    cb.call(this, response);
                }
            }.bind(this)).fail(function(err) {
                console.error("Error in getting Urls from spreadsheet :", err);
            });
        },
        addUrls: function(jsobj) {
            util.publish('/open/browse/private/whitelist', jsobj);
        },
        checkBrowserCompatible: function(e) {
            e.preventDefault();
            e.cancelBubble = true;
            util.publish('/open/browse/private/window', e);
        },
        openNewWindow: function(e) {
            // e.preventDefault();
            e.cancelBubble = true;
            // e.window.discard();
            if (e && e.url) {
                console.log('NewWindowEvent, opening : ' + e.url);
                if (e.target.src.indexOf(FULLClient.getConfig().chat) != -1) {
                    // In chat application link has been clicked
                    // we will by default load them up in browser
                    util.loadWebSiteInBrowser(e.url);
                    return true;
                }
                util.loadWebSiteInNewWindow(e.url);
                return true;
            }
        },
        loadStart: function(e) {
            root['test'][webviewController.counter++] = e;
        }
    };

    util.subscribe('/webview/controller/app/onload', webviewController, webviewController.initialCallForSpreadSheetUrl);

}(this, util));