function quitAppFaster(e) {
    if (!FULLClient["canQuit"]) {
        /*  
         *  Hiding SB window rather closing it
         *  with window X-Btn click
         */
        if (util.platform.isWin() && (!userDAO.getSkillByName('FullWork') || namespace.APP_ID != namespace.CONTAINER_CHAT)) {
            util.publish('/util/window/events/minimize', namespace.CONTAINER_SB);
        } else {
            util.publish('/util/window/events/hide', namespace.CONTAINER_SB);
        }

        util.publish('/timer/hwnd/show');
        return false; // this will prevent app from termination.
    }
};

onload = function() {
    var sbwin = util.getCurrentWindow();

    $('#v2_Phone_Icon').show();

    // start UI
    util.publish('/status/controller/mode/internalMode');
    // start clock
    util.publish('/goclock/controller/queryHours');
    // hide view profile option.
    util.publish('/status/UIController/hide/option/viewprofile', {
        mode: 'live',
        source: 'callcentermode'
    });

    console.log("Checking terminal-notifier permission from main window..!");
    util.publish("/notification/create/checkNotificationDependency");
 
    function embedIframeDom(url) {
        // var _client = document.createElement('iframe');
        // _client.style.width = '100%';
        // _client.style.height = '100%';
        // _client.src = url || 'file://' + FULLClient.getFilePath() + '/view/glitter.html';
        // _client.id = 'LoginModule';
        // return _client;
        var staticWelcomePage = new WebviewProxy('LoginModule', url, 'LoginModule');
         staticWelcomePage.setContentloaded(
            function(){
            util.publish('menuBar/updateTitle');
        });
        return staticWelcomePage.getView();
    };

    $('div[id="1_content"]').append(embedIframeDom('https://sites.google.com/a/a-cti.com/redone-team-vc/home/'));

    util.publish('module/controller/onload', {
        source: 'onload'
    });

    util.publish('/webview/controller/app/onload');

    // Send a message to main process
    util.subscribe(`/util/sendMessage/to/main`,{
        moduleName : namespace.moduleName.web,
        actionType: 'isCrashed',
        container: namespace.CONTAINER_SB
    });


    window.onbeforeunload = quitAppFaster;

    // Need to show Chat ICON
    if (userDAO.getSkillByName('FullWork'))
        $('#_chat').show().find('cite').hide();

    if (namespace.APP_ID != document.title) {
        // Change the name to FALLBACK ID
        document.title = namespace.APP_ID;
    }

    function checkDependencies() {
        var FormData,
            request,
            getPort;

        try {

            FormData = require('form-data');
            request = require("request");
            getPort = require('get-port');

            util.publish('/start/engine/updater/');

        } catch (e) {
            console.log('----- Updating the system -----');
            util.publish('/start/engine/updater/force/', true);
        }
    }

    checkDependencies();

    window.onfocus = function() {
        util.publish('/timer/hwnd/hide');
        util.tabs.focusActiveTab();
    }

    window.onblur = function() {
        util.publish('/timer/hwnd/show');
    }

    sbwin.on('minimize', function() {
        util.publish('/timer/hwnd/show');
    });

    sbwin.on('restore', function() {
        if (util.platform.isWin())
            util.publish('/timer/hwnd/hide');
    });

    // util.publish('arTimer/create/window');

    // jQuery(window).bind('keypress', jQuery.debounce(10000, true, function(event) {
    //     util.publish('/api/hit/detection/trial/');
    // }));
}