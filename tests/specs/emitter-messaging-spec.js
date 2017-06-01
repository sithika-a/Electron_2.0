const assert = require('assert')
const ChildProcess = require('child_process')
const path = require('path')

describe('app module', function() {

    var appProcess = null

    // it('@Emitter : send Message to MainProcess ...', function(done) {
    //     this.timeout(3000);

    //     var messenger = require("../../comm/messenger.js");
    //     var obj = {
    //         id: 1
    //     };

    //     messenger.subscribe(messenger.namespace.Main, (event) => {
    //         console.log('Received message in MainProcess', event.data);
    //         done();
    //         assert(event.data, obj);

    //     });
    //     messenger.broadCast(messenger.namespace.Main, obj)
    // })
    // var WindowManager = hiddenWin = null;

it('@Main Background  : module Available ? ', function(done) {
      var  bg = require("../../archive/background.js");
      console.log('bg.WindowManager : ',bg)
        assert(bg);
        done();
    });

    // it('@WindowManager : module Available ? ', function(done) {
    //     WindowManager = require("../../assets/js/services/WindowManager.js");
    //     assert(WindowManager);
    //     done();
    // });

    // it('@ open Hidden window :', function(done) {
    //     this.timeout(3000);
    //     var currendDir = path.join(process.cwd(), '../');
    //     console.log('currendDir : ', currendDir)
    //     process.chdir(currendDir);
    //     hiddenWin = WindowManager.openHiddenContainer();
    //     assert(hiddenWin);
    //     done();
    // });

    // it('@Emitter - Messaging From  Hidden Renderer to Main ---', function(done) {
    //     this.timeout(3000);
    //     var script = "FULLClient.emitter.sendToMain({ source : 'hiddenWindow', dest : 'main',id : '1'})"
    //     hiddenWin.webContents.executeJavaScript(script);

    //     var messenger = require("../../comm/messenger.js");

    //     messenger.subscribe(messenger.namespace.Main, (event) => {
    //         console.log('Received message from hiddenWindow', event.data);
    //         done();
    //         assert.equal(event.data.source, 'hiddenWindow')

    //     });

    // })


})