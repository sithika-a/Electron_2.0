/**
* 

    Messaging system for main process is defined 
    in here.

    {
    "target":{
            "id" : "",
            "title" : ""
        },
    "source":{
            "id" : "",
            "title" : ""
        },
    "options":{
            "globalPublish":false, // Publish to all windows
            "restart" : false,
            "quit" : false,
            "bounce":false, // "Window icon critical,normal" mac/win
            "badge":false // "Badge label for doc icon"
        },
    "etype":"", // points to operation type.
    "info" : { name : <fulclient sblistener message format object> }
}

Steps :
    
    TODO :
    a. message - validate
    b. target - validate
    c. source - auto   
    e. specify operation to perform

    Based on this satisfication, auto post of message should commence.
*
**/


/**
 * @param message {[String]} - mandatory
 * @param targetTitle {[String]} - defaults to "main" process
 */




//From containers to hiddenwindow / vice versa
function WindowMessaging() {
   this.name = 'WindowMessaging';
   this.metaData =  {
        messagingProtocol: 'eventEmitter',
        src: {
            windowName: util.window.getName(), // window name
            moduleName: 'StatusPanel'
        },
        dest: {
            name: 'V2', // window name
            channel : 'channelName'
        }
    };
    this.info = {
        name: 'StatusPanelController'
            // Actual Message
    };
}
 //From Hidden widnow to other containers

function MessageCreator( message  , targetTitle ) {
    this.name = "MessageCreator";
    this.init(message  , targetTitle);
}

MessageCreator.prototype.init = function(message,targetTitle) {
    // this.setSource();
    this.setMessage(message);
    // this.setTarget( targetTitle || 'main' );
};

MessageCreator.prototype.post = function() {
    if (window.FULLClient && FULLClient.ipc) {
        FULLClient.ipc.send(this);
    }
};

MessageCreator.prototype.setMessage = function(msg) {
    if (msg && typeof msg == 'object' && msg.name) {
        this.info = msg;
        this.setEventType('transerInfo');
    }
};

MessageCreator.prototype._internalCheck = function() {
    /**
    *
    * Check all criteria is met to send the ipc message.
      if not met, message is discarded with error.
    *
    **/
};

MessageCreator.prototype.log = function() {
    var tmp = [];
    for (var i = arguments.length - 1; i >= 0; i--) {
        tmp[i] = arguments[i];
    };
    tmp.splice(0, 0, '[' + this.name + '] : ');
    console.debug.apply(console, tmp);
};

MessageCreator.prototype.setTarget = function(title) {
    var targetArray = this.getAvailableTargets();
    for (var i = targetArray.length - 1; i >= 0; i--) {
        /**
            {
                id : <string>, 
                title : <string>
            }
        **/
        if( targetArray[i].title == title ){
            this['target'] =  targetArray[i];
            return true;
        }
    };

    throw new Error('Not a valid target ['+title+']');
};

MessageCreator.prototype.getAvailableTargets = function() {
    var wins, tmp = [];
    if (typeof util !== 'undefined') {
        wins = util.getAllWindows();
        for (var i = wins.length - 1; i >= 0; i--) {
            tmp.push({
                id: wins[i].id,
                title: wins[i].getTitle()
            });
        };

    } else {
        /**
         * When util is not available it means the target is webpage
         * trying to send a message
         **/
        tmp.push({
            title: 'FULL',
            web: true
        });
        tmp.push({
            title: 'WebsitesContainer',
            web: true
        });
        tmp.push({
            title: 'V2Container',
            web: true
        });
        tmp.push({
            title: 'ChatContainer',
            web: true
        });
    };

    tmp.push({
        title: 'main'
    });
    return tmp;
}

MessageCreator.prototype._setWebAsSource = function() {
    this.source = {
        id: location.host,
        src: location.href,
        web: true,
        title: document.title
    }
};

MessageCreator.prototype.setSource = function() {
    if (typeof util !== 'undefined') {
        var cWin = util.getCurrentWindow();
        this.source = {
            id: cWin.id,
            title: cWin.getTitle()
        }
    }
    //  else {
    //     // Webapplication is the source.
    //     this._setWebAsSource();
    // }
};

MessageCreator.prototype.setEventType = function(type) {
    if (!type)
        throw new Error('Type is not defined !!! ');
    this.eType = type;
};

MessageCreator.prototype.getEventType = function() {
    return this['eType'];
};

MessageCreator.prototype.setBounce = function(type) {
    if ( type && ['critical', 'normal'].indexOf(type) !== -1) {
        this.setEventType('bounce');
        this.setTarget('main');
        this.setMessage({
            name: 'bounce',
            attentionType: type
        });
        return true;
    }
    throw new Error('AttentionType is not of type "critical"|"normal" : ' + type);
};


MessageCreator.prototype.setBadge = function(text) {
    if (text && typeof text == 'string') {
        this.setEventType('badge');
        this.setTarget('main');
        this.setMessage({
            name: 'badge',
            label: text
        });
        return true;
    }
    throw new Error('Text is not of type string : ' + text);
};