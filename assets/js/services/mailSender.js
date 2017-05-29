(function($, util) {
    try {
        var mailhelper = {
            mailSend: function(data, callback) {
                console.log("Pushing Mail to Dev" + JSON.stringify(data));
                return $.ajax({
                    url: 'http://beta.sb.a-cti.com/InitialAccountAction/sendFailureNotification.do',
                    type: 'POST',
                    data: {
                        acctNum: '',
                        subject: data.subject || 'Default Subject line from @' + userDAO.getEmail(),
                        bodyOfMail: this.generateEMailHTML(data),
                        mailAddress: 'dev.sb@a-cti.com'
                    }
                }).pipe(function doneFilter() {
                    console.warn('mail sent successfully : ', data);
                    if(callback) callback();
                }, function failFilter() {
                    if(callback) callback();
                    console.warn('mailsender failed : ', data);
                    if (this.isTabClose(data)) {
                        console.warn('Resending mail Tab-Xclose info after 10 secs ..', data);
                        setTimeout(function(){
                            console.log('this :',this)
                            this.mailSend.call(this,data,callback);
                        }.bind(this),10000 );
                    }
                }.bind(this));
            },
            isTabClose: function(data) {
                if (data.type == 'tab-XClose') return true;
            },
            isErrMail: function(data) {
                if (data.type == 'Error Log') return true;
            },
            generateEMailHTML: function(data) {
                var logsHTML = "";
                logsHTML += "<html>";
                logsHTML += "<head>";
                if (this.isTabClose(data)) {
                    if (userDAO.getUser())
                        logsHTML += 'UserInfo : ( UserName : ' + userDAO.getUser().fullname + ', Email : ' + userDAO.getUser().email + ' )' + '<br>';
                    logsHTML += '<p>Tab source url : ' + data.tabInfo.originalSrcUrl + '</p>';
                    logsHTML += '<p>Last tab location : ' + data.tabInfo.currentTabLocation + '</p>';
                    logsHTML += '<p>Tab X-Close Reason : ' + data.xCloseReason + '</p>';
                } else if (this.isErrMail(data)) {
                    logsHTML += "<title>Error Log -" + new Date + "</title>";
                    logsHTML += this.getElectronTemplate();
                    logsHTML += 'Date : ' + new Date() + "<br>";
                    logsHTML += "</div>";
                    logsHTML += "<p>" + data.err.message + "</p>";
                    logsHTML += "<p>" + data.err.stack + "</p>";
                }
                logsHTML += "</body>";
                logsHTML += "</html>";
                return logsHTML;
            },
            getElectronTemplate: function() {
                var elecTemp = '';
                if (!/Electron/.test(navigator.userAgent) || /Tc-webkit/.test(navigator.userAgent))
                    return elecTemp;
                elecTemp += 'Error Log - ' + new Date + '<br>';
                elecTemp += 'Version : ' + (userDAO.getUser() ? 'App - ' + FULLClient.manifest.version + ' ( UserName : ' + userDAO.getUser().fullname + ', Email : ' + userDAO.getUser().email + ' )' : FULLClient.manifest.version) + '<br>';
                elecTemp += 'Engine Version : ' + process.versions['electron'] || process.versions['node-webkit'] + '<br>';
                elecTemp += 'Mode : ' + FULLClient.getMode() + '<br>';
                elecTemp += 'User : ' + process.env.USER + '<br>';
                elecTemp += '<p>Config : ' + JSON.stringify(FULLClient.getConfig()) + '</p><br>';

                return elecTemp;
            }
        };
    } catch (mailhelperSystem) {

        console.error("Exception While updating, zipUpdation.js", mailhelperSystem);
        console.error("Exception While updating, zipUpdation.js", mailhelperSystem.stack);
    }


    util.subscribe('/mailHelper/mailsend', mailhelper, mailhelper.mailSend);

})(jQuery, util);
