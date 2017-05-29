try {
    var argv = global.sharedObject.cliArgs;
    if (argv && argv['disable-network-check'])
        throw new Error('network check disabled')

    var isOnline = require('is-online');
    var path = require('path');
    var boot = {
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
            return ipcController.getContainer(namespace.CONTAINER_CHAT);
        },
        resetPromise: function() {
            boot.promise = null;
        },
        loadURL: function(urlToLoad, isNWUp ) {
            var container = boot.getContainer();
            if (new RegExp(path.basename(container.webContents.getURL()), 'i').test(urlToLoad)){
                container.send('webapp-nw',{
                    name : 'networkBoot',
                    isUp : isNWUp
                });
                return;
            }
            container.loadURL(urlToLoad);
        },
        getDownURL: function() {
            return /^darwin/.test(process.platform) ?
                'file://' + WindowManager.getFilePath() + '/view/wifi.html' :
                'file://' + WindowManager.getFilePath() + '/view/ethernet.html';
        },
        getUpURL: function() {
            return 'file://' + WindowManager.getFilePath() + '/view/AnywhereWorks.html';
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
        reset: function() {
            boot.stop();
            boot.resetPromise();
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
                        boot.loadURL(boot.getUpURL(),true);
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
        init: function() {
            console.log('******* boot check started ********** ');
            isOnline(boot.callback);
            this.start(boot.callback);
        }
    }

    Emitter.on('mainOnload', boot.init.bind(boot));
    Emitter.on('/network/boot/startup', boot.init.bind(boot));
    Emitter.on('/user/contact/available', boot.reset.bind(boot));
} catch (e) {
    console.log('Error in network boot checker');
    console.log(e.message);
    console.log(e.stack);
};