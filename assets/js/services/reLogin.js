;
((R, util) => {
    /**
     *
     * 1. Flush userDAO data in all container
     * 2. embed login page in chat container
     * 3. once logged in, start module loader
     * 
     */
    var reLogin = {
        name  :`reLogin`,
        googleAppScript: 'https://script.google.com/macros/s/AKfycbzHu2EQVazW4LQdns9i8KcHDwzX37_73cO_O7vldwwe-OCdlu95/exec?',
        wipeData() {
            this.removeUserFromSheet(userDAO.getEmail());
            userDAO.clear();
            // util.subscribe('/app/cookies/cleared', reLogin, reLogin.reset);
            this.reset();
            util.subscribe('/app/loginModule/onload/recieved', reLogin, reLogin.removeWebview);
        },
        reset() {
            util.publish('module/controller/reset');

            util.notification.create({
                title: 'Application Cache',
                body: 'Removed user data'
            });

            // Will allow window to close after clear cache.
            util.publish('/chat/quit/flag', true);

            // clear the holding window references.
            // so, it will be cached next time.
            util.publish('/util/v2/windows/caching/reset');

        },
        removeWebview() {
            $('webview:not(#LoginModule)').remove();
            // Remove any existing, badgelabel in 
            // app, which have not been read.
            util.publish('/msgModule/handler/', new ClientListener('badgelabel'));
            util.unsubscribe('/app/loginModule/onload/recieved', reLogin, reLogin.removeWebview);
            setTimeout(() => {
                console.log('Sending reLogin message to main ...');
                util.publish(`/sendMessage/to/main`,{
                    moduleName : this.name,
                    actionType : namespace.moduleName.reLogin,
                    name : this.name
                });
            }, 0);

            util.publish('/util/window/events/show', namespace.CONTAINER_CHAT);

            if (util.platform.isWin()) {
                util.publish('/util/window/events/restore', namespace.CONTAINER_CHAT);
            };
        },
        removeUserFromSheet(email) {
            /*
                this function will be called from two 
                sources

                a. during mannual clearcache
                b. during remove access during login.
            */
            if (email && util.isEmail(email)) {
                var url = this.googleAppScript + 'userEmail=' + email + '&mode=' + FULLClient.getMode() + '&engine=' + process.versions['electron'] + '&remove=true'
                $.getJSON(url)
                    .done((infoJSON) => {
                        if (infoJSON && /success/.test(infoJSON.status)) {
                            util
                            .getCurrentWindow()
                            .webContents
                            .session
                            .flushStorageData(true);
                            
                            setTimeout(() => {
                                util.app.restart();
                            },3000);
                        }
                    })
            }
        }
    };
    util.subscribe('/app/user/data/wipe', reLogin, reLogin.wipeData);
    util.subscribe('/app/remove/user/from/sheet', reLogin, reLogin.removeUserFromSheet);

    util.subscribe('/app/cookies/cleared',() => {
        reLogin.wipeData();
        util.clear.isCleared = false;
    });

    module.exports = reLogin;
})(window, util);