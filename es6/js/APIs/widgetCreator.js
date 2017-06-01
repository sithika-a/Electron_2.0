/***
      < -- --Widget Container API
      for widnow creation and handling..-- -- >

          USE CASES:
          < --Window Creation-- >

          Refer: https: //github.com/atom/electron/blob/master/docs/api/browser-window.md

        var options = {
              title: 'window1',
              width: 700,
              height: 800,
              alwaysOnTop: true
        }
    
        Syntax: windowCreator.create(URL, options)
      
      Eg:
          var google = windowCreator.create('http://www.google.com', options);
          var yahoo = windowCreator.create('http://www.yahoo.com');

      < --Listening to events: -- >

          Syntax: window.addListeners(eventType, callBack)
      Eg:
          google.addListeners(minimize, function() {
              console.log('Window is getting minimized !!!')
          });

      < --Events Handling-- >

      syntax: window.execute(command);
      Eg: google.execute('show')

      < --Communication between widnows-- >

      Eg: google.execute('send', message)
      Note: should have Listeners on other end to receive the response using "window.addEventListener('ElectronMessage',callbackFn)"
 ***/
var windowCreator = (function() {
    var BrowserWindow = FULLClient.require('electron').remote.BrowserWindow,
        process = typeof process != "undefined" ? process : FULLClient.require('process'),
        path = typeof path != "undefined" ? path : FULLClient.require('path'),
        eventsList = ['close', 'closed', 'focus', 'blur', 'minimize', 'restore', 'maximize', 'unmaximize', 'move', 'resize', 'enter-fullscreen', 'leave-fullscreen'],
        appHelper = {
            isEventAvailable: function(eType) {
                return eventsList.indexOf(eType) !== -1
            },
            getConfig: function() {
                if (!this.config) {
                    try {
                        // WorkAround for check based on code
                        // path or production path
                        this.config = FULLClient.require(path.join(process.resourcesPath, "app", "config", "config.json"));
                    } catch (e) {
                        this.config = FULLClient.require(path.join(process.cwd(), 'config', 'config.json'));
                    }
                }
                return this.config;
            },
            isURL: function(s) {
                var regexp = /(file|ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
                return s ? regexp.test(s) : false;
            },
            getPreloadUrl: function() {
                var manifest = require(path.join(this.getFilePath(), 'package.json')),
                    arr = manifest.main.match(/(.*asar)/g)
                asarPath = arr && arr.length ? '/' + arr[0] : '/asar/full.asar';
                return path.join(this.getFilePath(), asarPath, 'webPreload.min.js');
            },
            getFilePath: function() {
                if (this.getConfig() && this.getConfig().mode == 'code') {
                    return process.cwd()
                } else {
                    return path.join(path.join(process.resourcesPath, "app"));
                }
            }
        }

    return {
        create: function(url, options) {
            var instance, guestPage, preloadUrl,
                userAgent = /Tc-webkit/.test(navigator.userAgent) ? navigator.userAgent : navigator.userAgent + ' Tc-webkit',
                defaults = {
                    show: true,
                    'web-preferences': {
                        preload: appHelper.getPreloadUrl() // Path to Preload js file 
                    }
                };
            if (url && appHelper.isURL(url)) {
                guestPage = url
                options = options ? jQuery.extend(defaults, options) : defaults
                instance = new BrowserWindow(options);
                instance.loadURL(guestPage, { userAgent: userAgent });
                instance.on('closed', function() {
                    console.log('Browser window is closed...., deferencing property for garbage collection. src : ' + guestPage);
                    instance = null;
                });

                instance.webContents.on('did-finish-load', function() {
                    console.log('Browser window content loaded......!');
                    if (options.callback)
                        options.callback.call(options.context);
                });

                return {
                    getWebContents: function() {
                        return instance ? instance.webContents : Error('Window is destroyed or not created yet');
                    },
                    execute: function(command) {
                        // console.log("Reached widgetCreator::command ::",command,"arguments ::",arguments);

                        if (instance && instance[command]) {
                            // Created by ES6 transpilers.
                            if (command == 'send' && (arguments.length > 2 || typeof arguments[1] !== 'object'))
                                throw new Error('Not valid arguments !!');
                            var _instance;
                            for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                                args[_key - 1] = arguments[_key];
                            }

                            if (command == 'send')
                                args.unshift('webapp-msg');
                            return (_instance = instance)[command].apply(_instance, args);
                        }
                        if (instance == null)
                            throw new Error('Window is destroyed or not created yet');
                        else throw new Error('Browser window API  doesn\'t support [' + command + ']');
                    },
                    isEventValid: function(eventName) {
                        return appHelper.isEventAvailable(eventName);
                    },
                    addListeners: function(eventType, cb) {

                        if (instance && eventType && cb && typeof cb == "function" && this.isEventValid(eventType)) {
                            /**
                            *
                            * We have to register the event, on event callback fire pass the respective
                              info to the frame which loaded it.
                            *
                            **/
                            instance.on(eventType, cb);
                        } else if (!instance) {
                            throw new Error('Browser window API  doesn\'t support [' + command + ']');
                        } else {
                            throw new Error('Not valid arguments !!');
                        }
                    }
                }
            } else return false;
        }
    }
})();

// Exporting the module.
if (module) {
    module.exports = windowCreator;
}
