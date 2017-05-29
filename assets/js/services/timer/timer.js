/* 
open timer window
   FULLClient.ipc.send({
            "eType": "open",
            "title": "Timer"
        });

Hide    
   FULLClient.ipc.send({
            "eType": "windowEvents",
            "title": "Timer",
            "opt":"hide",
            "paramObj":{}
        });
Show 
    FULLClient.ipc.send({
            "eType": "windowEvents",
            "title": "Timer",
            "opt":"show",
            "paramObj":{}
        });
Message to TimerWindow
    FULLClient.ipc.send(setTime,'msg-to-'+namespace.CONTAINER_TIMER)

setsize
    FULLClient.ipc.send({
            "eType": "windowEvents",
            "title": "Timer",
            "opt":"setsize",
            "paramObj":{
                width:150,
                height:253
               }
        }); 

setPosition
    FULLClient.ipc.send({
            "eType": "windowEvents",
            "title": "Timer",
            "opt":"setPosition",
            "paramObj":{
                x:64,
                y:26
               }
        }); 
*/
;
(function(R, util) {

    function debounce(func, wait, immediate) {
        var timeout;
        return function() {
            var context = this,
                args = arguments;
            var later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    };

    // Constructor for time ticker.
    function Fulltimer() {
        if (!(this instanceof Fulltimer)) {
            return new Fulltimer();
        }
        this.DAIM = 0; // Time on the clock when last stopped in milliseconds

        this.start = function(timerObj) {
            timerObj.clearInterverlObj = setInterval(function() {
                this.DAIM += 1000;
                timerObj.callback.apply(this || null, [this, timerObj || null]);
            }.bind(this), 1000);
        };

        this.stop = function() {
            this.DAIM = 0;
        };

        this.getDAIM = function() {
            return this.DAIM;
        };

        this.formatTime = function(time, timerObj, activeWindowConnid) {
            if (time && timerObj) {
                var h = Math.floor((time / (1000 * 60 * 60)) % 24);
                var m = Math.floor((time / (1000 * 60)) % 60);
                var s = Math.floor((time / 1000) % 60);

                h = (h < 10) ? '0' + h : h;
                m = (m < 10) ? '0' + m : m;
                s = (s < 10) ? '0' + s : s;

                // Ticking time in tab UI
                $('#' + timerObj.taskId)
                    .find('#tabName')
                    .text(h + ':' + m + ':' + s);
            }
        };
    }

    var timer = {
        timerMap: {},
        activeConnId: null,
        activeARTabIndex:null,
        registerId: function(sourceURL) {
            var params = util.getParameters(sourceURL);
            /* Must contain connection ID */
            if (params && params.connId && !/InBoundCall|fetch/.test(params.calltype)) {
                this.initTimer(params.currentTabIndex, params.connId, this.tickCB, params);
            }
        },
        setActiveConnId: function(tabIndex) {
            var params = util.tabs.getOriginalParamById(tabIndex);
            if (params && /repeats|epCustom/i.test(params.calltype)) {
                this.activeConnId = params.connId;
                this.activeARTabIndex = params.currentTabIndex; // setting activeAR tabIndex. 
                this.hwnd.setConnection();
            } else {
                /**
                *  when its not ActiveRespose, we will be getting last AR infomation and we 
                *  will be updating activeConnId and activeARTabIndex. 
                */
                if(this.timerMap[this.activeConnId]){
                    this.activeARTabIndex = this.getActiveTimerTabindex(this.activeConnId);
                 }else if(this.getLastKeyFromTimerMap()){
                    this.activeConnId = this.getLastKeyFromTimerMap(); 
                    this.activeARTabIndex = this.getActiveTimerTabindex(this.activeConnId);
                 }

            }
        },
        markActiveTabById:function(){
            /**
            *  When user selects options in timerWidget. We will be getting active AR tabIndex to 
            *  populate that tab. 
            *  This function will get 
            */
            if(this.activeARTabIndex)
             util.publish('/timer/markActiveById',this.activeARTabIndex);
        },
        getActiveTimerTabindex:function(key){
            /**
            *  Takes ActiveReponse connid as key,mapping with timerMap and returning taskId(tabIndex)
            */
            if(key && this.timerMap[key]){
                return this.timerMap[key].taskId
            }
        },
        getLastKeyFromTimerMap:function(){
            /**
            *  Returns last timerObject's key. If there is now timer Object, it will return null.
            */
            var keys = Object.keys(this.timerMap);
            var lastInteraction;
            if(lastInteraction = keys[keys.length-1])
               return lastInteraction;
            else
               return null;
        },
        findLastActiveARAndUpdate:function(){
            /**
            *   This function will find last ActiveReponse and updates activeConnId and activeARTabIndex.
            */

            if(this.getLastKeyFromTimerMap()){
                this.activeConnId = this.getLastKeyFromTimerMap(); 
                this.activeARTabIndex = this.getActiveTimerTabindex(this.activeConnId);
            }else{
                console.log("No ConnId avaialble in Map..!");
            }
        },
        initTimer: function(taskId, connId, tickCB, urlInfo) {
            var timerObj = {};
            timerObj.instance = new Fulltimer();
            timerObj.connId = connId;
            timerObj.taskId = taskId;
            timerObj.urlInfo = urlInfo;
            timerObj.callback = tickCB;
            timerObj.clearInterverlObj = null;
            timerObj.instance.start(timerObj);
            this.timerMap[connId] = timerObj;
            this.activeConnId = connId;
        },
        closeTimer: function(info) {
            console.check("Timer[" + info.connId + "] does timerMap have connId " + this.timerMap[info.connId]);
            if (info && info.connId && this.timerMap[info.connId]) {
                this.timerMap[info.connId].instance.stop();
                clearInterval(this.timerMap[info.connId].clearInterverlObj);
                delete this.timerMap[info.connId];
                // Params are send to widget to close.
                this.hwnd.sendClose(info);
                console.check("Deleted[" + info.connId + "] from map");
                this.findLastActiveARAndUpdate();
            }
        },
        tickCB: function(timerInstance, timerObject) {
            var result = timerInstance.formatTime(timerInstance.getDAIM(), timerObject);
        },
        start: function(sourceURL) {
            this.cacheInfo(sourceURL);
            this.activeTimerFlag = true;
            this.registerId(sourceURL);
        },
        initLocalStorage: function() {
            util.storage.set('timerConnIdMap', {});
        },
        cacheInfo: function(sourceURL) {
            var params = util.getParameters(sourceURL);
            var interactionInfo = util.storage.get('timerConnIdMap');
            interactionInfo[params.connid || params.connId] = {
                connid: params.connid || params.connId,
                currentTabIndex: params.currentTabIndex,
                status: null
            }
            util.storage.set('timerConnIdMap', interactionInfo);
        },
        updateConnIdInfo: function(info) {
            /**
             {
                 connId : <connId>,
                 status : <status> string
             }
             */
        //pushing analytics data.
        util.analytics.push(null,analytics.TIMERWIDGET_TAB_DROPDOWN,info.connId,'User selected '+info.status+' status using TabTimerDropDown');  
            var localConnIdMap = util.storage.get('timerConnIdMap');
            if (info && info.connId && info.status && localConnIdMap[info.connId]) {
                localConnIdMap[info.connId].status = info.status;
                util.storage.set('timerConnIdMap', localConnIdMap);
                return true;
            }
        },
        hwnd: {
            create: function() {
                var pos = util.getCurrentWindow().getPosition();
                timer.initLocalStorage();
                this.messageToBackground('open', 'Timer', null, {
                    x: pos[0],
                    y: pos[1]
                });
                this.setListener();
            },
            setListener: function() {
                // Register on move listener
                // so whenever main windows moves
                // move the position of the app 
                // to that so it will not blink
                var cb = debounce(function() {
                    /**
                     * TODO : Check the current screen if,
                     * we find a match both windows are 
                     * in current screen then dont move 
                     * timer adjacent to app.
                     */
                    console.check('Debounce calling sequence ');
                    var timerWindow = util.caching.windows.getTimer();
                    if (timerWindow) {
                        timerWindow.setPosition.apply(timerWindow, util.getCurrentWindow().getPosition());
                        return true;
                    }
                    throw new Error('Timer window instance cannot be obtained');
                }.bind(this), 2000);

                util.getCurrentWindow().on('move', cb);
            },
            hide: function() {
                this.messageToBackground('windowEvents', 'Timer', 'hide', {});
                this.closeConnection();
            },
            setConnection: function() {
                var timerObj;
                if (timer.activeConnId && (timerObj = timer.timerMap[timer.activeConnId])) {
                    var setTime = new TimerCommunication('setConnectionInfo', timer.activeConnId);
                    setTime[setTime.opt].DAIM = timerObj.instance.getDAIM();
                    this.post(setTime);
                }
            },
            closeConnection: function() {
                if (timer.activeConnId) {
                    var stopTime = new TimerCommunication('closeConnection', timer.activeConnId);
                    this.post(stopTime);
                }
            },
            show: function() {
                if (timer.activeConnId) {
                    var timerObj = timer.timerMap[timer.activeConnId];
                    if (timerObj) {
                        // stopping existing timer
                        this.setConnection();
                        this.messageToBackground('windowEvents', 'Timer', 'show', {});
                    }
                }

            },
            sendClose: function(params) {
                if (params && params.connId) {

                    var stopTime = new TimerCommunication('closeConnection', params.connId);
                    this.post(stopTime);
                    this.messageToBackground('windowEvents', 'Timer', 'hide', {});
                }
            },
            messageToBackground: function(eType, title, opt, paramObj) {
                if (FULLClient) {
                    FULLClient.ipc.send({
                        "eType": eType,
                        "title": title,
                        "opt": opt,
                        "options": paramObj
                    });
                }
            },
            post: function(obj) {
                if (FULLClient && obj && obj instanceof TimerCommunication) {
                    FULLClient.ipc.send(obj, 'msg-to-' + namespace.CONTAINER_TIMER);
                    return true;
                }
                throw new Error('Object not an instance of TimerCommunication');
            }
        }
    };
    module.exports = timer;
    util.subscribe('/timer/markActiveTabById',timer,timer.markActiveTabById);
    util.subscribe('/timer/findLastActiveARAndUpdate',timer,timer.findLastActiveARAndUpdate);


    util.subscribe('/timer/close/', timer, timer.closeTimer);
    util.subscribe('/timer/update/connid/info', timer, timer.updateConnIdInfo);
    util.subscribe('/timer/start/', timer, timer.start);
    util.subscribe('/timer/set/active/connid/', timer, timer.setActiveConnId);

    util.subscribe('/timer/hwnd/show', timer.hwnd, timer.hwnd.show);
    util.subscribe('/timer/hwnd/hide', timer.hwnd, timer.hwnd.hide);
    util.subscribe('/timer/hwnd/destroy', timer.hwnd, timer.hwnd.destroy);
    util.subscribe('module/controller/onload', timer.hwnd, timer.hwnd.create);
})(this, util);