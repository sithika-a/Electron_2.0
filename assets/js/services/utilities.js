var shell = FULLClient.require('electron').shell;
var path = FULLClient.require('path');
var clipboard = require('electron').clipboard;
var remote = require('electron').remote;
//var utils=require('../js/background/mainUtils.js');
var util = {
    name: "utilities",
    log: function() {
        // var tmp = Array.prototype.slice.call(arguments);
        // if (typeof tmp[0] == 'string') {
        //     tmp[0] = '[' + this.name + '] : ' + tmp[0];
        // } else {
        //     tmp.splice(0, 0, '[' + this.name + '] : ');
        // }
        // console.debug.apply(console, tmp);
        console.debug.apply(console, arguments);
    }
};


util.hasSpecialCharacters = function(data) {
    var regex = /([^a-zA-Z0-9])/;
    if (typeof data == 'string' && data && !regex.test(data)) {
        return false;
    }
    return true;
};

util.getSharedObject = function() {
    return remote.getGlobal('sharedObject'); // check main.js for globalObj setup
}

util.isHttps = function(url) {
    return url && url.includes('https://')
}


util.document = {
    shadowRootFocus: function(webView) {
        if (webView && webView.shadowRoot) {
            webView.shadowRoot.querySelector('object').focus();
            this.releaseFocus();
            return true;
        }
    },
    releaseFocus: function() {
        const element = document.createElement("span")
        document.body.appendChild(element)

        const range = document.createRange()
        range.setStart(element, 0)

        const selection = window.getSelection()
        selection.removeAllRanges()
        selection.addRange(range)
        selection.removeAllRanges()

        document.body.removeChild(element)
    },
    claimFocus: function() {
        const activeElement = document.activeElement
        const selection = window.getSelection()

        var selectionStart, selectionEnd, range

        if (activeElement) {
            selectionStart = activeElement.selectionStart;
            selectionEnd = activeElement.selectionEnd;
        }
        if (selection.rangeCount) range = selection.getRangeAt(0)

        const restoreOriginalSelection = function() {
            if (selectionStart >= 0 && selectionEnd >= 0) {
                activeElement.selectionStart = selectionStart
                activeElement.selectionEnd = selectionEnd
            } else if (range) {
                selection.addRange(range)
            }
        }

        requestAnimationFrame(restoreOriginalSelection)
    }
}

util.showBadgeLabel = function(count) {

    if (!count)
        count = '';

    var text = count.toString().trim(),
        cDom = document.querySelector('canvas');
    var canvas = cDom ? cDom : document.createElement("canvas");
    canvas.height = 140;
    canvas.width = 140;
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.ellipse(70, 70, 70, 70, 0, 0, 2 * Math.PI);
    ctx.fill();
    ctx.textAlign = "center";
    ctx.fillStyle = "white";

    if (text.length > 2) {
        ctx.font = "75px sans-serif";
        ctx.fillText("" + text, 70, 98);
    } else if (text.length > 1) {
        ctx.font = "100px sans-serif";
        ctx.fillText("" + text, 70, 105);
    } else {
        ctx.font = "125px sans-serif";
        ctx.fillText("" + text, 70, 112);
    }

    if (count && parseInt(count)) {
        // In 1.x we have to send it to main container,
        // remote container is not serialized, so api
        // change will affect implementation.
        // check https://github.com/electron/electron/issues/4011
        util.publish(`/sendMessage/to/main`,{
            moduleName: util.name,
            eType: 'setOverlayIcon',
            dataURL: canvas.toDataURL()
        });
        return text;
    } else {
        util.publish(`/sendMessage/to/main`,{
            eType: 'setOverlayIcon',
            count: null
        });
    }

    return false;
}

util.escapeSpaces = function(str) {
    if (str && typeof str == 'string') {
        return str.replace(/[ ]/g, '\\ ');
    }
}

util.getTempDirectory = function() {
    return process.env.TMPDIR || process.env.TEMP || process.env.TMP
};

util.print = {
    appInfo: function() {
        var tmp = {
            mode: FULLClient.getMode(),
            packageJson: FULLClient.getManifest(),
            config: FULLClient.getConfig(),
            asarPath: FULLClient.getAsarPath()
        }
        return tmp;
    }
}

util.scripts = {
    get: function() {
        return document.scripts[document.scripts.length - 1];
    }
}

util.debounce = function(func, wait, immediate) {
    var timeout;
    return function() {
        var context = this,
            args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};

util.doNotBubble = function(e) {
    if (e) {
        e.cancelBubble = true;
    }
};

util.mocha = {
    sb: function() {
        util.publish(`/sendMessage/to/main`,{
            "eType": "open",
            "title": "sbMocha"
        })
    },
    v2: function() {
        util.publish(`/sendMessage/to/main`,{
            "eType": "open",
            "title": "v2Mocha"
        });
    }
};

util.analytics = {
    /**
     * Common function for google analytics push.
     * @parameters
     *       - accountNumber
     *       - eventAction
     *       - connId
     *       - metaInfo
     */

    /**
     *  Sample push:
     *  util.analytics.push(params['accountNumber'],analytics.TAB_LOAD,params['connId'],url);
     *  For more Infomation please check the following files: oldCommDAO.js,analytics.js,channelAction.js and channel.html
     */
    push: function(accountNumber, eventAction, connId, metaInfo) {
        util.publish('/analytics/push', accountNumber, eventAction, connId, metaInfo);
    }
}

util.user = {
    isUserInfoAvailable: function() {
        return userDAO.getUser() ? userDAO.getUser() : false
    },
    getEmail: function() {
        var _user = this.isUserInfoAvailable();
        if (_user) {
            return _user.email;
        }
    }
}


util.getRemote = function() {
    return FULLClient.require('electron').remote;
};

util.preventEvent = function(e) {
    if (e) {
        e.cancelBubble ? e.cancelBubble = true : false;
        e.preventDefault ? e.preventDefault() : false
    }
};

util.getDemoLines = function() {
    return ["8007066511", "8004616705", "8004617310", "8004619489", "8004619578", "8008050816", "8008352647", "8004611592", "8004614207", "8004615165", "8004617420", "8007047593", "8007066572", "8004618540", "8004612449", "8004619537", "8008087316", "8004615398", "8004617493", "8007047614", "8004611676", "8006800906", "8004612458", "8004614214", "8007066573", "8004618597", "8004612596", "8007047591", "8004618658", "8008087751", "8007047635", "8004611683", "8005456981", "8004614237", "8004618497", "8004615406", "8007066604", "8004618659", "8004614259", "8007047636", "8007047643", "8004612413", "8004614359", "8005457026", "8004614250", "8004618512", "8004616486", "8008088543", "8007066609", "8004612435", "8007047641", "8004614784", "8006800797", "8004618523", "8004615502", "8004614354", "8004616508", "8006352757", "8008088612", "8007066615", "8004614425", "8004616495", "8004618524", "8004616539", "8004610376", "8006352780", "8004612497", "8004618678", "8006800904", "8007047684", "8004614706", "8007066617", "8004612597", "8004618552", "8006800910", "8004610485", "8007066618", "8007095720", "8004617250", "8008038489", "8008038490", "8008038514", "8008038516", "8008038529", "8008038532", "8008038533", "8008352608", "8008352718", "8008352909", "8008353022", "8008353430", "8008391943", "8008392012", "8008392169", "8008392197", "8008392252", "8006352720", "8004612183", "8004612417", "8773257467", "8773257468", "8773257480", "8773257488", "8773257495", "8773257496", "8773257497", "8773257498", "8773257499", "8773257763", "8773257785", "8773258200", "8773258711", "8773258981", "8773259051", "8773259052", "8773259055", "8773259056", "8773259060", "8773259063", "8773259064", "8773259065", "8773259070", "8773259073", "8773259742", "8773261118", "8773261123", "8773261142", "8773261919", "8773265164", "8773265367", "8773265371", "8773265607", "8773265961", "8773267997", "8773267998", "8773268102", "8773269238", "8773269321", "8773271035", "8773271271", "8773271601", "8773271602", "8773271606", "8773271607", "8773271750", "8773271981", "8773272107", "8773272242", "8773272246", "8773272285", "8773272483", "8773273082", "8773273292", "8773273937", "8773275427", "8773275687", "8773276074", "8773276078", "8773276079", "8773276080", "8773276081", "8773276085", "8773276270", "8773276637", "8773276966", "8773277162", "8773278001", "8773278408", "8773278409", "8773278693", "8773278842", "8773279172", "8773279682", "8773280314", "8773281194", "8773281286", "8773281357", "8773281416", "8773281886", "8773282321", "8773282399", "8773282475", "8773282826", "8773283207", "8773283285", "8773285258", "8773286354", "8773287453", "8773288576", "8773289801", "8773290433", "8773290598", "8773290615", "8773291275", "8773291279", "8773299571", "8773299576", "8773299969", "8773299970"];
};

util.getParameterByName = function(name, url) {
    if (name && url) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(url);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }
};

util.getParameters = function(url) {
    if (!url)
        return {};

    var keyValue = {};
    if (url.indexOf('?') !== -1) {
        var lUrl = url.split('?')
        lUrl = lUrl[1].split('&');
        for (var i = lUrl.length - 1; i >= 0; i--) {
            var key, value;
            key = lUrl[i].split('=')[0]
            value = lUrl[i].split('=')[1]
            keyValue[key] = value;
            if (/connid/.test(key))
                keyValue['connId'] = value;
        };
    }
    return (keyValue);
};

util.isFetch = function(params) {
    if (params && (params.fetch || params.isAgentResearch)) {
        return true;
    }
};

util.isEmail = function(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

util.loadWebSiteInBrowser = function(url) {
    if (util.isUrl(url)) {
        shell.openExternal(url);
    }
}

util.loadWebSiteInNewWindow = function(url) {
    if (util.isUrl(url)) {
        util.publish(`/sendMessage/to/main`,{
            "eType": "loadWebsiteInNewWindow",
            "url": url
        });
    }
}

util.loadURL = function(url, options, cb) {
    var newurl;
    if (url) {
        url += (url.indexOf('?') != -1) ? '' : '?';
        if (url.indexOf('http') == -1 && (newurl = 'http://' + url) && this.isUrl(newurl)) {
            url = newurl;
        }
    };

    if (this.isUrl(url)) {
        if (util.window.getName() == namespace.CONTAINER_SB) {
            this.publish('/tab/controller/create', url, options, cb);
        } else {
            // From someother container
            // posting sbcontainer to load an url
            var accLoad = new SBcommunication('accountOpt');
            accLoad[accLoad.opt].opt = 'load';
            accLoad[accLoad.opt].url = url;
            FULLClient.ipc.sendToSB(accLoad)
        }

        return;
    };

    throw new Error('Invalid URL : ' + url);
};

util.publish = function(scheme, context) {
    amplify.publish.apply(amplify, arguments);
};

util.subscribe = function(scheme, context) {
    amplify.subscribe.apply(amplify, arguments);
};

util.unsubscribe = function(scheme, context) {
    amplify.unsubscribe.apply(amplify, arguments);
};

util.debug = {
    _activateDebug: function() {
        util.log('Debugging : ', util);
    },
    _deActivateDebug: function() {

    },
    on: function() {
        this._activateDebug();
        util.publish('/debug/switch/global/on');
    },
    off: function() {
        util.publish('/debug/switch/global/off');
    }
};

util.getBrowserWindow = function() {
    return this.getRemote().BrowserWindow;
};

util.getAllWindows = function() {
    return this.getBrowserWindow().getAllWindows();
};

util.notification = {
    /**
     *
     *     {
     *       "title" : <msg<string>>, less than 45 char
     *       "body" : <msg<string>>, less than 100 char
     *     }
     *
     **/
    truncate: function(str, charRestrictionCount) {
        if (str && charRestrictionCount && str.length > charRestrictionCount) {
            return str.substr(0, charRestrictionCount);
        }
        return str;
    },
    isValid: function(nObj) {
        return nObj && nObj.title && nObj.body
    },
    getTitle: function(nObj) {
        return this.truncate(nObj.title, 45);
    },
    getBody: function(nObj) {
        return this.truncate(nObj.body, 150);
    },
    create: function(nObj) {
        /**
         * @kamesh TODO
         * factory function alteration for notification
         * see Startup.js in WebviewCode base.
         */
        if (this.isValid(nObj)) {
            var n = new ClientListener('notify');
            n[n.opt].title = this.getTitle(nObj);
            n[n.opt].body = this.getBody(nObj);
            util.publish('/notification/create/show', n);
        }
    },
    prevent: function() {
        // In windows native notifications are causing problem
        // We are fixing it with this patch.
        if (util.platform.isWin()) {
            console.warn('preventing native notifications');
            util.getCurrentWindow().webContents.session.setPermissionRequestHandler(function(webContents, permission, callback) {
                if (permission === 'notifications') {
                    // We are denying permissions for all
                    // sort of notification
                    return callback(false) // denied.
                }
                callback(true)
            });
            return true;
        }
    }
};


util.platform = {
    isMac() {
        if (/^darwin/.test(process.platform)) return true;
    },
    isWin() {
        if (/^win/.test(process.platform)) return true;
    }
}
util.caching = {
    windows: {
        v2: null,
        sb: null,
        chat: null,
        timer: null,
        reset() {
            this.v2 = this.sb = this.chat = this.timer = null;
        },
        getByTitle() {
            return this.getTarget(util.window.getName());
        },
        getV2() {
            return this.v2 ? this.v2 : this.getTarget(namespace.CONTAINER_V2);
        },
        getSB() {
            return this.sb ? this.sb : this.getTarget(namespace.CONTAINER_SB);
        },
        getChat() {
            return this.chat ? this.chat : this.getTarget(namespace.CONTAINER_CHAT);
        },
        getTimer() {
            return this.timer ? this.timer : this.getTarget(namespace.CONTAINER_TIMER);
        },
        getTarget(title) {
            var targetArray = util.getAllWindows();
            for (var i = targetArray.length - 1; i >= 0; i--) {
                if (targetArray[i].getURL().indexOf(title + '.html') !== -1) {
                    switch (title) {
                        case namespace.CONTAINER_V2:
                            {
                                this.v2 = targetArray[i]
                                return this.v2;
                            }
                        case namespace.CONTAINER_CHAT:
                            {
                                this.chat = targetArray[i];
                                return this.chat;
                            }
                        case namespace.CONTAINER_TIMER:
                            {
                                this.timer = targetArray[i];
                                return this.timer;
                            }
                        default:
                            {
                                this.sb = targetArray[i];
                                return this.sb;
                            }
                    }
                }
            };
        }
    }
}

util.getCurrentWindow = function() {
    return this.caching.windows.getByTitle() || this.getRemote().getCurrentWindow();
}

util.clear = function() {
    // only one time clear is allowed.
    if (!util.clear.isCleared) {
        util.clear.isCleared = true;
        this.httpCache.clear();
        this.cookies.clear();
        this.storage.clear();
        userDAO.clear();
    }
};

util.persistentStorage = {
    clear: function(cb) {
        // > http://electron.atom.io/docs/api/session/
        var storage = ['appcache', 'cookies', 'indexdb', 'local storage'];
        var quota = ['temporary', 'persistent', 'syncable'];
        util.getCurrentWindow()
            .webContents
            .session
            .clearStorageData({
                storage: storage,
                quotas: quota
            }, cb || function clearStorage() {
                console.warn('storage clear for following ', storage, quota);
            });
    }
};

util.flush = function() {
    // > http://electron.atom.io/docs/api/session/
    util.getCurrentWindow()
        .webContents
        .session
        .flushStorageData();
};

util.webview = {
    post: function(webview, msg, channel) {
        if (webview && msg && typeof msg == 'object') {
            /**
             *
             * If any other channels need to be published
             * channel = 'webapp-msg' | 'webapp-init'
             * Check preloadWeb.js, preload.js
             *
             * http://electron.atom.io/docs/v0.29.0/api/web-view-tag/
             *
             **/
            webview.send(channel || 'webapp-msg', msg);
        }
    }
}

util.getInitObj = function(tabId) {
    return {
        'name': 'init',
        'opt': 'userinfo',
        'init': {
            'tabIndex': tabId,
            'contactInfo': JSON.stringify(userDAO.getUserDcmResponse())
        },
        'isElectron': true,
        'source': 'AnyWhereWorks'
    }
};

util.storage = {
    isAvailable: function() {
        return typeof Locstor == 'function' ? true : false;
    },
    set: function(k, v) {
        if (k && v && this.isAvailable()) {
            Locstor.set(k, v)
        }
    },
    get: function(k) {
        if (k && this.isAvailable()) {
            return Locstor.get(k)
        }
    },
    clear: function() {
        if (this.isAvailable()) {
            util.log('LOCALSTORAGE is getting cleared !!');
            Locstor.clear();
        }
    }
};

util.window = {
    getName: function() {
        var scripts = util.scripts.get();
        var title;
        switch (path.basename(scripts.src)) {
            case "chatContainer.js":
                {
                    title = namespace.CONTAINER_CHAT;
                    break;
                }
            case "webContainer.js":
                {
                    title = namespace.CONTAINER_SB;
                    break;
                }
            case "v2Container.js":
                {
                    title = namespace.CONTAINER_V2;
                    break;
                }
            case "hiddenWindow.js":
                {
                    title = namespace.HIDDEN_CONTAINER;
                    break;
                }
            default:
                {
                    break;
                }
        };

        return title;
    }
}

util.httpCache = {
    remove: function() {
        var remote = util.getRemote();
        var win = remote.getCurrentWindow ? remote.getCurrentWindow() : false;
        if (win) {
            win.webContents.session.clearCache(function() {
                util.log('CacheCleared ', arguments);
            });
        }
    },
    clear: function() {
        util.log('httpCache is getting cleared !!');
        this.remove();
    }
};

util.copy = function(text) {
    clipboard.writeText(text);
}

util.clipboard = {
    read: function() {
        var tc = new Thinclient('readFromClipboard'),
            option = tc[tc.opt],
            image = this.readImage();

        if (image.isEmpty()) {
            option.type = 'text';
            option.text = this.readText();
        } else {
            option.type = 'Image';
            option.image = image
        }
        return tc;
    },
    readImage: function() {
        var data = clipboard.readImage();
        var imgUrl = !data.isEmpty() ? data.toDataUrl() : '';
        return {
            dataUri: imgUrl,
            size: data.getSize(),
            isEmpty: imgUrl ? false : true
        }
    },
    writeImage: function(path) {
        return clipboard.writeImage(path);
    },
    readText: function() {
        return clipboard.readText();
    },
    writeText: function(text) {
        return text ? clipboard.writeText(text) : false;
    }
}


util.cookies = {
    clear: function() {
        util.log('COOKIES is getting cleared !!');
        this.removeAllCookies();
    },
    _delete: function(cookies, win, dfd) {
        if (typeof cookies == 'object' && win) {
            var args = [],
                cb = function(error) {
                    if (error)
                        dfd ? dfd.reject('Error') : false;
                    else
                        dfd.resolve('success');
                },
                URL = "http" + (cookies.secure ? "s" : "") + "://" + cookies.domain + cookies.path;

            console.log("url : " + URL + ', cookies name : ' + cookies.name);
            // api has changed for cookie remove
            // https://github.com/atom/electron/issues/3860
            args.push(URL);
            args.push(cookies.name);

            args.push(cb);
            win.webContents.session.cookies.remove.apply(null, args);
        }
    },
    get: function(domainName, cb) {
        var remote = util.getRemote(),
            cookieDomainObj = {},
            win = remote.getCurrentWindow ? remote.getCurrentWindow() : false;

        if (domainName)
            cookieDomainObj['domain'] = domainName;

        win.webContents.session.cookies.get(cookieDomainObj, cb);
    },
    remove: function(domainName) {
        /**
         * Jquery deferred deaths could happen at
         * this point, re-check mandatory
         * @kamesh TODO
         */
        if (domainName)
            return this.removeAllCookies(domainName);

        throw Error('Domain name is not Valid ' + domainName);
    },
    getDFDs: function(length) {
        var tmp = [];
        for (var i = 0; i < length; i++) {
            tmp.push($.Deferred())
        };
        return tmp;
    },
    cookieDeletion: function(arr) {
        $.when.apply($, arr)
            .done(function() {
                console.log('Cleared Cookies successfully ');
                util.publish('/app/cookies/cleared');
            })
            .fail(function() {
                console.log('failed');
            })
    },
    removeAllCookies: function(domainName) {
        var removeDFD = [],
            self = this,
            remote = util.getRemote(),
            cookieDomainObj = {},
            keys,
            win = remote.getCurrentWindow ? remote.getCurrentWindow() : false;

        if (domainName)
            cookieDomainObj['domain'] = domainName;

        if (win) {
            win.webContents.session.cookies.get(cookieDomainObj, function(error, cookies) {
                keys = Object.keys(cookies);
                removeDFD = util.cookies.getDFDs(keys.length);
                util.cookies.cookieDeletion(removeDFD);
                for (var i = 0; i < keys.length; i++) {
                    self._delete(cookies[keys[i]], win, removeDFD[i]);
                };
            });
        }

        return removeDFD;
    }
};

util.gmail = {
    session: function() {
        util.cookies.get('google.com', function(error, cookies) {
            if (error) {
                return;
            }

            var len = cookies.filter(function(cookie) {
                return /HID|SSID/.test(cookie.name)
            }).length;
            if (!len) {
                console.warn('Gmail session InActive.');
            } else {
                console.log('Gmail session active.');
            }
        })
    }
}

util.accessMods = {
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

util.UI = {
    v2: $('#v2_Phone_Icon')
}

util.v2 = {
    getV2LastReceivedStatus: function() {
        var v2Obj = Locstor.get('v2');
        var status = null;
        if (v2Obj) {
            status = v2Obj.lastReceivedStatus;
        }
        return status;
    },
    isV2LoggedIn: function() {
        var v2 = util.storage.get('v2');
        if (v2 && v2.loggedIn) {
            return true;
        } else return false;
    },
    isV2Available: function() {
        return true;
        // return util.caching.windows.getV2() ? true : false;
    },
    getStatusList: function() {
        return ['Email', 'Offline', 'ActiveResponse', 'Active Response', 'AfterCallWorks', 'AfterCallWork', 'Default', 'Busy', 'Available', 'Repeat', 'Chat', 'Lunch', 'Meeting', 'Personal', 'Project', 'Training', 'System', 'Break', 'Break2', 'Break3', 'PendingBusy', 'CallingCustomer', 'FailedConnectAgent', 'Video Call', 'Book Time', 'Synclio Call', 'Learning'];
    },
    passOriginalEvent: function(originalObject) {
        if (!this.isV2Available())
            return;

        if (typeof originalObject == "object" && originalObject.name == 'v2Communication') {
            // util.caching.windows.getV2().send('msg-to-' + namespace.CONTAINER_V2, originalObject);
            // TODO Inbuilt Routing System has to written.
            FULLClient.ipc.sendToV2(originalObject);
            return true;
        }
    },
    getV2Url: function() {
        return util.config.getV2url().split(/^(.*.com)/)[1] + '/AgentInfoAction/saveAgentInfo.do';
    },
    getAjaxData: function(StatusString, connIdString, isDummyBoolean) {
        return new UserClockStatus(StatusString, connIdString, isDummyBoolean)
    },
    getAjaxDetails: function(StatusString, connIdString, isDummyBoolean) {
        return {
            type: 'POST',
            url: this.getV2Url(),
            data: this.getAjaxData(StatusString, connIdString || 'N/A', !!isDummyBoolean)
        }
    },
    pushStatusToYoco: function(StatusString, connIdString, isDummyBoolean) {
        if (StatusString, connIdString) {
            return $.ajax(this.getAjaxDetails(StatusString, connIdString, isDummyBoolean));
        }
        throw new Error('Not Valid statusPush params ', {
            StatusString: StatusString,
            connIdString: connIdString,
            isDummyBoolean: isDummyBoolean
        });
    },
    statusPush: function(sObj) {
        if (typeof sObj == "object" && (new RegExp(sObj.status, "g").test(this.getStatusList()))) {
            if (!this.isV2LoggedIn()) {
                console.log('V2 is not LoggedIn ... sending status to YOCO  :', sObj.status)
                this.pushStatusToYoco(sObj.status, 'N/A', true);
            } else {
                var v2 = new V2Communication('statusPush');
                v2.statusPush = sObj.status; // ex : Available, Break, Offline etc..
                v2.isInterruptible = sObj.isInterruptible;
                v2.source = 'FULLClient_utilities';
                v2.isForce = true;
                FULLClient.ipc.sendToV2(v2);
                return true;
            }
        }
    },
    dial: function(no) {
        if (!this.isV2Available())
            return;

        if (util.isNumber(no)) {
            var dNo = new V2Communication('outbound');
            dNo[dNo.opt].phoneNumber = no;
            dNo.source = 'FULLClient_utilities';
            dNo.isForce = true;
            // util.caching.windows.getV2().send('msg-to-' + namespace.CONTAINER_V2, dNo);
            // TODO Inbuilt Routing System has to written.
            FULLClient.ipc.sendToV2(dNo);
            return true;
        }
    }
};

util.isUrl = function(s) {
    var regexp = /(file|ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
    return s ? regexp.test(s) : false;
};

/**
 * Replace all function in javascript.
 * @param Source
 * @param stringToFind
 * @param stringToReplace
 */
util.replaceAll = function(Source, stringToFind, stringToReplace) {
    var temp = Source;
    var index = temp.indexOf(stringToFind);
    while (index != -1) {
        temp = temp.replace(stringToFind, stringToReplace);
        index = temp.indexOf(stringToFind);
    }
    return temp;
};

util.isNumber = function(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
};

util.crashReporter = {
    port: null,
    _portDFD: null,
    getDFD: function() {
        if (!this._portDFD) {
            this._portDFD = $.Deferred();
        }
        return this._portDFD;
    },
    getPort: function() {
        if (!this._portDFD) {
            this.hook();
        }
        /**
         * Send message to main container.....
         */
        util.publish(`/sendMessage/to/main`,{
            "eType": "crashReporter",
            "source": util.window.getName() == 'AnyWhereWorks' ? 'Chat' : util.window.getName(),
            "opt": "port"
        });
    },
    setPort: function(port) {
        if (util.isNumber(port)) {
            this.port = port;
            this.getDFD().resolve(port);
        }
    },
    hook: function() {
        util.log('Hook Crash collector DFD ');
        this.getDFD()
            .done(function(port) {
                util.log('Dynamic port been Captured in Crash Reporter', port)
                if (port) {
                    util.log('Starting crash reporter in Browser Window ' + document.title)
                    var crashReporter = util.getRemote().crashReporter;
                    crashReporter.start({
                        productName: 'FULLClient-Electron',
                        companyName: 'FULLCreative',
                        autoSubmit: true,
                        submitURL: 'http://localhost:' + port + '/crashreporter',
                        extra: {
                            "githuburl": "https://github.com/kamesh-a",
                            "email": "kamesh.arumugam@a-cti.com",
                            "contact": "+919884228421",
                            "crashreport": "Please contact us regarding this report "
                        }
                    });
                }
            })
    },
    init: function() {
        this.getPort();
    }
}

util.windowEvents = {
    show: function(containerName) {
        this.sendToMainProcess(this.constructMsg('show', containerName))
    },
    focus: function(containerName) {
        this.sendToMainProcess(this.constructMsg('focus', containerName))
    },
    hide: function(containerName) {
        this.sendToMainProcess(this.constructMsg('hide', containerName))
    },
    restore: function(containerName) {
        this.sendToMainProcess(this.constructMsg('restore', containerName))
    },
    maximize(containerName) {
        this.sendToMainProcess(this.constructMsg('maximize', containerName))
    },
    minimize: function(containerName) {
        this.sendToMainProcess(this.constructMsg('minimize', containerName))
    },
    enableOnTop: function(containerName) {
        this.sendToMainProcess(this.constructMsg('enableOnTop', containerName))
    },
    disableOnTop: function(containerName) {
        this.sendToMainProcess(this.constructMsg('disableOnTop', containerName))
    },
    constructMsg(operationType, containerName) {
        if (operationType && containerName) {
            var msg = new PostToBackground(operationType);
            console.log('In util.windowevents :'+msg);
            if (msg[msg.choice]) {
                msg[msg.choice].title = containerName;
                return msg[msg.choice];
            }
        }
    },
    sendToMainProcess(msg) {
        if (msg) {
            console.log('is msg present ? ',msg)
            util.publish(`/sendMessage/to/main`,msg);
        }
    }

};
util.subscribe('/util/window/events/show', util.windowEvents, util.windowEvents.show);
util.subscribe('/util/window/events/hide', util.windowEvents, util.windowEvents.hide);
util.subscribe('/util/window/events/focus', util.windowEvents, util.windowEvents.focus);
util.subscribe('/util/window/events/restore', util.windowEvents, util.windowEvents.restore);
util.subscribe('/util/window/events/minimize', util.windowEvents, util.windowEvents.minimize);
util.subscribe('/util/window/events/minimize', util.windowEvents, util.windowEvents.maximize);
util.subscribe('/util/window/events/minimize', util.windowEvents, util.windowEvents.enableOnTop);
util.subscribe('/util/window/events/minimize', util.windowEvents, util.windowEvents.disableOnTop);

util.config = {
    getSBurl: function() {
        return FULLClient.getConfig().sb5
    },
    getOldV2url: function() {
        var config = FULLClient.getConfig().v2;
        if (typeof config == 'string')
            return config
        else if (typeof config == 'object')
            return config.old
    },
    getV2url: function() {
        var config = FULLClient.getConfig().v2;
        if (typeof config == 'string')
            return config
        else if (typeof config == 'object')
            return config.new
    }
};

util.mouse = {
    callback: null,
    registerCB: function(fn, context) {
        if (fn && typeof fn == 'function') {
            this.callback = fn;
        }
    },
    execute: function(type) {
        if (this.callback) {
            this.callback.call(null, {
                etype: 'contextmenu',
                action: 'click',
                menu: type
            });
        } else if (type) {
            switch (type) {
                case "cut":
                    {
                        util.publish('/tab/controller/mouse/' + type);
                        break;
                    }
                case "copy":
                    {
                        util.publish('/tab/controller/mouse/' + type);
                        break;
                    }
                case "paste":
                    {
                        util.publish('/tab/controller/mouse/' + type);
                        break;
                    }
                case "replace":
                    {
                        util.publish('/tab/controller/mouse/' + type);
                        break;
                    }
                default:
                    {
                        break;
                    }
            }
        }
    }
};
util.app = {
    restart: function() {
        util.flush(); // this is to make sure local storage IO operation is done before app restart
        util.publish('/app/restart/commence');
    },
    update: function() {
        if (util.window.getName() != namespace.CONTAINER_SB) {
            util.publish('/asar/update/commence');
        } else {
            FULLClient.ipc.sendToChat({
                mode: FULLClient.getMode(),
                name: 'setMode'
            })
        }
    }
};

util.checkForUpdates = {
    isFromMenu: function() {
        var update = util.storage.get('update');
        if (update && update.checkForUpdates)
            return true;
        else
            return false;
    },
    setFlag: function(bool) {
        util.storage.set('update', {
            checkForUpdates: bool
        });
    }
}

util.zoom = {
    zoomInEnabled: true,
    zoomOutEnabled: true,
    updateUIOnFocus: function(win) {
        var contact = userDAO.getUser();
        if (contact) {
            if (win) {
                if (!win.zoomLevel) {
                    this.enableBothForcibly();
                } else if (win.zoomLevel == namespace.ZOOMOUT_LIMIT) {
                    //zoomOut threshold reached so disable in UI
                    this.disableInUI(namespace.ZOOMOUT);
                    this.enableZoomIn(true);
                } else if (win.zoomLevel == namespace.ZOOMIN_LIMIT) {
                    //zoomIn threshold reached so disable in UI
                    this.disableInUI(namespace.ZOOMIN);
                    this.enableZoomOut(true);
                } else {
                    this.enableBothForcibly();
                }
            }
        }
    },
    disableAllOnClearCache: function() {
        this.postToBackground(namespace.DISABLE, namespace.ALL);
        this.setFlag(namespace.ZOOMIN, false);
        this.setFlag(namespace.ZOOMOUT, false);
    },
    enableBoth: function() {
        this.enableZoomIn();
        this.enableZoomOut();
    },
    enableBothForcibly: function() {
        //enable both zoomIn / zoomOut inUI
        this.postToBackground(namespace.ENABLE, namespace.BOTH);
        this.setFlag(namespace.ZOOMIN, true);
        this.setFlag(namespace.ZOOMOUT, true);
    },
    enableZoomIn: function(isForce) {
        if (isForce || !this.zoomInEnabled) {
            //enabling zoomIn while zooming Out
            this.postToBackground(namespace.ENABLE, namespace.ZOOMIN);
            this.setFlag(namespace.ZOOMIN, true);
        }
    },
    enableZoomOut: function(isForce) {
        if (isForce || !this.zoomOutEnabled) {
            // enabling zoomOut while zooming In
            this.postToBackground(namespace.ENABLE, namespace.ZOOMOUT);
            this.setFlag(namespace.ZOOMOUT, true);
        }
    },
    disableInUI: function(zoomType) {
        this.postToBackground(namespace.DISABLE, zoomType);
        this.setFlag(zoomType, false);
    },
    setFlag: function(zoomType, bool) {
        if (zoomType == namespace.ZOOMIN) {
            this.zoomInEnabled = bool;
        } else {
            this.zoomOutEnabled = bool;
        }
    },
    postToBackground: function(switchType, option) {
        if (switchType && option) {
            var bg = new PostToBackground("menuActions");
            bg[bg.choice].opt = switchType + option;
            util.publish(`/sendMessage/to/main`,bg[bg.choice]);
        }
    },
    getActiveTab: function() {
        var tab = util.tabs && util.tabs.getActiveTab() || document.querySelector('webview#LoginModule');
        return tab;
    },
    isUnderThreshold: function(zoomLevel) {
        if (zoomLevel >= namespace.ZOOMOUT_LIMIT && zoomLevel <= namespace.ZOOMIN_LIMIT) {
            // is Under Threshold..
            return true
        } else {
            // exceeded threshold.
            return false;
        }
    },
    isAtThreshold: function(zoomLevel) {
        if (zoomLevel == namespace.ZOOMOUT_LIMIT || zoomLevel == namespace.ZOOMIN_LIMIT) {
            // is at Threshold..
            return true
        } else {
            // not in threshold line..
            return false;
        }
    },
    setZoomLevel: function(win, zoomLevel, zoomType) {
        if (this.isUnderThreshold(zoomLevel)) {
            win.setZoomLevel(zoomLevel);
            win.zoomLevel = zoomLevel;
            if (this.isAtThreshold(zoomLevel)) {
                this.disableInUI(zoomType);
            }
        }
    },
    zoomIn: function(win) {
        if (win) {
            if (!win.zoomLevel) {
                win.zoomLevel = namespace.ZOOM_ACTUAL_SIZE;
            }
            this.enableZoomOut();
            this.setZoomLevel(win, win.zoomLevel + namespace.ZOOM_FACTOR, namespace.ZOOMIN);
        }
    },
    zoomOut: function(win) {
        if (win) {
            if (!win.zoomLevel) {
                win.zoomLevel = namespace.ZOOM_ACTUAL_SIZE;
            }
            this.enableZoomIn();
            this.setZoomLevel(win, win.zoomLevel - namespace.ZOOM_FACTOR, namespace.ZOOMOUT);
        }
    },
    resetZoom: function(win) {
        if (win) {
            this.enableBoth();
            win.setZoomLevel(namespace.ZOOM_ACTUAL_SIZE);
            win.zoomLevel = namespace.ZOOM_ACTUAL_SIZE;
        }
    }
};
util.subscribe('/util/menu/disableAll/onClearCache', util.zoom, util.zoom.disableAllOnClearCache);


util.engine = {
    getMinorVersion: function() {
        return parseInt(process.versions['electron'].split('.')[1])
    },
    getMajorVersion: function() {
        return parseInt(process.versions['electron'].split('.')[0])
    }
}

util.init = function() {
    this.crashReporter.init();
    this.notification.prevent();
};

util.logger = function(msg){
return msg ? '${JSON.stringify(msg)}' : '${msg}';
}

util.subscribe('/util/crashreporter/set/port', util.crashReporter, util.crashReporter.setPort);

// util.subscribe('module/controller/onload', util, util.init);
util.subscribe('/util/v2/push/original/event', util.v2, util.v2.passOriginalEvent);
util.subscribe('/util/v2/statusPush', util.v2, util.v2.statusPush);
util.subscribe('/util/v2/dialNumber', util.v2, util.v2.dial);

// resets all the cached window.
util.subscribe('/util/v2/windows/caching/reset', util.caching.windows, util.caching.windows.reset);

module.exports=util;