var ipc = require('remote').require('ipc')
 ipc.on('msg-to-V2', function(){
 	console.log('MEssage received in CHAT  :',arguments)
 });