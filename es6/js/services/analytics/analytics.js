/**
 *
  FullAnalytics.
           push('EventCatgory', // AccountNumber
              'EventAction',  // 'UserAction'. UserAction can anything which is declared in analytics object. Pls check oldCommDAO analytics object. 
              'EventLabel',   // User EmailId. we will take it by default. 
              'Dimension1',   // ConnID (Interaction connectionId).
              'Dimension2',   // Origin 'FullClient'. we can make use of this property to send anything in future. 
              'Dimesion4');   // Meta Information, like description or url. 
  
  Ex : util.publish('/analytics/push',params['accountNumber'],analytics.TAB_LOAD,params['connId'],url);            

**/
(function(R, util) {
    var FullAnalytics = {
        "channel": null,
        push: function(accountnumber, eventAction, dimension1, dimension4) {
            // Getting all parameters,creating google anlytics object and passing it sendMessageToChannelApplication function. 
            var gaObj = {
                name: "FullAnalytics"
            }
            gaObj.cat = accountnumber || 'accountNumber_N/A';
            gaObj.act = eventAction || 'eventActions_N/A';
            gaObj.label = this.getUser() || 'userEmail_N/A';
            gaObj.dimension1 = dimension1 || 'ConnId_N/A'; // connid customDimension1_N/A
            gaObj.dimension2 = 'FULLClient'; // origin customDimension2_N/A
            gaObj.dimension3 = (new Date()).toString(); // date         
            gaObj.dimension4 = dimension4 || 'Meta_Info_N/A'; // meta info customDimension4_N/A
            this.sendMessageToChannelApplication(gaObj);
        },
        getUser: function() {
            // Getting userEmailId from userDAO object and returning. 
            return userDAO.getUser() ? userDAO.getEmail() : null;
        },
        sendMessageToChannelApplication: function(gaObj) {
            // This function will send google analtics object channel.html. From there we will push it to google analytics. 
            if (this.channel && gaObj) {
                this.channel.send('webapp-msg', gaObj);
            }
        },
        setChannel: function() {
            // Caching analytics webview 
            this.channel = document.querySelector('#processReduce');
        }
    };
    module.exports = FullAnalytics;
    util.subscribe('/analytics/push', FullAnalytics, FullAnalytics.push);
    util.subscribe('module/controller/onload', FullAnalytics, FullAnalytics.setChannel);
})(this, util);