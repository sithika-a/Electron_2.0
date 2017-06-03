(function() {
    const Emitter = new(require("events").EventEmitter);

    let messenger = {
        profile: { // Define Module
            id: `Messenger`, // module Name
            action: `communication`, // purpose of module
            actionData: `winCommunication`,
            message: null,
            channel: {
                SB: `msg-to-FULL`, // SB container
                CHAT: `msg-to-Chat`, // AnyWhereWorks container
                V2: `msg-to-V2`, // v2 container
                Mediator: `msg-to-Mediator`, // hidden Renderer
                Main: `msg-to-Main` // BackGround
            }
        },
        bridge: {
            on(event, callback) {
                Emitter.on(event, callback);
            },
            emit(event, data) {
                Emitter.emit(event, {
                    'data': data
                });
            }
        },
        subscribe(event, callBack) {
            if (event && callBack && typeof callBack == 'function') {
                this.bridge.on(event, callBack);
            }
        },
        unSubscribe(eventName, callBack) {
            if (eventName) {
                if (callBack && typeof callBack == 'function') {
                    console.log('removing listener')
                    Emitter.removeListener(eventName, callBack);
                    return true
                }
                throw new Error('[messenger.unSubscribe] : callBack is not provided or inValid');
            }
            throw new Error('[messenger.unSubscribe] : eventName is not provided');

        },
        unSubscribeAll(eventList) {
            if (eventList) {
                Emitter.removeAllListeners(eventList)
            } else {
                Emitter.removeAllListeners()
            }
        },
        isValid(dataObj) {
            return dataObj && typeof dataObj == 'object' ? true : false;
        },
        broadCast(target, message) {
            if (this.isValid(message)) {
                console.log('its a valid message', message);
                if (target) {
                    console.log('BroadCasting ....', target)
                    this.bridge.emit(target, message)
                    return true;
                }
                throw new Error('[messenger.broadCast] : target not provided');

            }
            throw new Error('[messenger.broadCast] : MessageData is not an Object :' + message);
        },
        sendToMain(msg) {
            this.broadCast(this.profile.channel.Main, msg)
        },
        sendToV2(msg) {
            this.broadCast(this.profile.channel.V2, msg);
        },
        sendToHR(msg) {
            this.broadCast(this.profile.channel.Mediator, msg);
        },
        sendToChat(msg) {
            this.broadCast(this.profile.channel.CHAT, msg);
        },
        sendToSB(msg) {
            this.broadCast(this.profile.channel.SB, msg);
        }
    }
    module.exports = messenger;
})();