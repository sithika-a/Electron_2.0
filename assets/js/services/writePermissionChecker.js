;
(function(R, M) {
    var fs = require('fs');
    var child = require('child_process').exec;
    var writePermissionChecker = {
        dom: {
            updateFailedPopup: $('#updateFailedPopup'),
            close: $('#updateFailedPopup').find('.btnLightblue'),
            background: $('.transparentBg')
        },
        _canStart: function() { // duplicating this func. May be we can add this func in util. 
            return (userDAO.getSkillByName('FullWork') && util.window.getName() == 'AnyWhereWorks') ||
                (!userDAO.getSkillByName('FullWork') && util.window.getName() == 'FULL')
        },
        checkUserWritePermissionAndStart: function(permissionCB) {
            if (!this._canStart())
                return false;
            if (/darwin/.test(process.platform)) {
                //this.getLoggedUserName(); // getting username and caching. 
                fs.access(FULLClient.getFilePath(), fs.W_OK, function(err, stdin, stdout) {
                    if (err) {
                        console.log("User dont have permission to Install files. Please Contact IT.!", err);
                        this.showPermissionDeniedPopUp(); // showing permission denied popup. 
                        permissionCB.call(this, false);
                    } else {
                        console.log("User have Permission to write file, going forward with engine Updation.");
                        permissionCB.call(this, true);
                    }

                }.bind(this));
            } else {
                // windows block
                child('cls -oq', function(err) {
                    if (err) {
                        console.warn("Error:::", err);
                        console.log("User dont have permission to Install files. Please Contact IT.!", err);
                        this.showPermissionDeniedPopUp(); 
                        permissionCB.call(this, false);
                    } else {
                        permissionCB.call(this, true);
                    }
                });

            }

        },
        cachePopupDom: function() {
            this.addListernerForPermissionPopUpButton();
        },
        hidePopUp: function() {
            this.dom.updateFailedPopup.hide();
        },
        showPopUp: function() {
            this.dom.updateFailedPopup.show();
        },
        showBackground: function() {
            this.dom.background.show();
        },
        hideBackground: function() {
            this.dom.background.hide();
        },
        addListernerForPermissionPopUpButton: function() {
            if (this.dom.updateFailedPopup && this.dom.close) {
                this.dom.close.click(function() {
                    console.log("User closing Permission Popup..!");
                    this.hideBackground();
                    this.hidePopUp();
                }.bind(this));
            }
        },
        showPermissionDeniedPopUp: function() {
            this.showBackground();
            this.showPopUp();
        },
        hidePermissionDeniedPopUp: function() {
            this.hideBackground();
            this.hidePopUp();
        }
    };
    module.exports = writePermissionChecker;
    R['writePermissionChecker'] = writePermissionChecker;
    M.subscribe('/start/checkUserWritePermissionAndStart/', writePermissionChecker, writePermissionChecker.checkUserWritePermissionAndStart);
    M.subscribe('module/controller/onload', writePermissionChecker, writePermissionChecker.cachePopupDom);
    //M.subscribe('/start/writerPermissionChecker/', writePermissionChecker, writePermissionChecker.checkDomAvailiablity);
})(this, util);