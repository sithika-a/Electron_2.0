 (function(R, util) {

     var statusDropDown = {
         dropdown: $('.closeDwn ul'),
         dropdown_btn: $('#status_switch'),
         showDropDownBtn: function() {
             this.dropdown_btn.show();
         },
         hideDropDownBtn: function() {
             this.dropdown_btn.hide();
         },
         setListener: function() {
             this.dropdown_btn.click(function() {
                 console.warn('@CloseTab: status switch');
                 this.toggleDropDown(true);
             }.bind(this));
         },
         isBtnFocused: function() {
             if (this.dropdown_btn.is(":focus")) {
                 return true;
             }
         },
         isVisible: function() {
             return this.dropdown.is(':visible');
         },
         hideDropDown: function() {
             return this.dropdown.hide();
         },
         showDropDown: function() {
             this.dropdown.show();
             commonUtils.highLightSelectedElement();
         },
         toggleDropDown: function(isMouseClick) {
             if (this.isVisible()) {
                 this.hideDropDown();
                 this.checkForStatusChange(isMouseClick); // check for status_change only onEnter keyPress.
             } else this.showDropDown()
         },
         checkForStatusChange: function(isMouseClick) {
             if (!isMouseClick) {
                 var selectedElem = commonUtils.getSelectedElem();
                 console.log('Changing status in UI with enter key press', selectedElem);
                 statusHandler.statusSwitchHandler(selectedElem);
             }
         }
     }

     var sendMessage = {
         toAnalytics: function(params, originalURL, isRecentRefetch, status, type) {
             console.log('Sending to analytics ... ', arguments);
             if (params && type) {

                 var metaInfo = {
                     "url": originalURL || tabInfoObj["tabSrcUrl"]
                 };
                 if (textAreaHandler["userText"]) {
                     metaInfo["tabXCloseInfo"] = textAreaHandler["userText"];
                 }
                 metaInfo["status"] = status;
                 metaInfo["isRecentRefetch"] = isRecentRefetch;
                 metaInfo["originalSrcUrl"] = tabInfoObj["tabSrcUrl"];
                 metaInfo["currentTabLocation"] = tabInfoObj["currentTabLocation"];
                 console.warn('@closeTab Info : to analytics : ', metaInfo);
                 util.analytics.push(params['accountNumber'], type, params['connId'], JSON.stringify(metaInfo));
             }
         },
         sendPopUpCancelInfo: function() {
             console.log('sendPopUpCancelInfo !!!!!')
             var params, connID, isRecentRefetch, status;
             params = commonUtils.getParams();
             connID = commonUtils.getConnID(params);
             isRecentRefetch = refetchRoutine.isRecentRefetch(params) || false;
             if (!isRecentRefetch)
                 status = statusHandler.fetchStatusInfo(connID); // No need to send status if It is refetched one..
             this.toAnalytics(params, null, isRecentRefetch, status, analytics.TAB_XCLOSE_Cancel)
         },
         getMailSubject: function(tabInfo, params) {
             var sub = "Tab X-Close";
             if (params && refetchRoutine.isRecentRefetch(params)) {
                 sub += " (Recent Refetch)"
             }
             var accInfo = tabInfo.accountNumber || tabInfo.connId || "";
             console.log('accInfo : ', accInfo);
             sub += " : " + accInfo;
             console.warn('@closeTab : mail Subject : ', sub);
             return sub;
         },
         getMetaInfo: function() {
             var params = commonUtils.getParams();
             var tabInfo = commonUtils.getTabInfo(params);
             console.warn('@closeTab - tabInfo :', tabInfo)
             return {
                 type: 'tab-XClose',
                 tabInfo: tabInfo,
                 xCloseReason: textAreaHandler.userText,
                 subject: this.getMailSubject(tabInfo, params)
             };
         },
         toDev: function() {
             console.warn('@closeTab - Started Mailing to Dev')
             var metaInfo = this.getMetaInfo();
             util.publish('/mailHelper/mailsend', metaInfo, function() {
                 console.warn('Mail Pushed to Dev with TabInfo : ', metaInfo);
             });

         }
     }

     var textAreaHandler = {
         textArea: $("#closeTabUI").find("textarea"),
         errTextShown: false,
         userText: null,
         tabFocus: false,
         focusTextArea: function() {
             this.textArea.focus();
         },
         setListener: function() {
             this.textArea
                 .on('change keyup paste keypress', this.textArea_onKeyPress)

             .on('focus', function() {
                 this.onFocusTextArea.call(this)
             }.bind(this))

             .on('blur', function() {
                 this.removeTextAreaStyle.call(this)
             }.bind(this));
         },
         clearTextArea: function() {
             this.textArea.val('');
         },
         clearText: function() {
             this.userText = null;
         },
         textArea_onKeyPress: function(evt) {
             util.doNotBubble(evt);
             if (this.value.trim().length) {
                 textAreaHandler.hideErrText();
             }
         },
         showErrText: function() {
             this.errTextShown = true;
             this.textArea.addClass('error').focus();
         },
         hideErrText: function() {
             this.errTextShown = false;
             this.textArea.removeClass('error');
         },
         highlightTextArea: function() {
             this.textArea.css({
                 'border': '1px solid #DCDCDC',
                 'box-shadow': '0px 0px 10px #DCDCDC'
             });
         },
         removeTextAreaStyle: function() {
             this.textArea.css({
                 'border': '',
                 'box-shadow': ''
             });
         },
         onFocusTextArea: function() {
             if (!this.errTextShown) {
                 this.highlightTextArea();
             } else {
                 this.textArea.addClass('error');
             }
             if (statusDropDown.isVisible()) {
                 return statusDropDown.hideDropDown();
             }
         },
         getUserText: function() {
             if (!this.setText()) {
                 console.warn('@closeTab - No text found')
                 this.showErrText();
             }
             return this.userText;
         },
         setText: function() {
             this.userText = this.textArea.val().trim();
             return this.userText;
         },
         updateTextInUI: function(params) {
             if (this.getTextFromLS(params)) {
                 console.log('Updating text in UI.... ', this.userText);
                 return this.textArea.val(this.userText);
             } else {
                 console.warn('Text not available in LS.... ', this.userText);
                 this.textArea.val("");
             }
         },
         getTextFromLS: function(params) {
             console.log(' Getting text from Loc Storage', params);
             var connIdMap = commonUtils.getConnIdMap();
             var connId = params.connId || params.connid;

             if (connIdMap[connId] && connIdMap[connId].text) {
                 this.userText = connIdMap[connId].text
                 return this.userText;
             }
         },
         storeTextInLS: function() {
             console.log('storeTextInLS :', this.userText);

             var params = commonUtils.getParams();
             var connId = params.connId || params.connid;

             var connIdMap = commonUtils.getConnIdMap();

             if (connIdMap[connId]) {
                 console.log('adding text alone to connid map');
                 connIdMap[connId].text = this.userText;
             } else {
                 console.log('conn id not in map');
                 connIdMap[connId] = {
                     connid: connId,
                     currentTabIndex: params.currentTabIndex,
                     status: null,
                     text: this.userText
                 }
             }
             util.storage.set('timerConnIdMap', connIdMap);

         }
     }

     var statusHandler = {
         statusTextList: ['Close / Go Available',
             'Close / Go to Break',
             'Close / Meeting',
             'Close / System Issues',
             'Close / Project',
             'Close / Personal',
             'Close / Training',
             'Close / Offline'
         ],
         defaultStatusText: 'Close / Go Available',
         defaultStatus: 'Available',
         statusSelected: false,
         statusMap: {
             Available: "Close / Go Available",
             Break: "Close / Go to Break",
             Meeting: "Close / Meeting",
             System: "Close / System Issues",
             Project: "Close / Project",
             Personal: "Close / Personal",
             Training: "Close / Training",
             Offline: "Close / Offline"
         },
         getStatusIndex: function(statusText) {
             if (statusText) {
                 return this.statusTextList.indexOf(statusText)
             }
         },
         getStatusElemFromDom: function(statusText) {
             var index = this.getStatusIndex(statusText);
             if (index !== -1) {
                 return $('.closeDwn ul li:eq(' + index + ')')
             }
         },
         setListener: function() {
             $(".closeDwn ul li").click(function(event) {
                 console.log('dropdown item clicked');
                 statusHandler.status_switch.call(statusHandler, $(this));
             });
         },
         updateStatusInUI: function(statusText) {
             console.log('Updating status text :', statusText)
             if (statusText) {
                 closeTabDecider.closeTabBtn.text(statusText);
             }
         },
         fetchStatusInfo: function(connId) {
             var connIdMap = commonUtils.getConnIdMap();
             if (connId && connIdMap[connId] && connIdMap[connId].status) {
                 return connIdMap[connId].status;
             }
         },
         storeStatusInfo: function(status) {
             console.log('Storing status  :', status);

             if (status) {
                 var params = commonUtils.getParams();
                 var connId = params.connid || params.connId
                 var statusInfo = commonUtils.getConnIdMap();
                 statusInfo[connId] = {
                     connid: connId,
                     currentTabIndex: params.currentTabIndex,
                     status: status
                 }
                 util.storage.set('timerConnIdMap', statusInfo);
             }
         },
         checkForStatusSelection: function() {
             if (!this.statusSelected) {
                 this.storeStatusInfo(this.defaultStatus);
             }
         },
         getStatusKey: function(value) {
             // if value = "Close / Go Available" , return key as "Available"
             for (var key in this.statusMap) {
                 if (new RegExp('^' + value + '$').test(this.statusMap[key])) {
                     return key;
                 }
             }
         },
         getStatusValue: function(key) {
             // if key = "Meeting" , return value as "Close / Meeting"
             return this.statusMap[key]
         },
         setFlag: function(bool) {
             this.statusSelected = bool;
         },
         getLastSelectedStatusAndUpdateInUI: function(connId) {
             var status = this.fetchStatusInfo(connId);
             if (status) {
                 this.setFlag(true);
                 this.updateStatusInUI(this.getStatusValue(status));
             } else
                 this.updateStatusInUI(this.defaultStatusText);
             return status || this.defaultStatus;
         },
         getStatusFromUI: function() {
             if (closeTabDecider.closeTabBtn && closeTabDecider.closeTabBtn.text) return closeTabDecider.closeTabBtn.text().trim();
         },
         checkForStatusMatch: function() {
             // before updating last selected status in the drop down 
             //this will check status in the drop down and the status in closeTab button are same 
             var statusInUI = this.getStatusFromUI();
             var lastStatusFromDropdown = commonUtils.getSelectedElem();

             if (this.isNewStatus(lastStatusFromDropdown, statusInUI)) {
                 return statusInUI;
             }
         },
         isNewStatus: function(selectedStatus, statusInUI) {
             console.log('is New status :selectedStatus : ', selectedStatus, ' statusInUI : ', statusInUI)
             if (statusInUI && selectedStatus && statusInUI !== selectedStatus) {
                 return true;
             }
         },
         getSelectedStatus: function(elem) {
             if (elem) {
                 commonUtils.setCurrentElem(elem);
                 return commonUtils.getSelectedElem();
             }
         },
         statusSwitchHandler: function(statusText) {
             /* 
                  If the status selected is different from the last status then update it in UI
                  store status in LocalStorage then call closeTab function. 
                  In case of same status selected again , ignore updating in UI, 
                  just call closeTab function to proceed further.
              */
             if (!statusText) return;
             if (this.isNewStatus(statusText, this.getStatusFromUI())) {
                 // Different status selected
                 console.log('statusSwitchHandler ...', statusText)
                 this.updateStatusInUI(statusText);
             } else {
                 // Same status selected again

                 if (statusDropDown.isVisible()) {
                     console.log('statusSwitchHandler : hideDropDown')
                     statusDropDown.hideDropDown();
                 }
             }
             this.setFlag(true);
             this.storeStatusInfo(this.getStatusKey(statusText));
             closeTabDecider.closeTabCB.call(closeTabDecider);
         },
         status_switch: function(selectedElement) {
             if (selectedElement) {
                 console.log('Status switch from key press');
                 this.statusSwitchHandler(this.getSelectedStatus(selectedElement));
             }
         },
         getXcloseInfoObj: function(params) {
             if (params) {
                 var connId = commonUtils.getConnID(params);
                 return {
                     status: statusHandler.fetchStatusInfo(connId),
                     connId: connId,
                     isInterruptible: params.isAR ? util.tabs.isInterruptible(connId) : false,
                     calltype: params.calltype
                 }
             }
         },
         pushStatus: function(params) {
             var xCloseObj = this.getXcloseInfoObj(params);
             console.log('changing V2 status for recent AR : ', xCloseObj);
             util.publish('/status/controller/push/xclose/Info', xCloseObj)
         }
     }

     var commonUtils = {
         firstElem: $("#status_scroll").children().first(),
         lastElem: $("#status_scroll").children().last(),
         currentElem: null, // current status selected in drop down 
         getParams: function(tabSourceUrl) {
             return util.getParameters(tabSourceUrl || tabInfoObj.getTabSrc());
         },
         getConnID: function(params) {
             var connID = params.connId || params.connid;
             if (connID) {
                 return connID;
             }
         },
         getTabInfo: function(params) {
             if (params) {
                 console.warn('@closeTab - getTabInfo : params : ', params);
                 return {
                     originalSrcUrl: tabInfoObj.tabSrcUrl,
                     currentTabLocation: tabInfoObj.getCurrentTabUrl(),
                     accountNumber: params['accountNumber'],
                     connId: params['connId'] || params['connid']
                 };
             }
         },
         getConnIdMap: function() {
             var connIdMap = util.storage.get('timerConnIdMap');
             if (!connIdMap) connIdMap = {};
             return connIdMap;
         },
         getElemIndex: function(elem) {
             return elem.index ? elem.index() : elem.getAttribute('value');
         },
         setCurrentElem: function(value) {
             if (value) {
                 this.currentElem = value;
             }
         },
         focusFirstElem: function() {
             this.setCurrentElem(this.firstElem)
             this.highLightElem(this.currentElem.siblings(), this.currentElem);
         },
         focusLastElem: function() {
             this.setCurrentElem(this.lastElem)
             this.highLightElem(this.currentElem.siblings(), this.currentElem);
             this.scrollLast();
         },
         getSelectedElem: function() {
             if (this.currentElem) {
                 return this.currentElem.length ?
                     this.currentElem[0].textContent.trim() :
                     this.currentElem.textContent.trim();
             }
         },
         highLightSelectedElement: function() {
             /* will check status match like selected status with the status in UI before updating*/
             var statusInUI = statusHandler.checkForStatusMatch();
             if (statusInUI) {
                 // this.currentElem = statusInUI
                 this.currentElem = statusHandler.getStatusElemFromDom(statusInUI)
             }
             if (this.currentElem) {
                 var index = this.getElemIndex(this.currentElem);
                 if (index >= 0 && index < 4) {
                     this.scrollFirst();
                 } else {
                     this.scrollLast();
                 }
                 this.highLightElem(this.currentElem.siblings(), this.currentElem);
             } else {
                 //No element selected yet ...so moving first phase...  
                 this.scrollFirst();
             }

         },
         highLightElem: function(prevElem, currentElem) {
             if (prevElem)
                 prevElem
                 .css("background-color", "#ffffff")
                 .find('a')
                 .css("color", "#333");

             if (currentElem)
                 currentElem
                 .css("background-color", "#218AA0")
                 .find('a')
                 .css("color", "#ffffff");

         },
         scrollFirst: function() {
             keyEventHandler.menu.scrollTop(0);
         },
         scrollLast: function() {
             keyEventHandler.menu.scrollTop(101);
         }
     }

     var tabInfoObj = {
         tabSrcUrl: null,
         currentTabLocation: null,
         tabIdToClose: null,
         setId: function(tabId) {
             if (tabId) this.tabIdToClose = tabId;
         },
         getTabSrc: function() {
             this.tabSrcUrl = util.tabs.getOriginalTabSrc(this.tabIdToClose);
             return this.tabSrcUrl;
         },
         getCurrentTabUrl: function() {
             this.currentTabLocation = util.tabs.getTabById(this.tabIdToClose).getURL();
             console.warn('@closeTab : Getting current tab Location : ', this.currentTabLocation);
             return this.currentTabLocation;
         }
     }

     var closeTabDecider = {
         closeTabUI: $('#closeTabUI'),
         textArea: $("#closeTabUI").find("textarea"),
         closeTabBtn: $('#closeTabYes'),
         transparentBg: $('.black-screen'),
         isPopUpShown: function() {
             return this.closeTabUI.is(':visible')
         },
         showUI: function() {
             /* setTime out is given because,
              webview is getting focused which blocks this text area focus 
              so putting this to eventloop to make sure this executes at last
              */
             console.warn('@closeTab : showing popuUp')

             setTimeout(function() {
                 this.showTransparentBG();
                 this.closeTabUI
                     .show()
                     .find("textarea")
                     .focus();
             }.bind(this), 0);
         },
         hideUI: function() {
             if (this.isPopUpShown()) {
                 console.warn('@closeTab : hiding popuUp')
                 this.closeTabUI.hide();
                 textAreaHandler.clearTextArea();
                 this.hideTransparentBG();
             }
         },
         storeTextAndHideUI: function() {
             textAreaHandler.setText();
             sendMessage.sendPopUpCancelInfo();
             textAreaHandler.storeTextInLS();
             textAreaHandler.clearText();
             this.hideUI();
         },
         showTransparentBG: function() {
             this.transparentBg.show();
         },
         hideTransparentBG: function() {
             this.transparentBg.hide();
         },
         applyTabLock: function(params) {
             console.log('apply tab lock');
             var connID = commonUtils.getConnID(params);
             if (connID) {
                 console.log('applying... tab lock');

                 textAreaHandler.hideErrText();
                 statusDropDown.hideDropDown();
                 refetchRoutine.removeJustClose();
                 statusHandler.getLastSelectedStatusAndUpdateInUI(connID);
                 textAreaHandler.updateTextInUI(params);
                 this.showUI();
             }
         },
         isCallTypeValid: function(calltype) {
             if (calltype && /repeats|epCustom|InBoundCall/i.test(calltype)) {
                 console.log('ITs a valid interaction...')
                 return true;
             }
         },
         lockAllTab: function(tabInfo) {

             tabInfoObj.setId(tabInfo.tabIndex);
             console.warn('@closeTab -lockAllTab - TAB ID: ', tabInfoObj.tabIdToClose);

             var params = commonUtils.getParams(tabInfo.source);
             console.warn('@closeTab - lockAllTab - params : ', params);

             if (forceCloseRoutine.isThirdPartyAr(params)) {
                 console.log('Third party routine closing withou lock...')
                     /* -- Third party AR routine --
                           Closing the Tab without Lock
                       */
                 return forceCloseRoutine.closeThirdPartyAr(params, tabInfo);
             }

             if (refetchRoutine.isRecentRefetch(params)) {
                 /* -- RecentReFetch Routine -- 
                    Apply TabLock Confirmation if live Interaction is refetched not if ReFetched the fetched one.
                  */
                 refetchRoutine.lockRecentRefetch(params);
             } else if (!util.isFetch(params) && this.isCallTypeValid(params.calltype)) {
                 /* -- Live interaction Routine --
                   Apply TabLock Confirmation to all live Interactions 
                 */
                 console.warn('Applying Lock to Interaction - calltype: ', params.calltype);
                 this.applyTabLock(params);
             } else {
                 /* -- Fetch Routine --
                     Closing the Tab without Lock
                 */
                 console.warn('Closing the Tab without Lock - calltype: ', params.calltype)
                 this.closeTab(tabInfo);
             }
         },
         decider: function(tabInfo) {
             // Lock All tab patch 
             this.lockAllTab(tabInfo);
         },
         closeTab: function(tabInfo) {
             if (tabInfo && typeof tabInfo == 'object') {
                 util.publish('/tab/controller/close/tab/', tabInfo);
             }
         },
         closeTabCB: function() {
             console.warn('@closeTab - closeTabCB : userText : ', this.userText, ': statusSelected Flag :', this.statusSelected);
             if (textAreaHandler.getUserText()) {
                 console.warn('@closeTab - user feedback :', this.userText);
                 statusHandler.checkForStatusSelection();

                 statusHandler.setFlag(false);
                 var selectedStatus = statusHandler.getLastSelectedStatusAndUpdateInUI(); // Passing no ConnId will update default text in CloseTab Btn
                 this.hideUI();
                 sendMessage.toDev();
                 forceCloseRoutine.init(selectedStatus);
             }
         },
         changeBgColor: function(selected, siblings) {
             siblings.css('background-color', '');
         },
         setListeners: function() {
             this.setBtnListener();
             keyEventHandler.setListener();
             mouseEventHandler.setListener();
             statusDropDown.setListener();
             textAreaHandler.setListener();
             statusHandler.setListener();

             $('body').on('keydown', '#closeTabUI', function(e) {
                 if (e.keyCode == 27) {
                     this.escKeyPress();
                 }
             }.bind(this));

         },
         escKeyPress: function() {
             if (this.isPopUpShown())
                 this.storeTextAndHideUI();
         },
         setBtnListener: function() {
             $('#closeTabYes').click(function() {
                 console.warn('@CloseTab: Yes Btn Clicked')
                 this.closeTabCB.call(this);
             }.bind(this));

             $('#closeTabNo').click(function() {
                 console.warn('@CloseTab: No Btn Clicked');
                 this.storeTextAndHideUI();
             }.bind(this));
         }
     }
     util.subscribe('shortcuts/keyPress/escape', closeTabDecider, closeTabDecider.escKeyPress);
     var forceCloseRoutine = {
         init: function(selectedStatus) {
             console.log('forceClose Routine ....selectedStatus :', selectedStatus);

             var isRecentRefetch,
                 originalSrcUrl = tabInfoObj.getTabSrc(),
                 params = commonUtils.getParams(originalSrcUrl);

             closeTabDecider.closeTab({
                 source: originalSrcUrl,
                 tabIndex: tabInfoObj.tabIdToClose
             });

             if (refetchRoutine.isRecentRefetch(params)) {
                 isRecentRefetch = true;
                 refetchRoutine.closeRecentRefetch(params);

             } else if (this.isInBoundCall(params)) {
                 console.log('@forceClose Routine , isInBoundCall ');

                 isRecentRefetch = false;
                 this.closeInBoundCall(params)

             } else if (this.isAR(params)) {
                 isRecentRefetch = false;
                 console.log('@forceClose Routine, repeats  and  epCustom');
                 this.closeAR(params)
             }

             sendMessage.toAnalytics(params, originalURL, isRecentRefetch, selectedStatus, analytics.TAB_XCLOSE);
         },
         isThirdPartyAr: function(params) {
             if (params.xCloseCompleted) {
                 return true;
             }
         },
         closeThirdPartyAr: function(params, tabInfo) {
             // When we have other third party
             // system interacting in our application
             // as AR, example intercom for setmore is one
             // such kind
             if (this.isAR(params)) {
                 console.warn('pushing Available staus for third party like intercom..');
                 util.publish('tab/sbARStatusPush', params.connId, 'Completed');
                 util.publish('/status/UIController/manual/status/change', 'Available');
             }
             closeTabDecider.closeTab(tabInfo);
         },
         closeAR: function(params) {
             if (!params.xCloseCompleted) {
                 // For our internal app 'x' close we will send completed-tabclose
                 util.publish('tab/sbARStatusPush', params.connId, 'Completed-TabClose');
                 params.isAR = true;
                 statusHandler.pushStatus(params);
             }
         },
         closeInBoundCall: function(params) {
             params.isAR = false;
             statusHandler.pushStatus(params);
         },
         isAR: function(params) {
             if (params && params.connId && params.calltype && ['repeats', 'epcustom'].indexOf(params.calltype.toLowerCase()) != -1) {
                 return true;
             }
         },
         isInBoundCall: function(params) {
             if (params && params.connId && !params.xCloseCompleted && params.calltype && /InBoundCall/i.test(params.calltype)) {
                 return true;
             }
         },


     }

     var refetchRoutine = {
         justCloseText: "Close Tab",
         applyJustClose: function() {
             statusDropDown.hideDropDownBtn();
             statusHandler.updateStatusInUI(this.justCloseText);
         },
         removeJustClose: function() {
             statusDropDown.showDropDownBtn();
         },
         lockRecentRefetch: function(params) {
             console.log('locking Recent Refetched Interaction')
             if (params.connId || params.connid) {
                 console.log('applying... tab lock for recent Refetched account');
                 textAreaHandler.hideErrText();
                 this.applyJustClose();
                 textAreaHandler.updateTextInUI(params);
                 closeTabDecider.showUI();
             }
         },
         isRecentRefetch: function(params) {
             var connID = params.connId || params.connid;
             if (params && params.recentRefetch && connID && !util.isFetch(params)) {
                 return true;
             }
         },
         closeRecentRefetch: function(params) {
             console.log('@recent refetch force close ...')
             var connID = params.connId || params.connid;

             console.log('@recent refetch Completed-TabClose ...')
                 // For our internal app 'x' close we will send completed-tabclose
             util.publish('tab/sbARStatusPush', connID, 'Completed-TabClose')
         }

     }

     var mouseEventHandler = {
         isScrolling: false,
         mouseOverElem: null,
         checkMouseOver: function() {
             if (this.mouseOverElem) {
                 this.mouseOutCb(this.mouseOverElem);
                 this.mouseOverElem = null;
             }
         },
         mouseOverCb: function(selected, siblings) {
             commonUtils.setCurrentElem(selected);
             commonUtils.highLightElem(siblings, selected);
             this.setMouseOverElem(selected);
         },
         setMouseOverElem: function(selectedElem) {
             if (selectedElem)
                 this.mouseOverElem = selectedElem
         },
         mouseOutCb: function(unSelectedElement) {
             if (!unSelectedElement) return;
             commonUtils.highLightElem(unSelectedElement)
         },
         setListener: function() {
             $('.closeDwn ul').scroll(function() {
                 mouseEventHandler.isScrolling = true;
                 clearTimeout($.data(this, "scrollTimer"));
                 $.data(this, "scrollTimer", setTimeout(function() {
                     // If the window didn't scroll for 250ms
                     mouseEventHandler.isScrolling = false;
                 }, 250));
             });
             $('.closeDwn ul li')
                 .on('mouseenter', function(event) {
                     if (mouseEventHandler.isScrolling) {
                         return;
                     }
                     mouseEventHandler.mouseOverCb.call(mouseEventHandler, $(this), $(this).siblings());
                 })
                 .on('mouseleave', function(e) {
                     if (mouseEventHandler.isScrolling) {
                         return;
                     }
                     mouseEventHandler.mouseOutCb.call(mouseEventHandler, mouseEventHandler.mouseOverElem)
                 });
         }
     }

     var keyEventHandler = {
         menu: $("#status_scroll"),
         currentDiv: null,
         setListener: function() {
             $('#xClosePopUp').keydown(function(e) {
                 this.tabKeyPress(e);
                 this.arrowKeyEvent.call(this, arguments);
             }.bind(this));
         },
         tabKeyPress: function(e) {
             if (e.keyCode == 9 && $(e.target).is('#closeTabNo')) {
                 textAreaHandler.focusTextArea();
             }
         },
         enterKeyPress: function() {
             if (statusDropDown.isBtnFocused()) {
                 statusDropDown.toggleDropDown();
             }
         },
         isArrowKey: function(args) {
             if (args && args.length && (args[0].which == 40 || args[0].which == 38)) return true;
         },
         isEnterKey: function(args) {
             if (args && args.length && args[0].which == 13) return true;
         },
         isUpArrow: function(args) {
             if (args && args.length && args[0].which == 38) {
                 return true;
             }
         },
         isDownArrow: function(args) {
             if (args && args.length && args[0].which == 40) {
                 return true;
             }
         },
         arrowKeyEvent: function(args) {
             var params = commonUtils.getParams();
             if (refetchRoutine.isRecentRefetch(params)) return;

             if (this.isArrowKey(args)) {
                 this.statusScroll.call(this, args);
             } else if (this.isEnterKey(args)) {
                 this.enterKeyPress();
             }
         },
         upLimit: function(currentElem) {
             /* 
                   In menu only four elements are shown ,
                   if the cursor selection crossed the 4th element 
                   from the bottom, we need to scroll up to view the previous element.
              */
             var index = commonUtils.getElemIndex(currentElem);
             if (index <= 4) {
                 return true
             }
         },
         downLimit: function(currentElem) {
             /* 
                   In menu only four elements are shown ,
                   if the cursor selection crossed the 4th element
                   we need to scroll down to view the next element.
              */
             var index = commonUtils.getElemIndex(currentElem);
             if (index >= 4) {
                 return true
             }
         },
         scrollUp: function() {
             if (this.upLimit(commonUtils.currentElem)) {
                 console.debug('Going uppp')

                 this.currentDiv = this.menu.children().last();
                 var menuTop = this.menu.scrollTop();
                 var elemHeight = this.currentDiv.outerHeight();

                 this.menu.scrollTop(menuTop - elemHeight);
             }
         },
         scrollDown: function() {
             if (this.downLimit(commonUtils.currentElem)) {
                 console.debug('Going Down', commonUtils.currentElem);

                 this.currentDiv = this.menu.children().first();
                 var menuTop = this.menu.scrollTop();
                 var elemHeight = this.currentDiv.outerHeight();

                 this.menu.scrollTop(menuTop + elemHeight);
             }
         },
         getPrevElemIndex: function(previousElem) {
             if (previousElem) return commonUtils.getElemIndex(previousElem)
         },
         hasPrevious: function() {
             if (commonUtils.currentElem.prev().size() == 0) {
                 return false;
             } else return true;
         },
         canGoUp: function(prevElem) {
             /* This will check whether can scroll up , 
              ie,.if the current selection is first Status (available) 
              then i cannot scroll up further 
              */
             if (prevElem) {
                 var prevElemIndex = this.getPrevElemIndex(prevElem);
                 if (prevElemIndex >= 0 && prevElemIndex <= 6) {
                     return true;
                 }
             }
         },
         hasNext: function() {
             if (commonUtils.currentElem.next().size() == 0) {
                 return false;
             } else return true;
         },
         canGoDown: function(nextElem) {
             /* This will check whether can scroll down , 
              ie,.if the current selection is last Status (offline) 
              then i cannot scroll down further
              */
             if (nextElem) {
                 var nextElemIndex = this.getNextDivIndex(nextElem);
                 if (nextElemIndex >= 1 && nextElemIndex <= 7) {
                     return true;
                 }
             }
         },
         getNextDivIndex: function(nextElem) {
             if (nextElem) return commonUtils.getElemIndex(nextElem)
         },
         getPrevElem: function() {
             if (this.hasPrevious())
                 return commonUtils.currentElem.prev();
             else
                 return $("#status_scroll").children().last();
         },
         goUp: function(prevElem) {
             /* Going Up : 
                  1, High light the Previous Element of the current selection.
                  2, Remove selection from all other elements
                  3, Make previous Element as the current Element
                  4, Scroll Up the menu if it met the condition given in UpLimit fn.
             */
             commonUtils.highLightElem(prevElem.siblings(), prevElem);

             commonUtils.setCurrentElem(prevElem);

             this.scrollUp();
         },
         onScrollUp: function() {
             if (!commonUtils.currentElem) {
                 /* 
                  * If no status selected previously and clicking Up Arrow 
                  * on dropDown btn will focus last Status...
                  */
                 return commonUtils.focusLastElem();
             }
             var previousElem = this.getPrevElem();
             if (this.canGoUp(previousElem)) {
                 this.goUp(previousElem);
             }
         },
         getNextElement: function() {
             if (this.hasNext())
                 return commonUtils.currentElem.next();
             else
                 return $("#status_scroll").children().first();
         },
         goDown: function(nextElem) {
             /* Going Down : 
                  1, High light the Next Element of the current selection.
                  2, Remove selection from all other elements
                  3, Make next Element as the current Element
                  4, Scroll down the menu if it met the condition given in downLimit fn.
             */
             console.log('GO DOWN : nextElem ', nextElem)
             commonUtils.highLightElem(nextElem.siblings(), nextElem);
             commonUtils.setCurrentElem(nextElem);

             this.scrollDown();
         },
         onScrollDown: function() {
             var nextElement;
             if (!commonUtils.currentElem) {
                 /* 
                  * If no status selected previously and clicking down Arrow 
                  * on dropDown btn will focus very First Status...
                  */
                 return commonUtils.focusFirstElem();
             }

             nextElement = this.getNextElement();

             if (this.canGoDown(nextElement)) {
                 this.goDown(nextElement);
             }
         },
         statusScroll: function(args) {
             /* 
                Up/Down Arrow key press should scroll up/down the status from drop down 
             */
             if (statusDropDown.isVisible()) {
                 if (this.isDownArrow(args)) {
                     // Scroll Down..
                     return this.onScrollDown();
                 } else if (this.isUpArrow(args)) {
                     // Scroll UP..
                     return this.onScrollUp();
                 }
             } else {
                 statusDropDown.showDropDown();
             }
         }
     }

     R.tabLock = {
         closeTabDecider: closeTabDecider,
         textAreaHandler: textAreaHandler,
         mouseEventHandler: mouseEventHandler,
         keyEventHandler: keyEventHandler,
         refetchRoutine: refetchRoutine,
         statusDropDown: statusDropDown,
         statusHandler: statusHandler,
         sendMessage: sendMessage,
         commonUtils: commonUtils,
         tabInfoObj: tabInfoObj
     };

     util.subscribe('/tabLock/closeUI/decider/', closeTabDecider, closeTabDecider.decider);
     util.subscribe('/tabLock/closeUI/hideUI/', closeTabDecider, closeTabDecider.hideUI);
     util.subscribe('module/controller/onload', closeTabDecider, closeTabDecider.setListeners);

 })(window, util);