;
(function(util) {

    function findInPage(webview, text, isForward) {
        if (webview && text && jQuery.type(text) === "string") {
            return webview
                .findInPage(text, {
                    forward: isForward || false
                });
        } else
            removeOridinalMatch();
    };

    function showFindUI() {
        dom
            .parent
            .show()
            .find('input')
            .focus()
            .select();
    };

    function hideFindUI() {
        dom
            .parent
            .hide();
    };

    function removeOridinalMatch() {
        dom
            .ordinalMatch
            .text('');

        uiController.stopFind();
    }

    function stopFindInPage(webview) {
        if (webview) {
            webview
                .stopFindInPage('keepSelection');
        }
    };

    /**
            requestID

            activeMatchOrdinal , finalUpdate = false
            matches , finalUpdate = true

            case 1 :
                requestID -> register
                activeOrdianal - register
                finalUpdate = false

            case 2: 

                requestID == previousRequestID -> register
                matches - register
                finalUpdate = true

            case 3 :
                requestID -> register
                finalUpdate = true
                matches = 0


    */

    function isAPIChangeDetected(e) {
        /* 
            API change for 1.3.x to 1.4.x 
            two events are reduced to one
            combined event.
        */
        if (e.result.finalUpdate && util.isNumber(e.result.activeMatchOrdinal)) {
            this.setOrdinal(e.result.activeMatchOrdinal);
            this.setRequestID(e.result.requestId)
            return true;
        }
    }

    function updateOrdinalMatch(e) {
        if (!e.result.finalUpdate) {
            // ordinal match
            // set requestID
            // set ordinal
            this.setOrdinal(e.result.activeMatchOrdinal)
            this.setRequestID(e.result.requestId)
        } else {
            isAPIChangeDetected.call(this, e);
            // finalUpdate
            if (e.result.requestId == this.getRequestID()) {
                // set matches
                this.setMatches(e.result.matches);
            } else {
                // clear
                this.clear()
            }

            // display
            this.displayMatches();

        }
    }

    updateOrdinalMatch.displayMatches = function() {
        if (util.isNumber(this.getOrdinal()) && util.isNumber(this.getMatches())) {
            dom
                .ordinalMatch
                .text(this.getOrdinal() + ' of ' + this.getMatches());
        }
    };

    updateOrdinalMatch.clear = function() {
        this.setOrdinal(0);
        this.setMatches(0);
        this.setRequestID(0);
    };

    updateOrdinalMatch.setRequestID = function(v) {
        this.requestId = v;
    }
    updateOrdinalMatch.getRequestID = function(v) {
        return this.requestId;
    }

    updateOrdinalMatch.setMatches = function(v) {
        this.matches = v;
    }
    updateOrdinalMatch.getMatches = function(v) {
        return this.matches;
    }

    updateOrdinalMatch.setOrdinal = function(v) {
        this.ordinal = v;
    }

    updateOrdinalMatch.getOrdinal = function(v) {
        return this.ordinal;
    }

    var dom = {
        parent: $('.findsearch_hold'),
        input: $('.findsearch_hold').find('input'),
        previous: $('.findsearch_hold').find('#previousSearch'),
        next: $('.findsearch_hold').find('#nextSearch'),
        close: $('.findsearch_hold').find('#closeFindUI'),
        ordinalMatch: $('.findsearch_hold').find('input').siblings('span'),
        addListener: function() {
            this
                .input
                .on('keyup', uiController.changeEvent.bind(uiController));

            this
                .input
                .on('cut', uiController.changeEvent.bind(uiController));

            this
                .input
                .on('paste', uiController.changeEvent.bind(uiController));

            this
                .next
                .on('click', function() {
                    uiController.find(dom.input.val(), true);
                });

            this
                .previous
                .on('click', function() {
                    uiController.find(dom.input.val(), false);
                });

            this
                .close
                .on('click', function() {
                    hideFindUI();
                });
        }
    };

    var uiController = {
        getDom: function() {
            return util.tabs.getActiveTab() || document.querySelector('#LoginModule');
        },
        changeEvent: function(e) {
            var keycode = e.keyCode;
            var valid =
                (keycode > 47 && keycode < 58) || // number keys
                keycode == 32 || // spacebar
                keycode == 8 || // backspace
                keycode == 17 || // CTRL
                keycode == 91 || // CMD
                (keycode > 64 && keycode < 91) || // letter keys
                (keycode > 95 && keycode < 112) || // numpad keys
                (keycode > 185 && keycode < 193) || // ;=,-./` (in order)
                (keycode > 218 && keycode < 223); // [\]' (in order)

            if (valid) {
                // console.log('e.Keycode[' + (e.keyCode || e.type) + '] == [' + e.target.value + ']');
                this.find(e.target.value);
            } else {
                switch (e.keyCode || e.type) {
                    case 27:
                        {
                            // Escape
                            uiController.stopFind();
                            // take out UI
                            hideFindUI();
                            // focus current tab
                            util.tabs.focusActiveTab();
                            util.preventEvent(e);
                            break;
                        }
                    case 119:
                        {
                            // f8
                            console.check('Send event to frame', e);
                            this.getDom()
                                .sendInputEvent({ type: 'keyDown', keyCode: 'F8' });
                            this.getDom()
                                .focus();
                            break;
                        }
                    case 13:
                        {
                            // enter
                            this.find(e.target.value, true);
                            // close AP, if visible
                            util.publish('/answerphrase/close/active/ap');
                            break;
                        }
                    default:
                        {
                            break;
                        }
                }
            }
        },
        find: function(txt, isForward) {
            return findInPage(uiController.getDom(), txt, isForward);
        },
        stopFind: function() {
            return stopFindInPage(uiController.getDom());
        }
    };

    util.subscribe('/webview/found/in/page/', function(e) {
        // console.check(e.result);
        updateOrdinalMatch.call(updateOrdinalMatch, e);
    });

    module.exports = {
        controller: uiController,
        dom: dom,
        findInPage: findInPage,
        stopFindInPage: stopFindInPage
    };

    util.subscribe('/find/in/page/show', showFindUI);
    util.subscribe('/find/in/page/hide', hideFindUI);
    util.subscribe('module/controller/onload', dom, dom.addListener);

})(util);