(function() {
    var Emitter = new(require("events").EventEmitter);
    var messenger = {
        namespace: {
            SB: 'msg-to-FULL', // SB container
            CHAT: 'msg-to-Chat', // AnyWhereWorks container
            V2: 'msg-to-V2', // v2 container
            Mediator: 'msg-to-Mediator', // hidden Renderer
            Main: 'msg-to-Main' // BackGround
        },
        bridge: {
            'on': function(event, callback) {
                Emitter.on(event, callback);
            },
            'emit': function(event, data) {
                Emitter.emit(event, {
                    'data': data
                });
            }
        },
        getReceiverInfo : function(sender){
             console.log('hey i reached messenger : ',sender);
             this.sendToHR({sender : sender,
                message  :'getReceiverInfo',
                forgetAndFire : false});
        },
        subscribe: function(event, callBack) {
            if (event && callBack && typeof callBack == 'function') {
                this.bridge.on(event, callBack);
            }
        },
        unSubscribe: function(eventName, callBack) {
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
        unSubscribeAll: function(eventList) {
            if (eventList) {
                Emitter.removeAllListeners(eventList)
            } else {
                Emitter.removeAllListeners()
            }
        },
        isValid: function(dataObj) {
            return dataObj && typeof dataObj == 'object' ? true : false;
        },
        broadCast: function(target, message) {
            if (this.isValid(message)) {
                console.log('its a valid message');
                if (target) {
                    console.log('BroadCasting ....')
                    this.bridge.emit(target, message)
                    return true;
                }
                throw new Error('[messenger.broadCast] : target not provided');

            }
            throw new Error('[messenger.broadCast] : MessageData is not an Object :' + message);
        },
        sendToMain: function(msg) {
            console.log('sendint to main .. from messenger core ...')
            this.broadCast(this.namespace.Main, msg)
        },
        sendToV2: function(msg) {
            this.broadCast(this.namespace.V2, msg);
        },
        sendToHR: function(msg) {
            this.broadCast(this.namespace.Mediator, msg);
        },
        sendToChat: function(msg) {
            this.broadCast(this.namespace.CHAT, msg);
        },
        sendToSB: function(msg) {
            this.broadCast(this.namespace.SB, msg);
        }
    }

    module.exports = messenger;

})();
