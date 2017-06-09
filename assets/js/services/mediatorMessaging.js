// function MediatorCommunication(option){
//     this.name = 'MediatorCommunication',
//     this.action =  option;
//     this.userInfo = {
//         name : 'userInfo'
//     }

// }
    var messageHandler = {
        byPass(){

        },
        self(){

        },
        reStructure : function(){

        },
        decider(event){
            var msg = event.data;
            if(msg.metaData.dest.channel == namespace.channel.Mediator){
                this.self();
            }else {
                this.byPass(msg)
            }
        },
        listener(event) {
            console.log('Message received as ', event);
            switch (event.data.destination) {
                case namespace.channel.CHAT:
                    {
                        console.log('sending to chat.. ');
                        FULLClient.emitter.sendToChat(event.data.message);
                        break;
                    }
                case namespace.channel.V2:
                    {
                        FULLClient.emitter.sendToV2(event.data.message);
                        break;
                    }
                case namespace.channel.SB:
                    {
                        FULLClient.emitter.sendToSB(event.data.message);
                        break;
                    }
                case namespace.channel.Main:
                    {
                        console.log('to main ',FULLClient.emitter.sendToMain,':',event.data.message)
                        FULLClient.emitter.sendToMain(event.data.message);
                        break;
                    }
                     case namespace.channel.Mediator:
                    {
                        console.log('to HiddenWindow:',event.data.message)
                        // FULLClient.emitter.sendToMediator(event.data.message);
                        break;
                    }
                default:
                    {
                        console.log('default captured ==== ')
                    }
            }

        }
    }
   
    FULLClient.emitter.subscribe(namespace.channel.Mediator, function(event) {
      console.log('ACK : ',event.data.message)
        messageHandler.listener(event);
    });
