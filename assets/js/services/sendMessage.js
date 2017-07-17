((R, util) => {
    let sendMessage = {
        contructMessage(actualMessage, channel) {
            console.log('actualMessage : ', actualMessage)
            var WindowMessaging = require(path.join(process.cwd(), `assets/comm/proto/message-proto.js`))
            var msg = new WindowMessaging();
            msg.info = actualMessage;
            msg.metaData.src.moduleName = actualMessage.moduleName || actualMessage.name || null;
            msg.metaData.dest.channel = channel;
            console.log('contructMessage  : ', msg)

            return msg;
        },
        isValidMsg(message) {
            return (message && typeof message == 'object') ? true : false;
        },
        toMediator(message) {
            if (this.isValidMsg(message)) FULLClient.emitter.sendToMediator(this.contructMessage(message, namespace.channel.Mediator));
        },
        toMain(message) {
            console.log('isValidMsg in  send to main ...', FULLClient.emitter.sendToMediator)
            if (this.isValidMsg(message)) FULLClient.emitter.sendToMediator(this.contructMessage(message, namespace.channel.Main));
        },
        toSB(message) {
            if (this.isValidMsg(message)) FULLClient.emitter.sendToMediator(this.contructMessage(message, namespace.channel.SB));
        },
        toChat(message) {
            console.log('what is emitter obj ? ', FULLClient.emitter)

            if (this.isValidMsg(message)) {
                console.log('isValidMsg in  send to chat ...', FULLClient.emitter.sendToMediator)

                FULLClient.emitter.sendToMediator.call(FULLClient.emitter, this.contructMessage(message, namespace.channel.CHAT));
            }
        },
        toV2(message) {
            if (this.isValidMsg(message)) FULLClient.emitter.sendToMediator(this.contructMessage(message, namespace.channel.V2));
        },
        toWebview(message) {
            FULLClient.emitter.toWebview(message);
        }
    }
    util.subscribe(`/sendMessage/to/mediator`, sendMessage, sendMessage.toMediator);
    util.subscribe(`/sendMessage/to/main`, sendMessage, sendMessage.toMain);
    util.subscribe(`/sendMessage/to/sb`, sendMessage, sendMessage.toSB);
    util.subscribe(`/sendMessage/to/chat`, sendMessage, sendMessage.toChat);
    util.subscribe(`/sendMessage/to/v2`, sendMessage, sendMessage.toV2);
    util.subscribe(`/sendMessage/to/timer`, sendMessage, sendMessage.toTimer);
    util.subscribe(`/sendMessage/to/webview`, sendMessage, sendMessage.toWebview);
})(window, util);