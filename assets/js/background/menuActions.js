 var container = require(path.join(process.cwd(),`assets/js/background/windowAccess.js`))

 var menuActions = {
     menu: null,
     template: null,
     isMac: function() {
         return /^darwin/.test(process.platform)
     },
     setNativeMenu: function() {
         this.menu = require('electron').Menu;
         if (this.isMac()) {
             this.setNativeMenuForMac(darwinMenuList);
             this.attachListener();
         } else {
             // this.setNativeMenuForWin(winMenuList)
         }
     },
     setNativeMenuForMac: function(template) {
         if (template) {
             this.template = this.menu.buildFromTemplate(template);
             this.menu.setApplicationMenu(this.template);
         }
     },
     setNativeMenuForWin: function(template) {
         console.log('setting native menu for windows..', container.get(namespace.CONTAINER_CHAT))
         console.log('is fn available ? ', container.get(namespace.CONTAINER_CHAT).setMenu)
         container.get(namespace.CONTAINER_CHAT).setMenu(new this.menu(this.template))
     },
     sendSignalToChat: function(_event) {
         var msg = new Thinclient('menu');
         msg[msg.opt].metainfo.menu = 'Help';
         msg[msg.opt].metainfo.menuitem = _event.label;
         this.contactRenderer(namespace.CONTAINER_CHAT_ALIAS, msg)
     },
     getTarget: function(ref) {
         /*
          * Identifying Focussed window name from url of window
          * since both FULL and Chat window have same name as 
          * AnywhereWorks in main process..
          */
         var winTitleList = [namespace.CONTAINER_CHAT, namespace.CONTAINER_SB];
         var targetArray = [namespace.CONTAINER_CHAT_ALIAS, namespace.CONTAINER_SB];
         for (var i = targetArray.length - 1; i >= 0; i--) {
             if (ref.getURL().indexOf(winTitleList[i] + '.html') !== -1) {
                 return targetArray[i];
             }
         };
     },
     contactRenderer: function(containerTitle, message) {
         if (containerTitle && message) {
             ipcController.passInfo(containerTitle, message);
         }
     },
     checkForUpdates: function() {
         this.contactRenderer('Chat', new Application('checkForUpdates'))
     },
     enableZoomIn: function() {
         this.template.items[2].submenu.items[0].enabled = true;
     },
     disableZoomIn: function() {
         this.template.items[2].submenu.items[0].enabled = false;
     },
     enableZoomOut: function() {
         this.template.items[2].submenu.items[1].enabled = true;
     },
     disableZoomOut: function() {
         this.template.items[2].submenu.items[1].enabled = false;
     },
     enableActualSize: function() {
         this.template.items[2].submenu.items[2].enabled = true;
     },
     disableActualSize: function() {
         this.template.items[2].submenu.items[2].enabled = false;
     },
     enableReportIssue: function() {
         this.template.items[4].submenu.items[0].enabled = true;
     },
     disableReportIssue: function() {
         this.template.items[4].submenu.items[0].enabled = false;
     },
     enableResetAppData: function() {
         this.template.items[4].submenu.items[1].enabled = true;
     },
     disableResetAppData: function() {
         this.template.items[4].submenu.items[1].enabled = false;
     },
     enableCheckForUpdates: function() {
         this.template.items[0].submenu.items[2].enabled = true;
     },
     disableCheckForUpdates: function() {
         this.template.items[0].submenu.items[2].enabled = false;
     },
     disableZooming: function() {
         this.disableZoomOut();
         this.disableZoomIn();
         this.disableActualSize();
     },
     disableAll: function() {
         this.disableZoomOut();
         this.disableZoomIn();
         this.disableActualSize();
         this.disableCheckForUpdates();
         this.disableResetAppData();
         this.disableReportIssue();
     },
     enableAll: function() {
         /* 
          * once User Logged-In to App, enable All Zoom options in View Menu
          */
         this.enableZoomIn();
         this.enableZoomOut();
         this.enableActualSize();
         this.enableCheckForUpdates();
         this.enableResetAppData();
         this.enableReportIssue();
     },
     enableBoth: function() {
         this.enableZoomIn();
         this.enableZoomOut();
     },
     isContactAvail: function() {
         if (userInfo && Object.keys(userInfo).length)
             return true;
         else
             return false;
     },
     onBlur: function() {
         /*
          * No Event available to detect ,When no windows is onfocus
          * or when All windows is closed. so, OnBlur of any Windows
          *  Disable View menu itself.
          */
         if (this.isContactAvail()) {
             this.disableZooming();
         }
     },
     onFocus: function(option) {
         /*
          * when V2 window is Focused , disable View menu, we dont provide
          * zoom option for V2 , for other windows Always enable Actual Size 
          * that might be disable when V2 is Focused and send Info to 
          * respective windows to enable or disable ZoomUI depends on ZoomLevel..,
          */
         if (this.isContactAvail()) {
             if (option.container && option.container == 'V2') {
                 this.disableZooming();
             } else {
                 this.enableActualSize();
                 this.contactRenderer(option.container, new Application('onFocus'))
             }
         }
     },
     zoomIn: function(winRef) {
         this.contactRenderer(this.getTarget(winRef), new Application('zoomIn'))
     },
     zoomOut: function(winRef) {
         this.contactRenderer(this.getTarget(winRef), new Application('zoomOut'))
     },
     resetZoom: function(winRef) {
         this.contactRenderer(this.getTarget(winRef), new Application('resetZoom'))
     },
     clearCache: function() {
         this.contactRenderer('FULL', new Application('clearCache'))
     },
     switchZoomUI: function(option) {
         switch (option) {
             case "enableZoomIn":
                 {
                     this.enableZoomIn();
                     break;
                 }
             case "enableZoomOut":
                 {
                     this.enableZoomOut();
                     break;
                 }
             case "disableZoomIn":
                 {
                     this.disableZoomIn();
                     break;
                 }
             case "disableZoomOut":
                 {
                     this.disableZoomOut();
                     break;
                 }
             case "enableBoth":
                 {
                     this.enableBoth();
                     break;
                 }
             case "disableAll":
                 {
                     this.disableAll();
                     break;
                 }
             default:
                 {
                     console.log('default sequence in zoomUI ...', option)
                 }
         }
     },
     attachListener: function() {
         Emitter.on('zoomIn', menuActions.zoomIn.bind(menuActions));
         Emitter.on('zoomOut', menuActions.zoomOut.bind(menuActions));
         Emitter.on('resetZoom', menuActions.resetZoom.bind(menuActions));

         Emitter.on('ReportIssue', menuActions.sendSignalToChat.bind(menuActions));
         Emitter.on('clearCache', menuActions.clearCache.bind(menuActions));
         Emitter.on('checkForUpdates', menuActions.checkForUpdates.bind(menuActions));
         Emitter.on('switchZoomUI', menuActions.switchZoomUI.bind(menuActions))

         Emitter.on('onBlur', menuActions.onBlur.bind(menuActions));
         Emitter.on('onFocus', menuActions.onFocus.bind(menuActions));
         Emitter.on('/user/contact/available', menuActions.enableAll.bind(menuActions));

     }
 }

 Emitter.on('mainOnload', menuActions.setNativeMenu.bind(menuActions));