  let messageHandler = {
      passInfo(message) {
          console.warn('dest channel : ', message.metaData.dest.channel)
          switch (message.metaData.dest.channel) {
              case namespace.channel.Mediator:
                  {
                      console.log('Message received for hidden window : ', msg);
                      this.getMatch(msg);
                      break;
                  }
              case namespace.channel.CHAT:
                  {
                      console.log('sending to chat.. ');
                      emitter.sendToChat(message);
                      break;
                  }
              case namespace.channel.V2:
                  {
                      emitter.sendToV2(message);
                      break;
                  }
              case namespace.channel.SB:
                  {
                      console.log('sending to SB..' + message);

                      emitter.sendToSB(message);
                      //util.publish(`/sendMessage/to/sb`,message);
                      //sendMessage.toSB(message);
                      break;
                  }
              case namespace.channel.Main:
                  {
                      console.log('sending to main.. ', message);
                      // console.log(`Pass message to main emitter.sendToMain : ${message}`)
                      emitter.sendToMain(message);
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
      getMatch(msg) {
          if ((msg && msg.info && msg.info.opt)) {
              return this.choiceMap[msg.info.opt]()
          }
      },
      decider(event) {
          let msg = event.data;
          console.debug(`ACK : Actual Message : ${JSON.stringify(msg.info)} : src : ${JSON.stringify(msg.metaData.src)} : dest : src : ${JSON.stringify(msg.metaData.dest)}`);
              console.log('Message to others : ', msg);
              this.passInfo(msg)
      }
  }

  emitter.subscribe(namespace.channel.Mediator, event => {
      console.log('messageHandler : ')
      messageHandler.decider(event);
  });
  // emitter.subscribe(namespace.channel.SB, event => {
  //   console.log('messageHandler : ')
  //     messageHandler.decider(event);
  // });