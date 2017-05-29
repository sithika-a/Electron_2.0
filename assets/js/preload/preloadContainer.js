'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

(function (R) {
    console.log('Loading PRELOAD ..');
    var domain = location.host || location.href;
    console.debug('Domain : ' + domain);
    var messenger = require('electron').remote.require('../comm/messenger.js');

    R["FULLClient"] = {
        require: require,
        emitter: {
            broadCast: messenger.broadCast,
            subscribe: messenger.subscribe,
            unSubscribe: messenger.unSubscribe,
            unSubscribeAll: messenger.unSubscribeAll,
            isValid: function isValid(message) {
                if (message && (typeof message === 'undefined' ? 'undefined' : _typeof(message)) == 'object') return message;
            },

            wrap_msg: function wrap_msg(destination, message) {
                if (destination && this.isValid(message)) ;
                return {
                    // detail: {
                    name: 'windowCommunicationObject',
                    destination: destination,
                    source: message.source || null,
                    message: message
                    // }
                };
            },
            sendToHR: function sendToHR() {
                var destination = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : messenger.namespace.Mediator;
                var message = arguments[1];

                var msgObj = this.wrap_msg(destination, message);
                console.log('wrapper of message : ' + JSON.stringify(msgObj));
                // if (msgObj) messenger.sendToHR({message : JSON.stringify(msgObj)});

                if (msgObj) messenger.sendToHR(msgObj);
            },
            sendToMain: function sendToMain(message) {
                this.sendToHR(messenger.namespace.Main, message);
            },
            sendToV2: function sendToV2(message) {
                this.sendToHR(messenger.namespace.V2, message);
            },
            sendToChat: function sendToChat(message) {
                this.sendToHR(messenger.namespace.CHAT, message);
            },
            sendToSB: function sendToSB(message) {
                this.sendToHR(messenger.namespace.SB, message);
            }
        }
    };
})(window);