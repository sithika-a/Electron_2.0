const {app} = require(`electron`);

var messenger = require("../comm/messenger.js");
var WindowManager = require("../assets/js/services/WindowManager.js");



app.on(`ready`, () => {
     var hiddenWin = WindowManager.openHiddenContainer();
     hiddenWin.webContents.on('did-finish-load',()=>{
     	        var script = "FULLClient.emitter.sendToMain({ source : 'hiddenWindow', dest : 'main',id : '1'})"
hiddenWin.webContents.executeScript(script);
     });
 
});