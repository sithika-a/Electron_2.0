(function(R) {
    console.log(`Loading PRELOAD ..`);
    let domain = location.host || location.href;
    console.debug(`Domain : ${domain}`);
    const messenger = require(`electron`).remote.require(`../comm/messenger.js`);

    R["FULLClient"] = {
        require,
        emitter: {
            broadCast : messenger.broadCast,
            subscribe: messenger.subscribe,
            unSubscribe: messenger.unSubscribe,
            unSubscribeAll: messenger.unSubscribeAll,
            isValid(message) {
                if (message && typeof message == `object`) return message;
            },
            wrap_msg(destination, message) {
                if (destination && this.isValid(message))
                return {
                        name: messenger.profile.actionData,
                        destination: destination,
                        message: message
                }
            },
            sendToHR(message, destination = messenger.profile.channel.Mediator) {
                var msgObj = this.wrap_msg(destination, message);
                // console.log(`wrapper of message : ${JSON.stringify(msgObj)}`);

                if (msgObj) messenger.sendToHR(msgObj);
            },
            sendToMain(message) {
                this.sendToHR(message, messenger.profile.channel.Main);
            },
            sendToV2(message) {
                this.sendToHR(message, messenger.profile.channel.V2);
            },
            sendToChat(message) {
                this.sendToHR(message, messenger.profile.channel.CHAT);
            },
            sendToSB(message) {
                this.sendToHR(message, messenger.profile.channel.SB);
            }
        }
    }

})(window);