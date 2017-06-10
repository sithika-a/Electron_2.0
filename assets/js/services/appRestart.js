(function(R, util) {
    var restart = {
        getScriptName :  function(){
            var scriptname;
            switch(FULLClient.getAppName().toLowerCase()){
                case "fullclient-electron.exe":{
                    scriptname = 'fc.bat';
                    break;
                }

                case "anywhereworks.exe":{
                    scriptname = 'aww.bat';
                    break;
                }
                 
                case "anywhere works.exe":{
                    scriptname = 'awwspaced.bat';
                    break;
                }   

                case "aww-v2.exe":{
                    scriptname = 'aww-v2.bat';
                    break;
                }

                default:{
                    scriptname = 'aww.bat';
                    break;
                }
            }

            return scriptname;
        },
        quitApp: function() {
            
            util.publish('/app/restore/removeAll','tabs');

            var child = require('child_process').exec,
                path = require('path');

            // Windows, restarting of application  
            if (util.platform.isWin()) {
                var quietTool = path.resolve(process.resourcesPath, "app", "tools", "Quiet.exe");
                var scriptPath = path.resolve(process.resourcesPath, "app", "scripts", this.getScriptName());
                child('START " "  "' + quietTool + '"  "' + scriptPath + '"', function(err) {
                    if (err)
                        console.log("Error in restart" + err);
                });
            }

            // Mac, code for restarting Application
            else if (util.platform.isMac()) {
                var applicationPath, endIndex = process.resourcesPath.indexOf('/Contents');
                var appName = namespace.APP_ID == 'FULL' ? 'FULLClient-Electron' : FULLClient.getAppName();
                var scriptPath = path.resolve(process.resourcesPath, "app", "scripts", "restart.sh");
                applicationPath = process.resourcesPath.substring(0, endIndex);

                appName = util.escapeSpaces(appName);
                scriptPath = util.escapeSpaces(scriptPath);
                applicationPath = util.escapeSpaces(applicationPath);
                
                console.log('ApplicationPath to START : ' + applicationPath);
                //we are passing process id for future reference
                var daemon = child('sh ' + scriptPath + ' ' + process.pid + ' ' + applicationPath+' '+appName, function(err, stdout, stderr) {
                    if (err) {
                        console.log(err);
                    }
                    console.debug("STDOUT :", stdout);
                    console.warn("STDERR : ", stderr);
                });
            }
        },
        initiate: function() {
            this.quitApp();
        }
    }

    util.subscribe('/app/restart/commence', restart , restart.initiate);
})(this, util);