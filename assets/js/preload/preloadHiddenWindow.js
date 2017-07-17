(function(R) {
    console.log(`Loading PRELOAD ..`);
    let domain = location.host || location.href;
    let path = require(`path`);
    console.debug(`Domain : ${domain}`);
    const messenger = require(`electron`).remote.require(path.join(process.cwd(), `/assets/comm/messenger.js`));
    R[`FULLClient`] = {
        require,
        emitter: {
            broadCast: messenger.broadCast,
            subscribe: messenger.subscribe,
            unSubscribe: messenger.unSubscribe,
            unSubscribeAll: messenger.unSubscribeAll,
            isValid(msg) {
                if (msg && typeof msg == `object`) {
                    return msg;
                }
            },
            sendToChat(msg) {
                console.log(`hey sending to chat from hidden window preload...`,msg)
                if (this.isValid(msg)){
                    messenger.sendToChat(msg);
                }
            },
            sendToV2(msg) {
                if (this.isValid(msg))
                    messenger.sendToV2(msg);
            },
            sendToSB(msg) {
                if (this.isValid(msg))
                    messenger.sendToSB(msg);
            },sendToMain(msg) {
                if (this.isValid(msg)){
                    messenger.sendToMain(msg);
                }
            }
        }
    };
})(window);