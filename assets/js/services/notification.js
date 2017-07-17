((R, $, util, undefined) => {
    let fs = FULLClient.require(`fs`);
    let feedbackAlerted = false;
    try {
        let nodeNotifier = FULLClient.require(`node-notifier`);

        class FullNotification {
            constructor(message) {
                console.log(`clientlistener Obj :`, message.info)
                this.name = `FULLNotification`;
                this.source = message.info != null ? message.info : location.origin;
                console.log(`clientlistener source :`, this.source)

                this.container = message.metaData.src.windowName;
                this.title = this.getTitlefromObject();
                this.body = this.getBodyfromObject();
                this.icon = this.getIconfromObject();
                this.silent = this.getSilentOption();
                this.focusContainer = this.getfocusContainer();
                this.create();
            }
            create() {
                console.log(`create : `)
                let options = {
                    title: this.title,
                    body: this.body,
                    name: this.name,
                    icon: this.icon,
                    source: this.source,
                    container: this.container,
                    silent: this.silent,
                    focusContainer: this.focusContainer
                };
                if (util.platform.isMac()) {
                    this.macNotification(options);
                } else if (util.platform.isWin()) {
                    console.log(`win Notification ...`)
                    this.windowsNotification(options);
                }
            }
            _isValid() {
                return (this.source && this.source.notify) ? true : false;
            }
            getTitlefromObject() {
                console.log(`source L ${this.souce}`)
                return this.source.notify.title && this._isValid() ? this.source.notify.title : `Fullclient_Title`;
            }
            getBodyfromObject() {
                return this.source.notify.body && this._isValid() ? this.replaceSlash(this.source.notify.body) : `Fullclient_Message`;
            }
            getIconfromObject() {
                console.log('what is this  ? ', this)
                return this.source.notify.icon && this._isValid() ? this.source.notify.icon : ``;
            }
            getSilentOption() {
                return this.source.notify.silent || true;
            }
            getfocusContainer() {
                return this.source.notify.focusContainer || true;
            }
            replaceSlash(str) {
                return str.replace(/\\/g, `.`).replace(/\r?\n|\r/g, `.`);
            }
            getSourceObj(nObj) {
                let sourceObj;
                if (nObj.source.name == `clientlistener` && nObj.source.opt == `notify` && nObj.source.notify)
                    sourceObj = nObj.source.notify;
                else
                    sourceObj = nObj.source;
                return sourceObj;
            }
            macNotification(nObj) {
                let notificatioObj, containerName, options, _keys, _tc;

                notificatioObj = this.getnotifyObject(this.getSourceObj(nObj));
                if (notificationController.canUseTerminlNotifier) {
                    console.log(`macTerminalNotification: `, notificatioObj)
                    this.macTerminalNotification(notificatioObj, nObj);
                } else {
                    console.warn(`Falling back to backup notification`);
                    if (!feedbackAlerted) {
                        feedbackAlerted = true
                        util.publish(`/feedback/initiate`, {
                            userFeedback: `System generated feedback, Notification is falling back to native notification scheme`
                        });
                    }
                }

            }
            macTerminalNotification(notificatioObj, nObj) {
                let nc = new nodeNotifier.NotificationCenter();

                nc.notify({
                    title: this.getTitle(nObj),
                    message: this.getBody(nObj),
                    contentImage: this.getIcon(nObj),
                    remove: `ALL`,
                    wait: false // Wait with callback, until user action is taken against notification
                }, (err, response) => {
                    if (err) {
                        console.log(`Error in macNotification: ${err}`);
                    }
                    //if(new RegExp(response,`i`).test([`Removing previously sent notification`,`Activate`]))
                    if (response.indexOf(`Removing previously sent notification`) != -1 && response.indexOf(`Activate`) != -1) {
                        nc.emit(`click`);
                    }
                });

                nc.once(`click`, (notifierObject, options) => {
                    let targetWin = this.getContainer();
                    targetWin.setAlwaysOnTop(true);

                    setTimeout(() => {
                        targetWin.setAlwaysOnTop(false);
                    }, 200);
                    this.sendClickeventHelper(notificatioObj, nObj);
                    notificationController.activeNotification = null;
                });

                nc.once(`timeout`, (notifierObject, options) => {
                    notificationController.activeNotification = null;
                });

                setTimeout(() => {
                    /**
                     *  Onclose event is not triggering . if user closes notification by x-close, after that point
                     *  notification is not working. because we have to make `activeNotification` to null. so after 3 seconds
                     *  we are making it null.
                     */
                    notificationController.activeNotification = null;
                }, 3000);

            }
            sendClickeventHelper(notificatioObj, nObj) {
                let _keys, _tc;
                if (nObj.container && nObj.focusContainer) {
                    this.showAppropriateWindow(nObj.container); // showing appropriate window.
                }
                _tc = new Thinclient(`notify`);
                _tc[_tc.opt].isEvent = true;
                _keys = Object.keys(notificatioObj);
                for (let i = _keys.length - 1; i >= 0; i--) {
                    _tc[_tc.opt][_keys[i]] = notificatioObj[_keys[i]];
                }
                _tc[_tc.opt].type = `click`;
                console.log(`sendClickeventHelper  tc obj : `, _tc)
                this.sendClickEventToContainer(nObj.container, _tc);
            }
            windowsNotification(nObj) {
                let notificatioObj, containerName, _keys, _tc;
                let nc = new nodeNotifier.WindowsBalloon();

                notificatioObj = this.getnotifyObject(this.getSourceObj(nObj));
                setTimeout(() => {
                    /**
                     *  Onclose event is not triggering . if user closes notification by x-close, after that point
                     *  notification is not working. because we have to make `activeNotification` to null. so after 3 seconds
                     *  we are making it null.
                     */
                    notificationController.activeNotification = null;
                }, 3000);

                nc.notify({
                    title: this.getTitle(nObj),
                    message: this.getBody(nObj),
                    time: 3000,
                    wait: true
                }, (error, response) => {
                    if (error) this.handlefullexception(error);
                }).on(`click`, (...args) => {
                    notificationController.activeNotification = null;

                    let targetWin = this.getContainer();
                    if (targetWin) {
                        targetWin.setAlwaysOnTop(true);
                        setTimeout(() => {
                            targetWin.setAlwaysOnTop(false);
                        }, 0);
                    }

                    if (nObj.container && nObj.focusContainer) {
                        this.showAppropriateWindow(nObj.container); // showing appropriate window.
                    }
                    _tc = new Thinclient(`notify`);
                    _tc[_tc.opt].isEvent = true;
                    _keys = Object.keys(notificatioObj);


                    for (let i = _keys.length - 1; i >= 0; i--) {
                        _tc[_tc.opt][_keys[i]] = notificatioObj[_keys[i]];
                    }
                    _tc[_tc.opt].type = `click`;


                    this.sendClickEventToContainer(nObj.container, _tc);

                });

            }
            truncate(str, charRestrictionCount) {
                if (str && typeof str == `string`) {
                    if (charRestrictionCount && str.length > charRestrictionCount) {
                        return str.substr(0, charRestrictionCount);
                    } else {
                        return str;
                    }
                }
            }
            getnotifyObject(ClientListenerObject) {
                function NotifyObject(ClientListenerObject) {
                    let _keys = Object.keys(ClientListenerObject);
                    for (let i = _keys.length - 1; i >= 0; i--) {
                        this[_keys[i]] = ClientListenerObject[_keys[i]];
                    }
                }
                return new NotifyObject(ClientListenerObject);

            }
            getTitle(nObj) {
                return this.truncate(nObj.title, 45);
            }
            getBody(nObj) {
                return this.truncate(nObj.body, 150);
            }
            getIcon(nObj) {
                return;
            }
            getContainer() {
                if (this.container) {
                    return util.caching.windows.getTarget(this.container)
                }
            }
            showAppropriateWindow(containerName) {
                switch (containerName) {
                    case `V2`:
                        {
                            util.publish(`/util/window/events/show`, `V2`);
                            break;
                        }
                    case `FULL`:
                        {
                            util.publish(`/util/window/events/show`, `FULL`);
                            break;
                        }
                    case `AnyWhereWorks`:
                        {
                            let chatWindow = util.caching.windows.getChat();
                            if (util.platform.isWin() && chatWindow.isMinimized()) {
                                util.publish(`/util/window/events/restore`, `Chat`);
                                util.publish(`/util/window/events/show`, `Chat`);
                            } else {
                                util.publish(`/util/window/events/show`, `Chat`);

                            }
                            break;
                        }
                    default:
                        {
                            console.log(`Notification sender containerName in not avaialble. We are not taking action...!`);
                            break;
                        }
                }

            }
            sendClickEventToContainer(containerName, msg) {
                console.log(`sendClickEventToContainer : containerName : `, containerName, `:`, msg);
                switch (containerName) {
                    case `AnyWhereWorks`:
                        {
util.publish(`/sendMessage/to/chat`,msg);
                            break;
                        }

                    case `FULL`:
                        {
                            util.publish(`/sendMessage/to/sb`,msg);

                            break;
                        }

                    case `V2`:
                        {
                            util.publish(`/sendMessage/to/v2`,msg);

                            break;
                        }

                    default:
                        {
                            console.log(`Default sequence excecuting in sendClickEventToContainer..!`);
                            break;
                        }
                }

            }
            handlefullexception(arg) {
                console.error(`Exception in FullNotification module :: ${arg}`);
                console.error(`Error stack :: ${arg.stack}`);
            }
        }

        let notificationController = {
            activeNotification: null,
            terminalNotifierPath: `/node_modules/node-notifier/vendor/terminal-notifier.app/Contents/MacOS/terminal-notifier`,
            permissionLevel: 0777,
            applicationPath: util.escapeSpaces(process.execPath.replace(/([/]Contents.*)/g, ``)),
            canUseTerminlNotifier: false,
            // userPermissionToWriteFile: false,
            create() {
                console.log(`notificationController : create : ${this.activeNotification}`, arguments)
                if (!this.activeNotification) {
                    this.activeNotification = true;
                    // console.log(`notificationController : create : ${...arguments}`)
                    new(FullNotification.bind.apply(FullNotification, [FullNotification, ...arguments]))();
                }
            },
            checkNotificationDependency() {
                if (util.platform.isMac()) {
                    console.log(`tring to give permission`);
                    fs.access(FULLClient.getFilePath() + this.terminalNotifierPath, fs.W_OK && fs.R_OK && fs.X_OK, (err, res) => {
                        if (err) {
                            console.log(`Error File down have permissions:  ${err}`);
                            this.givingPermissionToTerminalNotifier();
                        } else {
                            console.log(`pre done`);
                            this.canUseTerminlNotifier = true;
                        }
                    }); // fs.access ends
                }
            },
            givingPermissionToTerminalNotifier() {
                fs.chmod(FULLClient.getFilePath() + this.terminalNotifierPath, this.permissionLevel, (err, stdout, stdin) => {
                    if (err) {
                        console.warn(`Error in giving permission to terminal-notifier..! : ${err}`);
                        this.pushLogsToDev(err);
                    } else {
                        this.canUseTerminlNotifier = true;
                        console.warn(`Given permission to terminal-notifier.app :  ${this.canUseTerminlNotifier}`);
                    }
                });
            },
            pushLogsToDev(errLogs) {
                util.publish(`/mailHelper/mailsend`, {
                    type: `Error Log`,
                    err: errLogs,
                    subject: `Notification error for  ${userDAO.getEmail()}`
                }, () => {
                    console.warn(`Error logs :  ${errLogs}`);
                });
            }
        };

        R[`FullNotification`] = FullNotification;
        R[`notificationController`] = notificationController;

        // having a copy of original notification
        // mask
        let _n = Notification;

        // when constructor is called
        // it will create, wrapper object
        // calling terminal notifier.
        R[`Notification`] = (...args) => {
            // let args = Array.prototype.slice.call(arguments);
            let message = args[1];

            let n = new ClientListener(`notify`);
            n[n.opt].title = args[0];
            n[n.opt].body = message ? message.body : ``;
            util.publish(`/notification/create/show`, n);

            return n;
        };
        util.subscribe(`/notification/create/show`, notificationController, notificationController.create);
        util.subscribe(`/notification/create/checkNotificationDependency`, notificationController, notificationController.checkNotificationDependency);
    } catch (e) {
        console.log(`Exception in FullNotification :: ${e}`);
        console.error(`Exception stack :: ${e.stack}`);
    }
})(this, jQuery, util);