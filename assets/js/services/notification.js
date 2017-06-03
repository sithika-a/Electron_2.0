(function(R, $, util, undefined) {
    var fs = FULLClient.require('fs');
    var feedbackAlerted = false;
    try {
        var nodeNotifier = FULLClient.require("node-notifier");

        function FullNotification(clientListenerObj) {
            console.log('Instanciate ...',clientListenerObj, ': arguments: ',arguments)
            this.name = "FULLNotification";
            this.source = clientListenerObj != null ? clientListenerObj : location.origin;
            this.container = util.window.getName();
            this.title = this.getTitlefromObject();
            this.body = this.getBodyfromObject();
            this.icon = this.getIconfromObject();
            this.silent = this.getSilentOption();
            this.focusContainer = this.getfocusContainer();
            this.create();
        }
        FullNotification.prototype.create = function() {
            console.log('create : ')
            var options = {
                title: this.title,
                body: this.body,
                name: this.name,
                icon: this.icon,
                source: this.source,
                container: this.container,
                silent: this.silent,
                focusContainer: this.focusContainer
            };
            if (/^darwin/.test(process.platform)) {
                console.log('macNotification ...')
                this.macNotification(options);
            } else if (/^win/.test(process.platform)) {
                                console.log('win Notification ...')

                this.windowsNotification(options);
            }
        };
        FullNotification.prototype._isValid = function() {
            if (this.source && this.source.notify)
                return true;
            else
                return false;
        };
        FullNotification.prototype.getTitlefromObject = function() {
            return this.source.notify.title && this._isValid() ? this.source.notify.title : "Fullclient_Title";
        };
        FullNotification.prototype.getBodyfromObject = function() {
            return this.source.notify.body && this._isValid() ? this.replaceSlash(this.source.notify.body) : "Fullclient_Message";
        };

        FullNotification.prototype.getIconfromObject = function() {
            return this.source.notify.icon && this._isValid() ? this.source.notify.icon : "";
        };
        FullNotification.prototype.getSilentOption = function() {
            return this.source.notify.silent || true;
        };
        FullNotification.prototype.getfocusContainer = function() {
            return this.source.notify.focusContainer || true;
        };
        FullNotification.prototype.replaceSlash = function(str) {
            //return str.replace(/\\/g, '.'); // old
            return str.replace(/\\/g, '.').replace(/\r?\n|\r/g, '.');
        };


        FullNotification.prototype.macNotification = function(nObj) {
            var sourceObj, notificatioObj, containerName, options, _keys, _tc;
            if (nObj.source.name == "clientlistener" && nObj.source.opt == "notify" && nObj.source.notify)
                sourceObj = nObj.source.notify;
            else
                sourceObj = nObj.source;
            notificatioObj = this.getnotifyObject(sourceObj);
            if (notificationController.canUseTerminlNotifier) {
                console.log('macTerminalNotification:',notificatioObj)
                this.macTerminalNotification(notificatioObj, nObj);
            } else {
                console.warn('Falling back to backup notification');
                if (!feedbackAlerted) {
                    feedbackAlerted = true
                    util.publish('/feedback/initiate', {
                        userFeedback: 'System generated feedback, Notification is falling back to native notification scheme'
                    });
                }
            }
        };

        // FullNotification.prototype.macBrowserNotification = function(notificatioObj, nObj) {
        //     console.log("Using macBrowserNotification machanism");
        //     var notifyObject = new Notification(this.getTitle(nObj), {
        //         body: this.getBody(nObj),
        //         icon: this.getIcon(nObj),
        //         silent: nObj.silent
        //     });
        //     notifyObject.onclick = function(e) {
        //         notificationController.activeNotification = null;
        //         this.sendClickeventHelper(notificatioObj, nObj);
        //     }.bind(this);
        //     notifyObject.onerror = function(e) {
        //         notificationController.activeNotification = null;
        //         this.handlefullexception(e);
        //     }.bind(this);
        //     notifyObject.onclose = function() {
        //         notificationController.activeNotification = null;
        //     }.bind(this);

        //     setTimeout(function() {
        //         /**
        //          *  Onclose event is not triggering . if user closes notification by x-close, after that point
        //          *  notification is not working. because we have to make 'activeNotification' to null. so after 3 seconds
        //          *  we are making it null.
        //          */
        //         notificationController.activeNotification = null;
        //     }.bind(this), 3000);
        // };

        FullNotification.prototype.macTerminalNotification = function(notificatioObj, nObj) {
            var nc = new nodeNotifier.NotificationCenter();

            nc.notify({
                title: this.getTitle(nObj),
                message: this.getBody(nObj),
                contentImage: this.getIcon(nObj),
                remove: "ALL",
                wait: false // Wait with callback, until user action is taken against notification
            }, function(err, response) {
                if (err) {
                    console.log("Error in macNotification:", err);
                }
                //if(new RegExp(response,'i').test(['Removing previously sent notification','Activate']))
                if (response.indexOf('Removing previously sent notification') != -1 && response.indexOf('Activate') != -1) {
                    nc.emit('click');
                }
            }.bind(this));

            nc.once('click', function(notifierObject, options) {
                var currentWin = util.getCurrentWindow();
                currentWin.setAlwaysOnTop(true);

                setTimeout(function() {
                    currentWin.setAlwaysOnTop(false);
                }.bind(this), 200);
                this.sendClickeventHelper(notificatioObj, nObj);
                notificationController.activeNotification = null;
            }.bind(this));

            nc.once('timeout', function(notifierObject, options) {
                notificationController.activeNotification = null;
            }.bind(this));

            setTimeout(function() {
                /**
                 *  Onclose event is not triggering . if user closes notification by x-close, after that point
                 *  notification is not working. because we have to make 'activeNotification' to null. so after 3 seconds
                 *  we are making it null.
                 */
                notificationController.activeNotification = null;
            }.bind(this), 3000);

        };

        FullNotification.prototype.sendClickeventHelper = function(notificatioObj, nObj) {
            if (nObj.container && nObj.focusContainer) {
                this.showAppropriateWindow(nObj.container); // showing appropriate window.
            }
            _tc = new Thinclient("notify");
            _tc[_tc.opt].isEvent = true;
            _keys = Object.keys(notificatioObj);
            for (var i = _keys.length - 1; i >= 0; i--) {
                _tc[_tc.opt][_keys[i]] = notificatioObj[_keys[i]];
            }
            _tc[_tc.opt].type = "click";
            this.sendClickEventToContainer(nObj.container, _tc);

        };

        FullNotification.prototype.windowsNotification = function(nObj) {
            var sourceObj, notificatioObj, containerName, _keys, _tc;
            var nc = new nodeNotifier.WindowsBalloon();
            if (nObj.source.name == "clientlistener" && nObj.source.opt == "notify" && nObj.source.notify) sourceObj = nObj.source.notify; //
            else sourceObj = nObj.source; //
            notificatioObj = this.getnotifyObject(sourceObj);
            // containerName = this.getContainer(this.source);
            setTimeout(function() {
                /**
                 *  Onclose event is not triggering . if user closes notification by x-close, after that point
                 *  notification is not working. because we have to make 'activeNotification' to null. so after 3 seconds
                 *  we are making it null.
                 */
                notificationController.activeNotification = null;
            }.bind(this), 3000);

            nc.notify({
                title: this.getTitle(nObj),
                message: this.getBody(nObj),
                time: 3000,
                wait: true
            }, function(error, response) {
                if (error) this.handlefullexception(error);
            }.bind(this)).on("click", function(arguments) {
                notificationController.activeNotification = null;

                var currentWin = util.getCurrentWindow();
                currentWin.setAlwaysOnTop(true);

                setTimeout(function() {
                    currentWin.setAlwaysOnTop(false);
                }.bind(this), 0);


                if (nObj.container && nObj.focusContainer) {
                    this.showAppropriateWindow(nObj.container); // showing appropriate window.
                }
                _tc = new Thinclient("notify");
                _tc[_tc.opt].isEvent = true;
                _keys = Object.keys(notificatioObj);


                for (var i = _keys.length - 1; i >= 0; i--) {
                    _tc[_tc.opt][_keys[i]] = notificatioObj[_keys[i]];
                }
                _tc[_tc.opt].type = "click";


                this.sendClickEventToContainer(nObj.container, _tc);

            }.bind(this));
        };

        FullNotification.prototype.truncate = function(str, charRestrictionCount) {
            if (str && typeof str == "string") {
                if (charRestrictionCount && str.length > charRestrictionCount) {
                    return str.substr(0, charRestrictionCount);
                } else {
                    return str;
                }
            }
        };
        FullNotification.prototype.getnotifyObject = function(ClientListenerObject) {
            function notifyObject(ClientListenerObject) {
                var _keys = Object.keys(ClientListenerObject);
                for (var i = _keys.length - 1; i >= 0; i--) {
                    this[_keys[i]] = ClientListenerObject[_keys[i]];
                }
            }
            return new notifyObject(ClientListenerObject);
        };
        FullNotification.prototype.getTitle = function(nObj) {
            return this.truncate(nObj.title, 45);
        };
        FullNotification.prototype.getBody = function(nObj) {
            return this.truncate(nObj.body, 150);
        };
        FullNotification.prototype.getIcon = function(nObj) {
            return "";
            // Disabling image code in notification.
            // return nObj ? nObj.icon : "";
        };
        FullNotification.prototype.getContainer = function() {
            if (this.source && this.source.notify.container)
                return this.source.notify.container;
            else
                return false;
        };
        FullNotification.prototype.showAppropriateWindow = function(containerName) {
            switch (containerName) {
                case 'V2':
                    {
                        util.windowEvents.show('V2');
                        break;
                    }
                case 'FULL':
                    {
                        util.windowEvents.show('FULL');
                        break;
                    }
                case 'AnyWhereWorks':
                    {
                        var chatWindow = util.caching.windows.getChat();
                        if (/win32/.test(process.platform) && chatWindow.isMinimized()) {
                            util.windowEvents.restore('Chat');
                            util.windowEvents.show('Chat');
                        } else {
                            util.windowEvents.show('Chat');
                        }
                        break;
                    }
                default:
                    {
                        console.log("Notification sender containerName in not avaialble. We are not taking action...!");
                        break;
                    }
            }

        };
        FullNotification.prototype.sendClickEventToContainer = function(containerName, msg) {
            switch (containerName) {
                case "AnyWhereWorks":
                    {
                        FULLClient.ipc.sendToChat(msg);
                        break;
                    }

                case "FULL":
                    {
                        FULLClient.ipc.sendToSB(msg);
                        break;
                    }

                case "V2":
                    {
                        FULLClient.ipc.sendToV2(msg);
                        break;
                    }

                default:
                    {
                        console.log("Default sequence excecuting in sendClickEventToContainer..!");
                        break;
                    }
            }
        };
        FullNotification.prototype.handlefullexception = function(arg) {
            console.error("Exception in FullNotification module ::", arg);
            console.error("Error stack ::", arg.stack);
        };
        var notificationController = {
            activeNotification: null,
            terminalNotifierPath: '/node_modules/node-notifier/vendor/terminal-notifier.app/Contents/MacOS/terminal-notifier',
            permissionLevel: 0777,
            applicationPath: util.escapeSpaces(process.execPath.replace(/([/]Contents.*)/g, '')),
            canUseTerminlNotifier: false,
            // userPermissionToWriteFile: false,
            create: function() {
                console.log('notificationController : create : ',this.activeNotification)
                if (!this.activeNotification) {
                    this.activeNotification = true;
                    var args = [].slice.apply(arguments);
                                        console.log('before splice Notify args : ',args)

                    args.splice(0, 0, FullNotification);
                    console.log('Notify args : ',args);
                    console.log(FullNotification.bind.apply(FullNotification, args));
                    new(FullNotification.bind.apply(FullNotification, args))();
                }
            },
            checkNotificationDependency: function() {
                if (/^darwin/.test(process.platform)) {
                    console.log("tring to give pre");
                    fs.access(FULLClient.getFilePath() + this.terminalNotifierPath, fs.W_OK && fs.R_OK && fs.X_OK, function(err, res) {
                        if (err) {
                            console.log("Error File down have permissions:", err);
                            this.givingPermissionToTerminalNotifier();
                        } else {
                            console.log("pre done");
                            this.canUseTerminlNotifier = true;
                        }
                    }.bind(this)); // fs.access ends
                }
            },
            givingPermissionToTerminalNotifier: function() {
                fs.chmod(FULLClient.getFilePath() + this.terminalNotifierPath, this.permissionLevel, function(err, stdout, stdin) {
                    if (err) {
                        console.warn("Error in giving permission to terminal-notifier..!", err);
                        this.pushLogsToDev(err);
                    } else {
                        this.canUseTerminlNotifier = true;
                        console.warn("Given permission to terminal-notifier.app : ", this.canUseTerminlNotifier);
                    }
                }.bind(this));
            },
            pushLogsToDev: function(errLogs) {
                util.publish('/mailHelper/mailsend', {
                    type: "Error Log",
                    err: errLogs,
                    subject: "Notification error for " + userDAO.getEmail()
                }, function callback() {
                    console.warn('Error logs : ', errLogs);
                }.bind(this));
            }
        };

        R["FullNotification"] = FullNotification;
        R["notificationController"] = notificationController;

        // having a copy of original notification
        // mask
        var _n = Notification;

        // when constructor is called
        // it will create, wrapper object
        // calling terminal notifier.
        R["Notification"] = function() {
            var args = Array.prototype.slice.call(arguments);
            var message = args[1];

            var n = new ClientListener('notify');
            n[n.opt].title = args[0];
            n[n.opt].body = message ? message.body : "";
            util.publish('/notification/create/show', n);

            return n;
        };
        util.subscribe("/notification/create/show", notificationController, notificationController.create);
        util.subscribe("/notification/create/checkNotificationDependency", notificationController, notificationController.checkNotificationDependency);
    } catch (e) {
        console.log("Exception in FullNotification ::", e);
        console.error("Exception stack ::", e.stack);
    }
})(this, jQuery, util);