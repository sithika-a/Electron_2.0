/**
*
* GoClock main container module
    - accept ajax
    - compute time
    - communicate with routing system
    - status push to server
    - External or Internal module
*
**/
(function(root, $, mediator, undefined) {

    var goClockCore = {
        mode: 'internal',
        name: 'GoClockCore',
        // log: function() {
        //     util.log.apply(this, arguments);
        // },
        // getUserJson: function() {
        //     /**
        //      *
        //      * Construct queryUser json object , for
        //      * fetching clock hours from goClock server
        //      **/
        //     var contact = userDAO.getUser();
        //     return JSON.stringify({
        //         email: contact.login,
        //         contactId: contact.id,
        //         uniquepin: userDAO.getCompanyId()
        //     });
        // },
        // isModuleLoadable: function() {
        //     return userDAO.getSkillByName('FullWork') || userDAO.getSkillByName('CEA') ? false : true;
        // },
        // kill: function() {
        //     var signOut = new GoclockHours();
        //     mediator.publish('/chatContainer/send/message', signOut);
        //     mediator.publish('goclock/UIController/sync', signOut);
        // },
        // queryLoginHours: function() {
        //     /**
        //      *
        //      * Query goClock Server, get login Hours.
        //      * return deferred obj.
        //      *
        //      **/
        //     return $.ajax({
        //         url: FULLClient.getConfig().clockapp + '/service/newmobileuserworkhours',
        //         type: 'POST',
        //         dataType: 'json',
        //         context: goClockCore,
        //         data: this.getUserJson()
        //     });
        // },
        // UISync: function() {
        //     if (this.mode == 'internal') {
        //         // Stop the ClockUI in ChatContainer Window
        //         // new GoclockHours() == default creates stop signal
        //         mediator.publish('/chatContainer/send/message', new GoclockHours());
        //     } else {
        //         // Stop the ClockUI in MainSBContainer Window
        //         mediator.publish('goclock/UIController/sync', new GoclockHours());
        //     }
        //     this.startUserClock();
        // },
        // startUserClock: function() {
        //     if (this.isModuleLoadable()) {
        //         // NETWORK CHECKER HAS TO BE USED
        //         this.queryLoginHours().pipe(
        //             function doneFilter(workHrs) {
        //                 var clockHours = new GoclockHours();
        //                 if (workHrs.status == 'success') {
        //                     clockHours.setDAIM(workHrs.workHoursJDOForToday);
        //                     console.debug('goClock server Hours Avail ', clockHours);
        //                     /**
        //                      *
        //                      * Send the clocked Info to Extension.
        //                      *
        //                      **/

        //                 }
        //                 console.debug('goClock server Hours info :: ', workHrs);
        //                 this.sendMessage(clockHours);
        //             },
        //             function failFilter(err) {
        //                 console.error('goClock server Failed to respond ', err);
        //             });
        //     }
        // },
        afkNotify: function(info) {
            util.v2.pushStatusToYoco(info.status, 'N/A', true);
        },
        // sendMessage: function(goClockHrsObj) {


        //     if (goClockHrsObj.in) {
        //         if (this.mode == 'internal') {
        //             mediator.publish('goclock/UIController/sync', new GoClockUIController(goClockHrsObj));
        //         } else {
        //             mediator.publish('/chatContainer/send/message', new GoClockUIController(goClockHrsObj));
        //         }

        //         mediator.publish('/goclock/controller/clockedIn');
        //         mediator.publish('/goclock/extension/clock/in', goClockHrsObj.DAIM);
        //     } else {
        //         /*
        //             "ClockOut signal" should go to both the windows
        //             at the same time.
        //         */
        //         mediator.publish('goclock/UIController/sync', new GoClockUIController(goClockHrsObj));
        //         mediator.publish('/chatContainer/send/message', new GoClockUIController(goClockHrsObj));
        //         mediator.publish('/goclock/controller/clockedOut');
        //         mediator.publish('/goclock/extension/clock/out');
        //     }
        // },
        // messageListener: function(msg) {

        //     if (msg) {
        //         switch (msg.opt) {
        //             case 'sync':
        //                 {
        //                     this.sendMessage(msg.hoursJDO);
        //                     break;
        //                 }
        //             default:
        //                 {
        //                     break;
        //                 }
        //         }
        //     }
        // },
        // setExternalMode: function() {
        //     this.mode = 'external';
        //     goClockCore.UISync();
        // },
        // setInternalMode: function() {
        //     this.mode = 'internal';
        //     goClockCore.UISync();
        // },
        // getMode: function() {
        //     return this.mode;
        // }
    }

    // mediator.subscribe('/goclock/controller/queryHours', goClockCore, goClockCore.startUserClock);
    // mediator.subscribe('/goclock/controller/sendUserStatus', goClockCore, goClockCore.sendUserStatus);
    // mediator.subscribe('/goclock/controller/postMessage', goClockCore, goClockCore.messageListener);
    // mediator.subscribe('/goclock/controller/kill', goClockCore, goClockCore.kill);

    /*  AFK */
    mediator.subscribe('/module/afk/notify', goClockCore, goClockCore.afkNotify);

    /* Based "external" or "internal" mode, sync UI and clock */
    // mediator.subscribe('/chatContainer/mode/externalMode', goClockCore, goClockCore.setExternalMode);
    // mediator.subscribe('/chatContainer/mode/internalMode', goClockCore, goClockCore.setInternalMode);

    /* Patch Only for Extension */
    // mediator.subscribe('/goclock/controller/extension/msg/internal', goClockCore, goClockCore.sendMessage);
    module.exports = goClockCore;

})(this, jQuery, amplify);