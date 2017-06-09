    var messageHandler = {
        byPass(destinationChannel) {
            switch (destinationChannel) {
                case namespace.channel.CHAT:
                    {
                        console.log('sending to chat.. ');
                        FULLClient.emitter.sendToChat(message);
                        break;
                    }
                case namespace.channel.V2:
                    {
                        FULLClient.emitter.sendToV2(message);
                        break;
                    }
                case namespace.channel.SB:
                    {
                        FULLClient.emitter.sendToSB(message);
                        break;
                    }
                case namespace.channel.Main:
                    {
                        console.log(`Bypassing message to main`, FULLClient.emitter.sendToMain, ':', message)
                        FULLClient.emitter.sendToMain(message);
                        break;
                    }
                case namespace.channel.Mediator:
                    {
                        console.log('to HiddenWindow:', message)
                        break;
                    }
                default:
                    {
                        console.log('default captured ==== ')
                    }
            }
        },
        toSelf(msg) {
            console.log(`Message received for hidden window : ${msg}`);
        },
        reStructure: function() {

        },
        decider(event) {
            let msg = event.data;
            console.log('ACK : ', msg);
            if (msg.metaData.dest.channel == namespace.channel.Mediator) {
                this.toSelf(msg);
            } else {
                this.byPass(msg.metaData.dest.channel)
            }
        },
        listener(message) {
            console.log('Message received as ', message.info);
            switch (message.metaData.dest.channel) {
                case namespace.channel.CHAT:
                    {
                        console.log(`sending to chat.. `);
                        FULLClient.emitter.sendToChat(message);
                        break;
                    }
                case namespace.channel.V2:
                    {
                        FULLClient.emitter.sendToV2(message);
                        break;
                    }
                case namespace.channel.SB:
                    {
                        FULLClient.emitter.sendToSB(message);
                        break;
                    }
                case namespace.channel.Main:
                    {
                        console.log('to main ', FULLClient.emitter.sendToMain, ':', message)
                        FULLClient.emitter.sendToMain(message);
                        break;
                    }
                case namespace.channel.Mediator:
                    {
                        console.log('to HiddenWindow:', message)
                        break;
                    }
                default:
                    {
                        console.log('default captured ==== ')
                    }
            }

        }
    }

    FULLClient.emitter.subscribe(namespace.channel.Mediator, event => {
        console.log('ACK : ', event)
        messageHandler.decider(event);
    });