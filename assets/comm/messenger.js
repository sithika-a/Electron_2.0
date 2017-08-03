const Emitter = new(require('events').EventEmitter);
let messenger = {
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
    isValid(dataObj) {
        return dataObj && typeof dataObj == 'object' ? true : false;
    }
}
let public = {
    subscribe(event, callBack) {
        if (event && callBack && typeof callBack == 'function') {
            messenger.bridge.on(event, callBack);
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
    publish(target, message) {
        if (messenger.isValid(message)) {
            if (target) {
                messenger.bridge.emit(target, message)
                return true;
            }
        } else {
            console.log('is inValid message', message)

        }
    },
    sendToMain(msg) {
        console.log('publish to main in messenger...', msg)
        this.publish(this.channel.Main, msg)
    },
    sendToV2(msg) {
        this.publish(this.channel.V2, msg);
    },
    sendToMediator(msg) {
        this.publish(this.channel.Mediator, msg);
    },
    sendToChat(msg) {
        this.publish(this.channel.CHAT, msg);
    },
    sendToSB(msg) {
        this.publish(this.channel.SB, msg);
    }
}

module.exports = public;