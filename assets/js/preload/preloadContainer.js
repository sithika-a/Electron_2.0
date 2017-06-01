"use strict";

(function (R) {
    console.log("Loading PRELOAD ..");
    var domain = location.host || location.href;
    console.debug("Domain : " + domain);

    var _require$remote$requi = require("electron").remote.require("../comm/messenger.js"),
        messenger = _require$remote$requi.messenger,
        profile = _require$remote$requi.profile;

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
                    name: profile.actionData,
                    destination: destination,
                    message: message
                };
            },
            sendToHR: function sendToHR(message) {
                var destination = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : profile.channel.Mediator;

                var msgObj = this.wrap_msg(destination, message);
                console.log("wrapper of message : " + JSON.stringify(msgObj));

                if (msgObj) messenger.sendToHR(msgObj);
            },
            sendToMain: function sendToMain(message) {
                this.sendToHR(message, profile.channel.Main);
            },
            sendToV2: function sendToV2(message) {
                this.sendToHR(message, profile.channel.V2);
            },
            sendToChat: function sendToChat(message) {
                this.sendToHR(message, profile.channel.CHAT);
            },
            sendToSB: function sendToSB(message) {
                this.sendToHR(message, profile.channel.SB);
            }
        }
    };
})(window);
