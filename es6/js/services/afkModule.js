/* AwayfromKeyboard function */
(function(R, M) {
    var self = awayfromkey = {
        module: (function() {
            var _tmp;
            try {
                _tmp = require('afk');
            } catch (e) {
                console.error('While getting AFK module , ::: ', e.stack);
                _tmp = false;
            }
            return _tmp;
        }()),
        idleTimeout: 60, // 1 minute
        previous_status: undefined,
        afk_Listener_id: undefined,
        afk_Listener: function(e) {
            switch (e.status) {
                case 'away':
                    {
                        console.debug('AFK User-Away !!! ');
                        amplify.publish('/module/afk/notify', {
                            status : 'User-Away',
                            source : 'afk'
                        });
                        var afk = new Thinclient('afk');
                        afk[afk.opt]['status'] = 'User-Away';
                        FULLClient.ipc.sendToChat(afk);
                        break;
                    }
                case 'back':
                    {
                        console.debug('AFK Back !!! ');
                        amplify.publish('/module/afk/notify', {
                            status : 'User-Back',
                            source : 'afk'
                        });
                        var afk = new Thinclient('afk')
                        afk[afk.opt]['status'] = 'User-Back';
                        FULLClient.ipc.sendToChat(afk);
                        break;
                    }
            }
        },
        initModule: function() {
            /**
             * If module is not present,
             * Application doesn't cease other
             * Modules or features.
             **/
            if (this.module && userDAO.getSkillByName('FullWork') ) {
                this.afk_Listener_id = this.module.addListener(this.idleTimeout, this.afk_Listener);
                console.debug('Starting the AFK module id : ' + this.afk_Listener_id);
            }
        },
        terminate: function() {
            if (this.module && typeof this.afk_Listener_id !== 'undefined') {
                console.debug('Removing module afk :::' + this.afk_Listener_id);
                this.module.removeListener(this.afk_Listener_id);
                this.afk_Listener_id = undefined;
            }
        }
    }

    M.subscribe('module/controller/onload', self, self.initModule);
    M.subscribe('/afk/controller/stop', self, self.terminate);

})(this, amplify);