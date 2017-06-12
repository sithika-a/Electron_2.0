  let ChannelMap;
  let messageHandler = {
      init() {
          util.publish(`/notification/create/checkNotificationDependency`)
      },
      byPass(message) {

          //  ChannelMap = {
          //     [namespace.channel.CHAT](message) {
          //                         console.log('to CHAT window ...')

          //         FULLClient.emitter.sendToChat(message);
          //     },
          //     [namespace.channel.V2](message) {
          //                         console.log('to V2 window ...')

          //         FULLClient.emitter.sendToV2(message);
          //     },
          //     [namespace.channel.SB](message) {
          //                         console.log('to SB window ...')

          //         FULLClient.emitter.sendToSB(message);
          //     },
          //     [namespace.channel.Main](message) {
          //                         console.log('to main window ...')

          //         FULLClient.emitter.sendToMain(message);
          //     },
          //     [namespace.channel.Mediator](message) {
          //         console.log('to hidden window ...')
          //             // FULLClient.emitter.sendToMediator(message);
          //     }
          // }
          // window["ChannelMap"] =ChannelMap;

          // for (let [key, value] of ChannelMap) {
          //     console.log(`for of value : ${value}`);
          //     if (key == message.metaData.dest.channel) {
          //         console.log(`match ;;;`)
          //         value();
          //     }
          // }
          switch (message.metaData.dest.channel) {
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
                      console.log('sending to main.. ');
                      // console.log(`Bypassing message to main FULLClient.emitter.sendToMain : ${message}`)
                      FULLClient.emitter.sendToMain(message);
                      break;
                  }
              case namespace.channel.Mediator:
                  {

                      console.log('to HiddenWindow:')
                      break;
                  }
              default:
                  {
                      console.log('default captured ==== ')
                  }
          }
      },
      choiceMap: {
          notify(infoObj) {
            util.publish(`/notification/create/show`,infoObj)
          }
      },
      getMatch (msg){
          return (msg && msg.info && msg.info.opt) ? this.choiceMap[msg.info.opt] : false;
      },
      toSelf(msg) {
          console.log(`Message received for hidden window : `,msg);
          var choice = this.getMatch(msg);
          console.log('choice : ',choice , 'msg.info : ',msg.info)
      return choice ? choice(msg) : false
      },
      decider(event) {
          let msg = event.data;
          console.log('ACK : ', msg);
          if (msg.metaData.dest.channel == namespace.channel.Mediator) {
              console.log('Message to Mediator : ');

              this.toSelf(msg);
          } else {
              console.log('Message to others : ');

              this.byPass(msg)
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
  messageHandler.init();

  FULLClient.emitter.subscribe(namespace.channel.Mediator, event => {
      console.log('ACK : ', event)
      messageHandler.decider(event);
  });