((R, util, FULLClient) => {
	 let clientlistener = {
        handler (msg) {
            console.log('handler :',msg)
            let val = msg.opt.trim();
            switch (val) {
                case 'accessToken':
                    {
                        console.log('Setting Access Token ', msg[msg.opt].token);
                        userDAO.setAccessToken(msg[msg.opt].token)
                        break;
                    }
                case "showUpdatePopup":
                    {
                        util.publish('updateUI/guestPage/msgHandler', msg[msg.opt])
                        break;
                    }
                case "readFromClipboard":
                    {
                        util.publish(`chatUtils/postToWebview`,util.clipboard.read());
                        break;
                    }
                case "getv2status":
                    {
                        // when chat frame requesting for status
                        // of v2, we will get it from localstorage
                        // and send chatcontainer -> chatframe
                        let toChat = new Thinclient('v2Status');
                        toChat[toChat.opt].status = util.v2.getV2LastReceivedStatus();
                        util.publish(`chatUtils/postToWebview`,toChat);

                        break;
                    }
                case 'showsbcontainer':
                    {
                        util.publish('/util/window/events/show', namespace.channel.CONTAINER_SB);
                        break;
                    }
                case 'toGuestPage':
                    {
                        util.publish(`chatUtils/postToWebview`,msg);
                        break;
                    }
                case 'setv2status':
                    {
                        //Forwarding status to SB container...
                        FULLClient.emitter.sendToSB(msg);
                        break;
                    }
                case 'feedback':
                    {
                        let feedbackSend = new Application('collectfeedback');
                        console.log('Feedback text:', msg[msg.opt].text);
                        feedbackSend[feedbackSend.opt].userFeedback = msg[msg.opt].text;
                        feedbackSend[feedbackSend.opt].isFromChatModule = true;
                        feedbackSend[feedbackSend.opt].token = msg[msg.opt].token
                        FULLClient.emitter.sendToSB(feedbackSend);
                        break;
                    }
                case 'notify':
                    {
                        console.log(`Notify : client :`);
                        R["noti"] = msg;
                        // route this msg to Notification API.
                        util.publish(`/util/sendMessage/to/mediator`,msg)
                        // util.publish('/notification/create/show', msg);
                        break;
                    }
                case "clearCache":
                    {
                        console.log("ClearCache: user doing sign-out in chat window.");
                        FULLClient.emitter.sendToSB({
                            name: "analytics",
                            accountNumber: null,
                            eventAction: analytics.APP_CLEAR_CACHE,
                            connId: FULLClient.getMode() + " " + FULLClient.getManifest().version + " " + process.platform,
                            metaInfo: "Clearing Cache for App from chatwindow"
                        });
                        util.clear();
                        break;
                    }
                case 'show':
                    {
                        util.subscribe('/util/window/events/show',namespace.channel.CONTAINER_CHAT);
                        break;
                    }
                case 'hide':
                    {
                        util.subscribe('/util/window/events/hide',namespace.channel.CONTAINER_CHAT);
                        break;
                    }
                case "restart":
                    {
                        chat.reloadchat();
                        break;
                    }
                case 'quit':
                    {
                        /* Request from chat application to quit FC App*/
                        let commObj = {
                            name: 'appQuit',
                            sender: namespace.channel.CONTAINER_CHAT
                        };
                        FULLClient.emitter.sendToSB(commObj);
                        break;
                    }
                case 'getstate':
                    {
                        chat.send_state();
                        break;
                    }
                case "download":
                    {
                        util.publish('/file/download/Start/', msg[msg.opt]);
                        break;
                    }
                case 'badgelabel':
                case 'count':
                    {
                        util.publish(`chatUtils/setBadge`, msg[msg.opt].count);
                        break;
                    }
                case 'requestattention': //needed for showing counts on new messsage arrived
                    {
                         util.publish(`chatUtils/bounce`, msg[msg.opt].isContinuous);
                        break;
                    }
                case 'enableOnTop':
                    {
                        util.subscribe('/util/window/events/enableOnTop',namespace.channel.CONTAINER_CHAT);
                        break;
                    }
                case 'restore':
                    {
                        util.subscribe('/util/window/events/restore',namespace.channel.CONTAINER_CHAT);

                        break;
                    }
                case 'maximize':
                    {
                        util.subscribe('/util/window/events/maximize',namespace.channel.CONTAINER_CHAT);
                        break;
                    }
                case 'disableOnTop':
                    {
                        util.subscribe('/util/window/events/disableOnTop',namespace.channel.CONTAINER_CHAT);
                        break;
                    }
                case 'loadwebsite':
                    {
                        // send to sb
                        FULLClient.emitter.sendToMediator(msg);
                        break;
                    }
                default:
                    {
                        console.warn("Unknown routine in channel listener ", msg);
                        break;
                    }
            }
        }
    };
    util.subscribe('/clientlistener/handler/',clientlistener,clientlistener.handler)

})(this, util, FULLClient)