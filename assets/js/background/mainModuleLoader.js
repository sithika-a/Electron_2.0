var mainModuleLoader = {
    name: 'mainModuleLoader',
    log: function() {
        console.log.apply(console, arguments);
    }
};

// based on the userInfo Update Event call this.
// mainModuleLoader.skillBasedLoader();

mainModuleLoader.skillBasedLoader = function() {
    // console.log('skillBasedLoader ...',userInfo)
    // APP_ID should be "AnyWhereWorks" chat to start
    if (typeof userInfo != 'undefined' && Object.keys(userInfo).length) {
        console.log('user contact available..')
        Emitter.emit('/user/contact/available');
        if(userInfo.isCEA) {
            this.customerExecutiveAssociate();
        } else if (userInfo.isFullWork) {
            console.log('chat mode ...')
            this.chatMode();
        } else {
            this.callCenterMode();
        }
    }
}

mainModuleLoader.customerExecutiveAssociate = function() {
    WindowManager.openWebContainer(true);
    windowEventsController.eventHandler(container.get(namespace.CONTAINER_CHAT), 'show');
    if (/win/.test(process.platform))
        windowEventsController.eventHandler(container.get(namespace.CONTAINER_CHAT), 'restore');
    WindowManager.openV2Container(true);
}

mainModuleLoader.chatMode = function() {
    // show chat container
    windowEventsController.eventHandler(container.get(namespace.CONTAINER_CHAT), 'show');
    if (/win/.test(process.platform))
        windowEventsController.eventHandler(container.get(namespace.CONTAINER_CHAT), 'restore');
    // start webContainer with show : false
    WindowManager.openWebContainer(false);
    WindowManager.openV2Container(false);
}

mainModuleLoader.callCenterMode = function() {
    // start webContainer with show : true
    WindowManager.openWebContainer(true);
    WindowManager.openV2Container(false);
    // Hide Chat Window 
    windowEventsController.eventHandler(container.get(namespace.CONTAINER_CHAT), 'hide');
}