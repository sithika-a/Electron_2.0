/*
    Opening a web link in external browser
    Browser Priority  : Chrome or Firefox or IE for windows // Chrome for mac
    Mac platform      : Implementing with chrome browser is fine but firefox it's not creating more than one instance . 
        
        => we loading chat link in browser and sbContainer link in private window
*/

(function(util) {
    var path = FULLClient.require('path');
    var fs = FULLClient.require('fs');

    var openBrowser = {
        'externalUrl': null,
        'macBrowser': null,
        'extEvent': null,
        targetBrowser: {
            chrome: 'Google Chrome',
            firefox: 'Firefox.exe',
            iexplore: 'IEXPLORE.exe'
        },
        availableBrowser: {},
        whiteList: [],
        setWhiteList: function(list) {
            if (list && list.length > 0)
                this.whiteList = list;
        },
        isInternal: function(url) {
            var arr = ['formcreator','-sb.appspot.com'];
            for (var i = arr.length - 1;(i >= 0 && arr[i]); i--) {
                var regex = new RegExp(arr[i], "g");
                if (regex.test(url)) {
                    util.loadURL(url);
                    return true;
                }
            };
            return this.isWhiteListed(url);
        },
        isWhiteListed: function(url) {
            var arr = this.whiteList;
            for (var i = arr.length - 1;(i >= 0 && arr[i]); i--) {
                var regex = new RegExp(arr[i], "g");
                if (regex.test(url)) {
                    util.loadWebSiteInBrowser(url);
                    return true;
                }
            };
        },
        getBrowser: function() {
            var browserName = ['chrome', 'firefox', 'iexplore'];
            for (var i = 0; i < browserName.length; i++) {
                if (this.availableBrowser[browserName[i]])
                    return {
                        name: browserName[i],
                        path: this.availableBrowser[browserName[i]]
                    }
            };
        },
        isURLValid: function(url) {
            return (!/[,=]/.test(url));
        },
        checkLoaderTag: function(event) {
            if (this.isInternal(event.url))
                return false;

            if (event.srcElement.id == "chat_webview") {
                util.loadWebSiteInBrowser(event.url);
                return;
            }
            // Browser Compatibility for iframe and webview
            if (event.url) {
                this.extEvent = event; // Storing webivew event , to send back when failure case
                this.externalUrl = event.url;
                this.startLoad();
            }
        },
        shorternUrl: function(url) {
            $.ajax({
                    type: 'POST',
                    contentType: 'application/json',
                    url: 'https://www.googleapis.com/urlshortener/v1/url?key=AIzaSyCq81yfRtt-CVaq8AUss9W1fibePVnZswg',
                    data: JSON.stringify({
                        longUrl: url
                    }),
                    dataType: 'json'
                })
                .done(function(res) {
                    this.externalUrl = res.id;
                    util.platform.isMac() ? this.runMacCode() : this.runWinCode();
                }.bind(this))
                .fail(function() {
                    this.runExistMethod();
                }.bind(this));
        },
        startLoad: function() {

            if (this.getPlatform() == 'win32')
                this.runWinCode();
            else
                this.runMacCode();
        },
        getChildProcess: function() {
            return require('child_process');
        },
        getPlatform: function() {
            return process.platform;
        },
        runWinCode: function() {
            if (this.isURLValid(this.externalUrl)) {
                this.triggerBat();
            } else
                this.shorternUrl(this.externalUrl);
        },
        triggerBat: function() {

            var url = this.externalUrl,
                browserInfoObj = this.getBrowser(),
                child = this.getChildProcess(),
                args, exeCMD;

            if (browserInfoObj) {
                switch (browserInfoObj.name) {
                    case 'chrome':
                        {
                            args = '"' + browserInfoObj.path + '" -incognito ' + url;
                            break;
                        }
                    case 'firefox':
                        {
                            args = '"' + browserInfoObj.path + '" -private-window ' + url;
                            break;
                        }
                    case 'iexplore':
                        {
                            args = '"' + browserInfoObj.path + '" -private ' + url;
                            break;
                        }
                    default:
                        break;
                }

                exeCMD = 'start "browser" /b ' + args;
                console.log('Exec Command : ', exeCMD);

                child.exec(exeCMD, function(err, out) {
                    if (err) {
                        console.log('err :: ', err);
                        this.runExistMethod()
                    }else{
                        this.pushEventToAnalytics();
                    }
                        
                }.bind(this));

                return true;
            }
            this.runExistMethod();
        },
       
        checkBrowserExists: function(browser, path) {
            fs.stat(path, function(err, stat) {
                if (!err) {
                    this.availableBrowser[browser] = path;
                }
            }.bind(this));
        },
        calculatePathFromRegKey: function(regString) {
            if (regString) {
                var regexM = regString.match(/[a-z](:)[^\n"]+/igm);
                if (regexM && regexM[0]) {
                    if (regexM[0].match(/chrome/i)) {
                        this.checkBrowserExists("chrome", regexM[0].trim());
                    } else if (regexM[0].match(/firefox/i)) {
                        this.checkBrowserExists("firefox", regexM[0].trim());
                    } else if (regexM[0].match(/iexplore/i)) {
                        this.checkBrowserExists("iexplore", regexM[0].trim());
                    }
                }
            }
        },
        getBrowserPathFromRegistry: function() {
            var child = this.getChildProcess(),
                browsers = Object.keys(this.targetBrowser);
            cmd1 = 'reg query "HKEY_LOCAL_MACHINE\\SOFTWARE\\Clients\\StartMenuInternet\\';
            cmd2 = '\\shell\\open\\command"';
            for (var i = 0; i < browsers.length; i++) {
                child.exec(cmd1 + this.targetBrowser[browsers[i]] + cmd2, function(err, res) {
                    if (!err) {
                        console.log(browsers[i], this.targetBrowser[browsers[i]], res);
                        this.calculatePathFromRegKey(res);
                    }
                }.bind(this));
            };
        },
        runMacCode: function() {

            if (!/[,=]/.test(this.externalUrl)) {
                var child = this.getChildProcess();

                var ChromeAppPath = '/Applications/Google\\ Chrome.app ';

                // FirefoxAppPath = '/Applications/Firefox.app'; //Future purpose

                child.exec('cd ' + ChromeAppPath, function(err, stdout) {
                    if (err)
                        this.runExistMethod();
                    else {
                        this.macBrowser = 'Chrome';
                        this.triggerBash();
                    }

                }.bind(this));
            } else
                this.shorternUrl(this.externalUrl);
        },
        triggerBash: function() {

            if (this.macBrowser) {

                var child = this.getChildProcess(),
                    //For Electron
                    cmd = util.escapeSpaces(FULLClient.getFilePath() + '/scripts/privateBrowsing.sh');

                //For node-webkit
                // cmd = process.cwd()+'/scripts/privateBrowsing.sh';

                child.exec('sh ' + cmd + ' ' + this.externalUrl + ' ' + this.macBrowser, function(err, stdout) {
                    if (!err){
                        console.log("Error Free in triggerBash !!!!! :) ");
                        this.pushEventToAnalytics();
                    }else {
                        console.log("Error in triggering Bash script : ", err);
                        this.runExistMethod();
                    }
                }.bind(this));
            }
        },
        pushEventToAnalytics:function(){
            // Pushing INCOGNITO_LINK loaded event to analytics
            if(util.tabs.getActiveTab()){
            var params = util.getParameters(util.tabs.getActiveTab().src);
            util.analytics.push(params['accountNumber'],analytics.INCOGNITO_LINK,params['connId'],util.tabs.getActiveTab().src); 
           }
        },
        runExistMethod: function() {
            if (this.extEvent.url) {
                util.loadWebSiteInNewWindow(this.extEvent.url);
            }
        },
        init: function() {
            if (util.platform.isWin()) {
                this.getBrowserPathFromRegistry();
            }
        }
    }
    util.subscribe('/open/browse/private/window', openBrowser, openBrowser.checkLoaderTag);
    util.subscribe('/open/browse/private/whitelist', openBrowser, openBrowser.setWhiteList);
    util.subscribe('module/controller/onload', openBrowser, openBrowser.init);
}(util));