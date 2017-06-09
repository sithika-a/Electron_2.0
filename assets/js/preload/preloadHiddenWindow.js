(function(R) {
    console.log(`Loading PRELOAD ..`);
    let domain = location.host || location.href;
    let path = require(`path`);
    console.debug(`Domain : ${domain}`);
    const messenger = require("electron").remote.require(path.join(process.cwd(), `/assets/comm/messenger.js`));
    console.log('messenger  :', messenger)
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
            sendToMain(msg) {
                console.log(`sending to main from win`)
                if (this.isValid(msg))
                    messenger.sendToMain(msg);
            },
            sendToV2(msg) {
                if (this.isValid(msg))
                    messenger.sendToV2(msg);
            },
            sendToChat(msg) {
                console.log('sending to chat from hidden win')
                if (this.isValid(msg))
                    messenger.sendToChat(msg);
            },
            sendToSB(msg) {
                if (this.isValid(msg))
                    messenger.sendToSB(msg);
            }
        }
    };
})(window);