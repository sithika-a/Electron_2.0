(function(root,util,undefined) {
    /**
     *
     * Constructors.
     *
     **/

    function GoclockHours(_in, dateAddedInMilliSec, src) {
        this.in = _in || false;
        this.name = 'GoclockHours';
        this.DAIM = dateAddedInMilliSec || 0;
        this.source = src || 'goClockModule';
    }

    GoclockHours.prototype = {
        constructor: GoclockHours,
        setDAIM: function(hoursJDOList) {
            if (hoursJDOList && hoursJDOList.constructor == Array) {
                this._getDAIMfromJDOlist(hoursJDOList);
                return true;
            }
        },
        _getDAIMfromJDOlist: function(hoursJDOList) {
            this.DAIM = 0;
            for (var i = hoursJDOList.length - 1; i >= 0; i--) {
                this.DAIM += this._getDAIM(hoursJDOList[i]);
            };
        },
        _getDAIM: function(hoursJDO) {
            var time = 0;
            if (hoursJDO) {

                if (hoursJDO.clockingStatus == 'CLOCKED_IN')
                    this.in = true;

                if (hoursJDO.clockInLongTime && hoursJDO.clockOutLongTime)
                    time = hoursJDO.clockOutLongTime - hoursJDO.clockInLongTime;
            }
            return time;
        },
        getTimeInMilliSeconds : function(){
            return this.DAIM;
        }
    };

    function UserClockStatus(StatusString, connIdString, isDummyBoolean) {
        this.agent = userDAO.getUser().fullname; // kamesh Arumugam
        this.state = StatusString; // Available,Break,Project,Metting,Account-Close,X-Close
        this.agentname = userDAO.getUser().fullname; // Kamesh Arumugam
        this.v2login = userDAO.getUser().email; // kamesh.arumugam@a-cti.com
        this.email = userDAO.getUser().email; // kamesh.arumugam@a-cti.com
        this.connectionId = connIdString || 'N/A'; // connid or N/A
        this.uniquepin = userDAO.getCompanyId(); // default adaptavant
        this.clockingStatus = isDummyBoolean ? 'DUMMY' : 'REAL';
        this.requestSource = "FULLClient";
        this.sourceEngine = nwUserAgent;
    }

    function GoClockController( operation ){
    	this.name = 'GoClockController';
    	this.opt = operation || 'sync';
    	this.sync = {
    		name : 'sync'
    	};
        this.hoursJDO = null;
    };

    GoClockController.prototype = {
    	constructor :  GoClockController,
    	setSync :  function(isStop , DAIM ){
    		this['opt'] = 'sync';
            this['hoursJDO'] = isStop ? new GoclockHours() : new GoclockHours(true,DAIM);
    	},
        getHours : function(){
            return this.hoursJDO;
        }
    }

    function GoClockUIController( GoclockHoursObj ){
    	this.name = 'GoClockUIController';
        this.hoursJDO = GoclockHoursObj || null;
    };

    GoClockUIController.prototype = {
    	constructor :  GoClockUIController,
    	setHours:  function( GoclockHoursObj ){
    		this.hoursJDO = GoclockHoursObj;
    	},
    	getHours : function(){
            return this.hoursJDO;
        }
    }

    root['GoClockUIController'] = GoClockUIController;
    root['GoClockController'] = GoClockController;
    root['GoclockHours'] = GoclockHours;
    root['UserClockStatus'] = UserClockStatus;

    Object.defineProperty(root, 'GoClockUIController', util.accessMods.protected);
    Object.defineProperty(root, 'GoClockController', util.accessMods.protected);
    Object.defineProperty(root, 'GoclockHours', util.accessMods.protected);
    Object.defineProperty(root, 'UserClockStatus', util.accessMods.protected);


})(this,util);