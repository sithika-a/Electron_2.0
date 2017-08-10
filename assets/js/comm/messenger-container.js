    (function(R) {
        console.log('Loading PRELOAD ..');
        var domain = location.host || location.href;
        var path = require('path');
        console.debug('Domain :', domain);
        let winCommunicator = require('electron').remote.require(path.join(process.cwd(), '/assets/js/comm/eventBus.js'));
        console.log('winCommunicator : ', winCommunicator)
        R['emitter'] = {
            isValid(message) {
                if (message && typeof message == 'object') {
                    return message;
                }
                // if (message && typeof message == 'object' && message.metaData && message.metaData.dest && message.metaData.dest.channel)
            },
            sendToHiddenWindow(message) {
                if (this.isValid(message)) {
                    console.log('It is a valid message ...')
                    winCommunicator.sendToHiddenWindow(message);
                } else {
                    console.log('invalid valid message ...')

                }
            },
            publish: winCommunicator.publish,
            subscribe: winCommunicator.subscribe,
            unSubscribe: winCommunicator.unSubscribe,
            unSubscribeAll: winCommunicator.unSubscribeAll
        }
    })(window)