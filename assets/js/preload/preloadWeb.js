;(function(R) {
    /**
		Registration of ipc alone contained in this 
        code, bcoz preload is common, in case of
        webapplication pages loaded in webview 
        alone we are define messaging rule and difference
        between container and webview.

        Messaging system for main process is defined 
		in here.
	**/
     if ((navigator.userAgent.indexOf('Tc-webkit') != -1) && typeof FULLClient == 'object') {
        console.debug('IPC Message Registration Success....!!');
        var ipc = FULLClient.require('electron').ipcRenderer;
        ipc.on('webapp-msg', FULLClient.ipc.receive);
        ipc.on('webapp-init', FULLClient.ipc.receive);
    };
})(window);