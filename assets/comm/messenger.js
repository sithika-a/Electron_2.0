 
(function() {
    const Emitter = new(require("events").EventEmitter);

    let messenger = {
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
            console.log('isValid message',dataObj)
            return dataObj && typeof dataObj == 'object' ? true : false;
        },
        broadCast(target, message) {
            if (this.isValid(message)) {
                if (target) {
                    this.bridge.emit(target, message)
                    return true;
                }
                // throw new Error('[messenger.broadCast] : target not provided');
            }else {
                            console.log('is inValid message',message)

            }
            // throw new Error('[messenger.broadCast] : MessageData is not an Object :' + message);
        },
        sendToMain(msg) {
            console.log('broadCast to main in messenger...',msg)
            this.broadCast(this.channel.Main, msg)
        },
        sendToV2(msg) {
            this.broadCast(this.channel.V2, msg);
        },
        sendToMediator(msg) {
            this.broadCast(this.channel.Mediator, msg);
        },
        sendToChat(msg) {
            this.broadCast(this.channel.CHAT, msg);
        },
        sendToSB(msg) {
            this.broadCast(this.channel.SB, msg);
        }
    }

    module.exports = messenger;
    
})();