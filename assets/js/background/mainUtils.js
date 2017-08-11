let util = {
    namespace: {
        APP_ID: /^win/.test(process.platform) && /FULLClient/.test(process.execPath) ? 'FULL' : 'AnywhereWorks', // "AnyWhereWorks || FULL" any branding app will behave based on it.
        HIDDEN_CONTAINER: 'HiddenWindow',
        CONTAINER_CHAT: 'AnyWhereWorks',
        CONTAINER_CHAT_ALIAS: 'Chat',
        CONTAINER_SB: 'FULL',
        CONTAINER_V2: 'V2',
        CONTAINER_TIMER: 'Timer',
        CONTAINER_V2_SOFTPHONE: 'V2SoftPhone',
        ZOOMIN: 'ZoomIn',
        ZOOMOUT: 'ZoomOut',
        ENABLE: 'enable',
        DISABLE: 'disable',
        BOTH: 'Both',
        ALL: 'All',
        ZOOMIN_LIMIT: 9,
        ZOOMOUT_LIMIT: -8,
        ZOOM_ACTUAL_SIZE: 0,
        ZOOM_FACTOR: 1
    },
    userInfo: null,
    config: null,
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
    getAppPath() {
        return path.join(path.join(process.resourcesPath, 'app'));
    },
    getFilePath() {
        return (this.getConfig() && this.getConfig().mode == 'code') ? process.cwd() : this.getAppPath();
    },
    getManifest() {
        return require(path.join(this.getFilePath(), 'package.json')); // getting package json path
    },
    getModule(relativePath){
        if(relativePath){
            return require(path.join(this.getFilePath(), relativePath));
        }
    },
    getwebPreload() {
        arr = manifest.main.match(/(.*asar)/g) // matching asar string. This will return matching array 
        asarPath = arr && arr.length ? '/' + arr[0] : '/asar/full.asar'; // getting first matched value 
        return path.join(this.getFilePath(), asarPath, this.namespace.preload.webview); // getting asar path
    }
}

module.exports = util;
let path = require('path');