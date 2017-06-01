/**
 *
 * Remove User access
 *
 */

;
(function() {

    function commenceRestartLater() {
        var v2Obj = util.storage.get('v2');
        if (v2Obj && v2Obj.lastReceivedStatus && (new RegExp(v2Obj.lastReceivedStatus, 'ig').test(['ActiveResponse', 'AfterCallWork', 'Active Response', 'Default', 'Busy', 'Repeat', 'Chat', 'PendingBusy', 'CallingCustomer']))) {
            return true
        }
    };

    var wipe = {
        googleAppScript: 'https://script.google.com/macros/s/AKfycbzHu2EQVazW4LQdns9i8KcHDwzX37_73cO_O7vldwwe-OCdlu95/exec?',
        // clean: function() {
        //     util.publish('/app/remove/user/from/sheet', userDAO.getEmail());
        //     util.clear();
        // },
        clean: function() {
            if (commenceRestartLater()) {
                setTimeout(wipe.clean.bind(wipe), 10000);
                console.log('Restarting will check again in 10 seconds');
                return;
            }
            util.publish('/app/remove/user/from/sheet', userDAO.getEmail());
            util.clear();
        },
        checkAccess: function() {
            $.getJSON(this.googleAppScript + 'userEmail=' + userDAO.getEmail() + '&mode=' + FULLClient.getMode() + '&engine=' + process.versions['electron'])
                .done(function(infoJSON) {
                    if (infoJSON && infoJSON.wipe) {
                        this.clean();
                    }
                }.bind(this));
        }
    };

    util.subscribe('/remove/access/data/', wipe, wipe.clean);
    util.subscribe('module/controller/login', wipe, wipe.checkAccess);
})();