let sendMessage = require('../../services/sendMessage.js')


((R, util, FULLClient) => {
    let clientlistener = {
        name : `clientListener`,
        getv2status() {
            let toChat = new Thinclient('v2Status');
            toChat[toChat.opt].status = util.v2.getV2LastReceivedStatus();
            util.publish(`/chat/postToWebview`, toChat);
        },
        handler(msg) {
            console.log('handler :', msg)
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
                        util.publish(`/chat/postToWebview`, util.clipboard.read());
                        break;
                    }
                case "getv2status":
                    {
                        // when chat frame requesting for status
                        // of v2, we will get it from localstorage
                        // and send chatcontainer -> chatframe
                        this.getv2status();

                        break;
                    }
                case 'showsbcontainer':
                    {
                        util.publish('/util/window/events/show', namespace.channel.CONTAINER_SB);
                        break;
                    }
                case 'toGuestPage':
                    {
                        util.publish(`/chat/postToWebview`, msg);
                        break;
                    }
                case 'setv2status':
                    {
                        //Forwarding status to SB container...
                        sendMessage.toSB(msg)
                        break;
                    }
                case 'feedback':
                    {
                        let feedbackSend = new Application('collectfeedback');
                        console.log('Feedback text:', msg[msg.opt].text);
                        feedbackSend[feedbackSend.opt].userFeedback = msg[msg.opt].text;
                        feedbackSend[feedbackSend.opt].isFromChatModule = true;
                        feedbackSend[feedbackSend.opt].token = msg[msg.opt].token
                                                sendMessage.toSB(feedbackSend)
                        break;
                    }
                case 'notify':
                    {
                        console.log(`Notify : client :`);
                        R["noti"] = msg;
                        // route this msg to Notification API.
                        util.publish('/notification/create/show', msg);
                        break;
                    }
                case "clearCache":
                    {
                        console.log("ClearCache: user doing sign-out in chat window.");
                        sendMessage.toSB({
                            name: "analytics",
                            accountNumber: null,
                            eventAction: analytics.APP_CLEAR_CACHE,
                            connId: FULLClient.getMode() + " " + FULLClient.getManifest().version + " " + process.platform,
                            metaInfo: "Clearing Cache for App from chatwindow"
                        })
                        util.clear();
                        break;
                    }
                case 'show':
                    {
                        util.subscribe('/util/window/events/show', namespace.channel.CONTAINER_CHAT);
                        break;
                    }
                case 'hide':
                    {
                        util.subscribe('/util/window/events/hide', namespace.channel.CONTAINER_CHAT);
                        break;
                    }
                case "restart":
                    {
                        util.publish('/chat/reloadChat');
                        break;
                    }
                case 'quit':
                    {
                        /* Request from chat application to quit FC App*/
                        let commObj = {
                            name: 'appQuit',
                            sender: namespace.channel.CONTAINER_CHAT
                        };
                        sendMessage.toSB(commObj)
                        break;
                    }
                case 'getstate':
                    {
                        util.publish(`/chat/getState`);
                        break;
                    }
                case "download":
                    {
                        util.publish(`/file/download/Start/`, msg[msg.opt]);
                        break;
                    }
                    // case 'badgelabel':
                case 'count':
                    {
                        // util.publish(`chat/setBadge`, msg[msg.opt].count);
                        break;
                    }
                case 'requestattention': //needed for showing counts on new messsage arrived
                    {
                        util.publish(`chat/bounce`, msg[msg.opt].isContinuous);
                        break;
                    }
                case 'enableOnTop':
                    {
                        util.subscribe('/util/window/events/enableOnTop', namespace.channel.CONTAINER_CHAT);
                        break;
                    }
                case 'restore':
                    {
                        util.subscribe('/util/window/events/restore', namespace.channel.CONTAINER_CHAT);

                        break;
                    }
                case 'maximize':
                    {
                        util.subscribe('/util/window/events/maximize', namespace.channel.CONTAINER_CHAT);
                        break;
                    }
                case 'disableOnTop':
                    {
                        util.subscribe('/util/window/events/disableOnTop', namespace.channel.CONTAINER_CHAT);
                        break;
                    }
                case 'loadwebsite':
                    {
                        // send to Mediator - hidden window
                        sendMessage.toMediator(msg)
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
    util.subscribe('/clientlistener/handler/', clientlistener, clientlistener.handler)

})(this, util, FULLClient)