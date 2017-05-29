var timerWorker = {
    interval: 1000,
    isQuitable: false,
    appendTrigger: false,
    currentInteraction: {}, // holds the current interaction info.
    dom: {
        timer: $('.timer-wrapper').find('ul.timer-holder'), //
        action: $('.btn_holder,#actionLabel'),
        hours: $('#hours'),
        minutes: $('#minutes'),
        seconds: $('#seconds'),
        timerholder: $('#timer-holder'),
        timerbtnholder: $('.btn_holder'),
        timerOptions: $('.btn_holder>ul'),
        dropdownli: $('#dropdown_btnul>li'),
        dropdownUL: $('#dropdown_btnul'),
        dropdownul: '<ul id="dropdown_btnul" style="display: none;">' +
            '<li id="Available" style="-webkit-app-region: no-drag"><a class="hint--top" class="hint--small" aria-label="On Completion - Available">Available</a></li>' +
            '<li id="Break" style="-webkit-app-region: no-drag"><a class="hint--top" class="hint--small" aria-label="On Completion - Break">Break</a></li>' +
            '<li id="Project" style="-webkit-app-region: no-drag"><a class="hint--top" class="hint--small" aria-label="On Completion - Project">Project</a></li>' +
            '<li id="Meeting" style="-webkit-app-region: no-drag"><a class="hint--top" class="hint--small" aria-label="On Completion - Meeting">Meeting</a></li>' +
            '<li id="System" style="-webkit-app-region: no-drag"><a class="hint--top" class="hint--small" aria-label="On Completion - System">System</a></li>' +
            '<li id="Personal" style="-webkit-app-region: no-drag"><a class="hint--top" class="hint--small" aria-label="On Completion - Personal">Personal</a></li>' +
            '<li id="Training" style="-webkit-app-region: no-drag"><a class="hint--top" class="hint--small" aria-label="On Completion - Training">Training</a></li>' +
            '<li id="Offline" style="-webkit-app-region: no-drag"><a class="hint--top" class="hint--small" aria-label="On Completion - Offline">Offline</a></li>' +
            '</ul>'
    },
    calculate: function(t) {
        var h = Math.floor((t / (1000 * 60 * 60)) % 24);
        var m = Math.floor((t / (1000 * 60)) % 60);
        var s = Math.floor((t / 1000) % 60);

        h = (h < 10) ? '0' + h : h;
        m = (m < 10) ? '0' + m : m;
        s = (s < 10) ? '0' + s : s;
        return h + ':' + m + ':' + s;
    },
    updateUI: function(workerObj) {
        var time = this.calculate(workerObj.daim + this.interval);
        workerObj.daim += this.interval;
        this.dom.hours.text(time.slice(0, 2));
        this.dom.minutes.text(time.slice(3, 5));
        this.dom.seconds.text(time.slice(6, 8));
    },
    onbeforeunload: function(e) {
        if (!timerWorker.isQuitable) {
            util.getCurrentWindow().hide();
            return timerWorker.isQuitable;
        } else return undefined;
    },
    startTicker: function(info) {
        timerWorker.updateUI.call(timerWorker, info);

        info.intervalId = setInterval(function() {
            timerWorker.updateUI.call(timerWorker, info);
        }, 1000);
    },
    start: function(info) {
        if (info && info.connId && info.daim) {
            var workerObj = {};
            this.stop(info); // stopting last ticker
            this.getLastSelectedStatusAndUpdateInWidget(info.connId); // getting lastUpdate Status and updating in UI. 
            workerObj.connId = info.connId;
            workerObj.daim = info.daim;
            this.startTicker(workerObj);
            this.currentInteraction = workerObj;
        }
    },
    stop: function() {
        // info.connId. 
        // get timerObj of (info.connId) and stop timer by calling intervalId  in that object. 
        // once timer stops send stopped signal to sender.
        if (this.currentInteraction.connId) {
            clearInterval(this.currentInteraction.intervalId);
            this.resetTimerWidgetUI();
        }
    },
    resetTimerWidgetUI: function() {
        this.dom.timer
            .find('span')
            .text('00');
        this.setDropdownText('Choose Action');
    },
    setListenerFortimerHolder: function() {
        this.dom.timerholder.dblclick(function(e) {
            util.preventEvent(e);
            this.popUpSBwindowAndShowActiveAR();
        }.bind(this));

        this.dom.dropdownUL.click(function() {
            this.popUpSBwindowAndShowActiveAR();
        }.bind(this));

        var timerWin = util.getCurrentWindow();
        timerWin.on('maximize', function(e) {
            util.preventEvent(e);
            timerWin.unmaximize();
            this.popUpSBwindowAndShowActiveAR();
        }.bind(this));

    },
    popUpSBwindowAndShowActiveAR: function() {
        this.sendMessageToMain({
            name: 'timerWidget'
        });
        util.windowEvents.show('FULL');
        util.windowEvents.focus('FULL');
    },
    setListenerForWidgetDropdown: function() { // should be in  timerWidget
        this.dom.action.on('click', function(event) {
            var tarEle = $(event.originalEvent.target)[0];

            if (/^hint--top/.test(tarEle.className))
                this.appendTrigger = true;
            else
                this.appendTrigger = false;

            var status = /A/.test(event.originalEvent.target.tagName) ? event.originalEvent.target.innerText : "button";
            // var status = originalText.slice(12, originalText.length);
            if (tarEle.id == 'actionLabel')
                status = 'actionLabel';
            switch (status.toLowerCase()) {
                case 'available':
                case 'break':
                case 'meeting':
                case 'project':
                case 'system':
                case 'personal':
                case 'offline':
                case 'training':
                    {
                        this.appendTrigger ? this.statusSwitch(status, this.appendTrigger) : false;
                        break;
                    }
                default:
                    {
                        if (/^actionLabel/.test(tarEle.id)) {
                            if (!this.dom.action.find('ul').is(':visible')) {
                                this.showWidgetDropdown();
                                event.stopPropagation();
                            } else {
                                this.hideWidgetDropdown();
                                event.stopPropagation();
                            }
                        } else {
                            if (!this.dom.action.find('ul').is(':visible')) {
                                this.showWidgetDropdown();
                            } else {
                                this.hideWidgetDropdown();
                            }
                        }
                        break;
                    }
            }
        }.bind(this))

    },
    statusSwitch: function(actualStatus, trigger) {
        this.updateConnIdInfo({
            connId: this.currentInteraction.connId,
            status: actualStatus
        });
        this.setDropdownText(actualStatus);
        //this.hideWidgetDropdown();
        // Test implemenation
        // :hover event is always stick with selected li when user selects status in timerWidget dropdown.
        // - when user selects status we are removing and adding unorderlist dom in 'Choose Action' button. 

        if (trigger) {
            this.hideWidgetDropdown();
            if (this.dom.timerbtnholder.find('ul')) {
                this.dom.timerbtnholder.find('ul').remove()
                setTimeout(function() {
                    this.dom.timerbtnholder.append(this.dom.dropdownul);
                    $('#dropdown_btnul').click(function() {
                        this.popUpSBwindowAndShowActiveAR();
                    }.bind(this));
                }.bind(this), 0);
            }
        } // trigger ends
    },
    showWidgetDropdown: function() {
        this.dom
            .action
            .find('ul')
            .show()

        util.getCurrentWindow()
            .setSize(165, 273);
    },
    hideWidgetDropdown: function() {
        this.dom
            .action
            .find('ul')
            .hide()

        util.getCurrentWindow()
            .setSize(165, 80);
    },
    setDropdownText: function(text) {
        this.dom
            .action
            .find('span')
            .text(text);
    },
    getLastSelectedStatusAndUpdateInWidget: function(connId) {
        var connIdMap = util.storage.get('timerConnIdMap');
        if (connId && connIdMap[connId] && connIdMap[connId].status) {
            this.setDropdownText(connIdMap[connId].status);
        } else {
            this.setDropdownText('Choose Action');
        }
    },
    updateConnIdInfo: function(info) {
        //pushing analytics data.
        this.sendMessageToMain({
            name: 'analytics',
            accountNumber: null,
            eventAction: analytics.TIMERWIDGET_DROPDOWN,
            connId: info.connId,
            metaInfo: 'User selected ' + info.status + ' status using TimerWidget DropDown'
        });
        // util.analytics.push(null, analytics.TIMERWIDGET_DROPDOWN, info.connId, 'User selected ' + info.status + ' status using TimerWidget DropDown');
        var connIdMap = util.storage.get('timerConnIdMap');
        if (info && info.connId && info.status && connIdMap[info.connId]) {
            connIdMap[info.connId].status = info.status;
            util.storage.set('timerConnIdMap', connIdMap);
            return true;
        }
    },
    sendMessageToMain: function(obj) {
        if (FULLClient && obj) {
            FULLClient.ipc.sendToSB(obj);
        }
    },
    init: function() {
        this.setListenerForWidgetDropdown();
        this.setListenerFortimerHolder();
        window.onbeforeunload = this.onbeforeunload;
    }
};

var msg = {
    handler: function(message) {
        var msg = arguments[0].name ? arguments[0] : arguments[1];
        switch (msg.name) {
            case 'TimerCommunication':
                {
                    switch (msg.opt) {
                        case 'setConnectionInfo':
                            {
                                timerWorker.start({
                                    connId: msg.connId,
                                    daim: msg[msg.opt].DAIM
                                });
                                break;
                            }
                        case 'updateConnectionInfo':
                            {
                                timerWorker.start(msg[msg.opt]);
                                break;
                            }
                        case 'closeConnection':
                            {
                                timerWorker.stop();
                                break;
                            }
                        default:
                            {
                                console.log("Executing default sequence in timerWorker:", msg);
                            }
                    }
                    break;
                }
            case "reLogin":
                {
                    window.removeEventListener("beforeunload", timerWorker.onbeforeunload);
                    timerWorker.isQuitable = true;
                    window.close();
                    break;
                }
            case 'appQuit':
                {
                    $('webview').remove();
                    window.removeEventListener("beforeunload", timerWorker.onbeforeunload);
                    timerWorker.isQuitable = true;
                    window.close();
                    break;
                }
            default:
                {
                    console.log("Default sequence executing in Electron stub :", msg);
                    break;
                }
        }
    }
};


onload = function() {
    timerWorker.init();
    //var ipc = FULLClient.require('ipc');
    var ipc = FULLClient.require('electron').ipcRenderer;
    ipc.on('msg-to-' + namespace.CONTAINER_TIMER, msg.handler);
}