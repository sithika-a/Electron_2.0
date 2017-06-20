var path = require(`path`);

var utils = require(path.join(process.cwd(),`assets/js/background/mainUtils.js`))
var WindowManager = require(path.join(process.cwd(),`assets/js/services/WindowManager.js`))
var container = require(path.join(process.cwd(),`assets/js/background/windowAccess.js`))
var mainModuleLoader = {
    name: 'mainModuleLoader',
    log: function() {
        console.log.apply(console, arguments);
    }
};

// based on the userInfo Update Event call this.
// mainModuleLoader.skillBasedLoader();

mainModuleLoader.skillBasedLoader = function() {
    // console.log('skillBasedLoader ...',utils.userInfo)
    // APP_ID should be "AnyWhereWorks" chat to start
    if (typeof utils.userInfo != 'undefined' && Object.keys(utils.userInfo).length) {
        console.log('user contact available..')
        Emitter.emit('/user/contact/available');
        if(utils.userInfo.isCEA) {
            this.customerExecutiveAssociate();
        } else if (utils.userInfo.isFullWork) {
            console.log('chat mode ...')
            this.chatMode();
        } else {
            this.callCenterMode();
        }
    }
}

mainModuleLoader.customerExecutiveAssociate = function() {
    WindowManager.openWebContainer(true);
    windowEventsController.eventHandler(container.get(utils.namespace.CONTAINER_CHAT), 'show');
    if (/win/.test(process.platform))
        windowEventsController.eventHandler(container.get(utils.namespace.CONTAINER_CHAT), 'restore');
    WindowManager.openV2Container(true);
}

mainModuleLoader.chatMode = function() {
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