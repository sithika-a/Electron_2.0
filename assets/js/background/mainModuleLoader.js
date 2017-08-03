    let WindowManager = require(`./windowManager.js`);
    let networkBoot = require(`./networkBoot.js`);
    let menuActions = require(`./menuActions.js`);
    let windowEventsController = require(`./windowEvents.js`)

    let mainModuleLoader = {
        name: 'mainModuleLoader',
        log: function() {
            console.log.apply(console, arguments);
        }
    };

    // based on the userInfo Update Event call this.
    // mainModuleLoader.skillBasedLoader();

    mainModuleLoader.skillBasedLoader = function() {
        console.log('skillBasedLoader ...',utils.userInfo)
        // APP_ID should be "AnyWhereWorks" chat to start
        if (typeof utils.userInfo != 'undefined' && Object.keys(utils.userInfo).length) {
            console.log('user contact available..');
            networkBoot.reset();
            menuActions.enableAll();
            if (utils.userInfo.isCEA) {
                console.log('cea mode ...')

                this.customerExecutiveAssociate();
            } else if (utils.userInfo.isFullWork) {
                console.log('chat mode ...')
                // this.chatMode();
            } else {
                console.log('callCenterMode mode ...')

                // this.callCenterMode();
            }
        }
    }

    mainModuleLoader.customerExecutiveAssociate = function() {
                console.log('WindowManager ***',WindowManager)

        console.log('WindowManager functions.. *** ',WindowManager.openHiddenContainer)
        WindowManager.openWebContainer(true);
        windowEventsController.eventHandler(container.get(utils.namespace.CONTAINER_CHAT), 'show');
        if (/win/.test(process.platform))
            windowEventsController.eventHandler(container.get(utils.namespace.CONTAINER_CHAT), 'restore');
        WindowManager.openV2Container(true);
    }

    mainModuleLoader.chatMode = function() {
        console.log('Chat mode in mainModuleLoader...')
            // show chat container
        windowEventsController.eventHandler(container.get(utils.namespace.CONTAINER_CHAT), 'show');
        if (/win/.test(process.platform))
            windowEventsController.eventHandler(container.get(utils.namespace.CONTAINER_CHAT), 'restore');
        // start webContainer with show : false
        WindowManager.openWebContainer(false);
        WindowManager.openV2Container(false);
    }

    mainModuleLoader.callCenterMode = function() {
        // start webContainer with show : true
        WindowManager.openWebContainer(true);
        WindowManager.openV2Container(false);
        // Hide Chat Window 
        windowEventsController.eventHandler(container.get(utils.namespace.CONTAINER_CHAT), 'hide');
    }

module.exports = mainModuleLoader;