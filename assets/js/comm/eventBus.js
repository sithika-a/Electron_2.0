const Emitter = new(require('events').EventEmitter);
const channel = {
    SB: 'msg-to-switchboard', // SB container
    CHAT: 'msg-to-chat', // AnyWhereWorks container
    V2: 'msg-to-v2', // v2 container
    HIDDEN_CONTAINER: 'msg-to-hidden-window', // hidden Renderer
    BROWSER: 'msg-to-browser' // BackGround process
};
let internamEmitter = {
    id: 'internamEmitter', // module Name
    message: null,
    on(...args) {
        Emitter.on(...args);
    },
    emit(event, data) {
        Emitter.emit(event, {
            'data': data
        });
    },
    isValid(dataObj) {
        return dataObj && typeof dataObj == 'object' ? true : false;
    }
}
let eventBus = {
    subscribe(event, callBack) {
        if (event && callBack && typeof callBack == 'function') {
            internamEmitter.on(event, callBack);
        }
    },
    unSubscribe(eventName, callBack) {
        if (eventName) {
            if (callBack && typeof callBack == 'function') {
                console.log('removing listener')
                Emitter.removeListener(eventName, callBack);
                return true
            }
            throw new Error('[internamEmitter.unSubscribe] : callBack is not provided or inValid');
        }
        throw new Error('[internamEmitter.unSubscribe] : eventName is not provided');

    },
    unSubscribeAll(eventList) {
        if (eventList) {
            Emitter.removeAllListeners(eventList)
        } else {
            Emitter.removeAllListeners()
        }
    },
    publish(target, message) {
        if (internamEmitter.isValid(message)) {
            if (target) {
                internamEmitter.emit(target, message)
                return true;
            }
        } else {
            console.log('is inValid message', message)

        }
    },
    sendToMain(msg) {
        console.log('publish to main in internamEmitter...', msg)
        this.publish(channel.BROWSER, msg)
    },
    sendToV2(msg) {
        this.publish(channel.V2, msg);
    },
    sendToHiddenWindow(msg) {
        this.publish(channel.HIDDEN_CONTAINER, msg);
    },
    sendToChat(msg) {
        this.publish(channel.CHAT, msg);
    },
    sendToSB(msg) {
        this.publish(channel.SB, msg);
    }
}

module.exports = eventBus;