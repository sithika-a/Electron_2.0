((R)=>{
  let contructMessage = (actualMessage, channel) => {
     console.log('actualMessage : ', actualMessage)
            var WindowMessaging = require(path.join(process.cwd(), `assets/js/comm/proto/message-proto.js`))
            var msg = new WindowMessaging();
            msg.info = actualMessage;
            msg.metaData.src.moduleName = actualMessage.moduleName || actualMessage.name;
            msg.metaData.dest.channel = channel;
            console.log('contructMessage  : ', msg)
            return msg;
   }
    let isValid = message => (message && typeof message == 'object') ? true : false;
    let sendMessage = {
           toMediator(message) {
            if (isValid(message)) emitter.sendToMediator(contructMessage(message, namespace.channel.Mediator));
        },
        toMain(message) {
            console.log('isValid in  send to main ...', emitter.sendToMediator)
            if (isValid(message)) emitter.sendToMediator(contructMessage(message, namespace.channel.Main));
        },
        toSB(message) {
            console.log('Sending to SB ',message);
            if (isValid(message)){
             console.log('Received in SB');
             emitter.sendToMediator(contructMessage(message, namespace.channel.SB));
         }
        },
        toChat(message) {
            console.log('what is emitter obj ? ', emitter)

            if (isValid(message)) {
                console.log('isValid in  send to chat ...', emitter.sendToMediator)

                emitter.sendToMediator(contructMessage(message, namespace.channel.CHAT));
            }
        },
        toV2(message) {
            if (isValid(message)){
                console.log("In send message to v2 :",message);
             emitter.sendToMediator(contructMessage(message, namespace.channel.V2));
         }
        },
        toWebview(message) {
            emitter.toWebview(message);
        }
    }
    let commPhrase = `/sendMessage/to/`
    // module.exports = sendMessage;
    util.subscribe(`${commPhrase}mediator`, sendMessage, sendMessage.toMediator);
    util.subscribe(`${commPhrase}main`, sendMessage, sendMessage.toMain);
    util.subscribe(`${commPhrase}sb`, sendMessage, sendMessage.toSB);
    util.subscribe(`${commPhrase}chat`, sendMessage, sendMessage.toChat);
    util.subscribe(`${commPhrase}v2`, sendMessage, sendMessage.toV2);
    util.subscribe(`${commPhrase}timer`, sendMessage, sendMessage.toTimer);
    util.subscribe(`${commPhrase}webview`, sendMessage, sendMessage.toWebview);

  })(window,util);
