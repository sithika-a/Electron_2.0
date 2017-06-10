/**
 var options = {
    contentlength: "47754",
    filename: "UserImage",
    isViewable: false,
    mimetype: "image/jpg",
    name: "donwnload",
    action: 'download', // download | cancel
    url: 'http://tinyurl.com/h4e5z5c'
}
var options = {
    contentlength: "49791508",
    filename: "app-mac-0.37.8.zip",
    isViewable: false,
    mimetype: "application/zip",
    name: "donwnload",
    action: 'cancel', // download | cancel
    url: 'https://commondatastorage.googleapis.com/images.sb.a-cti.com/full_spectrum/solomon.mark@a-cti.com/transferredFiles/L2FwcGhvc3RpbmdfcHJvZC9ibG9icy9BRW5CMlVwRFNPVzBta1Ffd1J1NGNYWG1hd3lxWUU3dU5UVTNsamJ2Z3h2OVEzeGNsaWhQbEFCdGNjWnVnWWVEYXdTYm5pbjRpUnM4TDdLbTRXcTZwWlktTk9SczR2ZjFoMXJOVnN2bHpwY2R3M0d4R2N6WXlBNC5JVmZPeHhhNkgwa2FzT3h1'
}
 */
(function(R, util) {
    var EventEmitter = require("events").EventEmitter;
    var path = require("path");
    var win = util.getCurrentWindow();
    var remote = FULLClient.require('electron').remote
    var dialog = remote.dialog;
    var fs = FULLClient.require("fs");
    var request = FULLClient.require("request");

    function FileDownloader(downloadItem) {
        EventEmitter.call(this);
        this.name = "fileDownloader";
        this.id = uuid.v4(new Date().getTime());
        this.requestObject = null;
        this.originalObject = downloadItem;
        this.getdownloadUrl = function() {
            return downloadItem.url ? downloadItem.url : null;
        };
        this.downloadFile = function(cb, requestErrorCallback, filePath) {
            this.requestObject = request(this.getdownloadUrl()).on("response", cb).pipe(fs.createWriteStream(filePath));
            this.requestObject.on("error", function(err) {
                if (err) {
                    console.log("Error in request:", err);
                    this.removeProgressBar();
                    requestErrorCallback.apply(this, [{
                        err: err,
                        id: this.id,
                        originalObject: this.originalObject
                    }]);
                }
            }.bind(this));
        };
        this.removeProgressBar = function() {
            win.setProgressBar(-1);
        };
        this.cancelDownload = function() {
            this.requestObject.emit("close");
            console.warn("Download Cancelling for [CLOSE]");
            this.requestObject.end('');
            console.warn("Download Cancelling for [end]");
            this.requestObject.close();
            console.warn("Download Cancelling for [destory]");
            console.log("Download canceled for [ ", this.id, " ]");
        };
        this.on(this.id, function() {
            console.warn("Cancel Event Emitted for :", this.id);
            this.cancelDownload();
        });
    }
    FileDownloader.prototype = Object.create(EventEmitter.prototype);
    var downloadController = {
        downloadMap: {},
        downloadActive: null,
        glen: null,
        chunkLength: null,
        downloadedPercentage: null,
        precision: null,
        customDownloadPath: false,
        previousPercentage: 0,
        responseObj: {},
        decider: function(downloadItem) {
            console.log("Getting request for download for chat : downloadActive :", this.downloadActive);
            if (!this.downloadActive && downloadItem && downloadItem.action != "cancel") {
                this.downloadActive = true;
                this.start(downloadItem);
            }
            if (downloadItem && downloadItem.action == "cancel") {
                var Obj = this.downloadMap[downloadItem.id];
                console.warn("Download Cancelling for [", downloadItem.id, " ]");
                Obj.emit(downloadItem.id);
                this.responseObj[downloadItem.id].destroy();
                this.sendCancelEventToChat(this.downloadMap[downloadItem.id]);
                this.downloadMap[downloadItem.id].originalObject.fileCancelled = true;
                process.nextTick(function() {
                    downloadController.deletefile(downloadItem.id, downloadController.removeLocalObj); // cancelling and removing reference
                })
            }
        },
        start: function(downloadItem) {
            var fileObj = path.parse(downloadItem.filename);
            console.info("FileObj:", fileObj.ext);
            var downloadObj = new FileDownloader(downloadItem);
            var dpath, options;
            options = {
                title: "Downloads",
                defaultPath: this.getDownloadFolder() + "/" + downloadItem.filename,
                filters: [{
                    name: "All Files",
                    extensions: ["*"]
                }]
            };
            dialog.showSaveDialog(options, function(data) {
                if (!data) {
                    console.log("User selected cancel button: ", data);
                    this.downloadActive = null;
                }
                if (data) {
                    this.downloadActive = null;

                    console.debug("User selected path :", data);
                    var filePath = this.getPathToWrite(data, fileObj.ext);
                    downloadObj.originalObject["downloadInfo"] = path.parse(filePath);
                    downloadObj.originalObject["fileInfo"] = fileObj;
                    downloadObj.downloadFile(function(res) {
                        this.responseObj[downloadObj.id] = res;
                        this.glen += parseInt(res.headers["content-length"], 10);
                        var downloadPercentage = 0;
                        console.debug("Written Path :", this.getPathToWrite(data, fileObj.ext));
                        res.on("data", function(chunk) {
                            try {
                                this.chunkLength += chunk.toString("utf8");
                                downloadPercentage += chunk.length;
                                this.calculatePercentageAndMegabyte(this.glen, this.chunkLength, downloadPercentage, res, downloadItem, downloadObj);
                            } catch (e) {
                                // avoiding range error here.
                                // we will port to other http downloaders.
                            }
                        }.bind(this));

                        res.on("error", function(err) {
                            if (err) {
                                console.error("Error while downloading...!", err.message);
                                console.error("Error while downloading...!", err.stack);
                                this.removeProgressBar();
                            }
                        }.bind(this));

                        res.on("end", function(err) {

                            if (err) {
                                console.log("Error at end:", err.message);
                                console.log("Error at end:", err.stack);
                                this.removeProgressBar();
                            }
                            var fileInfo = path.parse(data);
                            this.findOriginalObjectandCompleteEvent(res.request.href, fileInfo.base ? fileInfo.base : fileObj.base, downloadObj.id);
                            this.setDownloadPathinLocalStorage("lastDownloadedPath", fileInfo.dir);
                            if (fileInfo.dir && fileInfo.base && !downloadObj['originalObject'].fileCancelled) {
                                this.finishDownload("completed", fileInfo.ext ? fileInfo.base : fileInfo.base + fileObj.ext);
                            }

                        }.bind(this));
                    }.bind(this), this.requestErrorCallback, filePath);
                    this.downloadMap[downloadObj.id] = downloadObj;
                }
            }.bind(this));
        },
        findOriginalObjectandCompleteEvent: function(url, filename, fileId) {
            for (var i in this.downloadMap) {
                if (this.downloadMap[i].originalObject.url == url || this.downloadMap[i].originalObject.filename == filename) {
                    var fileInfo = new Thinclient("downloadFileInfo");
                    fileInfo[fileInfo.opt].originalObject = this.downloadMap[i].originalObject;
                    fileInfo[fileInfo.opt].id = this.downloadMap[i].id;
                    fileInfo[fileInfo.opt].status = "completed";
                    this.sendMessageToChat(fileInfo);
                    this.removeLocalObj(fileId);
                }
            }
        },
        removeLocalObj: function(fileId) {
            delete this.downloadMap[fileId];
            if ($.isEmptyObject(this.downloadMap)) {
                console.log("downloadMap is empty", this.downloadMap, ": we can clear dock...!");
                this.flushDockProgress();
            }
        },
        flushDockProgress: function() {
            this.precision = null;
            this.chunkLength = null;
            this.glen = null;
            this.removeProgressBar();
        },
        deletefile: function(fileId, cb) {
            var obj = this.downloadMap[fileId];
            var downloadInfo = obj.originalObject.downloadInfo;
            var originalInfo = obj.originalObject.fileInfo;
            var filePath;
            if (downloadInfo) {
                filePath = path.join(downloadInfo.dir, downloadInfo.name + (downloadInfo.ext || originalInfo.ext));
                console.warn("DOWNLOAD File-path to delete while CANCEL :", filePath);
            }

            if (filePath) {
                this.checkfileExistenceInUserSystem(filePath, function(path) {
                    fs.unlink(path, function(err) {
                        if (err) {
                            console.error("Error in deleting file:", err.message);
                            console.error("Error in deleting file:", err.stack);
                        } else {
                            console.warn("DOWNLOAD File-path to delete successful :", path);
                            cb.call(this, fileId);
                        }
                    }.bind(this));
                }.bind(this));
            }
        },
        checkfileExistenceInUserSystem: function(filePath, cb) {
            fs.stat(filePath, function(err, stats) {
                if (err) {
                    console.error("Error in getting " + filePath + "availibilty:", err);
                } else {
                    cb.call(this, filePath);
                }
            }.bind(this));
        },
        requestErrorCallback: function() {
            var errorInfo = arguments[0];
            delete downloadController.downloadMap[errorInfo.id];
            var fileInfo = new Thinclient("downloadFileInfo");
            fileInfo[fileInfo.opt].originalObject = errorInfo.originalObject;
            fileInfo[fileInfo.opt].id = errorInfo.id;
            fileInfo[fileInfo.opt].status = "failed";
            downloadController.sendMessageToChat(fileInfo);
        },
        sendCancelEventToChat: function(fileObj) {
            var fileInfo = new Thinclient("downloadFileInfo");
            fileInfo[fileInfo.opt].originalObject = fileObj;
            fileInfo[fileInfo.opt].id = fileObj.id;
            fileInfo[fileInfo.opt].status = "cancelled";
            this.sendMessageToChat(fileInfo);
        },
        getDownloadFolder: function() {
            var downloadFolderName = "Downloads";
            if ("HOME" in process.env) {
                return path.join(process.env.HOME, downloadFolderName);
            } else if ("HOMEPATH" in process.env) {
                return path.join(process.env.HOMEDRIVE, process.env.HOMEPATH, downloadFolderName);
            } else if ("USERPROFILE" in process.env) {
                return path.join(process.env.USERPROFILE, downloadFolderName);
            }
        },
        getDownLoadedPath: function(filename) {
            return path.join(this.getDownloadFolder(), filename);
        },
        getCustomDownLoadedPath: function(filename) {
            return path.join(this.getCachedDownloadedPath("lastDownloadedPath"), filename);
        },
        showInFolder: function(filename) {
            if (this.customDownloadPath) shell.showItemInFolder(this.getCustomDownLoadedPath(filename));
            else shell.showItemInFolder(this.getDownLoadedPath(filename));
        },
        getCachedDownloadedPath: function(key) {
            return util.storage.get(key);
        },
        setDownloadPathinLocalStorage: function(key, value) {
            if (key && value) this.customDownloadPath = true;
            return util.storage.set(key, value);
        },
        updateProgressBar: function(percentage) {
            if (!util.platform.isMac()) {
                setTimeout(function() {
                    win.setProgressBar(percentage);
                }, 0);
            }
        },
        removeProgressBar: function() {
            setTimeout(function() {
                win.setProgressBar(-1);
            }, 0);
        },
        finishDownload: function(state, filename) {
            if (state == "completed") {
                this.completed(filename);
            }
        },
        completed: function(filename) {
            this.showInFolder(filename);
            this.removeProgressBar();
        },
        getPathInfo: function(filepathInfo) {
            return path.parse(filepathInfo);
        },
        getPathToWrite: function(filepathInfo, savedfileObj) {
            var pathInfo = path.parse(filepathInfo);
            return path.join(pathInfo.dir, pathInfo.name + (pathInfo.ext || savedfileObj));
        },
        constructDownloadInfoObject: function(downloadItem, downloadObj, previousPercentage, downloadedMB) {
            var percent = new Thinclient("downloadFileInfo");
            percent[percent.opt].originalObject = downloadItem;
            percent[percent.opt].id = downloadObj.id;
            percent[percent.opt].downloadedPercentage = previousPercentage;
            percent[percent.opt].downloadedMB = downloadedMB;
            this.sendMessageToChat(percent);
        },
        sendMessageToChat: function(obj) {
            if (FULLClient && obj) {
                FULLClient.ipc.sendToChat(obj);
            }
        },
        calculatePercentageAndMegabyte: function(glen, chunkLength, downloadPercentage, res, downloadItem, downloadObj) {
            var currentPercentage, downloadedMB;
            currentPercentage = Math.floor(downloadPercentage / res.headers["content-length"] * 100);
            downloadedMB = (chunkLength.length / 1048576).toFixed(2);
            if (this.previousPercentage != currentPercentage) {
                this.previousPercentage = currentPercentage;
                this.downloadedPercentage = this.previousPercentage;
                this.constructDownloadInfoObject(downloadItem, downloadObj, this.previousPercentage, downloadedMB);
            }
            /**
             * Mac dockbar is frozen, if there is more
             * downloads happening at same time.
             */
            var downloaded = parseFloat((chunkLength.length / glen).toFixed(2));
            if (typeof downloaded == "number" && this.precision != downloaded) {
                this.updateProgressBar(downloaded);
            }
        }
    };
    R["downloadController"] = downloadController;
    module.exports.FileDownloader = FileDownloader;
    module.exports.downloadController = downloadController;
    util.subscribe("/file/download/Start/", downloadController, downloadController.decider);
})(this, util);