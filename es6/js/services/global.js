/**
 *
 * All Global & namespace should come under
 * this file.
 **/
Array.prototype.filterObjects = function(key, value) {
    return this.filter(function(x) {
        return x[key] === value;
    })
}
Array.prototype.removeItem = function(key, value) {
    if (value == undefined)
        return;

    for (var i in this) {
        if (this[i][key] == value) {
            this.splice(i, 1);
        }
    }
};

Object.merge = function(o1, o2) {
    if (typeof o1 == 'object' && typeof o2 == 'object') {
        // issue: Array & null are object in javascript.
        for (var i in o2) {
            o1[i] = o2[i];
        }
        return o1;
    }
    throw new Error('Arguments are not Objects');
};

(function(R, undefined) {

    $('#v2_Phone_Icon').hide();

    var path = FULLClient.require('path');

    function getConfig() {
        var config;
        try {
            // WorkAround for check based on code
            // path or production path
            config = require(path.join(process.resourcesPath, "app", "config", "config.json"));
        } catch (e) {
            config = require(path.join(process.cwd(), 'config', 'config.json'));
        }
        return config;
    }

    function getFilePath() {
        if (getConfig() && getConfig().mode == 'code') {
            return process.cwd()
        } else {
            return path.join(path.join(process.resourcesPath, "app"));
        }
    }

    function getManifest() {
        var manifest;
        try {
            // WorkAround for check based on code
            // path or production path
            manifest = require(path.join(process.resourcesPath, "app", "package.json"));
        } catch (e) {
            manifest = require(path.join(process.cwd(), 'package.json'));
        }
        return manifest;
    }

    FULLClient.name = 'FULLClientGlobal';
    FULLClient.canQuit = false;

    FULLClient.log = function() {
        var tmp = [];
        for (var i = arguments.length - 1; i >= 0; i--) {
            tmp[i] = arguments[i];
        };
        tmp.splice(0, 0, '[' + this.name + '] : ');
        console.debug.apply(console, tmp);
    }

    FULLClient.quit = function() {
        // this.App.quit();
        // REDO
    };

    FULLClient.isElectron = function() {
        return process.versions['electron']
    }
    FULLClient.config = getConfig();
    FULLClient.manifest = getManifest();

    FULLClient.getManifest = getManifest;

    FULLClient.getMode = function() {
        return this.config.mode;
    }
    
    FULLClient.isModeValid = function(mode) {
        if (['1.x', 'test-1.x','lily'].indexOf(mode) !== -1) {
            return true;
        }
    }

    FULLClient.setMode = function(mode) {
        // Switch back once all things are fixed
        if (this.isModeValid(mode)) {
            this.config.mode = mode;
            util.app.update();
            return true;
        }

        throw new Error('Mode is not compatible : ' + mode);
    }

    FULLClient.getAppName = function() {
        if (/^darwin/.test(process.platform))
            return path.basename(process.execPath).substring(0, path.basename(process.execPath).lastIndexOf(' '));
        else
            return path.basename(process.execPath).substring(0, (process.execPath).lastIndexOf('\\'));
    }

    FULLClient.getConfig = function() {
        return this.config[this.getMode()];
    }

    FULLClient.getFilePath = getFilePath

    FULLClient.getAppPath = function() {
        return FULLClient.getFilePath().replace(/([/]Contents.*)/g, '')
    }

    FULLClient.set = function(key, value) {
        this[key] = value;
    };

    FULLClient.getAsarPath = function() {
        var arr = FULLClient.getManifest().main.match(/(.*asar)/g)
        return arr && arr.length ? '../' + arr[0] : '../asar/full.asar'
    }
})(this);