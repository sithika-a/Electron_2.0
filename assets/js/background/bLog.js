/**
 * Background logs writing
 * system.
 */
var fs = require('fs');
var path = require('path');

var bLog = {
    _basepath: 'backgroundLogs',
    _stream: null,
    getPath :  function(){
        return path.join( app.getAppPath() , this._basepath );
    },
    _checkDirectory: function() {
        // Synchronous code in here
        var logsPath =  this.getPath();
        if( !fs.existsSync(logsPath) ){
            fs.mkdirSync(logsPath)
        }
    },
    _createStream: function() {
        this._stream = fs.createWriteStream(
            path.join(this.getPath(), Date.now().toString() + '.log'), {
                encoding: 'utf-8',
                mode: 0777,
                flags: 'a'
            }
        );
        return this._stream;
    },
    _getStream: function() {
        if (!this._stream) {
            this._checkDirectory()
            return this._createStream();
        }

        return this._stream;
    },
    write: function() {

        /* Arguments are automatically taken */
        var tmp = [].slice.call(arguments);
        this._getStream()
            .write(
                new Date() + " :: " +
                JSON.stringify(tmp) +
                '\n'
        );
    },
    hook: function() {
        function logHandler() {
            this.write.apply(bLog, arguments);
        };

        var methods = [
            'log', 'debug', 'error', 'warn', 'info'
        ];
        
        if (console) {
            for (var i = methods.length - 1; i >= 0; i--) {
                console[methods[i]] = logHandler.bind(this);
            };
        }
    }
}

 bLog.hook();
// if (global.sharedObject && global.sharedObject.cliArgs && global.sharedObject.cliArgs['enable-background-logs']) {
//     bLog.hook();
// }