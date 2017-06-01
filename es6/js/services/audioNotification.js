/**
 * https://trello.com/c/d3RQ5EBr/111-audio-pings-notifications-on-v2-status-s
 */
(function(util) {
    var audioNotify = {

        v2Status: null, //current status
        defTime: 420000, //default time (Testing purpose)
        timerIns: null, //Instance of setTimeout and setInterval
        audioTag: null, //audio tag
        prevStatus: null, //previous status
        excludeStatus: ['Available','Video Call', 'Training', 'PendingBusy', 'Busy', 'Dialing', 'CallingCustomer', 'Email', 'Lunch', 'Meeting', 'Personal', 'System', 'OnEP', 'Repeat', 'Chat', 'AgentHungUp', 'Offline', 'Custom Interaction'],
        sumTime: null,
        threeSecStatus: {
            MissedCallAgent: 3000,
            FailedConnectAgent: 3000,
            FailedConnectCustomer: 3000,
            Default: 3000,
            Break: 6e5, //10mins
            Break2: 6e5, //10mins
            Break3: 6e5, //10mins
            Project: 42e4, //7mins
            'Active Response': 42e4 //7mins
        },
        //Privilege status 
        privStatus: {
            AfterCallWork: [15000, 60000],
        },

        getStatus: function(status) {
            this.v2Status = status;

            if (this.excludeStatus.indexOf(status) != -1) // return if any exclude status comes.
                return this.clearTimer();
            else if (this.prevStatus == status)
                return;

            if (this.privStatus[status]) {
                this.clearTimer();
                this.privStatusTimer(status, this.privStatus[status][0]); //privilege timer , Timings will be automated if it varries.
            } else if (this.threeSecStatus[status]) {
                this.clearTimer();
                this.setTimer(status, this.threeSecStatus[status]) //Three seconds status timer{
            } else {
                this.clearTimer();
                this.setTimer(status, this.defTime); //Default timer with 7 mins
            }
        },
        setTimer: function(status, delay) {
            this.prevStatus = status;
            this.timerIns = setTimeout(function() {
                this.sumTime += delay;
                if (this.prevStatus == this.v2Status) {
                    this.showNotify(status, this.getTime());
                    this.setTimer(status, delay);
                }
            }.bind(this), delay)
        },
        //privStatusTimer is for privilege status 
        privStatusTimer: function(status, delay) {
            this.prevStatus = status;
            this.timerIns = setTimeout(function() {
                this.sumTime += delay;
                if (this.prevStatus == this.v2Status) {
                    this.showNotify(status, this.getTime());
                    this.privStatusTimer(status, this.privStatus[status][1]);
                }
            }.bind(this), delay);
        },
        clearTimer: function() {
            clearInterval(this.timerIns);
            this.sumTime = null;
            this.prevStatus = null;
        },
        getTime: function() {
            if (parseInt(this.sumTime / 1000) < 60) {
                return parseInt(this.sumTime / 1000) + 'seconds';
            } else {
                var totalSeconds = parseInt((this.sumTime / 1000));
                var mins = parseInt(totalSeconds / 60);
                var remainingSeconds = totalSeconds - (mins * 60);
                return parseInt((this.sumTime / 1000) / 60) + 'm : ' + remainingSeconds + 's'
            }
        },
        showNotify: function(status, time) { // To Show the Notification
            var title = "StatusTracker";
            this.audioTag.play();
            util.notification.create({
                title: title,
                body: "You are in '" + status + "' status for " + time
            });
        },
        appendUI: function() {
            var audio = document.createElement('audio');
            audio.src = "http://images.sb.a-cti.com/TC/electron/common-images/statusChange.wav";
            audio.volume = 0.3;
            document.body.appendChild(audio);
            this.audioTag = audio;
        }
    }

    window['audio'] = audioNotify;
    util.subscribe('/clear/status/timer', audioNotify, audioNotify.clearTimer);
    util.subscribe('/check/audio/ping/status', audioNotify, audioNotify.getStatus);
    util.subscribe('/webview/controller/app/onload', audioNotify, audioNotify.appendUI);
})(util)