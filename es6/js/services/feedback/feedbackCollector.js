/**
 
 Feedback Collector

 Resources :
 
 - http://dexie.org/
 - https://github.com/broofa/node-uuid
 - https://developer.mozilla.org/en/docs/Web/API/Blob
 - https://developer.mozilla.org/en-US/docs/Web/API/FormData
 - https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest
 - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/prototype

 Deffered :
 http://videos.bigbinary.com/jquery/jquery-deferred.html
 http://joseoncode.com/2011/09/26/a-walkthrough-jquery-deferred-and-promise/
 http://www.danieldemmel.me/blog/2013/03/22/an-introduction-to-jquery-deferred-slash-promise/


Design :

    - Logging system ( kDebug.js )
    - UserFeedback constructor ( entry point for creating feedback )
    - Collection of [images,logs,localLogs] - collects and stores them in [feedbackStore,imageStore,clientLogStore] respectively
    - stateMapService - maintains state like ACK, Recieved logs from clients etc.
    - saveService - saves these data into container IndexedDB
    - collectorService - after succesful save queries db for [feedbackStore,imageStore,clientLogStore]
    - sendService - sends the feedback through mailing system
    - cleanService - removes current feedback [feedbackStore,imageStore,clientLogStore] from indexedDB.

    ============================

    1.User gives feedback --> UUID --> [collectImages,collectLogs,localLogs] --> [stateMapService] --> [saveService] --> [collectorService]

    --> [sendService] --> [cleanService]
    

    2.appStartUp --> onload --> [unsendFeedbackService]
    
    =============================

**/

;
(function(R, util, undefined) {


    var feedbackDB = localDB.createDB('feedbackDB', 1); // DBname

    feedbackDB.setStoreObject({
        feedbackStore: 'id',
        clientLogStore: '++id,parentId',
        imageStore: '++id,parentId'
    });

    localDB.register(feedbackDB); // registered asynch.
    localDB.createDBInstance(feedbackDB.name, 'feedbackStore');

    function FeedbackFD(user, uniqueId, arrayOfLogs, arrayOfImages, arrayOfFb, mailsubject) {
        this.id = uniqueId;
        this.form_data = new FormData();
        this.setLogs(arrayOfLogs);
        this.setImages(arrayOfImages);
        this.setText(arrayOfFb);
        this.form_data.append("t", new Date().getTime());
        this.form_data.append("tag", "suggestion");
        this.form_data.append("user_tag", "Electron");


        var htmlObj = {
            "html_template": "NA",
            "html_template_subject": mailsubject
        };

        console.log('Feedback loop key : ' + this.getLoopKey(mailsubject));
        this.form_data.append("custom_html_info", JSON.stringify(htmlObj));
        this.form_data.append("loopKey", this.getLoopKey(mailsubject));
        this.form_data.append("user_name", (user) ? user.fullname : 'Unable To get UserInfo');
        this.form_data.append("user_email", (user) ? user.email : 'Unable To get UserInfo');
    }

    FeedbackFD.prototype = {
        constructor: FeedbackFD,
        setLogs: function(arrayOfLogs) {
            var _blob;
            for (var i = arrayOfLogs.length - 1; i >= 0; i--) {
                if (arrayOfLogs[i]) {
                    _blob = new Blob([arrayOfLogs[i].value], {
                        type: 'text/html'
                    });
                    console.warn('appending Logs arrayOfLogs[' + i + ']:' + arrayOfLogs[i].host);
                    this.form_data.append("feedbackAttachment", _blob, arrayOfLogs[i].host);
                }
            };
            _blob = null;
        },
        getLoopKey: function(subject) {
            console.log('Subject line ', subject);
            if (/AnywhereWorks/ig.test(subject)) {
                this['for'] = 'AnywhereWorks';
                return FULLClient.getConfig().chatLoop
            }
            return FULLClient.getConfig().loop
        },
        setImages: function(arrayOfImages) {
            for (var i = arrayOfImages.length - 1; i >= 0; i--) {
                if (arrayOfImages[i]) {
                    ImageService.appendToFeedback(arrayOfImages[i], this.form_data);
                }
            };
        },
        setText: function(arrayOfFb) {
            if (arrayOfFb[0]) {
                this.form_data.append("card_title", arrayOfFb[0].feedback);
                console.warn('Feedback Appended!', arrayOfFb[0].feedback);
            }
        }
    }

    function UserFeedback(feedbackMessage) {

        this.id = uuid.v4(new Date().getTime()); //mandatory

        this.feedback = feedbackMessage || 'Auto Generated Feedback '; // mandatory

        this.logs = {};

        this.images = {};

        this.save(); // save the state of object.

        this.publish(); // publish message to get logs and images.

    };

    UserFeedback.prototype = {
        // Available methods on the object.
        save: function(obj) {
            saveService.storeById(obj || this);
        },
        publish: function() {
            this.captureLogs.apply(this, this.captureImages() /* Returns Promises for ImageCollection Returns */ );
        },
        captureImages: function() {
            var dfdV2 = $.Deferred();
            ImageService.getScreen({
                id: this.id,
                title: namespace.CONTAINER_V2,
                deferred: dfdV2
            });

            var dfdSB = $.Deferred();
            ImageService.getScreen({
                id: this.id,
                title: namespace.CONTAINER_SB,
                deferred: dfdSB
            });

            var dfdChat = $.Deferred();
            // BUG : Windows
            // when window is hidden we are tyring to 
            // capture the window it is unable to work
            // and halting the feedback process
            if (userDAO.getSkillByName('FullWork')) {
                // ImageService.getScreen({
                //     id: this.id,
                //     title: namespace.CONTAINER_CHAT,
                //     deferred: dfdChat
                // });
                dfdChat.resolve('Stopping Chat Screen Capture.');
            } else {
                // Mannually resolving the DFD, for the
                // feedback routine to continue
                dfdChat.resolve('Not needed');
            }
            var dfdFeedbackFileUpload = $.Deferred();
            util.publish('/fileUpload/user/uploads/capture', {
                id: this.id,
                deferred: dfdFeedbackFileUpload
            });

            return [dfdSB.promise(), dfdV2.promise(), dfdChat.promise(), dfdFeedbackFileUpload.promise()];
        },
        captureLogs: function(sbImagePromise, v2ImagePromise, chatImagePromise, userUploadPromise) {

            kDebug.getLogs(this.id, function(logObj) {
                var appLogsDfd = $.Deferred();
                // Saving the generated LogHTML to DB.
                saveService.saveLogsById(logObj, appLogsDfd);
                stateService.chainPromises(
                    logObj.parentId, [
                        appLogsDfd.promise(),
                        sbImagePromise,
                        v2ImagePromise,
                        chatImagePromise,
                        userUploadPromise,
                        iFramesLogs.sendLogCaptureSingal(this.id)
                    ]
                );
            }, this);
        }
    };

    var ImageService = {
        getScreen: function(feedbackObj) {
            var container = util.caching.windows.getTarget(feedbackObj.title)
            return container ? this.getSnap(container, feedbackObj) : feedbackObj.deferred.resolve('container not available');
        },
        getSnap: function(container, feedbackObj) {
            container.capturePage(function(image) {
                ImageService.isImageValid(image, feedbackObj);
            });
        },
        getImageBlob: function(file) {
            var _blob = new Blob([file], {
                type: 'image/png'
            });
            return _blob;
        },
        appendToFeedback: function(imgObj, formData) {
            var type = (imgObj.img.type && imgObj.img.type.indexOf('image') == -1) ? '_File' : '_image';
            var name = imgObj.frame + type;
            // attaching User uploads to Feedback card with frame name
            formData.append("feedbackAttachment", imgObj.img, name);
        },
        isImageValid: function(image, feedbackObj) {
            /*
             * Validating captured image: if its not empty then image will
             * be appended with Feedback otherwise deferred object will be
             * resolved with failure message, and image won't be in User Feedback..
             */
            if (!image.isEmpty()) {
                amplify.publish('/feedback/setImage', new ImageCapture(feedbackObj.title, this.getImageBlob(image.toPng()), feedbackObj.id), feedbackObj.deferred);
            } else {
                feedbackObj.deferred.resolve('Failed to Capture ', feedbackObj.title, ' Image');
                amplify.publish('/feedback/setImage', new ImageCapture(feedbackObj.title, 'Failed', feedbackObj.id), feedbackObj.deferred);
            }

        }
    };

    util.subscribe('container/imageCapture', ImageService.getScreen);

    var stateService = {
        chainPromises: function(uniqueId, promiseArray) {
            $.when
                .apply($, promiseArray)
                .pipe(function piping(containerLogResponse, sbImageSaveResponse, v2ImageSaveResponse, chatImageSaveResponse, UploadSaveResponse) {
                    /**
                     *
                     * Clearing User File uploads cached files
                     *
                     **/
                    console.log('[Feedback] chain promises pipe ');
                    util.publish('/fileUpload/clear');
                    return containerLogResponse.parentId;
                })
                .done(function success(feedbackId) {
                    util.publish('/fileUpload/clear'); //clearing userUploads once feedBAck about to sent
                    /**
                     *
                     * Collects the Feedback,Logs from frames and
                     * Images from sbContainer,v2Container
                     * Which are store in feedbackStore, imageStore, logStore
                     * and sends them.
                     *
                     **/
                    console.log('[Feedback] chain promises done ');
                    collectorService.collectForId(feedbackId);
                })
                .fail(function failed(logId, feedbackId, err) {
                    console.error('FeedbackCollector Deferred Error :', arguments);
                });
        }
    }

    var saveService = {
        save: function(storename, jsObject, successCB, failCB) {
            if (typeof jsObject == 'object') {
                localDB.getDBinstance('feedbackDB')[storename]
                    .put(jsObject)
                    .then(successCB || function() {})
                    .catch(failCB || function(err) {})
                    .finally(function() {
                        // localDB.closeDBInstance('feedbackDB');
                    });
            }
        },
        saveLogsById: function(logObj, deferred) {
            this.save('clientLogStore', logObj, function success() {
                if (deferred) {
                    deferred.resolve(logObj);
                } else {
                    iFramesLogs.stateMap.logsRecievedForAck(logObj.parentId);
                }
            }, function fail(err) {
                if (deferred) {
                    deferred.reject(err);
                }
            });
        },
        saveImagesById: function(imgObj, deferred) {
            this.save('imageStore', imgObj, function done() {
                if (deferred) {
                    deferred.resolve(imgObj);
                }
            }, function fail(err) {
                if (deferred) {
                    deferred.reject(err);
                }
            });
        },
        storeById: function(storeFbRecord) {
            this.save('feedbackStore', storeFbRecord);
        }
    };


    var queryService = {
        queryById: function(storeName, uniqueId, keyPath, successCB, failureCB, context) {
            localDB.getDBinstance('feedbackDB')[storeName]
                .where(keyPath)
                .equals(uniqueId)
                .toArray(function(arrayOfRows) {
                    successCB(context, arrayOfRows);
                })
                .catch(function(err) {
                    failureCB(context, [err]);
                })
                .finally(function() {
                    // localDB.closeDBInstance('feedbackDB');
                });
        },
        getLogById: function(uniqueId, callback, context) {
            var dfd = $.Deferred();
            this.queryById('clientLogStore', uniqueId, 'parentId', dfd.resolveWith, dfd.rejectWith, context);
            return dfd.promise();
        },
        getImageById: function(uniqueId, callback, context) {
            var dfd = $.Deferred();
            this.queryById('imageStore', uniqueId, 'parentId', dfd.resolveWith, dfd.rejectWith, context);
            return dfd.promise();
        },
        getFeedbackById: function(uniqueId, callback, context) {
            var dfd = $.Deferred();
            this.queryById('feedbackStore', uniqueId, 'id', dfd.resolveWith, dfd.rejectWith, context);
            return dfd.promise();
        }
    };

    var cleanService = {
        cleanById: function(storeName, uniqueId, keyPath, callback) {
            localDB.getDBinstance('feedbackDB')[storeName]
                .where(keyPath)
                .equals(uniqueId)
                .delete(callback || function() {})
                .catch(function(err) {
                    //err
                })
                .finally(function() {
                    // localDB.closeDBInstance('feedbackDB');
                });

        },
        cleanLogById: function(uniqueId, callback) {
            this.cleanById('clientLogStore', uniqueId, 'parentId', callback);
        },
        cleanImageById: function(uniqueId, callback) {
            this.cleanById('imageStore', uniqueId, 'parentId', callback);
        },
        cleanFeedbackById: function(uniqueId, callback) {
            this.cleanById('feedbackStore', uniqueId, 'id', callback);
        },
        clean: function(uniqueId, callback) {
            this.cleanLogById(uniqueId, callback);
            this.cleanImageById(uniqueId, callback);
            this.cleanFeedbackById(uniqueId, callback);
            collectorService.clean(uniqueId);
        },
        clientDB: function() {
            console.log('[Feedback][cleanService][clientDB]');
            try {
                var activeTab = util.tabs.getActiveTab();
                var clearLogs = new LogACK('clearLogs');
                // Delete local logs
                kDebug.clearLogs();
                // processReduction Delete webview logs.
                document.querySelector('#' + logsCollectionService.id.processReduce)
                    .send('webapp-msg', clearLogs);
                // clean active tab logs.
                if (activeTab) {
                    // TAB might be auto envicted or they might have closed it
                    // Interpreter will throw error bcoz dom is gone.
                    activeTab.send('webapp-msg', clearLogs);
                }
            } catch (e) {
                console.log('clientDB ', e.message);
                console.log('clientDB ', e.stack);
            }
        }
    };


    var collectorService = {
        isFromChatModule: null,
        token: null,
        collectForId: function(uniqueId) {

            if (!uniqueId)
                throw new Error('CollectorServiceFailure:: query ::uniqueId not valid ' + uniqueId);

            /*===============================================
            =            Promise Implementation             =
            ===============================================*/

            console.log('Collection Service :: Started :: id[' + uniqueId + ']');

            $.when(
                    queryService.getLogById(uniqueId, null, this),
                    queryService.getImageById(uniqueId, null, this),
                    queryService.getFeedbackById(uniqueId, null, this)
                )
                .pipe(function(logArray, imageArray, feedbackArray) {
                    logArray = jQuery.makeArray(logArray);
                    imageArray = jQuery.makeArray(imageArray);
                    feedbackArray = jQuery.makeArray(feedbackArray);

                    /**
                    *
                    * Series of promise implemention is carried on, 
                        - getBlobURL, in failure requeues to get the url
                        - send feedback to loopTodo
                    *
                    **/

                    var mailsubject;
                    if (this.isFromChatModule)
                        mailsubject = 'AnywhereWorks ';
                    else
                        mailsubject = 'FULLClient ';

                    mailsubject += userDAO.getUser().fullName;
                    console.log('[Feedback][collectorService] pipe ');
                    return updateCardInfoAndSend(new FeedbackFD(userDAO.getUser(), uniqueId, logArray, imageArray, feedbackArray, mailsubject));
                }.bind(this))
                .done(function(r) {
                    console.log('[Feedback][collectorService] done ');
                    console.log('Cleaning Service :: Started :: id[' + uniqueId + ']');
                    cleanService.clientDB(uniqueId);
                });

        },
        initiateUserFeedback: function(userFBObj) {
            /*==============================================
            =            Feedback Process start            =
            ==============================================*/
            /**
            *
            * Triggers, chain or series of events like,
                - collecting logs from app & childFrames
                - collect images
                - store images, logs
                - fetch and send them.
            *
            **/
            if (userFBObj) {
                if (userFBObj.isFromChatModule) {
                    this.isFromChatModule = userFBObj.isFromChatModule;
                } else {
                    this.isFromChatModule = false;
                }

                new UserFeedback(userFBObj.userFeedback);
            }
        },
        clean: function(id) {
            if (!id)
                throw new Error('CollectorServiceFailure:: clean ::uniqueId not valid ' + id);
            console.check('Cleaning Success for, data in memory for id[' + id + ']');
        }
    };


    // write Object.Observer on ackMap for send service
    var iFramesLogs = {
        originMap: { /* feedbackId:[] */ },
        tabMap: { /* tabId : feedbackId */ },

        gotTabCloseSingal: function(tabId) {
            /**
            *
            * Tab Close should resolve the promise
              immediately to avoid the deadlock,
              because promise will until it gets
              resolved or rejected.

            *
            **/
            if (tabId && this.tabMap[tabId]) {
                var feedbackId = this.tabMap[tabId];
                var dfd = this.stateMap.getDefer(feedbackId);
                /**
                *
                * 
                    TabClose should resolve the promise
                    if it is already, that will not harm,
                    but if it not resolved earlier. resolving
                    it will aid to continue the feedback send 
                    commence.
                *
                **/
                console.log('Resolving Deferred for tabId[' + tabId + ']');
                dfd ? dfd.resolve('tabclose_' + tabId) : false;
            }
        },
        stateMap: {
            setMap: function(id) {
                this[id] = {
                    total: 0,
                    received: 0,
                };
            },
            //feedbackId:{total:0,received:0}
            incrementAckTotal: function(id) {
                this[id].total++;
            },
            getDefer: function(id) {
                return this[id].defer;
            },
            logsRecievedForAck: function(id) {
                this.incrementReceived(id);
            },
            incrementReceived: function(id) {

                if (++this[id].received >= this[id].total) {
                    this.getDefer(id).resolve(id);
                }
            },
            instantiateDefer: function(id) {
                var ackDefer = $.Deferred();
                var self = this;

                setTimeout(function() {
                    console.log('Resolving feedback from timeout id[' + id + '], total = ' + self[id].total + ', recieved = ' + self[id].received);
                    ackDefer.resolve(id);
                }, 5000);

                this[id].defer = ackDefer;

                return ackDefer;
            },
        },
        sendLogCaptureSingal: function(id) {
            var tabId = util.tabs.getActiveTabId();

            this.stateMap.setMap(id);
            // BUG : Windows
            // when window is hidden we are tyring to 
            // capture the window it is unable to work
            // and halting the feedback process
            if (userDAO.getSkillByName('FullWork')) {
                logsCollectionService.getChatLogs(id);
            }
            logsCollectionService.getWebFormLogs(id);
            logsCollectionService.getV2Logs(id);
            logsCollectionService.getLogs(id);

            /**
            *
            * TODO : 
                - DeadLock might occur if, Tab is closed after successful
                ACK, because promise will wait until it will be resolved.
                in such situation, tab Keeper service should notify
                that tab is taken out/closed.

                so inturn promise could be resolved.
            *
            **/


            return this.stateMap.instantiateDefer(id);
        },
        isChildFrameExists: function(doc) {
            return doc ? doc.querySelectorAll('iframe') : [];
        },
        postMessage: function(winObject, id) {
            if (winObject) {
                // IPC sending has to enabled.
                winObject.postMessage(new LogsAck(id), '*');
                return true;
            }
        },
    };

    var logsCollectionService = {
        view: null,
        id: {
            processReduce: 'processReduce'
        },
        getView: function(id) {
            return id ? document.getElementById(id) : false;
        },
        frameTemplate: function(uniqueId) {
            return uniqueId ? new LogsAck(uniqueId) : false;
        },
        postMessage: function(webDom, uniqueId) {
            var template = this.frameTemplate(uniqueId);
            return (webDom && template) ? webDom.send('webapp-msg', template) : false;
        },
        getChatLogs: function(uniqueId) {
            var template = this.frameTemplate(uniqueId);
            return template ? FULLClient.ipc.sendToChat(template) : false //
        },
        getV2Logs: function(uniqueId) {
            var template = this.frameTemplate(uniqueId);
            return template ? FULLClient.ipc.sendToV2(template) : false //
        },
        getSynclioLogs: function(uniqueId) {
            var dom = this.getView(this.id.synclio);
            return (dom && uniqueId) ? this.postMessage(dom, uniqueId) : false
        },
        getWebFormLogs: function(uniqueId) {
            /* Collect Logs of Webforms Other than SB accounts */
            var dom = util.tabs.getActiveTab();

            if (dom) {
                var tabIndex = util.getParameterByName('currentTabIndex', dom.src);
                iFramesLogs.tabMap[tabIndex] = uniqueId;
            }

            return (dom && uniqueId && dom.src && dom.src.indexOf(FULLClient.getConfig().sb5) == -1) ?
                this.postMessage(dom, uniqueId) : false
        },
        getLogs: function(uniqueId) {
            var dom = this.getView(this.id.processReduce);
            return (dom && uniqueId) ? this.postMessage(dom, uniqueId) : false
        },
        embed: function(obj) {
            /*
             * SB logs has to be captured even with no active tabs ,
             * Fix : Hidden dummy webview with same Domain as normal SB accounts
             * added to DOM and that will be queried to getLogs from Indexed DB. 
             * same Logic applies for Getting Synclio video call Logs
             */
            var web = new WebviewProxy(obj.id, obj.url);
            web.setHidden();
            document.body.appendChild(web.getView());
            web.setContentloaded(function() {
                web.setHidden();
                util.publish('/process/reduce/embed/log/urls');
                util.publish('/maxtabcounter/checkAnalyticsTabInfo');
            });
        },
        embedLogCollector: function() {
            this.embed({
                url: "http://images.sb.a-cti.com/TC/processReduction.html",
                id: "processReduce"
            });

            /* unsentFeedback are checked */
            unsentFeedback.clear();
        }
    };

    var unsentFeedback = {
        retentionLimit: 1,
        getVersion: function(string) {
            return /([0-9]{0,}\.[0-9]{0,})/.exec(string)[0];
        },
        isSendable: function() {
            var localVersion = this.getVersion(FULLClient.getManifest().main);
            if (compareVersions(localVersion, '2.17.0') == 1) {
                return true;
            }
        },
        // TODO : Send unsent feedbacks.
        query: function() {
            console.log('[Feedback][unsentFeedback][query]');
            localDB.getDBinstance('feedbackDB')['feedbackStore']
                .reverse()
                .limit(this.retentionLimit)
                .each(function(feedbackObject) {
                    var feedbackId = feedbackObject.id;
                    // Call collector service with unqiueID
                    // NB : We have to use transaction to do these.
                    console.log('[Feedback][unsentFeedback][query][feedbackId=' + feedbackId + ']');
                    setTimeout(function() {
                        collectorService.collectForId(feedbackId);
                    }, 0);
                });
        },
        clear: function() {
            if (!this.isSendable()) {
                localDB.getDBinstance('feedbackDB')['feedbackStore']
                    .each(function(feedbackObject) {
                        var feedbackId = feedbackObject.id;
                        // Call collector service with unqiueID
                        // NB : We have to use transaction to do these.
                        console.log('[Feedback][unsentFeedback][clear][feedbackId=' + feedbackId + ']');
                        setTimeout(function() {
                            cleanService.clean(feedbackId);
                        }, 0);
                    })
                    .finally(function clearFinal() {
                        console.log('[Feedback][unsentFeedback][clear][finally method called]');
                    });
            } else {
                console.log('[Feedback][unsentFeedback][clear][query to send unsent feedbacks]');
                unsentFeedback.query();
            }
        }
    };

    function sendFeedback(uploadInfo) {
        var title = uploadInfo.FormData.get('card_title').substring(0,10);
        var analyticsInfo = title + ' ' + FULLClient.getMode() + ' ' + FULLClient.getManifest().version;
        console.log('[Feedback][sendFeedback][uniqueId = [' + uploadInfo.uniqueId + '] = '+title+']');
        return $.ajax({
                url: uploadInfo.url,
                type: 'POST',
                processData: false,
                contentType: false,
                enctype: 'multipart/form-data',
                data: uploadInfo.FormData,
                headers: {
                    Authorization: 'Bearer ' + (collectorService.token || userDAO.getAccessToken())
                }
            })
            .done(function(r) {
                console.log('[Feedback][sendFeedback][success][uniqueId = [' + uploadInfo.uniqueId + '] = '+title+']');
                util.analytics.push(null, analytics.FEEDBACK_SUCCESS, analyticsInfo, 'Feedback sent');
                cleanService.clean(uploadInfo.uniqueId);
                return "sent";
            })
            .fail(function(r) {
                // Recursion Until Sent successfully
                // TODO : We need to specify Time Limit to trigger
                console.debug('[Feedback][sendFeedback][failed][uniqueId = [' + uploadInfo.uniqueId + '] = '+title+']');
                util.analytics.push(null, analytics.FEEDBACK_FAILED, analyticsInfo, 'Feedback failed');
                setTimeout(sendFeedback, 300000, uploadInfo);
                return "re-sending";
            });
    }

    function updateCardInfoAndSend(feedbackObj) {
        if (!/AnywhereWorks/i.test(feedbackObj['for'])) {
            console.log('[Feedback][updateCardInfoAndSend] Chat Feedback ');
            feedbackObj.form_data.append("dept_id", FULLClient.getConfig().dcmApi.dept_id);
            feedbackObj.form_data.append("dept", FULLClient.getConfig().dcmApi.dept);
            feedbackObj.form_data.append("task_type", FULLClient.getConfig().dcmApi.task_type);
            feedbackObj.form_data.append("brand_id", FULLClient.getConfig().dcmApi.brand_id);
        };

        return sendFeedback({
            'url': FULLClient.getConfig().feedback.chat,
            'FormData': feedbackObj.form_data,
            'uniqueId': feedbackObj.id
        });
    }

    util.subscribe('/feedback/setImage', UserFeedback.prototype, function(imgObj, deferred) {
        saveService.saveImagesById(imgObj, deferred);
    });


    //Logs Will Come from Other systems.
    util.subscribe('/feedback/setLogs', UserFeedback.prototype, function(logsObj) {
        console.check('LogsRecieved[' + logsObj.host + '] = ' + logsObj.parentId);
        saveService.saveLogsById(logsObj);
    });

    util.subscribe('/feedback/gotACK', UserFeedback.prototype, function(logsObj) {
        console.check('ACK[' + logsObj.host + '] = ' + logsObj.id);
        iFramesLogs.stateMap.incrementAckTotal(logsObj.id);
    });

    util.subscribe('/feedback/initiate', collectorService, collectorService.initiateUserFeedback);
    util.subscribe('/tabkeeper/close', iFramesLogs, iFramesLogs.gotTabCloseSingal);
    util.subscribe('module/controller/onload', logsCollectionService, logsCollectionService.embedLogCollector);

}(this, util));