  
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
                    console.log('sending to SB..'+message);
                      
                      FULLClient.emitter.sendToSB(message);
                      //util.publish(`/sendMessage/to/sb`,message);
                     //sendMessage.toSB(message);
                      break;
                  }
              case namespace.channel.Main:
                  {
                      console.log('sending to main.. ',message);
                      // console.log(`Bypassing message to main FULLClient.emitter.sendToMain : ${message}`)
                      FULLClient.emitter.sendToMain(message);
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
      // tag (strings, ...values){
      //   foreach ()

      // },
      decider(event) {
          let msg = event.data;
          console.debug(`ACK : Actual Message : ${msg.info} : src : ${JSON.stringify(msg.metaData.src)} : dest : src : ${JSON.stringify(msg.metaData.dest)}`);
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
  // FULLClient.emitter.subscribe(namespace.channel.SB, event => {
  //   console.log('messageHandler : ')
  //     messageHandler.decider(event);
  // });