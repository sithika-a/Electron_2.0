(function(R, util){
    var menuBar = {
    defaultTitle: 'AnyWhereWorks',
    defaultTabID: '1',
    isTimerActive : function(){
        return $('ul.v2_tab>li>span').hasClass('timecount');
    },
    updateTitle: function(title) {
        if (title) {
            if (/^AnywhereWorks$|^FULL$/.test(title)) {
                // website other than SB Routine
                this.setWebPageTitle();
            } else {
                // SB acc load routine
                this.setWindowTitle(title + ' - SwitchBoard');
                this.setTabTitle(title); // This is added here to avoid tooltip on tab hover.
            }
        } else {
            // website other than SB Routine
            this.setWebPageTitle();
        }
    },
    setWindowTitle: function(title) {
        util.getCurrentWindow().setTitle(title || this.defaultTitle)
    },
    getTabId: function() {
        var tabId = util.tabs.getActiveTabId();
        return tabId ? tabId : this.defaultTabID;
    },
    setTabTitle: function(title) {
        if(!this.isTimerActive()){
            /* 
             * update tab title only if timer is not active ,
             * or else flickering happens when tries to update tabName 
             * with timer count and actual website name..
             */
            $('#'+ this.getTabId() +' a').text(title || this.defaultTitle)
        }
    },
    getWebPageTitle: function(activeTab) {
        if (activeTab)
            return activeTab.getTitle();
    },
    setWebPageTitle: function() {
        /*
         * for websites other than SB , get Title of webPage and  
         * update in TabName and windowName
         */
        var title = this.getWebPageTitle(this.getActiveTab());
        this.setWindowTitle(title);
        this.setTabTitle(title)
    },
    getActiveTab: function() {
        return util.tabs.getActiveTab() || document.getElementById('LoginModule');
    }
}
    util.subscribe('menuBar/updateTitle',menuBar,menuBar.updateTitle)

})(window, util);