"use strict";

(function (R) {
    console.log("Loading PRELOAD ..");
    var domain = location.host || location.href;
    console.debug("Domain : " + domain);
    var messenger = require("electron").remote.require("../es6/comm/messenger.js");

    R["FULLClient"] = {
        require: require,
        emitter: {
            broadCast: messenger.broadCast,
            subscribe: messenger.subscribe,
            unSubscribe: messenger.unSubscribe,
            unSubscribeAll: messenger.unSubscribeAll,
            isValid: function isValid(message) {
                if (message && typeof message == "object") return message;
            },
            wrap_msg: function wrap_msg(destination, message) {
                if (destination && this.isValid(message)) return {
                    name: messenger.profile.actionData,
                    destination: destination,
                    message: message
                };
            },
            sendToHR: function sendToHR(message) {
                var destination = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : messenger.profile.channel.Mediator;

                var msgObj = this.wrap_msg(destination, message);
                // console.log(`wrapper of message : ${JSON.stringify(msgObj)}`);

                if (msgObj) messenger.sendToHR(msgObj);
            },
            sendToMain: function sendToMain(message) {
                this.sendToHR(message, messenger.profile.channel.Main);
            },
            sendToV2: function sendToV2(message) {
                this.sendToHR(message, messenger.profile.channel.V2);
            },
            sendToChat: function sendToChat(message) {
                this.sendToHR(message, messenger.profile.channel.CHAT);
            },
            sendToSB: function sendToSB(message) {
                this.sendToHR(message, messenger.profile.channel.SB);
            }
        }
    };
})(window);
