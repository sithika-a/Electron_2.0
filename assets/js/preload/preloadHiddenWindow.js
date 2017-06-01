"use strict";

(function(R) {
    console.log("Loading PRELOAD ..");
    var domain = location.host || location.href;
    var path = require('path');
    console.debug("Domain : " + domain);
    var messenger = require("electron").remote.require(path.join(process.cwd(),"/comm/messenger.js"));

    R["FULLClient"] = {
        require: require,
        emitter: {
            namespace : messenger.namespace,
            broadCast : messenger.broadCast,
            subscribe: messenger.subscribe,
            unSubscribe: messenger.unSubscribe,
            unSubscribeAll: messenger.unSubscribeAll,
            isValid: function(msg) {
                if (msg && typeof msg == 'object') {
                    return msg;
                }
            },
            sendToMain: function (msg) {
                console.log('sending to main from messenger')
                if(this.isValid(msg))
                messenger.sendToMain(msg);
            },
            sendToV2: function (msg) {
                if(this.isValid(msg))
                messenger.sendToV2(msg);
            },
            sendToChat: function (msg) {
                if(this.isValid(msg))
                messenger.sendToChat(msg);
            },
            sendToSB: function (msg) {
                if(this.isValid(msg))
                messenger.sendToSB(msg);
            }
        }
    };
})(window);