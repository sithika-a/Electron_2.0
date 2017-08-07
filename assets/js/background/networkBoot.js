try {
    
    if (global.sharedObject) {
        let argv = global.sharedObject.cliArgs;
        if (argv && argv['disable-network-check'])
            throw new Error('network check disabled')
    }

    let isOnline = require('is-online');
    let path = require('path');
    let boot = {
        getPromise: function(n) {
            if (!boot.promise) {
                boot.promise = Promise.resolve(n);
            }
            return boot.promise;
        },
        setPromise: function(promise) {
            if (boot.promise) {
                boot.promise = promise;
                return boot.promise;
            }
        },
        getContainer: function() {
            return messageHandler.getContainer(utilities.namespace.CONTAINER_CHAT);
        },
        resetPromise: function() {
            boot.promise = null;
        },
        loadURL: function(urlToLoad, isNWUp) {
            let container = boot.getContainer();
            if (new RegExp(path.basename(container.webContents.getURL()), 'i').test(urlToLoad)) {
                container.send('webapp-nw', {
                    name: 'networkBoot',
                    isUp: isNWUp
                });
                return;
            }
            container.loadURL(urlToLoad);
        },
        getDownURL: function() {
            return /^darwin/.test(process.platform) ?
                'file://' + utilities.getFilePath() + '/view/wifi.html' :
                'file://' + utilities.getFilePath() + '/view/ethernet.html';
        },
        getUpURL: function() {
            return 'file://' + utilities.getFilePath() + '/view/AnywhereWorks.html';
        },
        start: function(cb) {
            this.stop()
            this.intervalID = setInterval(function() {
                isOnline(cb);
            }, 500);
        },
        stop: function() {
            clearInterval(boot.intervalID);
        },

        isDownCB: function() {
            boot.setPromise(
                boot.getPromise(0)
                .then(function(value) {
                    // console.log('isDownCB ', value);
                    if (value <= -2) {
                        // clear the promise
                        boot.resetPromise();
                        // load page.
                        boot.loadURL(boot.getDownURL(), false);
                    }
                    return --value;
                })
            )
        },
        isUpCB: function() {
            boot.setPromise(
                boot.getPromise(0)
                .then(function(value) {
                    // console.log('isUp ', value)
                    if (value >= 2) {
                        // clear the promise
                        boot.resetPromise();
                        // load page.
                        boot.loadURL(boot.getUpURL(), true);
                    }
                    return ++value;
                })
            )
        },
        callback: function(err, indicator) {
            // either we have to send or 
            // decide based on 0 or 1.
            if (indicator)
                boot.isUpCB();
            else
                boot.isDownCB();
        },

    }
    let public = {
        init: function() {
            console.log('******* boot check started ********** ');
            isOnline(boot.callback);
            boot.start(boot.callback);
        },
        reset: function() {
            boot.stop();
            boot.resetPromise();
        }

    }
    module.exports = public;
    let utilities = require('./mainUtils.js');
    let messageHandler = require('./mainMessaging.js');
    let WindowManager = require('./windowManager.js');

} catch (e) {
    console.log('Error in network boot checker');
    console.log(e.message);
    console.log(e.stack);
};