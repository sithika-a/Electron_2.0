/**
 *
 * Base Controller
 *
 **/

/**
 *
 * TODO :
    a. Base Data Collector
    b. Check Mode and route Message
    c. UI controll to show or stop.
 *
 **/

(function(root, $, util, lUserDAO, undefined) {
    var v2Intercept = {
        checkForV2Live: function(orgObj) {
            if (orgObj && orgObj.isInterruptible && this.isOldV2()) {
                /* 
                 * 1, old V2 with 1.x changes ,status will be Interruptible,no need to send other status info
                 * 2, New V2 with 1.x , will send single message with Status and interruptible flag is true  
                 */
                orgObj['statusPush'] = 'Interruptible';
                return true;
            }
        },
        isOldV2: function() {
            if (/staging-v2/.test(util.config.getOldV2url()))
                return true;
        }
    }

    var statusPanelController = {
        name: 'statusPanelController',
        log: function() {
            util.log.apply(this, arguments);
        },
        mode: lUserDAO.getSkillByName('FullWork') ? 'external' : 'internal',
        getMode: function() {
            return this.mode;
        },
        approvedOptionList: util.v2.getStatusList(),
        isWhiteListed: function(status) {
            return this.approvedOptionList.indexOf(status) !== -1 ? true : false;
        },
        isModuleLoadable: function() {
            return userDAO.getSkillByName('FullWork') || userDAO.getSkillByName('CEA') ? false : true;
        },
        pushToV2: function(sObj) {
            if (sObj && !/fetch/.test(sObj.calltype) && (sObj.connId || sObj.isForce)) {
                this.log("pushing status to V2: ", sObj);
                util.publish('/util/v2/push/original/event', sObj);
                util.tabs.removeInterruptibleConnId(sObj.connId);
                return true;
            }
            console.warn('[\'pushToV2\'] discarded : ', sObj);
        },
        pushInterrutibleInfo: function(info) {
            console.log('pushInterrutibleInfo ...',info)

            if (info && info.connId) {
                var iObj = new V2Communication('statusPush');
                iObj.statusPush = 'Available';
                iObj.isInterruptible = 'true';
                iObj.isForceClose = true;
                iObj.connId = info.connId;
                iObj.source = 'FULLClient_status_controller';
                this.timer.orgEventModify(iObj);

                v2Intercept.checkForV2Live(iObj); // patch for live-V2 support in 1.x 
                this.pushStatus(iObj);
                return true;
            }
        },
        pushXcloseInfo: function(info) {

            console.log('pushXcloseInfo :: ', info)
            if (info && info.connId) {
                var iObj = new V2Communication('statusPush');
                iObj.statusPush = info.status;
                iObj.isInterruptible = info.isInterruptible;
                // iObj.isForce = true;
                iObj.connId = info.connId;
                iObj.source = 'FULLClient_status_controller';
                
                console.log('Xclose info obj :', iObj);
                   if(info.isInterruptible) v2Intercept.checkForV2Live(iObj); // patch for live-V2 support in 1.x 
                this.pushStatus(iObj);
                return true;
            }
        },
        isOldV2: function() {
            if (/staging-v2/.test(util.config.getOldV2url()))
                return true;
        },
        isOriginalEventValid: function(orgObj) {
            if (orgObj && orgObj['connId'] && orgObj['calltype']) {
                return true;
            }
        },
        pushViaStatus: function(statusObj) {
            if (statusObj && this.isWhiteListed(statusObj.value)) {
                var lObj = new V2Communication('statusPush');
                lObj.statusPush = statusObj.value;
                lObj.source = 'FULLClient_status_controller';
                lObj.isForce = true;
                this.pushStatus(lObj);
                return true;
            }
        },
        _mergeProperties: function(obj1, obj2) {
            if (obj1 && obj2) {
                obj1.connId = obj2.connId || obj2.connid;
                obj1.tabIndex = obj2.tabIndex;
                obj1.calltype = obj1.calltype || obj2.calltype;
                obj1.userpin = obj2.userpin;
                return obj1;
            }
        },
        isInterruptible: function(iObj) {
            if (iObj && iObj.connId && util.tabs.isInterruptible(iObj.connId)) {
                iObj.isInterruptible = 'true';
                console.log('IS_INTERRUPTIBLE[' + iObj.connId + '] : with status [' + iObj['statusPush'] + ']');
                return true;
            }
        },
        pushOriginalEvent: function(orgObj) {
            if (!this.isOriginalEventValid(orgObj)) {
                /**
                 * From two sources, chromeAppApi
                 * and sb. we are pushing status
                 * change sequence to v2.
                 *
                 * We are validating/ stopping status
                 * push based on the connid present
                 * in original push event
                 *
                 * in some cases, the url changes or DS or SB
                 * during supervisor call / fetch account etc.
                 *
                 * connid present will commence this routine
                 * else, sourceMap has be checked.
                 *
                 * check TabController.js
                 */
                var mergedObj = this._mergeProperties(orgObj, util.tabs.getOriginalParam(orgObj.source));
                // this.log('Data2 : ', mergedObj);
                /**
                 * SourceMap and take the data.
                 * source map should contain the data
                 * for original url, get the params
                 * inject the data into original event and use it
                 *
                 * a. get data
                 * b. inject data
                 * c. validateData
                 * d. print in case of routine failing and debug details
                 *     1. stack on the sourcemap
                 *     2. defective source url
                 *     3. incoming OriginalEvent obj.
                 */
                orgObj = mergedObj ? mergedObj : orgObj;
            }
            if (this.isOriginalEventValid(orgObj)) {
                this.timer.orgEventModify(orgObj);
                this.isInterruptible(orgObj);

                v2Intercept.checkForV2Live(orgObj); // patch for live-V2 support in 1.x 
                this.pushStatus(orgObj);
            } else {
                this.log('Discarding this push, without connID not status push will work ', orgObj);
                return false;
            }
        },
        timer: {
            // TODO routine for fixing
            // via direct status push
            // One scenario which might affect 
            // the routine is chromeAppApi
            // with http local call,7056 port
            _getStorageInfo: function(oEvt) {
                if (oEvt && oEvt.connId) {
                    var connId = oEvt.connId;
                    var connIdInfo = util.storage.get('timerConnIdMap');
                    if (connIdInfo[connId]) {
                        var status = connIdInfo[connId].status;
                        var isApproved = statusPanelController.isWhiteListed(status);
                        if (isApproved) {
                            console.log('TIMERDROP_DOWN : status changed from[' + oEvt['statusPush'] + '] to [' + status + ']');
                            return status;
                        }
                    }
                    return false;
                }
            },
            orgEventModify: function(oEvt) {
                // Check Localstorage for data change
                // If data is available for status, make use of 
                // it else let the status go in.

                if (oEvt && oEvt.connId) {
                    var status = this._getStorageInfo(oEvt)
                    oEvt['statusPush'] = status || oEvt['statusPush'];
                    return oEvt['statusPush'];
                }
            }
        },
        pushStatus: function(sObject) {
            this.pushToV2(sObject);
        },
        listener: function(msg) {
            if (msg) {
                console.log('Message @ STATUSModule : ', msg.UImsg);
                /* 
                    In-case, user manually changes status from, availability
                    options, we should send the status to repective routing
                    System v2 or InbuiltRouting.

                    After successfully, change of status, auto change signal will reach
                 */

                var statusUImsg = msg.UImsg;
                switch (statusUImsg.opt) {
                    case "status":
                        {
                            if (this.isWhiteListed(statusUImsg['status'].value)) {

                                // console.log('Source  : ',statusUImsg['status'] , msg);
                                /* 
                                When, User manually changes the status,
                                source will be manual, so we have to send 
                                the information to respective routing system
                                either v2 or InbuiltRouting.
                             */
                                if (statusUImsg['status'].source == 'manual') {
                                    this.log("Outgoing status : v2/IR/chromeappAPI/7056: " + statusUImsg['status'].value);
                                    statusUImsg.originalEvent ?
                                        this.pushOriginalEvent(statusUImsg.originalEvent) : // using original event from chromeAppApi
                                        this.pushViaStatus(statusUImsg['status']); // construting status from push call.
                                } else {
                                    this.log("Incoming status to main container for UI :" + statusUImsg['status'].value);
                                    /**
                                     *
                                     * Patch, In live 0.1.51 user dont have constant connection
                                     * please check the goClockExtension.
                                     *
                                     **/
                                    util.publish('/goclock/extension/status', msg.UImsg['status'].value);
                                }
                            }
                            break;
                        }
                    default:
                        {
                            break;
                        }
                }
                return true;
            }
        }
    };

    util.subscribe('/status/controller/push/xclose/Info', statusPanelController, statusPanelController.pushXcloseInfo);

    util.subscribe('/status/controller/recieved/postMessage', statusPanelController, statusPanelController.listener);
    util.subscribe('/status/controller/push/interruptible/info', statusPanelController, statusPanelController.pushInterrutibleInfo)
    root['statusPanelController'] = statusPanelController;

    module.exports = statusPanelController;
}(this, jQuery, util, userDAO));