/**
 * 
 *  App Updater : 
    -- Manifest and other logic
        - json
        - version check
        - zip URL ( download & extract ) 
        - update manifest with version
        - reload app only once after all the update is done.

        {
            "version": "0.3.1",
            "downloadURL": "http://images.sb.a-cti.com/TC/electron/staging/app/updates0.3.1.zip"
        }
 */
(function(util) {
    var path = FULLClient.require('path');
    var appUpdates = {
        updateManifest: null,
        isAsarRestartRequired: null,
        _queuedRestart: function() {
            if (this.isAsarRestartRequired) {
                util.publish('/app/restart/commence');
            }else {
                console.log('no app update and asar update avaialble..');
                 if(util.checkForUpdates.isFromMenu()){
                    util.checkForUpdates.setFlag(false);
                        alert('Your App is Already Updated..');
                 }
            }
        },
        start: function(asarObj) {

            this.isAsarRestartRequired = asarObj ? asarObj.asarUpdated : false;

            if (FULLClient.getMode() != 'code') {
                // var jsonFetchUrl = 'http://images.sb.a-cti.com/TC/electron/' + FULLClient.getMode() + '/app/appUpdater.json';
                var jsonFetchUrl = 'https://storage.googleapis.com/images.sb.a-cti.com/TC/electron/' + FULLClient.getMode() + '/app/appUpdater.json';
                $.getJSON(jsonFetchUrl)
                    .done(function(res) {
                        this.checkVersion(res);
                    }.bind(this))
                    .fail(function(reason) {
                        console.error('AppUpdates Failed ', reason);
                        this._queuedRestart();
                    }.bind(this));
            }
        },
        commenceDownload: function(manifest) {
            this.updateManifest = manifest;
            // commence update
            util.publish('/download/helper/file/download', {
                updateType : 'app',
                url: manifest.downloadURL,
                callback: this.downloadCB,
                mimetype: 'application/zip',
                context: this
            });
        },
        checkVersion: function(manifest) {
            var packageJSON = FULLClient.getManifest();
            // App Updater will work if mode / version is not matching.
            if (manifest && manifest.version && packageJSON.version != manifest.version) {
                util.publish('updateUI/ShowUI/container', 'appUpdate', manifest, this.commenceDownload, this);
            }
            // Mode change should trigger update mechanism.
            else if (manifest.mode && util.scripts.get().src.indexOf(manifest.mode) == -1) {
                util.publish('updateUI/ShowUI/container', 'appUpdate', manifest, this.commenceDownload, this);
            } 
            else {
                this._queuedRestart();
            }
        },
        downloadCB: function(error, filePath) {
            // extract
            if (error) {
                console.error('Error While Downloading : ', this.updateManifest);
                console.error('Reason : ' + error.message);
                console.error('stack : ', error.stack);

                this._queuedRestart();

                return;
            }
            util.publish('/download/helper/zip/extract', {
                fd: filePath,
                context: this,
                callback: this.extractCB
            });
        },
        extractCB: function(error, stdout, stderr) {
            if (error) {
                console.error('Error While Extracting : ', this.updateManifest);
                console.error('Reason : ' + error.message);
                console.error('stack : ', error.stack);

                util.publish('/mailHelper/mailsend', {
                    subject: 'App Updater Failed ',
                    type: 'Error Log',
                    err: error
                });

                this._queuedRestart();
                return;
            }
            this.versionUpdateInManifest();
        },
        versionUpdateInManifest: function() {
            var appManifest = FULLClient.getManifest();
            appManifest.version = this.updateManifest.version;
            util.publish('/download/helper/file/write', {
                fd: path.join(FULLClient.getFilePath(), 'package.json'),
                callback: this.updateVersionInPlist,
                context: this
            }, JSON.stringify(appManifest));
        },
        pushLogsToDev: function(errLogs) {
            util.publish('/mailHelper/mailsend', {
                type: 'Error Log',
                err: errLogs,
                subject: "App updater : failed while writing to info.plist for " + userDAO.getEmail()
            }, function callback() {
                console.warn('Error logs : ', errLogs);
                this.reload();
            }.bind(this));
        },
        plistParser: function(plistPath, data) {
            try {
                var plist = require('plist'),
                    fs = require('fs'),
                    appInfoPlist = plist.parse(data);

                appInfoPlist['CFBundleVersion'] = '64-bit';
                appInfoPlist['CFBundleShortVersionString'] = this.updateManifest.version;
                fs.writeFile(plistPath, plist.build(appInfoPlist), 'utf8', function(err) {
                    if (err) this.pushLogsToDev(err);
                    else this.reload();
                }.bind(this));
            } catch (e) {
                console.log('Error while parsing Info Plist :', e);
                // this.pushLogsToDev(e);
            }
        },
        updateVersionInPlist: function() {
            if (/^darwin/.test(process.platform)) {
                var fs = require("fs"),
                    plistPath = FULLClient.getFilePath().replace('/Resources/app', '/Info.plist');
                fs.readFile(plistPath, 'utf8', function(err, data) {
                    if (err) this.pushLogsToDev(err);
                    else this.plistParser(plistPath, data);
                }.bind(this));
            } else
                this.reload();
        },
        reload: function(error) {
            // reload should commence
            if (error) {
                console.error('Error While updating manifest : ', this.updateManifest);
                console.error('Reason : ' + error.message);
                console.error('stack : ', error.stack);

                this._queuedRestart();
                
                return;
            }
            util.publish('/app/restart/commence');
        }
    }
    util.subscribe('/app/updater/start', appUpdates, appUpdates.start)
})(util);