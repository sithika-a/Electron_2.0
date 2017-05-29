/**
*
* Time Ticker
*  - accept daim
    - UI
    - ui tick
    - ui stop
**/

(function(root, $, mediator, undefined) {

    var timeTick = {
        UI: $('#clock_time'),
        DAIM: 0,
        secondsTick: 1000,
        _interval: null,
        transform: function(t) {
            var h = Math.floor((t / (1000 * 60 * 60)) % 24);
            var m = Math.floor((t / (1000 * 60)) % 60);
            var s = Math.floor((t / 1000) % 60);

            h = (h < 10) ? '0' + h : h;
            m = (m < 10) ? '0' + m : m;
            s = (s < 10) ? '0' + s : s;
            return h + ':' + m + ':' + s;
        },
        tick: function() {
            // console.check(this.DAIM)
            this.UI.html(this.transform(this.DAIM + this.secondsTick));
            this.DAIM += this.secondsTick;
        },
        updateStartUI: function() {

            this._interval = setInterval(function() {
                timeTick.tick.call(timeTick);
            }, 1000);

            this.UI.text('Syncing...').css({
                'font-size': '16px',
                'margin-top': '0px'
            });
        },
        updateStopUI: function() {
           
            this.UI.text('Not Clocked In').css({
                'font-size': '14px',
                'margin-top': '4px'
            });
        },
        setDAIM: function(dateAddedInMilliSec) {
            this.DAIM = dateAddedInMilliSec;
        },
        start: function(GoclockHrObj) {
            this.setDAIM(GoclockHrObj.DAIM);
            this.updateStartUI();
        },
        stop: function(GoclockHrObj) {
            this.updateStopUI();
        },

        UIcontroller: function(GoclockUIObj) {
            var hoursJDO = null;
            if (GoclockUIObj ) {
                clearInterval(this._interval);
                hoursJDO = GoclockUIObj.hoursJDO;
                ( hoursJDO && hoursJDO.in ) ? this.start(hoursJDO) : this.stop(hoursJDO);
            }
        },
        informToCentralController : function( passEvent ){
            if( passEvent ){
                var infoToPass = new GoClockController();
                infoToPass.setSync(passEvent.isStop,passEvent.daim);
                /**
                *
                * Ticker is someother client
                * window
                **/
                if( window.opener )
                    window.opener.postMessage(infoToPass , '*');
                /**
                *
                * In main container window.
                *
                **/
                else
                    amplify.publish('/goclock/controller/postMessage',infoToPass);

                return true;
            }
        }
    }

    timeTick.stop();

    mediator.subscribe('goclock/UIController/startClock', timeTick, timeTick.start);
    mediator.subscribe('goclock/UIController/stopClock', timeTick, timeTick.stop);
    mediator.subscribe('goclock/UIController/sync', timeTick, timeTick.UIcontroller);
    mediator.subscribe('goclock/central/controller/passevent', timeTick, timeTick.informToCentralController);

})(this, jQuery, amplify);
