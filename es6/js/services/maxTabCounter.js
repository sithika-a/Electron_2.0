;(function(R, util) {
    var maxtabcounter = {
        pushNumberOfTabsLoadedInfo: function() {
            var loadedTabs = util.tabs.getAllTabs().length,
                localObj = this.getMaxNumberOfTabsLoadedInfo();
            if (localObj && loadedTabs > localObj.numberOfTabsLoaded) {
                localObj.numberOfTabsLoaded = loadedTabs;
                localObj.winResolution = JSON.stringify(util.getCurrentWindow().getBounds());
                util.storage.set('TabInfoToAnalytics', localObj);
            }
        },
        getMaxNumberOfTabsLoadedInfo: function() {
            return util.storage.get('TabInfoToAnalytics');
        },
        checkAnalyticsTabInfo: function() {
            /**  {
             *     numberOfTabsLoaded : 0,
             *     daim : 0
             *   }
             */
            if (!util.storage.get('TabInfoToAnalytics')) {
                util.storage.set('TabInfoToAnalytics', {
                    numberOfTabsLoaded: 0,
                    daim: 0,
                    winResolution:''
                });
            }
            this.sendTabInfoToAnalytics();

        },
        sendTabInfoToAnalytics: function() {
            var lastStoredObj = this.getMaxNumberOfTabsLoadedInfo(),
                currentTime = Date.now(),
                count,
                winResolution;
            count = lastStoredObj.numberOfTabsLoaded ? lastStoredObj.numberOfTabsLoaded.toString() : '0';
            winResolution = lastStoredObj.winResolution ? lastStoredObj.winResolution.toString() : 'Window_Resolution_N/A';

            if (lastStoredObj && lastStoredObj.daim == 0 && lastStoredObj.numberOfTabsLoaded !== 0) {
                lastStoredObj.daim = currentTime;
                lastStoredObj.numberOfTabsLoaded = 0;
                lastStoredObj.winResolution = '';
                util.storage.set('TabInfoToAnalytics', lastStoredObj);
                util.analytics.push(null, analytics.MAX_LOADED_TABS,winResolution, count);
            }

            if (lastStoredObj && lastStoredObj.numberOfTabsLoaded !== 0 && (currentTime - lastStoredObj.daim) > 1000 * 60 * 60 * 24) { // 1000 * 60 * 60 * 24
                lastStoredObj.daim = currentTime;
                lastStoredObj.numberOfTabsLoaded = 0;
                lastStoredObj.winResolution = '';
                util.storage.set('TabInfoToAnalytics', lastStoredObj);
                console.log("Storing LoadedTabInfo :", this.getMaxNumberOfTabsLoadedInfo());
                util.analytics.push(null, analytics.MAX_LOADED_TABS,winResolution, count);
            }
        }
    };
    
    util.subscribe('/maxtabcounter/pushNumberOfTabsLoadedInfo', maxtabcounter, maxtabcounter.pushNumberOfTabsLoadedInfo);
    util.subscribe('/maxtabcounter/checkAnalyticsTabInfo', maxtabcounter, maxtabcounter.checkAnalyticsTabInfo);
})(this, util);