     let darwinMenuList = [{
        label: "Application",
        submenu: [{
            label: "About Application",
            selector: "orderFrontStandardAboutPanel:"
        }, {
            type: "separator"
        }, {
            label: "Check for Updates...",
            click: function() {
                menuActions.checkForUpdates();
            }
        }, {
            label: "Hide AnyWhereWorks",
            role: "hide"
        }, {
            label: "Hide Others",
            role: "hideothers"
        }, {
            label: "Show All",
            role: "unhide"
        }, {
            type: "separator"
        }, {
            label: "Quit",
            click: function() {
                app.quit();
            },
            accelerator: "Command+Q"
        }]
    }, {
        label: "Edit",
        submenu: [{
            label: "Undo",
            accelerator: "CmdOrCtrl+Z",
            selector: "undo:"
        }, {
            label: "Redo",
            accelerator: "Shift+CmdOrCtrl+Z",
            selector: "redo:"
        }, {
            type: "separator"
        }, {
            label: "Cut",
            accelerator: "CmdOrCtrl+X",
            selector: "cut:"
        }, {
            label: "Copy",
            accelerator: "CmdOrCtrl+C",
            selector: "copy:"
        }, {
            label: "Paste",
            accelerator: "CmdOrCtrl+V",
            selector: "paste:"
        }, {
            label: "Select All",
            accelerator: "CmdOrCtrl+A",
            selector: "selectAll:"
        }]
    }, {
        label: "View",
        submenu: [{
            label: "Zoom In",
            accelerator: "Command+Plus",
            click: function(item, focusedWindow) {
                                                menuActions.zoomIn(focusedWindow);
            }
        }, {
            label: "Zoom Out",
            accelerator: "Command+-",
            click: function(item, focusedWindow) {
                                menuActions.zoomOut(focusedWindow);
            }
        }, {
            label: "Actual Size",
            accelerator: "Command+o",
            click: function(item, focusedWindow) {
                menuActions.resetZoom(focusedWindow);
            }
        }]
    }, {
        label: "Window",
        role: 'window',
        submenu: [{
            label: "Minimize",
            role: "minimize"
        }, {
            label: "Zoom",
            role: "zoom"
        }, {
            label: "Close",
            role: "close"
        }, {
            label: 'Bring All to Front',
            role: 'front'
        }]
    }, {
        label: "Help",
        submenu: [{
            label: "Report Issue",
            click: function(event) {
                menuActions.sendSignalToChat(event);
                // Emitter.emit('ReportIssue', event);
            }
        }, {
            label: "Reset App Data",
            click: function() {
                menuActions.clearCache();
                // Emitter.emit('clearCache');
            }
        }]
    }];
    module.exports = darwinMenuList;
let menuActions = require('./menuActions');
