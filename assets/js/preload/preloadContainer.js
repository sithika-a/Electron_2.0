(function(R) {
    console.log(`Loading PRELOAD ..`);
    let domain = location.host || location.href;
    var path = require(`path`);
    console.debug(`Domain : ${domain}`);
    const messenger = require(`electron`).remote.require(path.join(process.cwd(), `/assets/comm/messenger.js`));
    R["FULLClient"] = {
        require,
        emitter: {
            broadCast: messenger.broadCast,
            subscribe: messenger.subscribe,
            unSubscribe: messenger.unSubscribe,
            unSubscribeAll: messenger.unSubscribeAll,
            isValid(message) {
                if (message && typeof message == `object` && message.metaData && message.metaData.dest && message.metaData.dest.channel)
                    return message;
            },
            wrap_msg(destination, message) {
                if (destination && this.isValid(message))
                    return {
                        name: messenger.actionData,
                        destination: destination,
                        message: message
                    }
            },
            sendToMediator(message) {
                // var msgObj = this.wrap_msg(destination, message);
                // console.log(`wrapper of message : ${JSON.stringify(msgObj)}`);
                console.log(`sendint to mediator ... from preload...${JSON.stringify(message)}`)
                if (this.isValid(message)) {
                    console.log('It is a valid message ...')
                    messenger.sendToMediator(message);
                } else {
                    console.log('invalid valid message ...')

                }
            },
            sendToMain(message) {
                console.log(`send to main from preload ...`)
                this.sendToMediator(message);
            },
            sendToV2(message) {
                this.sendToMediator(message, messenger.channel.V2);
            },
            sendToChat(message) {
                this.sendToMediator(message, messenger.channel.CHAT);
            },
            sendToSB(message) {
                this.sendToMediator(message, messenger.channel.SB);
            }
        }
    }

})(window);