;(function(root, $, mediator) {
    process.on('uncaughtException', function(err) {
        console.log(err);
    });

    /**
     *
     * Twin windows are there, so before login
     * we have to give control the login window
     * to show up.
     *
     **/
    var loginDFD = $.Deferred();
    var onLoadDFD = $.Deferred();

    onload = function() {
        if (namespace.APP_ID != document.title) {
            // Change the name to FALLBACK ID
            document.title = namespace.APP_ID;
        }
console.log('Onload in Chat container.. ..')
        amplify.publish('module/controller/onload', {
            source: 'onload'
        });
        
    };

    var moduleLoader = {
        name: 'ModuleLoader',
        log: function() {
            util.log.apply(this, arguments);
        }
    };

    moduleLoader.init = function() {
        mediator.publish('/app/loginModule/start', loginDFD);
        mediator.publish('/webview/controller/app/onload');
        
        $.when(loginDFD)
            .done(function() {
                moduleLoader.skillBasedLoader();
                userDAO.setloggedIn(true);
                /**
                 *
                 * When clear cached, we will populate only dummy blank page in
                 * main window, because google sign in not done. Once user signs
                 * in, we will change the url to default SB url, for session's
                 * create.
                 *
                 * Connecting codes present in SBLoader.js, onload fn.
                 **/
            });
    }

    moduleLoader.onloadRecived = function(isDomReady) {
        /* 
            SkillBased App mode:
                "FullWork": ChatMode
                "OneClient": WebSiteMode
                default : callCenterMode
         */
        if (isDomReady)
            onLoadDFD.resolveWith(moduleLoader, []);

        this.init();

        return onLoadDFD.promise();
    };

    moduleLoader.login = function() {

        if (userDAO.getUserDcmResponse())
            loginDFD.resolveWith(moduleLoader, []);

        if (window.Locstor)
            /fullauth/.test(Locstor.get("recentRefetch")) ? Locstor.remove('recentRefetch') : false;

        return loginDFD.promise();
    };


    moduleLoader.skillBasedLoader = function() {
        // Attach all app handlers
        // in main js thread, which
        // helps in quiting the app during
        // internet issue / when app is not logged in.
        util.publish(`/util/sendMessage/to/main`,{
            eType: `init`
        })

        // APP_ID should be "AnyWhereWorks" chat to start
        if (userDAO.getSkillByName('FullWork')) {
            this.chatMode();
        }
        else {
            // If chat skill is not present it should
            // check asar and appupdates
            util.publish('/asar/update/commence');
        }

        $('#v2_Phone_Icon').show();

    }


moduleLoader.chatMode = function() {

        this.log('ChatMode');
        // start chat
        util.publish('/chat/start');
        util.publish('/start/engine/updater/');
    }

    moduleLoader.reset = function() {
        loginDFD = $.Deferred();
        this.init();
    }

    mediator.subscribe('module/controller/onload', moduleLoader, moduleLoader.onloadRecived);
    mediator.subscribe('module/controller/login', moduleLoader, moduleLoader.login);
    mediator.subscribe('module/controller/reset', moduleLoader, moduleLoader.reset);
})(window, jQuery, amplify);
