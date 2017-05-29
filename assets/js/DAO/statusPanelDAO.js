(function(root) {
    /* 

        DAO : [constructors are public]
        controller : StatusContoller 
        UI : StatusUIMessenger
    */

    function StatusController(lUImsg) {
        this.name = 'StatusController';
        this.UImsg = lUImsg || null;
    };

    StatusController.prototype.setUImsg = function(uiMessage) {
        if (typeof uiMessage == 'object' && uiMessage instanceof StatusUIMessenger) {
            this.UImsg = uiMessage;
            return true;
        }
    };

    function StatusUIController(lUImsg) {
        this.name = 'StatusUIController';
        this.UImsg = lUImsg || null;
    };

    StatusUIController.prototype.setUImsg = function(uiMessage) {
        if (typeof uiMessage == 'object' && uiMessage instanceof StatusUIMessenger) {
            this.UImsg = uiMessage;
            return true;
        }
    };

    function StatusUIMessenger() {
        this.name = 'StatusUIMessenger';
        this.opt = null;
        this.originalEvent = null;
        this.status = {
            'name': 'status',
            'value': null,
            'source': 'auto'
        };
        this.clockedOut = {
            'name': 'clockedOut'
        };
        this.clockedIn = {
            'name': 'clockedIn'
        };
        this.hide = {
            'name': 'hide'
        };
        this.show = {
            'name': 'show'
        };
    };

    StatusUIMessenger.prototype = {
        constructor: StatusUIMessenger,
        setStatus: function(lStatus, source) {
            if (lStatus) {
                this.opt = 'status';
                this['status']['value'] = lStatus;
                this['status']['source'] = source || 'auto';
                return true;
            }
        },
        setClockedOut: function() {
            this.opt = 'clockedOut';
        },
        setClockedIn: function() {
            this.opt = 'clockedIn';
        },
        setHide: function() {
            this.opt = 'hide';
        },
        setShow: function() {
            this.opt = 'show';
        },
        setOriginalEvent: function(obj) {   
            if (typeof obj == 'object') {
                this.originalEvent = obj;
            }
        }
    };

    root['StatusController'] = StatusController;
    root['StatusUIController'] = StatusUIController;
    root['StatusUIMessenger'] = StatusUIMessenger;

    Object.defineProperty(root, 'StatusController', util.accessMods.protected);
    Object.defineProperty(root, 'StatusUIController', util.accessMods.protected);
    Object.defineProperty(root, 'StatusUIMessenger', util.accessMods.protected);

}(this));