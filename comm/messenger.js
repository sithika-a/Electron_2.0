'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

(function () {
    var Emitter = new (require("events").EventEmitter)();

    var profile = { // Define Module
        id: 'Messenger', // module Name
        action: 'communication', // purpose of module
        actionData: 'winCommunication',
        message: null,
        channel: {
            SB: 'msg-to-FULL', // SB container
            CHAT: 'msg-to-Chat', // AnyWhereWorks container
            V2: 'msg-to-V2', // v2 container
            Mediator: 'msg-to-Mediator', // hidden Renderer
            Main: 'msg-to-Main' // BackGround
        }
    };
    var messenger = {
        profile: profile,

        bridge: {
            on: function on(event, callback) {
                Emitter.on(event, callback);
            },
            emit: function emit(event, data) {
                Emitter.emit(event, {
                    'data': data
                });
            }
        },
        subscribe: function subscribe(event, callBack) {
            if (event && callBack && typeof callBack == 'function') {
                this.bridge.on(event, callBack);
            }
        },
        unSubscribe: function unSubscribe(eventName, callBack) {
            if (eventName) {
                if (callBack && typeof callBack == 'function') {
                    console.log('removing listener');
                    Emitter.removeListener(eventName, callBack);
                    return true;
                }
                throw new Error('[messenger.unSubscribe] : callBack is not provided or inValid');
            }
            throw new Error('[messenger.unSubscribe] : eventName is not provided');
        },
        unSubscribeAll: function unSubscribeAll(eventList) {
            if (eventList) {
                Emitter.removeAllListeners(eventList);
            } else {
                Emitter.removeAllListeners();
            }
        },
        isValid: function isValid(dataObj) {
            return dataObj && (typeof dataObj === 'undefined' ? 'undefined' : _typeof(dataObj)) == 'object' ? true : false;
        },
        broadCast: function broadCast(target, message) {
            if (this.isValid(message)) {
                console.log('its a valid message', message);
                if (target) {
                    console.log('BroadCasting ....', target);
                    this.bridge.emit(target, message);
                    return true;
                }
                throw new Error('[messenger.broadCast] : target not provided');
            }
            throw new Error('[messenger.broadCast] : MessageData is not an Object :' + message);
        },
        sendToMain: function sendToMain(msg) {
            this.broadCast(profile.channel.Main, msg);
        },
        sendToV2: function sendToV2(msg) {
            this.broadCast(profile.channel.V2, msg);
        },
        sendToHR: function sendToHR(msg) {
            this.broadCast(profile.channel.Mediator, msg);
        },
        sendToChat: function sendToChat(msg) {
            this.broadCast(profile.channel.CHAT, msg);
        },
        sendToSB: function sendToSB(msg) {
            this.broadCast(profile.channel.SB, msg);
        }
    };
    module.exports = messenger;
})();
