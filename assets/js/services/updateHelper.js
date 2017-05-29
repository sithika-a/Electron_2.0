/*
- download ( { url: <>, context : < optional-Object > },mimetype:<application/zip> , callback : <function> )
- extract ( { fd:<filePath> } , callback : <function> )
- callback ( err and success )
    - err :  first param is error & data params are null
    - success :  first param null & data
- fileWriteCode ( { fd : <filePath> , context : < optional-Object > } , <buffer or string> , callback )
// Asar updation
- Asar updateJson logic
    - JSON
    - CheckSum Check
    - asarUpdate download URL ( download & extract ) 
    - updater mainfest with checksum
    - reload
    Mannual Test: 
    util.publish('/download/helper/file/download',{
        url:'http://images.sb.a-cti.com/TC/electron/staging/asar/updates0.30.0.zip',
        callback:function test(){console.log(arguments)}
        });
        
    util.publish('/download/helper/zip/extract',{
        fd:'/Volumes/HD_II/Office/FullClient-codebase/Mac_Setup/Electron/0.34.3/AnyWhereWorks.app/Contents/Resources/app/updates0.30.0.zip',
        callback:function(){console.log(arguments)}
        });
    util.publish('/download/helper/write/file',{
        fd:FULLClient.getFilePath()+'/test.txt',
        callback:function(){console.log(arguments)}
        },"tesing info")
 */

(function(util) {
    var fs = FULLClient.require('fs'),
        http = FULLClient.require('http'),
        https =require('https');
        path = FULLClient.require('path');

    var downloadHelper = {
        /*
            { 
                url:<>, 
                context :<> , 
                mimetype : 'application/zip',
                callback : <function> 
            }
        */
        retries: 0,
        download: function(paramObj) {
            console.log('URL in update Helper to download : ', paramObj)
            if (paramObj.url && util.isUrl(paramObj.url)) {
                var url = paramObj.url.replace(/(http:\/\/images.sb.a-cti.com)/,'https://storage.googleapis.com/images.sb.a-cti.com')
                var filename = path.basename(url);
                var tmpPath = paramObj.downloadPath || FULLClient.getFilePath();
                var downloadFilePath = path.join(tmpPath, filename);
                
                var http = util.isHttps(url) ? https : http;

                console.log('File downloadURL  :: ' + url);
                console.log('File path to download :: ' + downloadFilePath);
                
                var file;
                http.get(url, function(res) {
                    if (paramObj.mimetype == res.headers['content-type']) {


                        file = fs.createWriteStream(downloadFilePath, {
                            autoClose: true
                        });
                        var downloadPercentage = 0,
                            previousPercentage = 0,
                            progressUIShown = false,
                            currentPercentage;

                        res.on("data", function(chunk) {
                            if (paramObj.updateType && paramObj.updateType == 'app') {
                                if(!progressUIShown) {
                                    progressUIShown = true;
                                util.publish('updateUI/hideDownloadWinandshowProgress');
                                 }
                                downloadPercentage += chunk.length;
                                currentPercentage = Math.floor(downloadPercentage / res.headers["content-length"] * 100);
                                if (previousPercentage != currentPercentage) {
                                    previousPercentage = currentPercentage;
                                    util.publish('progressUI/updatePercentage', previousPercentage);
                                }
                            }

                        }.bind(this));
                        file.on('finish', function() {
                            console.log("Finished..!");
                            if (paramObj.updateType && paramObj.updateType == 'app') progressUIShown = false;
                            file.close();
                            setTimeout(function() {
                                if (paramObj.callback)
                                paramObj.callback.apply(paramObj.context || null, [null, downloadFilePath]);
                            }, 6000);
                        });

                        res.pipe(file);
                    }
                }.bind(this)).on('error', function(e) {
                    console.log("Error in downloading : " + e);
                    if (paramObj.callback)
                        paramObj.callback.call(paramObj.context || null, e);
                });
            }
        },
        /*
            { fd:<filePath> 
                , callback : <function> 
            }
        */
        queuedRetries: function(paramObj) {
            if (this.retries <= 3 && paramObj) {
                setTimeout(function() {
                    this.extract(paramObj);
                }, this.retries++ * 3000)
            }
        },
        extract: function(paramObj) {

            var unzipTool, src = paramObj.fd,
                dest = paramObj.extractPath || FULLClient.getFilePath(),
                child = FULLClient.require('child_process');

            if (path.extname(src) == '.zip') {
                if (/^win/.test(process.platform)) {
                    unzipTool = path.resolve(FULLClient.getFilePath(), 'tools', 'unzip.exe');
                } else if (/darwin/.test(process.platform)) {
                    unzipTool = 'unzip';
                }

                console.warn('src : ' + src + ", dest : " + dest);

                child.exec('"' + unzipTool + '" -oq "' + src + '" -d "' + dest + '" ', function(e, stdout, stderr) {
                    if (e) {
                        console.log("Error in Extraction : " + e);
                        console.warn("Queueing for retries.");
                        this.queuedRetries(paramObj);
                    } else if (paramObj.callback) {
                        console.log('Making retries 0, and proceeding with call back');
                        this.retries = 0;
                        paramObj.callback.apply(paramObj.context || null, [e, stdout, stderr]);
                    }
                }.bind(this));
            } else {
                if (paramObj.callback)
                    paramObj.callback.apply(paramObj.context || null, [
                        new Error('Invalid zip file')
                    ]);
            }
        },
        extractWithADM: function(paramObj) {
            try {

                console.warn('paramObj : ', paramObj);

                process.noAsar = true;

                var src = paramObj.fd,
                    dest = paramObj.extractPath || FULLClient.getFilePath(),
                    adm = FULLClient.require('adm-zip');

                paramObj.callback = paramObj.callback || function() {};

                if (path.extname(src) == '.zip') {
                    var zip = new adm(src);
                    if (!zip.isOriginalFs) {
                        console.log('Routing to older zip systeam, bcoz ADM zip not updated.')
                        return this.extract(paramObj);
                    }
                    console.warn('zip.isOriginalFs Available ');
                    zip.extractAllToAsync(dest, true, paramObj.callback.bind(paramObj.context))
                } else {
                    if (paramObj.callback)
                        paramObj.callback.apply(paramObj.context || null, [
                            new Error('Invalid zip file')
                        ]);
                }
            } catch (err) {
                console.warn('Error in extractWithADM routing to extract');
                this.extract(paramObj);
            }
        },
        /*
            { 
                fd : <filePath> , 
                cb : callback 
            } , 
            <buffer or string>
        */
        writeToFileSystem: function(paramObj, dataToWrite) {
            if (paramObj && paramObj.fd && dataToWrite) {
                fs.writeFile(paramObj.fd, dataToWrite, function(err) {
                    if (paramObj && typeof paramObj.callback == "function") {
                        paramObj.callback.apply(paramObj.context || null, [err || null, "success"]);
                    }
                });
            } else if (paramObj && typeof paramObj.callback == "function") {
                paramObj.callback.call(paramObj.context || null, new Error('Invalid param , while writing into file'));
            }
        }
    }

    module.exports = downloadHelper;
    util.subscribe('/download/helper/file/download', downloadHelper, downloadHelper.download);
    util.subscribe('/download/helper/zip/extract', downloadHelper, downloadHelper.extract);
    util.subscribe('/download/helper/zip/extractWithADM', downloadHelper, downloadHelper.extractWithADM);
    util.subscribe('/download/helper/file/write', downloadHelper, downloadHelper.writeToFileSystem);

})(util);
