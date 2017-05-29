(function() {
    var pref = $('.option-list #preferences'),
        profilePic = $('header.main-header figure'),
        feedback = $('#agentFb'),
        shortcuts = key.noConflict();

    if (/test|code/.test(FULLClient.getMode())) {
        shortcuts('command+shift+l,ctrl+shift+l', function(loadEvt) {
            util.preventEvent(loadEvt);

            // https://my.distributedsource.com/crm#task/0532b505-d15e-45b1-b6e8-f8d3200851e6?connid=LcMjycGJG1Vxd9vumswCwEsBN1RaocTbK1462027380279AR&userpin=kamesh.arumugam@a-cti.com&calltype=epCustom
            setTimeout(function() {
                util.loadURL('https://my.distributedsource.com/crm#task/0532b505-d15e-45b1-b6e8-f8d3200851e6?connid=LcMjycGJG1Vxd9vumswCwEsBN1RaocTbK1462027380279AR&userpin=' + userDAO.getEmail() + '&calltype=epCustom');
            }, 0);

            setTimeout(function() {
                util.loadURL('https://my.distributedsource.com/crm#task/0532b505-d15e-45b1-b6e8-f8d3200851e6?connid=U94vBIbGNvLFQBtX9ItpWhhDmoXP9OsAY1462084380816AR&userpin=' + userDAO.getEmail() + '&calltype=epCustom');
            }, 10000);
        });
    };

    shortcuts('command+=,ctrl+=', function() {
        util.zoom.zoomIn(util.zoom.getActiveTab());
    });

    shortcuts('command+o,ctrl+o', function() {
        util.zoom.resetZoom(util.zoom.getActiveTab());
    });

    shortcuts('command+-,ctrl+-', function() {
        util.zoom.zoomOut(util.zoom.getActiveTab());
    });

    shortcuts('command+w,ctrl+w', function(closeEvent) {
        util.preventEvent(closeEvent);
        var id = util.tabs.getActiveTabId();
        // Force close
        util.publish('/tabLock/closeUI/decider/', {
            source: tabController.sources.getURLbyId(id),
            isForce: true,
            tabIndex: id
        });
    });

    shortcuts('command+shift+r,ctrl+shift+r', function(closeEvent) {
        // util.publish('/refetch/recent');
        var dom = util.tabs.getActiveTab();
        if (dom) {
            dom.reloadIgnoringCache(true);
        }
    });

    shortcuts('command+shift+t,ctrl+shift+t', function(testRunner) {
        util.preventEvent(testRunner);
        if (FULLClient.getMode() == "code")
            FULLClient.ipc.send({ eType: 'open', title: 'sbJasmineRunner' })
    });

    shortcuts('ctrl+tab', function(tabEvent) {
        util.preventEvent(tabEvent);
        util.publish('/switch/tab/shortcut');
    });

    shortcuts('command+option+i,ctrl+shift+i', function(eDeveloperTool) {
        util.preventEvent(eDeveloperTool);
        util.getCurrentWindow().openDevTools();
    });

    shortcuts('command+h', function(event) {
        util.preventEvent(event);
        if (/^darwin/.test(process.platform))
            util.windowEvents.hide(util.window.getName());
    });

    shortcuts('command+r,ctrl+r', function(reloadEvent) {
        util.preventEvent(reloadEvent);
    });

    shortcuts('command+f12,f12', function(closeEvent) {
        util.publish('/fetch/display/gui');
    });

    shortcuts('command+f', function(searchEvent) {
        util.publish('/find/in/page/show');
    });

    shortcuts('enter', function(e) {
        util.publish('/answerphrase/close/active/ap');
    });


    shortcuts('escape', function(e) {
        util.publish('shortcuts/keyPress/escape');
        
        if (FULLClient["canQuit"] == true){
            util.preventEvent(e);
        } else {
            $('.quit-popup-hold.quitApp').hide();
            FULLClient["canQuit"] = false;
        }

        util.publish('/find/in/page/hide');

        if (pref.hasClass('open'))
            pref.removeClass('open')

        if (profilePic.hasClass('open'))
            profilePic.removeClass('open')

        // Hiding, timer UI in tabs if
        // escape is pressed.
        $('.timer').hide();

        util.publish('/v2/logout/hide');

    });

    shortcuts('command+f8,f8', function(event) {
        var dom = util.tabs.getActiveTab();
        if (dom) {

            function PassEvent(code) {
                this.name = "_event";
                this.keyCode = code;
                this.caller = "";
            };

            var f8Event = new PassEvent(event.keyCode);
            f8Event["caller"] = "app";
            f8Event["ctrlKeyArg"] = false;
            f8Event["altKeyArg"] = false;
            f8Event["shiftKeyArg"] = false;
            f8Event["metaKeyArg"] = true;
            dom.send('webapp-msg', f8Event);
            if (event.srcElement.nodeName != "WEBVIEW")
                util.document.shadowRootFocus(dom);

            util.publish('/answerphrase/close/active/ap');
        }
    });
})();