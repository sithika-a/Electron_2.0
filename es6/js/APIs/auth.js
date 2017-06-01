function getParameters(url) {
    if (!url)
        return {};

    var keyValue = {};
    if (url.indexOf('?') !== -1) {
        var lUrl = url.split('?')
        lUrl = lUrl[1].split('&');
        for (var i = lUrl.length - 1; i >= 0; i--) {
            var key, value;
            key = lUrl[i].split('=')[0]
            value = lUrl[i].split('=')[1]
            keyValue[key] = value;
        };
    }
    return (keyValue);
}

var Electron = {
    isElectron: function() {
        return navigator.userAgent.indexOf('Electron') !== -1
    },
    isValid: function(msg) {
        return msg && typeof msg == 'object' ? msg : false;
    },
    post: function(msg) {
        if (!this.isElectron() || typeof msg !== "object") {
            /**
             * Application is not running in Electron container,
             * So browser based postmessage will work.
             */
            return false;
        }
        if (window.FULLClient && FULLClient.ipc && this.isValid(msg)) {
            /**
             * sbContainer fn would be "sendToFULL" -> FULLClient.ipc.sendToFULL(<jsMessageObject>);
             * v2Container fn would be "sendToV2" -> FULLClient.ipc.sendToV2(<jsMessageObject>);
             * chatContainer fn would be "sendToCHAT" -> FULLClient.ipc.sendToCHAT(<jsMessageObject>);
             */
            FULLClient.ipc.sendToChat(msg);
        }
        /**
         * via node-js and Electron IPC
         * more direct way
         */
        else if (window.require && window.process) {
            var ipc = require('electron').ipcRenderer;
            ipc.send('msg-to-Chat', msg);
        }
        else {
            console.error('NO IPC or FULLClient API available');
        }
    },
    messageHandler : function( message ){
    	 var e = message.detail;
    	 switch (e.name) {
	        case "init":
	            {
                    // SEND request params for fullAuth js Implementation
                    var params = getParameters(location.href);
                    params['name'] = 'oAuth';
                    console.warn('Location Params ', params );
                    this.post(params,'chat');
                }
	        default:
	            break;
    	}
    }
}

window.addEventListener('ElectronMessage', Electron.messageHandler.bind(Electron));