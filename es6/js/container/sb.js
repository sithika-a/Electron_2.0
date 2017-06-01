console.log('SB container...',messenger);

var ipc = require('ipc');
ipc.on('msg-to-SB',function(){
    console.log('ACK from main : ',arguments)
});


// var messenger = require('electron').remote.require('/Users/sithika/Documents/Learning/electron-workspace/electronComm/messenger.js');
// var SB = {
//     messageHandler: function(event) {
//         console.log('message received as : ', event.data);
//         if(event.data.message == 'handshake')
//         	this.handshake(event.data)
//     },
//     handshake: function(data) {
//         switch (data.source) {
//             case "CHAT":
//                 {
//                 	console.log('this is from CHAT')
//                     messenger.broadCast('msg-to-Chat', {
//                             target: 'CHAT',
//                             source: 'SB',
//                             message: 'ack'
//                         });
//                     }
//                 }
//         }
// }
// // Listeners
// var listenerCB = function() {
//     console.log('USER AWAY ', arguments);
//     var msg = new Services("pushToAnalytics")
//     msg[msg.opt].eventAction = "user-AWAY"
//     messenger.broadCast("pushToAnalytics", msg[msg.opt])
// }
// function on(){
// messenger.subscribe("afkUserAway", listenerCB);
// }
// function off(){
// messenger.unSubscribe("afkUserAway", listenerCB);
// }
// on();
// messenger.subscribe(namespace.SB, SB.messageHandler.bind(SB));
