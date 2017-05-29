/** cloud JSON Example
{
    "asarPackage": "asar",
    "asarVersion": "2.0.99",
    "version": "0.4.3",
    "checkSum": "8cfdcbcfc2c0ebe53cf1c1840fb544e4257f6c36",
    "asarDownloadURI": "http://images.sb.a-cti.com/TC/electron/test/asar/updates2.0.99.zip"
}
*/


(function(util) {

    var asarUpdater = {
        manifestUpdate: null,
        manifest: null,
        extractPath: null, //extractPath to send updateHelper
        pathVersion: null, //pathVersion to upate manifest file
        getJsonURL : function(){
            // return 'http://images.sb.a-cti.com/TC/electron/' + FULLClient.getMode() + '/asar/0.2.0/asarUpdater.json';
            return 'https://storage.googleapis.com/images.sb.a-cti.com/TC/electron/' + FULLClient.getMode() + '/asar/0.2.0/asarUpdater.json';
        },
        hashCheck: function() {
            if (FULLClient.getMode() != "code") {
                $.getJSON(this.getJsonURL(), function(data) {
                    console.warn('Asar Updater response : ', data);
                    this.manifest = FULLClient['manifest'];
                    if (this.manifest.checkSum !== data['checkSum'])
                        this.calculatePath(data);
                    else {
                        console.log("Asar Updation : Your app is upto date");
                        util.publish('/app/updater/start', {
                            asarUpdated: false
                        });
                    }
                }.bind(this));
            }
            return true;
        },
        getSemVer: function(arg) {
            return /([0-9]{0,}\.[0-9]{0,})/.exec(arg)[0];
        },
        calculatePath: function(res) {

            var path = FULLClient.require('path'),
                packVer = this.getSemVer(FULLClient.getManifest().main), //Getting Major and Minor of semversion
                cloudVer = this.getSemVer(res['asarVersion']), // Getting Major and Minor of semverion
                manifest = FULLClient.getManifest().main;

            //Checking the asar folder existence
            if (compareVersions(packVer, cloudVer) == 0) {

                var patch = /[0-9]*\.[0-9]*\.[0-9]*/.exec(manifest)[0],
                    patch = ++patch.split('.')[2], //Incrementing value
                    folderVer = packVer + '.' + patch; //creating a folder version if same asar folder exists.

                //Refer cloud JSON Example above     
                this.extractPath = path.join(FULLClient.getFilePath(), res['asarPackage'], folderVer);
                this.pathVersion = path.join(res['asarPackage'], folderVer);
                this.versionCheck(res);

            } else {
                this.extractPath = path.join(FULLClient.getFilePath(), res['asarPackage'], res['asarVersion']);
                this.pathVersion = path.join(res['asarPackage'], res['asarVersion']);
                this.versionCheck(res);
            }
        },
        //Assigning the manifest value 
        versionCheck: function(res) {
            var path = FULLClient.require('path');
            //creating url for main and preloadUrl JSON property
            this.manifest.main = path.join(this.pathVersion, "full.asar", "background.js");
            this.manifest.preloadUrl = path.join(this.pathVersion, "full.asar", "preload.min.js");
            //Assigning new hashvalue
            this.manifest.checkSum = res['checkSum'];
            this.startUpdate(res['asarDownloadURI']);

        },
        startUpdate: function(url) {
            util.publish('/download/helper/file/download', {
                url: url,
                callback: this.downloadCB,
                mimetype: 'application/zip',
                context: this
            });
        },
        downloadCB: function(err, filePath) {
            if (err) {
                this.sendErrMail(err);
                console.warn('Asar Updater : Error in downloading');
                return;
            }
            util.publish('/download/helper/zip/extractWithADM', {
                fd: filePath,
                context: this,
                callback: this.excractCB,
                extractPath: this.extractPath
            });

            //Extraction with extract command 

            // util.publish('/download/helper/zip/extract', {
            //     fd: filePath,
            //     context: this,
            //     callback: this.excractCB,
            //     extractPath: this.extractPath
            // });
        },
        excractCB: function(err, stdout, stderr) {
            if (err) {
                this.sendErrMail(err);
                console.warn('Asar Updater : Error in Extracting');
                return;
            }
            util.publish('/download/helper/file/write', {
                fd: FULLClient.require('path').join(FULLClient.getFilePath(), 'package.json'),
                context: this,
                callback: function() {
                    console.warn('Going to commence APP Update');
                    util.publish('/app/updater/start', {
                        asarUpdated: true
                    });
                }
            }, JSON.stringify(this.manifest));
        },
        sendErrMail: function(errObj) {
            var tmp = {
                subject : "Asar Updation Error",
                type: "Error Log",
                err : errObj
            }
            util.publish('/mailHelper/mailsend', tmp);
        }
    }

    module.exports = asarUpdater;
    util.subscribe('/asar/update/commence', asarUpdater, asarUpdater.hashCheck);
})(util)