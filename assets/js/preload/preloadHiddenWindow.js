"use strict";

(function (R) {
    console.log("Loading PRELOAD ..");
    let domain = location.host || location.href;
    let path = require("path");
    console.debug("Domain : " + domain);
    // const {messenger,profile} = require(`electron`).remote.require(`../comm/messenger.js`);
    console.log(path.join(process.cwd(), "/comm/messenger.js"));
    let messenger = require("electron").remote.require(path.join(process.cwd(), "/comm/messenger.js"));
    console.log('messenger  :', messenger.subscribe);
    R["FULLClient"] = {
        require,
        emitter: {
            broadCast: messenger.broadCast,
            subscribe: messenger.subscribe,
            unSubscribe: messenger.unSubscribe,
            unSubscribeAll: messenger.unSubscribeAll,
            isValid: function isValid(msg) {
                if (msg && typeof msg == "object") {
                    return msg;
                }
            },
            sendToMain: function sendToMain(msg) {
                console.log("sending to main from win");
                if (this.isValid(msg)) messenger.sendToMain(msg);
            },
            sendToV2: function sendToV2(msg) {
                if (this.isValid(msg)) messenger.sendToV2(msg);
            },
            sendToChat: function sendToChat(msg) {
                console.log('sending to chat from hidden win');
                if (this.isValid(msg)) messenger.sendToChat(msg);
            },
            sendToSB: function sendToSB(msg) {
                if (this.isValid(msg)) messenger.sendToSB(msg);
            }
        }
    };
})(window);
