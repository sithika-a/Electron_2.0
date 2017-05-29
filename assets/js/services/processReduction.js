/**
 * Process reduction module, which will help in reducing
 * process based on skill or logs etc.
 */
(function() {
    var pReduce = {
        getV2URL : function(){
            var src = util.config.getV2url().replace(/(\/A.*)/,'');
            var logsURL;
            if(src){
                logsURL = src += '/pages/logs.jsp'
                return logsURL;
            }
        },
        embedURL: function() {
            var obj = {
                name: "embedURL",
                url: [
                    util.config.getSBurl() + '/views/clearCache.html',
                    // this.getV2URL()
                ]
            }
            document.querySelector('#processReduce')
                .send('webapp-msg', obj);
        }
    }
    util.subscribe('/process/reduce/embed/log/urls', pReduce, pReduce.embedURL);
})();