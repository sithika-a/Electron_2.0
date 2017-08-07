/**
*
    Preload Scripts will injected into webframe 
    and starts the features, communication routes 
    in web-frames like, spellcheck, ipc messaging 
    routines etc.
*
**/
(function(R, FULLClient) {
    var domain = location.host || location.href;
    console.debug('Domain :' + domain);
    try {
        var remote = require('electron').remote,
           argv = remote.getGlobal('sharedObject') ? remote.getGlobal('sharedObject').cliArgs : null; // check main.js for globalObj setup
        if (argv && argv['disable-spellcheck']) {
            console.debug('SpellCheck disabled from cli');
        } else if (/^darwin|win/.test(process.platform)) {
            console.debug('Starting Spell Check module !!! ');
            var checker = require('spellchecker');
            var frame = require('electron').webFrame
            frame.setSpellCheckProvider("en-US", false, {
                spellCheck: function(text) {
                    return !checker.isMisspelled(text);
                }
            });
        }
    } catch (e) {
        console.debug('Error in SpellCheck Module : ', e)
    }

    var ipc = require('electron').ipcRenderer;

    function isWhiteListCheckPass() {
        var whiteList = [
            "alpha-sb",
            "beta-v2",
            "live-v2",
            "alpha-v2",
            "beta-sb",
            "beta.sb",
            "local.sb",
            "testing-sb",
            "adaptiv3delivery-hrd",
            "staging-v2",
            "images.sb.a-cti.com",
            "loopto",
            "setmore",
            "formcreator",
            "fullspectrum",
            "distributedsource",
            "dist-sourcetest",
            "fullauthservices",
            "file://",
            "localhost",
            "synclio",
            "127.0.0.1",
            "httpbin",
            "lily",
            "ngrok"
        ];

        // NB: Supporting disabling of white listed
        // websites to access nodejs apis;
        if(argv && argv['disable-whitelist-checks'])
            return true;

        for (var i = whiteList.length - 1; i >= 0; i--) {
            if (location.href.indexOf(whiteList[i]) !== -1 || location.host.indexOf(whiteList[i]) !== -1) {
                return true
            }
        };
    }
    /**
     *
     * Get WhiteListed Domains, Unlocking all the node js powers to all
     * we pages can give chance for malicious webapplication to change
     * entire filesystem.
     *
     * so, we are provinding node powers only to whitelisted domains.
     *
     **/

    if (isWhiteListCheckPass()) {
        R.FULLClient = {
            require: require, // ipc
            versions : process.versions,
            // process: process,
            // module: module,
            // Buffer: Buffer,
            // setImmediate: setImmediate,
            // clearImmediate: clearImmediate,
            ipc: {
                isValid: function(dataObj) {
                    return dataObj && typeof dataObj == 'object' ? true : false;
                },
                send: function(message, target) {
                    if (this.isValid(message) && ipc) {
                        ipc.send(target || 'msg-to-Main', message);
                        return true;
                    }

                    throw new Error('[send] : MessageData is not and Object :' + message);
                },
                sendToHost: function(message) {
                    if (this.isValid(message) && ipc) {
                        ipc.sendToHost('webapp-msg', message);
                        return true;
                    }
                    throw new Error('[sendToHost]: MessageData is not and Object : ' + message);
                },
                sendToV2: function(msg) {
                    this.send(msg, 'msg-to-V2');
                },
                sendToChat: function(msg) {
                    this.send(msg, 'msg-to-Chat');
                },
                sendToSB: function(msg) {
                    this.send(msg, 'msg-to-FULL');
                },
                receive: function() {
                    /**
                     *
                     * Upon receiving a message, we are dispatching
                     * the message on custom event on window.
                     *
                     * window object can capture the message and take
                     * actions on that.
                     *
                     **/
                    var message = arguments[0].name ? arguments[0] : arguments[1];
                    console.debug('Recieved Message on WebApplication :: ', message, ', typeof message : ' + typeof message);
                    if (message && typeof message == 'object') {
                        window.dispatchEvent(new CustomEvent('ElectronMessage', {
                            detail: message
                        }))
                    }
                }
            }
        };
    }
})(window);