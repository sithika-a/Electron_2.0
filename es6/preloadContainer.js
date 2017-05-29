(function(R) {
    console.log(`Loading PRELOAD ..`);
    let domain = location.host || location.href;
    console.debug(`Domain : ${domain}`);
    const messenger = require(`electron`).remote.require(`../comm/messenger.js`);

    R["FULLClient"] = {
        require: require,
        emitter: {
            broadCast : messenger.broadCast,
            subscribe: messenger.subscribe,
            unSubscribe: messenger.unSubscribe,
            unSubscribeAll: messenger.unSubscribeAll,
            isValid(message) {
                if (message && typeof message == 'object') return message;
            },
            wrap_msg: function(destination, message) {
                if (destination && this.isValid(message));
                return {
                    // detail: {
                        name: 'windowCommunicationObject',
                        destination: destination,
                        source: message.source || null,
                        message: message
                    // }
                }
            },
            sendToHR(destination = messenger.namespace.Mediator, message) {
                var msgObj = this.wrap_msg(destination, message);
                console.log(`wrapper of message : ${JSON.stringify(msgObj)}`);
                                // if (msgObj) messenger.sendToHR({message : JSON.stringify(msgObj)});

                if (msgObj) messenger.sendToHR(msgObj);
            },
            sendToMain(message) {
                this.sendToHR(messenger.namespace.Main, message);
            },
            sendToV2(message) {
                this.sendToHR(messenger.namespace.V2, message);
            },
            sendToChat(message) {
                this.sendToHR(messenger.namespace.CHAT, message);
            },
            sendToSB(message) {
                this.sendToHR(messenger.namespace.SB, message);
            }
        }
    }

})(window);