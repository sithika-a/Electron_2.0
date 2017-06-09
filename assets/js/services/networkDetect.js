(function(util) {
   var sharedObject = util.getSharedObject();
    var argv = sharedObject ? sharedObject.cliArgs : false; // check main.js for globalObj setup
    if (argv && argv['disable-network-check']){
        return false;
    }
        

    var networkDetect = {

        timeInt: 5000,
        setIntIns: null,
        checkFlag: false,
        trueCheck: [],
        prevNetStatus: null,

        info: {
            'up': 0,
            'down': 0,
            'sampleCount': 0,
            'limit': 2,
            reset: function() {
                this.up = this.down = this.sampleCount = 0;
            }
        },
        clrTrueCheck: function() {
            this.trueCheck = [];
        },
        resetVal: function() {
            this.info.reset();
            this.checkFlag = false;
            this.clrTrueCheck();
        },
        activate: function() {
            this.setTimer(this.timeInt);
        },
        setTimer: function(time) {
            this.setIntIns = setInterval(function() {

                try {
                    this.checkInternet(function(arg) {
                        util.publish('/network/detection/status', arg);
                        this.netStatus(arg);
                    }.bind(this));
                } catch (e) {
                    console.warn('Error in networkDetection at checkInternet try-catch block : ', e);
                    //To send a error email
                    // util.publish('/mailHelper/mailsend', {
                    //     subject: "Error in is-online module",
                    //     err: {
                    //         message: e,
                    //         stack: e
                    //     }
                    // });

                    this.deactivate();
                }
            }.bind(this), time);
        },
        netStatus: function(value) {
            if (this.checkFlag)
                return this.evaluateStatus.call(this.info, value);
            if (!value)
                return this.runFalseBlock(value);
            else if (value)
                return this.runTrueBlock(value);
            else
                console.warn('unknown value from is-online : ', value);
        },
        runFalseBlock: function(arg) {
            this.checkFlag = true;

            this.info.up = this.trueCheck.length; // If we have up it will add 
            this.info.sampleCount = this.trueCheck.length ? (this.trueCheck.length) + 1 : ++this.info.sampleCount; //Getting sampleCount

            //4 true and 5th value comes as false , it wont wait for next value to trigger evaluateStatus
            //If the limit is not equal we Incrementing down.
            return (this.trueCheck.length == this.info.limit - 1) ? this.evaluateStatus.call(this.info, arg) : this.info.down++;
        },
        runTrueBlock: function(arg) {
            this.trueCheck.push(arg);
            if (this.trueCheck.length >= this.info.limit) {
                // Got continous true Internet up
                this.clrTrueCheck();
                return this.sendNetStatus(true);
            }
        },
        deactivate: function() {
            clearInterval(this.setIntIns);
            this.resetVal();
            util.publish('/network/strength/UI/clear', 0);
            return this.setIntIns = null;
        },
        evaluateStatus: function(value) {

            value == true ? this.up++ : this.down++;
            this.sampleCount++;

            if (this.sampleCount >= this.limit) {

                if (this.down >= this.limit) {
                    networkDetect.resetVal();
                    return networkDetect.sendNetStatus(false);
                } else if (this.up >= this.limit - 1) {
                    networkDetect.resetVal();
                    return networkDetect.sendNetStatus(true);
                }
            }
            return this;
        },
        checkInternet: function(cb) {
            require('is-online')(function(err, online) {
                cb(online);
            });
        },
        sendNetStatus: function(arg) {
            if (arg !== this.prevNetStatus) {
                var ob = new Thinclient("networkDetection");
                ob[ob.opt].isUp = arg;
                FULLClient.ipc.sendToChat(ob);
                util.analytics.push(FULLClient.getMode() + ' ' + FULLClient.getManifest().version + ' ' + process.platform, "n/w", "N/A", (arg == true) ? "up" : "down");
                this.prevNetStatus = arg;
                return arg;
            }
            return arg;
        }
    }

    window.addEventListener("offline", function() {
        networkDetect.deactivate();
        networkDetect.sendNetStatus(false);
        setTimeout(function() {
            networkDetect.activate();
        }, 5000);
    });

    module.exports = networkDetect;
    util.subscribe('module/controller/onload', networkDetect, networkDetect.activate);

    //For testing purpose
    // util.subscribe('/deactivate', networkDetect, networkDetect.deactivate);

})(util);