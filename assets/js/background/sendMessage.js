// (function(R) {
//     R["FULLClient"] = {
//         require,
//         emitter: {
//             broadCast: messenger.broadCast,
//             subscribe: messenger.subscribe,
//             unSubscribe: messenger.unSubscribe,
//             unSubscribeAll: messenger.unSubscribeAll,
//             isValid(message) {
//                 if (message && typeof message == `object` && message.metaData && message.metaData.dest && message.metaData.dest.channel)
//                     return message;
//             },
//             sendToMediator(message) {
//                 // var msgObj = this.wrap_msg(destination, message);
//                 console.log(`wrapper of message : `,message);
//                 if (this.isValid(message)) {
//                     console.log('It is a valid message ...')
//                     messenger.sendToMediator(message);
//                 } else {
//                     console.log('invalid valid message ...')

//                 }
//             },
//             sendToMain(message) {
//                 this.sendToMediator(message);
//             },
//             sendToV2(message) {
//                 this.sendToMediator(message, messenger.channel.V2);
//             },
//             sendToChat(message) {
//                 this.sendToMediator(message, messenger.channel.CHAT);
//             },
//             sendToSB(message) {
//                 this.sendToMediator(message, messenger.channel.SB);
//             }
//         }
//     }

// })(window);


module.exports = (messenger) => {
    return {
        contructMessage(actualMessage, channel) {
            var WindowMessaging = require(`assets/comm/proto/message-proto.js`);
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
            if (this.isValidMsg(message)) messenger.sendToMediator(this.contructMessage(message, namespace.channel.SB));
        },
        toSB(message) {
            if (this.isValidMsg(message)) messenger.sendToSB(this.contructMessage(message, namespace.channel.SB));
        },
        toChat(message) {
            if (this.isValidMsg(message)) messenger.sendToChat(this.contructMessage(message));
        },
        toV2(message) {
            if (this.isValidMsg(message)) messenger.sendToV2(this.contructMessage(message));
        }
    }
}