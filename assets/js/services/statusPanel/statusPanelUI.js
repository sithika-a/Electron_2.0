/**
 *
 * status panel UI module
 *
 **/


(function(root, $, util, undefined) {

    // changes for status preference icon
    // $('header.main-header figure,.clockin-details').on('click', function(event) {
    //     util.preventEvent(event);
    //     var target = $('#userpicture_image_holder');
    //     target.hasClass('open') ? target.removeClass('open') : target.addClass('open').siblings().removeClass('open');
    //     // Right side preference icon.
    //     if ($('.option-list #preferences').hasClass('open'))
    //         $('.option-list #preferences').removeClass('open')
    // });

    var statusUI = {
        options: $('#status_change'),
        colorCode: $('#status_notify_color'),
        statusText: $('#status_notify_text'),
        tickMarkHTML: '<i id="tick_icon" class="fa fa-check"></i>',
        isModuleLoadable: function() {
            return userDAO.getSkillByName('FullWork') || userDAO.getSkillByName('CEA') ? false : true;
        },
        setColorCode: function(lColor) {
            this.colorCode.removeClass().addClass(lColor);
        },
        setTickMark: function(statusName) {
            // ex : statusName : 'Available'
            if (statusName) {
                var dom = this.options.children('#' + statusName); // ex : document.querySelector('#Available')
                dom.html(this.tickMarkHTML + dom.text()); // adding "Tick" html code and Previous text to target element.
            }
        },
        unsetTickMark: function() {
            this.options
                .find('#tick_icon')
                .remove();
        },
        setStatusText: function(lStatus) {
            // if (lStatus) {
            //     this.statusText
            //         .text(lStatus)
            // };
        },
        hideUIPanel: function() {

            this.options
                .parent()
                .hide();

            this.statusText
                .parent()
                .hide();
        },
        setUserImage: function() {
            var photo = userDAO.getUser() && util.isUrl(userDAO.getUser().photoID) ? userDAO.getUser().photoID : 'http://images.sb.a-cti.com/TC/node-webkit/common-images/user-ic.png';
            document.querySelector('#userpicture_image').src = photo;
        },
        showUIPanel: function() {
            if (this.isModuleLoadable()) {
                // this.options
                //     .parent()
                //     .show();

                // this.statusText
                //     .parent()
                //     .show();

                // this.setUserImage();
            }
        },
        showViewProfile: function() {
            this.options
                .find('i.fa-user') // "view profile" html element.
                .parent()
                .siblings() // list of <li> with available, status options
                .hide();

            this.statusText // "Hide the routing system status"
                .hide();

            this.options // we are adding clockoutUI class to remove divider.
                .addClass('clockoutUl'); // add clockoutUI class to hide divider.
        },
        showAllOptions: function() {
            this.options
                .find('i.fa-user') // "view profile" html element.
                .parent()
                .siblings()
                .show();

            this.statusText // "Show the routing system status"
                .show();

            this.options // we are adding clockoutUI class in showViewProfile function to remove divider.
                .removeClass('clockoutUl'); // removing clockoutUi class while showing Alloptions.         


            this.hideClockOutOption(); // "Clock out" option is currently hidden.
        },
        hideViewProfile: function() {
            this.options
                .find('i.fa-user') // "view profile" html element.
                .parent() // li element.
                .hide();
        },
        optionsClicked: function(statusEvent) {
            var stat = statusEvent.target.id || $(statusEvent.target).text();
            if (stat) {
                console.debug('************* Pushing Status from App ************* ' + stat);
                switch (stat) {
                    case 'View Profile':
                        {
                            // TODO : event based mechanism
                            // async operation, but change it pub and stub pattern.
                            // amplify.
                            // _event_manager.fire('#chat_container', 'chat_profile_click', {});
                            break;
                        }
                    case 'View Timesheets':
                        {
                            // TODO : event based mechanism
                            // async operation
                            util.loadURL(FULLClient.getConfig().goclock);
                            break;
                        }
                    default:
                        {
                            statusPanelUIController.setManualStatus(stat);
                            break;
                        }
                }
            }
        },
        hideClockOutOption: function() {
            /* 
                FROM HTML this has to removed
             */

            $('.fa-sign-out')
                .parent() // clock out parent li dom.
                .hide() // clock out option is hidden.
                .siblings('.divider:last') // Getting the last divider element
                .hide(); // hidding


        },
        decider: function(status) {
            if (status) {
                /* Setting the text in the top right corner !!! */
                this.setStatusText(status);
                this.unsetTickMark();
                switch (status) {
                    case "Available":
                        {
                            this.setColorCode('online');
                            this.setTickMark(status);
                            break;
                        }
                    case "Break":
                        {
                            this.setColorCode('away');
                            this.setTickMark(status);
                            break;
                        }
                    case "Personal":
                        {
                            this.setColorCode('away');
                            this.setTickMark(status);
                            break;
                        }
                    case "Meeting":
                        {
                            this.setColorCode('dnd');
                            this.setTickMark(status);
                            break;
                        }
                    case "Project":
                        {
                            this.setColorCode('away');
                            this.setTickMark(status);
                            break;
                        }
                    case "Lunch":
                        {
                            this.setColorCode('offline');
                            this.setTickMark(status);
                            break;
                        }
                    case "Busy":
                        {
                            this.setColorCode('dnd');
                            break;
                        }
                    case "Offline":
                        {
                            this.setColorCode('offline');
                            break;
                        }
                    case "PendingBusy":
                        {
                            this.setColorCode('dnd');
                            break;
                        }
                    case "Chat":
                        {
                            this.setColorCode('away');
                            break;
                        }
                    case "Repeat":
                        {
                            this.setColorCode('away');
                            break;
                        }
                    case "ActiveResponse":
                        {
                            this.setColorCode('away');
                            break;
                        }
                    case "AfterCallWork":
                        {
                            this.setColorCode('away');
                            break;
                        }
                    case "FailedConnectAgent":
                        {
                            this.setColorCode('dnd');
                            break;
                        }
                    default:
                        {
                            this.setColorCode('away');
                            break;
                        }
                }
            }
        }
    };

    statusUI.options.on('click', statusUI.optionsClicked);
    /* 
        By Default, we will hide the "Clock Out" option 
        from drop downs.
     */
    statusUI.hideClockOutOption();

    var statusPanelUIController = {
        /* Only Status should pass to controller all other events has to pass to chat app directly */
        msgListener: function(msg) {
            // statusUIcontroller msg event
            // console.debug('Status Panel REcieved this message ', msg);
            if (msg && msg.name == 'StatusUIController') {
                var StatusUImsg = msg.UImsg;
                if (StatusUImsg && StatusUImsg.name == 'StatusUIMessenger' && StatusUImsg.opt) {
                    switch (StatusUImsg.opt) {
                        case "clockedIn":
                            {
                                // show all the statuses
                                statusUI.showAllOptions();
                                break;
                            }
                        case "clockedOut":
                            {
                                // hide all the statuses
                                statusUI.showViewProfile();
                                break;
                            }
                        case "show":
                            {
                                // show the panel
                                statusUI.showUIPanel();
                                break;
                            }
                        case "hide":
                            {
                                // hide the panel
                                statusUI.hideUIPanel();
                                break;
                            }
                        case "status":
                            {
                                /* Set status information in UI */
                                statusUI.decider(StatusUImsg['status'].value);
                                break;
                            }
                        default:
                            {
                                break;
                            }
                    }
                }
            }
        },
        setManualStatus: function(lStatus, originalEvent) {
            if (lStatus || originalEvent) {
                var msg = new StatusUIMessenger()
                msg.setStatus(lStatus || originalEvent.statusPush, 'manual');
                msg.setOriginalEvent(originalEvent);
                this.toStatusController(msg);
            }
        },
        setAutoStatus: function(lStatus, originalEvent) {
            if (lStatus || originalEvent) {
                var msg = new StatusUIMessenger()
                msg.setStatus(lStatus || originalEvent.statusPush, 'auto');
                msg.setOriginalEvent(originalEvent); //added
                this.toStatusController(msg);
                /**
                *
                * TODO in electron
                * Send the status to All WebLoadedTabs

                    ChromeAppApi will collect the status and set it in
                    its globally accessible object. chromeAppApi.getV2Status() 
                    and chromeAppApi._setV2Status(<status>)

                    Check FULLClientApi == chromeAppApi both are same name.
            
                    TabController to should recieve this message and postMessage to All Iframes/webview.
                *
                **/
                var pushToTabs = new ClientListener('setv2status');
                pushToTabs.name = 'setV2status';
                pushToTabs[pushToTabs.opt].status = lStatus; // 
                util.publish('/tab/controller/status/to/tabs', pushToTabs);
            }
        },
        toStatusController: function(lStatusUIMessengerObj) {
            if (lStatusUIMessengerObj) {
                var toStatusController = new StatusController(lStatusUIMessengerObj);
                /**
                 *
                 * UI is someother window
                 *
                 **/
                // if (window.opener)
                //     window.opener.postMessage(toStatusController, '*');
                // else
                util.publish('/status/controller/recieved/postMessage', toStatusController);

                return true;
            }
        }
    }

    /* controller sends what status to update in UI */
    util.subscribe('/status/UIController/sync', statusPanelUIController, statusPanelUIController.msgListener);
    /* When user changes the status, "manually" , we pass the info to controller. */
    util.subscribe('/status/UIController/manual/status/change', statusPanelUIController, statusPanelUIController.setManualStatus);
    /* Routing system or v2 intenally uses this command to sync the status, which "automatic" */
    util.subscribe('/status/UIController/auto/status/change', statusPanelUIController, statusPanelUIController.setAutoStatus);
    /* Only for live mode */
    util.subscribe('/status/UIController/hide/option/viewprofile', statusUI, statusUI.hideViewProfile);

    root['statusPanelUIController'] = statusPanelUIController;
    root['statusUI'] = statusUI;

}(this, jQuery, util))