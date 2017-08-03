/**
 *
 * Input/TextArea Events preventing key commands on
 * cmd+q, cmd+w, cmd+r
 *
 **/
//var WindowManager=require('../assets/js/background/windowManager.js')(util);
var utils=require('../assets/js/background/mainUtils.js');
console.log('In options :'+util);
$('input:text,textarea').keydown(function(e) {
    switch (e.keyCode) {
        case 81:
        case 82:
        case 87:
            {
                // cmd + q , cmd + r , cmd + w in order.
                if (e.metaKey || e.ctrlKey) {
                    console.log(' cmd + w');
                    util.preventEvent(e);
                }
                break;
            }
    }
});

$('textarea').add('input:text[name="fetchVal"]').keydown(function(e) {
    switch (e.keyCode) {
        case 13:
            {
                util.publish('/fetch/load',e);
                break;
            }
        case 27:
            {
                if (e.currentTarget.name == "fetchVal")
                    util.publish('/fetch/hide/gui');
                else
                    util.publish('/feedback/closeFeedback');

                break;
            }
    }
});

// hiding chat option and divider in settings depends upon skill.
if (!(userDAO.getSkillByName('FullWork') || userDAO.getSkillByName('CEA'))) {
    $('#_chat')
        .hide()
        .next().hide();
}

/*
 * V2 window is shown back
 */
$('#v2_Phone').click(function() {
    console.log('Click event :'+namespace.CONTAINER_V2);
    
    util.publish('/util/window/events/show', namespace.CONTAINER_V2);
    //WindowManager.openV2Container(true);
});


// Show options List when preferences is clicked.
$('.option-list #preferences').click(function(event) {
    var target = $(event.currentTarget);
    target.hasClass('open') ? target.removeClass('open') : target.addClass('open').siblings().removeClass('open');
    if ($('header.main-header figure').hasClass('open'))
        $('header.main-header figure').removeClass('open');
});

/*
 * Chat window is shown back
 */
$('#_chat').click(function() {
    util.publish('/util/window/events/show', namespace.CONTAINER_CHAT);
});

$('.option-list #preferences ul').click(function(event) {
    if (event.target.innerHTML && event.target.nodeName.toString() === 'LI') {
        switch (event.target.innerText.trim()) {
            case 'Fetch':
                {
                    util.publish('/fetch/display/gui');
                    break;
                }
            case 'Re-Fetch Recent':
                {
                    util.analytics.push(null, analytics.REFETCH_RECENT_CLICKED,FULLClient.getMode() + ' ' + FULLClient.getManifest().version + ' ' + process.platform,'User clicking on Refetch Recent.');
                    util.publish('/refetch/recent');
                    break;
                }
            case 'LoopToDo':
                {
                    util.loadURL('http://my.loopto.do/?'); // change async
                    break;
                }
            case 'Back up form':
                {
                    util.analytics.push(null, analytics.BACKUP_FORM, null, 'Agent using backup form');
                    util.loadURL('https://docs.google.com/a/a-cti.com/spreadsheet/viewform?usp=drive_web&formkey=cHZHQnhWZDYwbHhXQjZseHhZM0dKWnc6MA#gid=17');
                    break;
                }
            case 'Feedback':
                {
                    util.analytics.push(null, analytics.FEEDBACK_CLICKED,FULLClient.getMode() + ' ' + FULLClient.getManifest().version + ' ' + process.platform,'User clicking on Feedback');
                    util.publish('/feedback/display/gui');
                    break;
                }
            case 'Team FULL Creative':
                {
                    util.analytics.push(null, analytics.FULLCREATIVE_PAGE, null, 'User Loaded Team FullCreative page');
                    util.loadURL('https://sites.google.com/a/a-cti.com/redone-team-vc/home/');
                    break;
                }
            case 'Reload V2':
                {
                    // util.notification.create({
                    //     title: 'V2 Window',
                    //     body: 'Restoring state'
                    // });

                    // util.publish('/softphone/softPhoneStop');

                    // FULLClient.ipc.send({
                    //     "eType": "reloadV2",
                    //     "name": "reloadV2"
                    // });

                    // util.publish('/clear/status/timer');
                    // util.analytics.push(null, analytics.RELOAD_V2, null, 'v2Container getting Reloaded');

                    // get confirmation.
                    util.publish('/v2/logout/confirmation','Are you sure, you want to reload?');
                    break;
                }
            case 'Clear Cache':
                {
                    event.stopImmediatePropagation();
                    if (!util.clear.isCleared) {
                        $(event.target)
                            .addClass('hover_remove')
                            .children('i')
                            .addClass('show');
                        util.analytics.push(null, analytics.APP_CLEAR_CACHE, null, 'Clearing Cache for App from SB Window');
                        util.publish('/softphone/softPhoneStop');
                        util.publish('/util/menu/disableAll/onClearCache');
                        // clear's the cache and sends info
                        // to chat frame to embed login page.
                        util.clear();
                        
                    }
                    break;
                }
            case 'Exit':
                {
                    /* 
                     * Flag to differentaite dock icon quit from
                     * window's X-Btn ,ie., this flag will be enabled
                     * whenever ther is a request for app quit from
                     * any window and disabled with dock icon quit request
                     */
                    FULLClient["canQuit"] = true;
                    util.publish('/app/quit/popup');
                    break;
                }
            case 'Quit':
                {
                    /* 
                     * Flag to differentaite dock icon quit from
                     * window's X-Btn ,ie., this flag will be enabled
                     * whenever ther is a request for app quit from
                     * any window and disabled with dock icon quit request
                     */
                    FULLClient["canQuit"] = true;
                    util.publish('/app/quit/popup');
                    break;
                }
            case 'Chats':
                {
                    util.analytics.push(null, analytics.CHAT_ICON_CLICKED,FULLClient.getMode() + ' ' + FULLClient.getManifest().version + ' ' + process.platform,'User clicking on Chat icon');
                    break;
                }
            case 'Network Strength':
                {
                    util.analytics.push(null, analytics.NETWORK_STRENGTH_CLICKED,FULLClient.getMode() + ' ' + FULLClient.getManifest().version + ' ' + process.platform,'User clicking on Network strength indicator');
                    break;
                }
            default:
                {
                    console.error("Some Funny sequence in settings tab capture it :: " + event.target.innerHTML.trim());
                    break;
                }
        }
    }
});

(function(util) {
    var fileUpload = {
        fileList: [], // List of all images
        getImage: function(fileListObj) {
            if (fileListObj && fileListObj.length) {
                for (var i = 0; i < fileListObj.length; i++) {
                    var file = fileListObj[i];
                    if (file.size < 1024 * 1024 * 10) {
                        //allow files only with size less than 10MB
                        this.conversion(file.name, file.size);
                        this.fileList.push(file);
                    } else {
                        // alert to the user bt not support in webview
                        alert("Maximum File Size limit is 10MB !!");
                    }
                }

                this.clearInputHolder();
            }
        },
        extractFileName: function(txt) {
            var fileName = txt.trim().replace(" ", "").split(".")[0];
            return fileName;
        },
        picReader: function(feedbackObj) {
            try {
                if (feedbackObj && this.fileList && this.fileList.length) {
                    var count = 0;
                    for (var i = 0; i < this.fileList.length; i++) {
                        count = count + 1;
                        var file = this.fileList[i];
                        util.publish('/feedback/setImage', new ImageCapture(file.name || 'UserUpload', this.getImageBlob(file), feedbackObj.id), false);
                        if (count == this.fileList.length) feedbackObj.deferred.resolve('Files are stored in DB');

                    }
                } else {
                    console.debug('No Manual attachment files to upload');
                    feedbackObj.deferred.resolve("NoFileToUpload");
                }
            } catch (e) {
                feedbackObj.deferred.resolve("failed : " + e.message);
                console.error('UserFileUpload Failed :', e.message);
                console.error('UserFileUpload Failed :', e.stack);
            }
        },
        getImageBlob: function(file) {
            console.log('file type:', file.type);
            var _blob = new Blob([file], {
                type: file.type ? file.type : ''
            });
            return _blob;
        },
        KMGTbytes: function(num) {
            //convert bytes into equivalent higher units as KB, MB
            var unit, units = ["TB", "GB", "MB", "KB", "Bytes"];
            for (unit = units.pop(); units.length && num >= 1024; unit = units.pop()) {
                num /= 1024;
            }
            return [num, unit];
        },
        conversion: function(fname, fsize) {
            var fileName = fname;
            var sizeArray = this.KMGTbytes(fsize);
            var fileSize = Math.floor(sizeArray[0]);
            var unit = sizeArray[1];
            this._deleteFileByName(fileName.trim());
            this.attachTemplate(fileName, fileSize, unit);
        },
        attachTemplate: function(fname, fsize, unit) {
            /* Injection of Attachements dynamically in UI on file upload*/
            var str = '<li>' +
                '<span class="attachname">' + fname + '</span>' +
                '<span>(' + fsize + unit + ')</span>' +
                '<a class="clearattach">&times;</a>' +
                '</li>';
            $('.attach_list').append(str);
        },
        _deleteFileByName: function(currentFileName) {
            if (currentFileName) {
                // console.warn('currentFileName : ',currentFileName);
                for (var i = 0; i < this.fileList.length; i++) {
                    var filename = this.fileList[i].name;
                    // console.warn('filename['+i+'] : ',filename);
                    if (filename == currentFileName) {
                        this.fileList.splice(i, 1);
                        $('.attachname:contains("' + currentFileName + '")').filter(function() {
                            var spanDOM = $(this);
                            if (currentFileName == spanDOM.text()) {
                                // console.warn('remove : ',spanDOM.text());
                                spanDOM
                                    .parent() // li Dom
                                    .remove() // removing Attachment.
                            }
                        });
                    }
                }
            }
        },
        xButton: function(target) {
            /* 
             * clearing Attachments on
             * X-btn click in UI
             * as well deallocatiing its memory.
             */
            if (target) {
                var _t = $(target);
                this._deleteFileByName(_t.siblings('.attachname').text());
                _t.parent().remove();
            }
        },
        clearFileList: function() {
            /* Empty entire fileList when Feedback is cancelled */
            this.clearUI();
            this.clearCachedList();
            this.clearInputHolder();
        },
        clearInputHolder: function() {
            $('#fileUpload').val('');
        },
        clearUI: function() {
            $('.attach_list').empty();
        },
        clearCachedList: function() {
            this.fileList = [];
        },
        fileUploadDFD: function(feedbackObj) {
            if (feedbackObj)
                this.picReader(feedbackObj)
        },
        setListeners: function() {
            $('#agentFb .popup-body').on('change', '#fileUpload', function(event) {
                util.publish('/fileUpload/get/inputImage', event.target.files);
            });

            $('#agentFb .popup-body').on('keydown', '.attach', function(e) {
                switch (e.keyCode) {
                    case 13:
                        {
                            $('#agentFb .popup-body #fileUpload').trigger('click');
                            break;
                        }
                    case 27:
                        {
                            util.publish('/feedback/UI/hide');
                            break;
                        }
                }
            });

            $('#agentFb').on('keydown', function(e) {
                if (e.keyCode == 27) {
                    util.publish('/feedback/UI/hide');
                }
            });

            //Listeners to clear user uploads in Feedback
            $('#agentFb .popup-body').on('click', '.clearattach', function(evt) {
                util.publish('/fileUpload/xbutton', this);
            });
        },
        init: function() {
            /* Dynamic Injection of File upload UI in Feedback onLoad */
            var str = '<div class="attach_hold">' +
                '<ul class="attach_list"></ul>' +
                '<div class="btn-holder">' +
                '<a href="#" class = "attach" tabindex="2">Attach your file</a>' +
                '<input id="fileUpload" type="file" accept="image/*,text/plain,text/richtext,text/rtf," multiple/>' +
                '</div>' +
                '</div>';
            $('#agentFb .popup-body').append(str);
            this.setListeners();
        }
    };

    var fetch = {
        "element": $('#fetch'),
        "goFetch": $('#fetch').find('#gofetch'),
        "valElement": $('#fetch').find('input'),
        "close": $('#fetch').find('.close_pref'),
        "transparentBg" : $('.black-screen'),
        trigger: function() {
            this.element.show();
            this.transparentBg.show();
            this.valElement.focus();
        },
        hide: function() {
            this.element
                .hide()
                .find('input')
                .val('');
            this.transparentBg.hide();
        },
        enterKeyPress : function(event){
            if(event && event.target && event.target.placeholder && event.target.placeholder == "Account no/Conn Id"){
                // validate the key press belongs to Fetch Text area 
                console.log('validation pass')
              this.loadAccount();
            }
        },
        loadAccount: function() {
            this.validate();
            this.hide();
        },
        setRecentRefetch: function(url) {
            url ? util.storage.set('recentRefetch', url) : false;
        },
        getRecentRefetch: function() {
            var url = util.storage.get('recentRefetch');
            if (url) {
                return url.replace(/(calltype=)[a-zA-Z]+[&]/, 'calltype=fetch&recentRefetch=true&');
            }
        },
        validate: function() {
            /**
             * Account Number Routine
             * connectionId Routine
             */
            // if (util.isUrl(fetch.valElement.val().trim())) {
            //     var url = fetch.valElement.val() + '/?';
            //     util.loadURL(url);
            //     return url;
            // } else {
            //     var fetchAccount = this.createUrl(fetch.valElement.val().trim());
            //     if (util.isUrl(fetchAccount)) {
            //         util.loadURL(fetchAccount);
            //         return fetchAccount;
            //     }
            // }
            var dataTrimmed = this.valElement.val().trim();
            var lUrl = this.isUrl(dataTrimmed) || this.accountURL(dataTrimmed) || this.connIDUrl(dataTrimmed);
            this.setRecentRefetch(lUrl);
            util.loadURL(lUrl);
            // console.debug("Fetching:", lUrl);
            // Pushing FETCH to FullAnalytics
            var params = util.getParameters(lUrl);
            util.analytics.push(params['accountNumber'] || params['acctNum'], analytics.FETCH, params['connId'] || params['connid'], lUrl)
        },
        isUrl: function(url) {
            if (util.isUrl(url))
                return url;
        },
        accountURL: function(accno) {
            // remove special characters
            // /[^\w]/
            // Check alphabets are there, if present fall back
            // /[a-zA-Z]/
            // get all numbers
            // /[\d]*/
            if (accno) {
                accno = accno.replace(/[^\w]/g, '');
                accno = /[a-zA-Z]/.test(accno) ? accno.replace(/[\d]/g, '') : accno.replace(/[^\d]/g, '');
            }

            if (util.isNumber(accno)) {
                return FULLClient.getConfig().sb5 + '/InitialAccountAction/getAccountInfo.do?accountNumber=' + accno + '&userpin=&calltype=fetch&useDNISMap=true&fetch=true&agentLogin=' + util.user.getEmail();
            }
        },
        connIDUrl: function(connId) {
            // return FULLClient.getConfig().sb + '/ActiveResponseAction/InitializeAccount.do?acctNum=&userpin=&calltype=fetch&useDNISMap=true&nativeFetch=true&connId=' + connId + '&userName=&billing=true';
            if (connId)
                return FULLClient.getConfig().sb5 + '/InitialAccountAction/getAccountInfo.do?calltype=epCustom&connId=' + connId + '&agentLogin=' + util.user.getEmail() + '&isAgentResearch=true';
        },
        refetch: function() {
            util.loadURL(this.getRecentRefetch());
        },
        init: function() {
            // close button UI
            this.close
                .click($.proxy(this.hide, this));

            this.goFetch
                .click($.proxy(this.loadAccount, this));
        }
    }

    var feedback = {
        element: $("#agentFb"),
        transparentBg : $(".black-screen"),
        close: $("#agentFb").find(".close_pref"),
        feedbackText: $("#agentFb").find("textarea"),
        sendFeedback: $("#agentFb").find("#sendFdb"),
        isNotCached: false,
        setCharCount: function() {
            $('#agentFb .fetch-con').prepend('<span class="character_count">Characters remaining: 500</span>');
            $('#agentFb .fetch-con').prepend('<span class="error-text">Please give a valid feedback</span>');
        },
        sendFeedBack: function(event) {
            util.doNotBubble(event);
            if (this.feedbackText.val() && this.validateFeedback(this.feedbackText.val())) {
                this.hide();
                setTimeout($.proxy(function() {
                    this.pushFeedback();
                }, this), 2e3);
            } else {
                $('.fetch-con').find('textarea').addClass('error');
                $('.error-text').addClass('error-text').show();
                $('.error-text').addClass('error').show();
            }
        },
        textArea_onKeyPress: function(evt) {
            util.doNotBubble(evt);
            if (this.value.length) {
                $('.fetch-con').find('textarea').removeClass('error');
                $('.error-text').addClass('error-text').hide();
                $('.error-text').addClass('error').hide();

                if (this.value.length <= 500)
                    $('.character_count').removeClass('count_less');
                else {
                    $('.character_count').addClass('count_less');
                    this.value = this.value.substring(0, 497) + '...';
                    return false;
                }
            }
            $('.character_count').text("Characters remaining : " + (500 - this.value.length));
        },
        display: function() {
            this.element.show();
            this.transparentBg.show();
            this.feedbackText.focus();
        },
        hide: function(event) {
            util.doNotBubble(event)
            this.feedbackText.blur();
            this.transparentBg.hide();
            this.element.hide();
            util.publish('/fileUpload/clearUI');
            return true;
        },
        clear: function() {
            this.feedbackText.val("");
        },
        validateFeedback: function(feedbackText) {
            return (feedbackText && feedbackText.trim() ? true : false);
        },
        pushFeedback: function() {
            if (this.feedbackText.val()) {
                $('.character_count').text("Characters remaining : 500");
                util.publish('/feedback/initiate', {
                    userFeedback: this.feedbackText.val()
                });
            }
            this.clear();
        },
        closeFeedback: function() {
            this.hide();
            util.publish('/fileUpload/clear');
        },
        init: function() {
            this.setCharCount();
            this.sendFeedback.click($.proxy(this.sendFeedBack, this));
            this.feedbackText.on('change keyup paste keypress', this.textArea_onKeyPress);
            this.close.click(
                $.proxy(this.closeFeedback, this)
            );

        }

    }

    util.subscribe('/fileUpload/get/inputImage', fileUpload, fileUpload.getImage);
    util.subscribe('/fileUpload/clear', fileUpload, fileUpload.clearFileList);
    util.subscribe('/fileUpload/clearUI', fileUpload, fileUpload.clearUI);
    util.subscribe('/fileUpload/image/read', fileUpload, fileUpload.picReader);
    util.subscribe('/fileUpload/xbutton', fileUpload, fileUpload.xButton);
    util.subscribe('/fileUpload/user/uploads/capture', fileUpload, fileUpload.fileUploadDFD);
    util.subscribe('module/controller/onload', fileUpload, fileUpload.init);

    /* Fetch */
    util.subscribe('/fetch/display/gui', fetch, fetch.trigger);
    util.subscribe('/fetch/load', fetch, fetch.enterKeyPress);
    util.subscribe('/fetch/hide/gui', fetch, fetch.hide);
    util.subscribe('/fetch/save/recentURL', fetch, fetch.setRecentRefetch);

    util.subscribe('/refetch/recent', fetch, fetch.refetch);

    // hide feedback & zoom in options
    util.subscribe('module/controller/onload', fetch, fetch.init);

    // Feedback Codes
    util.subscribe('module/controller/onload', feedback, feedback.init);
    util.subscribe('/feedback/UI/hide', feedback, feedback.hide);
    util.subscribe('/feedback/display/gui', feedback, feedback.display);

    /**
     * Previously, when we hit clear cache
     * all windows will close and it will route
     * and wait in chat page for login window 
     * to show up, but scheme is changed to clear cache in
     * SB-container and then remove windows to match
     * UI design.
     */
    util.subscribe('/app/cookies/cleared', function() {
        FULLClient.ipc.sendToChat({
            "name": "wipedata"
        });
    });
})(util)