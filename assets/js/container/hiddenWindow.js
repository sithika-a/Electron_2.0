    console.log('hidden backGroundWindow ...');
    var winList = ['CHAT', 'Timer', 'SB', 'V2'];
    var currentSkillSet = 'onlyChat';



    // var skillSet = {
    //     'onlyChat': {
    //         Mediator: {
    //             name: 'Mediator',
    //             channel: namespace.Mediator,
    //             eventsList: ['AFK','AppQuit'],
    //             events: {
    //                 AFK: {
    //                     name: 'AwayFromKeyBoard'
    //                 },
    //                 AppQuit: {
    //                     name: 'appQuit'
    //                 }
    //             }
    //         },
    //         CHAT: {
    //             name: 'Chat',
    //             channel: namespace.CHAT,
    //             eventsList: ['capturelogs'],
    //             events: {
    //                 capturelogs: {
    //                     name: 'capturelogs',
    //                     uniquedId: null
    //                 }
    //             }
    //         }

    //     },
    //     'FUllSkill': {
    //         CHAT: {
    //             name: 'Chat',
    //             channel: namespace.CHAT,
    //             eventsList: ['capturelogs'],
    //             events: {
    //                 capturelogs: {
    //                     name: 'capturelogs',
    //                     uniquedId: null
    //                 }
    //             }
    //         },
    //         V2: {
    //             name: 'V2',
    //             channel: namespace.V2,
    //             eventsList: ['pushStatus'],
    //             events: {
    //                 pushStatus: {
    //                     name: 'pushStatus'
    //                 }
    //             }
    //         },
    //         Mediator: {
    //             name: 'Mediator',
    //             channel: namespace.Mediator,
    //             eventsList: ['AFK'],
    //             events: {
    //                 AFK: {
    //                     name: 'AwayFromKeyBoard'
    //                 }
    //             }
    //         },
    //         SB: {
    //             name: 'SwitchBoard',
    //             channel: namespace.SB,
    //             eventsList: ['StatusChange'],
    //             events: {
    //                 StatusChange: {
    //                     name: 'StatusChange',
    //                     type: 'manual', // or Auto
    //                     status: 'Avaialble'
    //                 }
    //             }
    //         }

    //     },
    //     Timer: {
    //         name: 'Timer',
    //         channel: namespace.Timer,
    //         eventsList: ['StatusChange'],
    //         events: {
    //             StatusChange: {
    //                 name: 'StatusChange',
    //                 type: 'manual', // or Auto
    //                 status: 'Avaialble'
    //             }
    //         }
    //     }

    // }

    // function getSkillInfo() {
    //     return {ReceiverInfo : skillSet[currentSkillSet]};
    // }


    var namespace = {
        SB: 'msg-to-FULL', // SB container
        CHAT: 'msg-to-Chat', // AnyWhereWorks container
        V2: 'msg-to-V2', // v2 container
        Mediator: 'msg-to-Mediator', // hidden Renderer
        Main: 'msg-to-Main' // BackGround
    };



var messageHandler = {
    handler : function(){
        
    }
}
    var clientListenerHandler = {
        handler: function(msg) {
            switch (msg.opt) {
                case 'setv2status':
                    {
                        // send the status to V2
                        util.publish('/util/v2/statusPush', {
                            status: msg[msg.opt].status
                        });
                        break;
                    }
                case "loadwebsite":
                    {
                        if (msg[msg.opt].isBrowserLoad) {
                            // load in browser and get back
                            util.loadWebSiteInBrowser(msg[msg.opt].url);
                        } else if (msg[msg.opt].isFullwork) {
                            // load in our client
                            util.publish('/tab/controller/load/fullwork', msg[msg.opt].url);
                        } else {
                            util.loadWebSiteInNewWindow(msg[msg.opt].url);
                        }
                        break;
                    }
                default:
                    {
                        break;
                    }
            }
        }
    }
    var actionList = ['loadWebsite']

    var hiddenWindow = {
        listener: function(event) {
            console.log('Message received as ', event);
            switch (event.data.destination) {
                case namespace.CHAT:
                    {
                        console.log('sending to chat.. ');
                        FULLClient.emitter.sendToChat(event.data.message);
                        break;
                    }
                case namespace.V2:
                    {
                        FULLClient.emitter.sendToV2(event.data.message);
                        break;
                    }
                case namespace.SB:
                    {
                        FULLClient.emitter.sendToSB(event.data.message);
                        break;
                    }
                case namespace.Main:
                    {
                        console.log('to main ',FULLClient.emitter.sendToMain,':',event.data.message)
                        FULLClient.emitter.sendToMain(event.data.message);
                        break;
                    }
                     case namespace.Mediator:
                    {
                        console.log('to HiddenWindow:',event.data.message)
                        FULLClient.emitter.sendToMain(event.data.message);
                        break;
                    }
                    // case "getReceiverInfo" :{
                    //     if (winList.indexOf(event.data.sender) != -1) {
                    //         console.log('sender is available',getSkillInfo());
                    //         this.send(event.data.sender, getSkillInfo())

                    //     }
                    //     break;
                    // }
                default:
                    {
                        console.log('default captured ==== ')
                    }
            }

        }
    }
    var count = 0;
    // Listeners

    function publish() {
        for (var i = 0; i < 1000; i++) {
            FULLClient.emitter.broadCast('window3', {
                TEST: 'HEY',
                source: 'win6',
                destination: 'win3'
            });
            FULLClient.emitter.broadCast('window4', {
                TEST: 'HEY',
                source: 'win6',
                destination: 'win4'
            });
            FULLClient.emitter.broadCast('window5', {
                TEST: 'HEY',
                source: 'win6',
                destination: 'win5'
            });
            FULLClient.emitter.broadCast('window6', {
                TEST: 'HEY',
                source: 'win6',
                destination: 'win6'
            });

            // FULLClient.emitter.broadCast('msg-to-Chat', {
            //     TEST: 'HEY',
            //     source: 'win6',
            //     destination: 'win6'
            // })
        }
    }
    FULLClient.emitter.subscribe('msg-to-Mediator', function(event) {
      console.log('ACK : ',event.data.message)
        hiddenWindow.listener(event);
    });


