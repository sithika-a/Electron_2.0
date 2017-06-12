let userInfo = null;
let path = require('path');
let namespace = {
     messengerPath : `../assets/comm/messenger.js`,
      channel: {
            SB: `msg-to-FULL`, // SB container
            CHAT: `msg-to-Chat`, // AnyWhereWorks container
            V2: `msg-to-V2`, // v2 container
            Mediator: `msg-to-Mediator`, // hidden Renderer
            Main: `msg-to-Main` // BackGround
        },
        preload : {
        	container : `assets/js/preload/preloadContainer.js`,
        	mediator : `assets/js/preload/preloadHiddenWindow.js`,
        	webview : `webPreload.min.js`,
        },
        module : {
        	messageHandler : `mainMessagingModule`
        },
        APP_ID: /^win/.test(process.platform) && /FULLClient/.test(process.execPath) ? `FULL` : `AnywhereWorks`, // "AnyWhereWorks || FULL" any branding app will behave based on it.
        HIDDEN_CONTAINER :`HiddenWindow`,
        CONTAINER_CHAT: `AnyWhereWorks`,
        CONTAINER_CHAT_ALIAS: 'Chat',
        CONTAINER_SB: 'FULL',
        CONTAINER_V2: 'V2',
        CONTAINER_TIMER: 'Timer',
        CONTAINER_V2_SOFTPHONE: 'V2SoftPhone',
        ZOOMIN: `ZoomIn`,
        ZOOMOUT: `ZoomOut`,
        ENABLE: `enable`,
        DISABLE: `disable`,
        BOTH: `Both`,
        ALL: `All`,
        ZOOMIN_LIMIT: 9,
        ZOOMOUT_LIMIT: -8,
        ZOOM_ACTUAL_SIZE: 0,
        ZOOM_FACTOR: 1
    }

let util = {
	config : null,
    userInfo : null,
	getConfig() {
    	if (!this.config) {
            try {
                // WorkAround for check based on code
                // path or production path
                this.config = require(path.join(process.resourcesPath, "app", "config", "config.json"));
            } catch (e) {
                this.config = require(path.join(process.cwd(), 'config', 'config.json'));
            }
        }
        return this.config;

	},
	getAppPath (){
     return path.join(path.join(process.resourcesPath, `app`));
	},
	getFilePath() {
  	return (this.getConfig() && this.getConfig().mode == `code`) ? process.cwd() : this.getAppPath();
	},
	getContainerPreload() {
        return path.join(this.getFilePath(), namespace.preload.container);
    },
    getHiddenWindowPreload() {
        return path.join(this.getFilePath(), namespace.preload.mediator);
    },
    getManifest () {
    	   return require(path.join(this.getFilePath(), 'package.json')); // getting package json path
    },
    getwebPreload() {
        arr = manifest.main.match(/(.*asar)/g) // matching asar string. This will return matching array 
        asarPath = arr && arr.length ? '/' + arr[0] : '/asar/full.asar'; // getting first matched value 
        return path.join(this.getFilePath(), asarPath, namespace.preload.webview); // getting asar path
    }
}



util.sendMessage = {
    contructMessage(actualMessage, channel) {
        var msg = new WindowMessaging();
        msg.info = actualMessage;
        msg.metaData.src.moduleName = actualMessage.moduleName || actualMessage.name || null;
        msg.metaData.dest.channel = channel;
        console.log('contructMessage  : ', msg)

        return msg;
    },
    isValidMsg(message) {
        return (message && typeof message == 'object') ? true : false;
    },
    toMediator(message) {
        if (this.isValidMsg(message)) FULLClient.emitter.sendToMediator(this.contructMessage(message, namespace.channel.Mediator));
    },
    toMain(message) {
        if (this.isValidMsg(message)) FULLClient.emitter.sendToMain(this.contructMessage(message, namespace.channel.Main));
    },
    toSB(message) {
        if (this.isValidMsg(message)) FULLClient.emitter.sendToSB(this.contructMessage(message, namespace.channel.SB));
    },
    toChat(message) {
        if (this.isValidMsg(message)){                
         FULLClient.emitter.sendToChat.call(FULLClient.emitter,this.contructMessage(message, namespace.channel.CHAT));
        }
    },
    toV2(message) {
        if (this.isValidMsg(message)) FULLClient.emitter.sendToV2(this.contructMessage(message, namespace.channel.V2));
    }
}
util.subscribe(`/util/sendMessage/to/mediator`, util.sendMessage, util.sendMessage.toMediator);
util.subscribe(`/util/sendMessage/to/sb`, util.sendMessage, util.sendMessage.toSB);
util.subscribe(`/util/sendMessage/to/chat`, util.sendMessage, util.sendMessage.toChat);
util.subscribe(`/util/sendMessage/to/v2`, util.sendMessage, util.sendMessage.toV2);
util.subscribe(`/util/sendMessage/to/timer`, util.sendMessage, util.sendMessage.toTimer);

    
