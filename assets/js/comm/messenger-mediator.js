(function(R) {
    console.log('Loading PRELOAD ..');
    let domain = location.host || location.href;
    let path = require('path');
    console.debug('Domain :', domain);
    const winCommunicator = require('electron').remote.require(path.join(process.cwd(), '/assets/js/comm/eventBus.js'));
    let isValid = msg => {
        if (msg && typeof msg == 'object') {
            return msg;
        }
    };
    R['emitter'] = {
        publish: winCommunicator.publish,
        subscribe: winCommunicator.subscribe,
        unSubscribe: winCommunicator.unSubscribe,
        unSubscribeAll: winCommunicator.unSubscribeAll,
        sendToChat(msg) {
            console.log('hey sending to chat from hidden window preload...', msg)
            if (isValid(msg)) {
                winCommunicator.sendToChat(msg);
            }
        },
        sendToV2(msg) {
            if (isValid(msg))
                winCommunicator.sendToV2(msg);
        },
        sendToSB(msg) {
            console.log('hey sending to sb from hidden window preload...', msg);
            if (isValid(msg))
                winCommunicator.sendToSB(msg);
        },
        sendToMain(msg) {
            if (isValid(msg)) {
                winCommunicator.sendToMain(msg);
            }
        }
    };
})(window);