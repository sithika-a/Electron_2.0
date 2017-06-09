const {app} = require(`electron`);

app.on(`ready`, () => {
     var hiddenWin = WindowManager.openHiddenContainer();
     hiddenWin.webContents.on('did-finish-load',()=>{
     	        var script = "FULLClient.emitter.sendToMain({ source : 'hiddenWindow', dest : 'main',id : '1'})"
hiddenWin.webContents.executeScript(script);
     });
 
});