;
(function(R, util) {
    var fs = FULLClient.require('fs');
    var path = FULLClient.require('path');
    var engineUpdater = {
        infoJson: null,
        userPermission: false,
        periodicCheck: null,
        'engineVersion': process.versions['electron'],
        'googleAppScript': 'https://script.google.com/macros/s/AKfycbzHu2EQVazW4LQdns9i8KcHDwzX37_73cO_O7vldwwe-OCdlu95/exec?',
        _canStart: function() {
            return (userDAO.getSkillByName('FullWork') && util.window.getName() == 'AnyWhereWorks') ||
                (!userDAO.getSkillByName('FullWork') && util.window.getName() == 'FULL')
        },
        getTempDirectory: function() {
            return util.getTempDirectory();
        },
        getConfigInfoFromTemp: function() {
            try {
                return require(path.join(this.getTempDirectory(), 'appMode.json'));
            } catch (err) {
                return false;
            }
        },
        writeIntoTemp: function(appPath, infoJSON) {
            var appMode;
            if (infoJSON && FULLClient.isModeValid(infoJSON.modetoswitch))
                appMode = infoJSON.modetoswitch
            else
                appMode = FULLClient.getMode();

            var data = JSON.stringify({
                'appMode': appMode
            });

            fs.writeFile(path.join(this.getTempDirectory(), 'appMode.json'), data, function(err) {
                if (err) {
                    console.warn('Error in Writing appMode in Engine Updation');
                }
                if (util.platform.isMac()) this.replaceMacApp(appPath, infoJSON.downloadUrl.mac.filename);
                else if (util.platform.isWin()) this.replaceWinApp(appPath, infoJSON.downloadUrl.win.filename);
            }.bind(this));
        },
        deleteTmpConfig: function(config) {
            if (config) {
                console.warn("Mode switch is available  : " + config.appMode);
                tmpPath = path.join(this.getTempDirectory(), 'appMode.json');
                fs.unlink(tmpPath, function(err) {
                    if (err)
                        console.log("Error in deleting appMode tmpPath : ");
                    // in 1.x there should be mode switch.
                    // disabling temprorily.
                    FULLClient.setMode(config.appMode);
                });
                return true;
            }
            throw new Error('Invalid param : ' + typeof config);
        },
        checkForUserAccess: function(json) {
            if (json && json.wipe) {
                console.log("User dont have access use application, wiping data :", json);
                FULLClient.ipc.sendToSB({
                    name: "analytics",
                    accountNumber: null,
                    eventAction: analytics.WIPE_DATA,
                    connId: FULLClient.getMode() + " " + FULLClient.getManifest().version + " " + process.platform,
                    metaInfo: "Wiping data for user using spreadsheet."
                });
                util.publish('/remove/access/data/');
                return true;
            }
        },
        popUpDownloadUI: function() {
            if (this._canStart() && this.infoJson && this.infoJson.status == 'success') {
                console.log("Showing UI for engineUpdate", this.infoJson);
                util.publish('updateUI/ShowUI/container', 'engineUpdate', this.infoJson, this.downloadAndInstall, this)
            }
        },
        isGuestUpdateAvailable: function() {
            var guestInfo = util.storage.get('guestUpdate');
            if (guestInfo && Object.keys(guestInfo).length) {
                return true;
            }
        },
        start: function(isPeriodicCheck) {
            // We have to start engine update only in 
            // one container window either chat or main container.

            // NB : Patch code once people are moved remove it.
            if (compareVersions(process.versions.electron, '1.3.13') == -1) {
                console.warn('============== patching to ============== 1.3.13')
                this.patch();
                return;
            }

            if (!this._canStart())
                return false;
            if (this.isGuestUpdateAvailable() && !isPeriodicCheck) //dont proceed engineUpdate on startUp with guestUpdate enabled
                return false;
            $.getJSON(this.googleAppScript + 'userEmail=' + userDAO.getEmail() + '&mode=' + FULLClient.getMode() + '&engine=' + process.versions['electron'])
                .done(function(infoJSON) {
                    this.infoJson = infoJSON ? infoJSON : null; // caching infoJson
                    /**
                     * User has to removed from app
                     * data should be wiped off.
                     */
                    if (this.checkForUserAccess(infoJSON))
                        return;

                    var tmpConfig = this.getConfigInfoFromTemp();
                    if (FULLClient.getMode() != 'code') {
                        console.log('Engine Updater response : ', infoJSON);
                        // case 1 : Different engine version than the current one running.
                        // will show popup and update the engine.
                        if (infoJSON.version && infoJSON.version.trim() && !/[^0-9.]/.test(infoJSON.version) && this.engineVersion != infoJSON.version && infoJSON.status == 'success') {
                            this.popUpDownloadUI();
                        }
                        // case 2 : If only modeSwitch is specified.
                        // we will switch the mode alone for app.
                        else if (infoJSON.modetoswitch && FULLClient.isModeValid(infoJSON.modetoswitch) && FULLClient.getMode() != infoJSON.modetoswitch) {
                            FULLClient.setMode(infoJSON.modetoswitch);
                        }
                        // case 3 : After starting the app, if there is mode was there in use like staging, test , spectron
                        // it will switch back to previous mode and then deleted the appMode.json which was created.
                        else if (tmpConfig) {
                            this.deleteTmpConfig(tmpConfig);
                            console.warn('Removed appMode key from localStorage');
                        }
                        // case 4: We periodically check for engine update, incase of that
                        // we should not show UI, but in future we will show UI for all cases.
                        else {
                            console.warn('Commencing ASAR updater.');
                            util.publish('/asar/update/commence');
                        }
                    }
                }.bind(this));
        },
        // NB: remove after migration
        patch: function() {
            var infoJSON = this.infoJson = {
                "mode": "1.x",
                "version": "1.3.13",
                "name": "EngineUpdater",
                "downloadUrl": {
                    "mac": {
                        "url": "http://images.sb.a-cti.com/TC/electron/live/engine/app-mac-1.3.13.zip",
                        "filename": "AnywhereWorks.app"
                    },
                    "win": {
                        "url": "http://images.sb.a-cti.com/TC/electron/live/engine/app-win-1.3.13.zip",
                        "filename": "app-win-1.3.13.exe"
                    }
                },
                "status": "success",
                "wipe": false,
                "modetoswitch": false
            };
            /**
             * User has to removed from app
             * data should be wiped off.
             */
            if (this.checkForUserAccess(this.infoJson))
                return;

            var tmpConfig = this.getConfigInfoFromTemp();
            if (FULLClient.getMode() != 'code') {
                console.log('Engine Updater response : ', infoJSON);
                // case 1 : Different engine version than the current one running.
                // will show popup and update the engine.
                if (infoJSON.version && infoJSON.version.trim() && !/[^0-9.]/.test(infoJSON.version) && this.engineVersion != infoJSON.version && infoJSON.status == 'success') {
                    this.popUpDownloadUI();
                }
                // case 2 : If only modeSwitch is specified.
                // we will switch the mode alone for app.
                else if (infoJSON.modetoswitch && FULLClient.isModeValid(infoJSON.modetoswitch) && FULLClient.getMode() != infoJSON.modetoswitch) {
                    FULLClient.setMode(infoJSON.modetoswitch);
                }
                // case 3 : After starting the app, if there is mode was there in use like staging, test , spectron
                // it will switch back to previous mode and then deleted the appMode.json which was created.
                else if (tmpConfig) {
                    this.deleteTmpConfig(tmpConfig);
                    console.warn('Removed appMode key from localStorage');
                }
                // case 4: We periodically check for engine update, incase of that
                // we should not show UI, but in future we will show UI for all cases.
                else if (!isPeriodicCheck) {
                    console.warn('Commencing ASAR updater.');
                    util.publish('/asar/update/commence');
                }
            }
        },
        downloadAndInstall: function() {
            var infoJSON = arguments[0];
            var UpdationTrigger = arguments[1];
            if (UpdationTrigger && infoJSON) {
                console.debug("Starting download process.. ");
                /**
                 * Restarting Engine from one mode to another
                 * so, it helps in providing one CDN link to
                 * all engine updates
                 *
                 * ex: Live -> live ( normal )
                 *     live -> test ( fixed routine );
                 */
                this.downloadZip(infoJSON, function(extractUrl) {
                    this.extractZip(extractUrl, function(appPath) {
                        this.writeIntoTemp(appPath, infoJSON);
                    }.bind(this));
                }.bind(this));
            }
        },
        downloadZip: function(response, cb) {
            var path = require('path'),
                downloadPercentage = 0,
                previousPercentage,
                currentPercentage,
                file,
                temp = util.getTempDirectory();

            temp = path.resolve(temp + '/EngineUpdates.zip');

            var downloadZipUrl = this.getDownloadZipUrl(response);

            downloadZipUrl = downloadZipUrl.replace(/(http:\/\/images.sb.a-cti.com)/, 'https://storage.googleapis.com/images.sb.a-cti.com')

            http = util.isHttps(downloadZipUrl) ? require('https') : require('http');

            console.log('URL Path engine being downloaded :', downloadZipUrl);

            var req = http.get(downloadZipUrl, function(res) {
                if (res.statusCode == 200) {
                    util.publish('updateUI/hideDownloadWinandshowProgress'); // hidding downloadUI and start showing progress bar UI. 
                    var len = parseInt(res.headers['content-length'], 10);
                    var total = len / 1000000; // getting total mb of respose file
                    if (res.headers['content-type'] == "application/zip" || res.headers['content-type'] == "application/x-zip-compressed") {

                        file = fs.createWriteStream(temp);
                        res.on("data", function(chunk) {
                            // showing download data in percentage
                            downloadPercentage += chunk.length;
                            currentPercentage = Math.floor(downloadPercentage / res.headers["content-length"] * 100);

                            if (previousPercentage != currentPercentage) {
                                previousPercentage = currentPercentage;
                                util.publish('progressUI/updatePercentage', previousPercentage)
                            }
                        }.bind(this));

                        res.pipe(file);
                        res.resume();

                        res.on('end', function end() {
                            cb(temp);
                        });
                    } else {
                        util.publish('updateUI/hidePopUp');
                    }
                } else {
                    util.publish('updateUI/hidePopUp');
                }
            }.bind(this));

            req.on("error", function(err) {
                console.log("Error in downloading file::", err);
            }.bind(this));
        },
        extractZip: function(src, cb) {

            var child_process = this.createChildProcess(),
                path = require('path'),
                unzipChildProcessCmd,
                dest;

            if (util.platform.isMac()) {
                dest = util.getTempDirectory() + 'EngineUpdates';

                unzipChildProcessCmd = 'unzip -oq "' + src + '" -d "' + dest + '" ';
            } else if (util.platform.isWin()) {
                dest = path.resolve(process.env.TEMP + '/EngineUpdates');
                unzipChildProcessCmd = ' "' + path.resolve(FULLClient.getFilePath(), 'tools/unzip.exe') + '" -o "' + src + '" -d "' + dest + '" ';
            }

            console.log('Path : ' + unzipChildProcessCmd);
            child_process.exec(unzipChildProcessCmd, function(err) {
                if (!err)
                    cb(dest);
                else {
                    console.log("Error in Extracting a file using child process : " + err);
                }
            });

        },
        /*
            Method to create child process
        */
        createChildProcess: function() {
            return require('child_process');
        },

        /*
            App replacement code for mac
        */
        replaceMacApp: function(dest, filename) {
            console.log('What is this :: ' + dest);
            // # param1, appNameToQuit : to quit
            // # param2, sourcePath : path info
            // # param3, destionationPath : Destionation path where to place

            var appNameToQuit = util.escapeSpaces(FULLClient.getAppName());
            var sourcePath = util.escapeSpaces(path.join(dest, filename))
            var destionationPath = util.escapeSpaces(path.join('/Applications', filename));
            // if (['kamesh.arumugam@a-cti.com', 'raju.pillai@a-cti.com', 'ashwin.mohan@a-cti.com'].indexOf(userDAO.getEmail()) != -1) {
            //     var testPath, downloadFolderName = 'Desktop';
            //     if ("HOME" in process.env) {
            //         testPath = path.join(process.env.HOME, downloadFolderName, 'TestFolders');
            //     } else if ("HOMEPATH" in process.env) {
            //         testPath = path.join(process.env.HOMEDRIVE, process.env.HOMEPATH, downloadFolderName, 'TestFolders');
            //     } else if ("USERPROFILE" in process.env) {
            //         testPath = path.join(process.env.USERPROFILE, downloadFolderName, 'TestFolders');
            //     }
            //     destionationPath = util.escapeSpaces(path.join(testPath, 'destionationApp', filename));
            // }


            var currentAppPath = util.escapeSpaces(process.execPath.replace(/([/]Contents.*)/g, ''));
            var shellScriptPath = util.escapeSpaces(path.join(FULLClient.getFilePath(), 'scripts', 'engine.sh'));


            var script = 'sh ' +
                ' ' + shellScriptPath + // bash script path
                ' ' + appNameToQuit + // ex : 'Anywhere\ Works.app'
                ' ' + sourcePath + // Extract zip path ex: '/tmp/../Anywhere\ Works.app'
                ' ' + destionationPath + // ex: '/Application/Anywhere\ Works.app'
                ' ' + currentAppPath; // ex : '/HD_II/test.app' or '/Application/Anywhere\ Works.app'

            console.log('script Details : ' + script);
            var child = this.createChildProcess();
            child.exec(script, function(err) {
                if (err)
                    console.log("Error in child_process : " + err);
            });
        },
        /*
            App replacement code for window's
        */
        replaceWinApp: function(dest, filename) {
            var child_process = this.createChildProcess();
            var execPath = path.join(process.env.TEMP, 'EngineUpdates', filename);

            console.log('Path : ' + execPath);
            child_process.exec('"' + execPath + '"', function(err) {
                if (err) {
                    util.publish('updateUI/hidePopUp');
                    console.log("User denied permission or failed to execute the update.exe : ", err);
                }
            });
        },
        /*
            Method to get downloadZip url Depends on platform
        */
        getDownloadZipUrl: function(response) {
            if (util.platform.isMac())
                return response.downloadUrl.mac.url;
            else
                return response.downloadUrl.win.url;
        },
        checkUserWritePermissionAndStart: function(periodicCheck) {
            this.periodicCheck = periodicCheck ? periodicCheck : false;
            util.publish('/start/checkUserWritePermissionAndStart/', this.permissionCallback);
        },
        permissionCallback: function(permission) {
            if (permission) {
                engineUpdater.userPermission = permission;
                engineUpdater.periodicCheck ? engineUpdater.start(true) : engineUpdater.start();
            } else {
                console.log("User dont have permission :", permission);
                engineUpdater.userPermission = permission;
            }
        }
    };
    R['engineUpdater'] = engineUpdater;
    module.exports = engineUpdater;
    setInterval(function() {
        engineUpdater.checkUserWritePermissionAndStart(true);
    }, FULLClient.getMode() == 'test-1.x' ? 60000 /* 2 mins */ : 300000 /* 1 hour */ ); // 300000 5min

    util.subscribe('/start/engine/updater/', engineUpdater, engineUpdater.checkUserWritePermissionAndStart);
})(this, util);