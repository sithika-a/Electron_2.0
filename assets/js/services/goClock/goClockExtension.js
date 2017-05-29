/**
 *
 * Extension is for live user 0.1.50
 * There is not socket/channel to maintain
 * persistent connection with server to give
 * real time updates. Until unless we move
 * chat build we should have this extensions
 * routine.
 
 * This extension can be taken down once chat moved to everyone
 * applicable only to live & v0.1.50
 **/

/**
 *
 * TODO:
 *  - Check chat is available -Done
 *  - Config version check "Live" -Done
 *  - Extend the GoClockCore -Done
 *  - Intercept the status request -Done
 *  - Issue clock in and clock out command -Done
 *  - Starty dummy UI and sync -Done
 */

(function(R, M, undefined) {

    var extension = { 
        daim: 0,
        in : false,
        isChat: false,
        _isClockOutSignal: false,
        name : 'GoClockExtension',
        log : function(){
            util.log.apply(this, arguments);
        },
        isChatKilled: function() {
            return this.isChat;
        },
        setChatAvailability: function(flag) {
            this.isChat = flag;
        },
        isClockedIn: function() {
            return this.in;
        },
        setInFlag: function(DAIM) {
            this.daim = DAIM ? DAIM : 0;
            this.in = true;
        },
        setOutFlag: function() {
            this.in = false;
        },
        statusTrack: function(status) {
            if (status && (this.isChatKilled() ||FULLClient.isElectron())) {
                switch (status) {
                    case "Offline":
                        {
                            M.publish('/goclock/controller/extension/msg/internal', new GoclockHours());
                            this._isClockOutSignal = true;
                            break;
                        }
                    case "Lunch":
                        {
                            M.publish('/goclock/controller/extension/msg/internal', new GoclockHours());
                            this._isClockOutSignal = true;
                            break;
                        }
                    default:
                        {
                            this._isClockOutSignal = false;
                            if (!this.in) {
                                /**
                                 * Show StatusPanelUI
                                 */
                                var statusMsgShow = new StatusUIMessenger();
                                statusMsgShow.setShow();
                                M.publish('/status/UIController/sync', new StatusUIController(statusMsgShow));
                                /**
                                 * Show time "Synching" status.
                                 */
                                setTimeout(function() {
                                    if (!extension._isClockOutSignal)
                                        M.publish('/goclock/controller/queryHours');
                                }, 5000);

                                if (this.daim) {
                                    var GCH = new GoclockHours(true, this.daim, 'goClockExtension');
                                    M.publish('/goclock/controller/extension/msg/internal', GCH);
                                }
                            };
                            break;
                        }
                }
            }
        }
    };

    M.subscribe('/goclock/extension/status', extension, extension.statusTrack);
    M.subscribe('/goclock/extension/clock/in', extension, extension.setInFlag);
    M.subscribe('/goclock/extension/clock/out', extension, extension.setOutFlag);
    M.subscribe('/goclock/extension/chat/killed', extension, extension.setChatAvailability);

    R['goClockExtension'] = extension;

})(this, util);