  

  let messageHandler = {
      byPass(message) {
        console.warn('dest channel : ',message.metaData.dest.channel)
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
                      console.log('sending to main.. ',message.info);
                      // console.log(`Bypassing message to main FULLClient.emitter.sendToMain : ${message}`)
                      FULLClient.emitter.sendToMain(message.info);
                      break;
                  }
              default:
                  {
                      console.log('default captured ==== ')
                  }
          }
      },
      choiceMap: {
          // notify(infoObj) {
          //   util.publish(`/notification/create/show`,infoObj)
          // }
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
              console.log('Message to others : ',msg);

              this.byPass(msg)
          }
      }
  }

  FULLClient.emitter.subscribe(namespace.channel.Mediator, event => {
    console.log('messageHandler : ')
      messageHandler.decider(event);
  });