(function(util) {

    var sharedObject = util.getSharedObject();
    var argv = sharedObject ? sharedObject.cliArgs : false; // check main.js for globalObj setup
    if (argv && argv['disable-network-check']){
        return false;
    }

    var networkDetect = {

        checkFlag: false,
        trueCheck: [],
        wifi: $('.wifi_strength.fr')[0],
        //Info object having information about up and down.
        info: {
            'up': 0,
            'down': 0,
            'sampleCount': 0,
            'limit': 5,
            reset: function() {
                this.up = this.down = this.sampleCount = 0;
            },
            getPercentVal: function(percentage) {
                return Math.round((this.limit * percentage) / 100);
            }
        },
        clrTrueCheck: function() {
            this.trueCheck = [];
        },
        resetVal: function() {
            this.info.reset();
            this.clrTrueCheck();
            this.checkFlag = false;
        },
        manipulateDom: function(bar) {
            this.resetVal();
            $(networkDetect.wifi).removeClass('wifi0_signal')
                .removeClass('wifi4_signal')
                .removeClass('wifi3_signal')
                .removeClass('wifi2_signal')
                .removeClass('wifi1_signal');

            return $(networkDetect.wifi).addClass('wifi' + bar + '_signal');
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

            this.info.up = this.trueCheck.length; // If up is there it will add
            this.info.sampleCount = this.trueCheck.length ? (this.trueCheck.length) + 1 : ++this.info.sampleCount; //Getting sampleCount

            //4 true and 5th value comes as false , it wont wait for next value to trigger evaluateStatus
            //If the limit is not equal we Incrementing down.
            return (this.trueCheck.length == this.info.limit - 1) ? this.evaluateStatus.call(this.info, arg) : this.info.down++;
        },
        runTrueBlock: function(arg) {

            this.trueCheck.push(arg);
            if (this.trueCheck.length >= this.info.limit) {
                this.info.up = this.info.sampleCount = this.trueCheck.length;
                // Got continous true Internet up
                this.clrTrueCheck();
                return this.evaluateStatus.call(this.info, true);
            }
        },
        evaluateStatus: function(value) {

            value == true ? this.up++ : this.down++;
            this.sampleCount++;

            if (this.sampleCount >= this.limit) {
                switch (true) {

                    case (this.up >= this.getPercentVal(90)):
                        return networkDetect.manipulateDom(4);

                    case (this.up >= this.getPercentVal(70)):
                        return networkDetect.manipulateDom(3);

                    case (this.up >= this.getPercentVal(50)):
                        return networkDetect.manipulateDom(2);

                    case (this.up >= this.getPercentVal(10)):
                        return networkDetect.manipulateDom(1);

                    case (this.up < 1):
                        return networkDetect.manipulateDom(0);

                    default:
                        networkDetect.resetVal();
                }
            }
        }
    }

    window.addEventListener('online', function(){
        networkDetect.manipulateDom(1);
    });

    module.exports = networkDetect;

    util.subscribe('/network/detection/status', networkDetect, networkDetect.netStatus);
    util.subscribe('/network/strength/UI/clear', networkDetect, networkDetect.manipulateDom);

})(util)