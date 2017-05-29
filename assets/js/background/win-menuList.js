var winMenuList = [{
    label: "Application",
    submenu: [{
        label: "About Application"
    }, {
        type: "separator"
    }, {
        label: "Check for Updates...",
         click: function() {
            menuActions.checkForUpdates();
        }
    }, {
        label: "Hide AnyWhereWorks",
        accelerator: "Command+H",
        role: "hide"
    }, {
        label: "Hide Others",
        accelerator: "Option+Command+H",
        role: "hideothers"
    }, {
        label: "Show All",
        role: "unhide"
    }, {
        type: "separator"
    }, {
        label: "Quit",
        accelerator: "Command+Q",
        click: function() {
            app.quit();
        }
    }]
}, {
    label: "Edit",
    submenu: [{
        label: "Undo",
        accelerator: "CmdOrCtrl+Z",
        selector: "undo"
    }, {
        label: "Redo",
        accelerator: "Shift+CmdOrCtrl+Z",
        selector: "redo"
    }, {
        type: "separator"
    }, {
        label: "Cut",
        accelerator: "CmdOrCtrl+X",
        selector: "cut"
    }, {
        label: "Copy",
        accelerator: "CmdOrCtrl+C",
        selector: "copy"
    }, {
        label: "Paste",
        accelerator: "CmdOrCtrl+V",
        selector: "paste"
    }, {
        label: "Select All",
        accelerator: "CmdOrCtrl+A",
        selector: "selectAll"
    }]
}, {
    label: "View",
    submenu: [
      {
        label: "Zoom In",
        // accelerator: "Command+Plus",
        click: function(item, focusedWindow) {
            console.log('zoom in');
            menuActions.zoomIn(focusedWindow);
        }
    }, {
        label: "Zoom Out",
        // accelerator: "Command+-",
        click: function(item, focusedWindow) {
            menuActions.zoomOut(focusedWindow);
        }
    },
    {
        label: "Actual Size",
        // accelerator: "Command+o",
        click: function(item, focusedWindow) {
            console.log('actual size');
            menuActions.resetZoom(focusedWindow);
        }
    }]
}, {
    label: "Window",
    role: 'window',
    submenu: [{
        label: "Minimize",
        accelerator: "CmdOrCtrl+Z",
        role: "minimize"
    }, {
        label: "Zoom",
        accelerator: "Shift+CmdOrCtrl+Z",
        role: "zoom"
    }, {
        label: "Close",
        accelerator: "Shift+CmdOrCtrl+Z",
        role: "close"
    },
     {
      label: 'Bring All to Front',
      role: 'front'
    }]
}, {
    label: "Help",
    submenu: [{
        label: "Report Issue",
        click: function(event) {
            menuActions.sendSignalToChat(event);
        }
    }, {
        label: "Reset App Data",
        click: function() {
            menuActions.clearCache();
        }
    }]
}];