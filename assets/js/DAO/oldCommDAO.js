var namespace = {
    channel: {
        SB: 'msg-to-switchboard', // SB container
        CHAT: 'msg-to-chat', // AnyWhereWorks container
        V2: 'msg-to-v2', // v2 container
        HIDDEN_CONTAINER: 'msg-to-hidden-window', // hidden Renderer
        BROWSER: 'msg-to-browser' // BackGround process
    },
    APP_ID: /^win/.test(process.platform) && /FULLClient/.test(process.execPath) ? 'FULL' : 'AnywhereWorks', // "AnyWhereWorks || FULL" any branding app will behave based on it.
    HIDDEN_CONTAINER: 'HiddenWindow',
    CONTAINER_CHAT: 'AnyWhereWorks',
    CONTAINER_CHAT_ALIAS: 'Chat',
    CONTAINER_SB: 'FULL',
    CONTAINER_V2: 'V2',
    CONTAINER_TIMER: 'Timer',
    CONTAINER_V2_SOFTPHONE: 'V2SoftPhone',
    ZOOMIN: 'ZoomIn',
    ZOOMOUT: 'ZoomOut',
    ENABLE: 'enable',
    DISABLE: 'disable',
    BOTH: 'Both',
    ALL: 'All',
    ZOOMIN_LIMIT: 9,
    ZOOMOUT_LIMIT: -8,
    ZOOM_ACTUAL_SIZE: 0,
    ZOOM_FACTOR: 1
}

/* Main Process Communication Object */
function PostToBackground(operationType) {
    this.name = 'PostToBackground';
    this.choice = operationType;
    this.actionType = 'windowEvents';
    this.menuActions = {
        name: 'menuActions',
        eType: 'menuActions',
        opt: null
    };
    this.show = {
        moduleName: `utilities`,
        title: null,
        actionType: this.actionType,
        opt: 'show'
    };

    this.hide = {
        moduleName: `utilities`,
        title: null,
        actionType: this.actionType,
        opt: 'hide'
    };
    this.focus = {
        moduleName: `utilities`,
        title: null,
        actionType: this.actionType,
        opt: 'focus'
    };

    this.enableOnTop = {
        moduleName: `utilities`,
        title: null,
        actionType: this.actionType,
        opt: 'enableontop'
    };

    this.disableOnTop = {
        moduleName: `utilities`,
        title: null,
        actionType: this.actionType,
        opt: 'disableontop'
    };
    this.restore = {
        moduleName: `utilities`,
        title: null,
        actionType: this.actionType,
        opt: 'restore'
    };
    this.minimize = {
        moduleName: `utilities`,
        title: null,
        actionType: this.actionType,
        opt: 'minimize'
    };
    this.maximize = {
        moduleName: `utilities`,
        title: null,
        actionType: this.actionType,
        opt: 'maximize'
    };

}
var analytics = {
    TAB_LOAD: 'TabLoad', // switchboard tab load
    TAB_ONLOAD: 'TabOnload', // switchboard tab onload
    FETCH: 'Fetch', // user fetching accountNumber | connId
    TAB_CLOSE: 'TabClose', // when user closes tab in switchboard
    TAB_XCLOSE: 'TabXClose', // when user doing x-close in switchboard
    TAB_XCLOSE_Cancel: 'TabXClosePopupCancel', // when user doing x-close popUp cancel in switchboard
    V2_CLOSED: 'V2Closed', // when v2 closes. appQuit will trigger V2close. 
    RELOAD_V2: 'ReloadV2', // when user clicks reload V2 option.
    APP_CLEAR_CACHE: 'AppClearCache', // when user clicks on clear cache option. 
    BACKUP_FORM: 'BackUpForm', // when user clicks on backup form option. 
    APP_ABNORMAL_QUIT: 'AppCrashed', // We will sends this event when app starts after a Crash.   
    APP_CLOSED: 'AppClosed', // will be pushed when app closed. App quit can be from SBwindow|chat| dock close in mac. 
    FULLCREATIVE_PAGE: 'FULLCreativeWebsite', // will be pushed when user clicks on Team Fullcreate option. 
    INCOGNITO_LINK: 'IncognitoLinkLoaded', // will be pushed when incognito link loaded. 
    TIMERWIDGET_DROPDOWN: 'TimerDropDown', // User selected status using TimerWidget
    TIMERWIDGET_TAB_DROPDOWN: 'TabTimerDropDown', // User selected status using Fullclient tab. 
    MAX_LOADED_TABS: 'MaxLoadedTab',
    CHAT_ICON_CLICKED: 'ChatIconClicked',
    REFETCH_RECENT_CLICKED: 'RefetchRecentClicked',
    FEEDBACK_CLICKED: 'FeedbackClicked',
    SENDING_FEEDBACK_BEGIN: 'SendingFeedbackBegin',
    FEEDBACK_SUCCESS: 'FeedbackSentSuccessfully',
    FEEDBACK_FAILED: 'FeedbackFailed',
    NETWORK_STRENGTH_CLICKED: 'NetworkStrengthClicked',
    UPDATE_BTN_CLICKED: 'UpdateButtonClicked',
    UPDATE_LATER_CLICKED: "UpdateLaterClicked",
    WIPE_DATA: "AppWipeData"
};

function ImageCapture(frameName, encodedImg, feedbackId) {
    this.name = 'image';
    this.frame = frameName;
    this.img = encodedImg;
    this.parentId = feedbackId;
};

function TabLock(text, isInformational) {
    if (typeof text != 'string') {
        return {};
    };
    this.name = 'tabLock';
    this.url = location.href;
    this.enableLock = true;
    this.dialog = {
        informational: isInformational ? true : false,
        text: text ? text : 'Do you wish to force close the tab?'
    }
}

function TimerCommunication(opt, connId) {
    this.name = 'TimerCommunication';
    this.setOperation.apply(this, arguments);
    this.setConnectionInfo = {
        name: 'setConnectionInfo',
        DAIM: null
    }

    this.updateConnectionInfo = {
        name: 'updateConnectionInfo',
        DAIM: null,
        status: null
    }

    this.closeConnection = {
        name: 'closeConnection'
    }
}

TimerCommunication.prototype.setOperation = function(opt, connId) {
    if (opt && connId && (new RegExp(opt, 'ig').test(['setConnectionInfo', 'updateConnectionInfo', 'closeConnection']))) {
        this.opt = opt;
        this.connId = connId;
        return true;
    }
    throw new Error('Specified Operation is not available');
};

/**
 * SB communication Class
 * @param operationType
 * @constructor
 */
function SBcommunication(operationType) {
    if (operationType)
        operationCycle = operationType;
    else
        operationCycle = null;

    this.name = 'sbCommunication';
    this.opt = operationCycle; // accountOpt or statusPush Operation.
    this.accountOpt = {
        url: '',
        name: 'accountOpt',
        opt: null // accountOptions = 'load' or 'unLoad'
    };
    this.resizeContainer = {
        name: 'resizeContainer',
        w: null,
        h: null
    };
    this.statusPush = {
        name: 'statusPush',
        status: null // statusTypes
    };
}


function V2Communication(operationType) {

    var v2Options = ['statusPush', 'outbound', 'getStatus', 'reloadJS', 'close'],
        statusTypes = {
            name: 'statusTypes',
            _available: 'Available',
            _break: 'Break',
            _meeting: 'Meeting',
            _systemissues: 'System',
            _personaltime: 'Personal',
            _offline: 'Offline'
        };

    var sbOpt = {
        name: 'sbOpt',
        account: 'accountOpt',
        status: 'statusPush',
        _event: '_event',
        webtab: 'webtab'
    };

    if (operationType)
        operationCycle = operationType;
    else
        operationCycle = v2Options;

    this.name = 'v2Communication';
    this.opt = operationCycle; // 'statusPush' or 'outbound' or 'getStatus','resizeContainer'
    this.resizeContainer = {
        name: 'resizeContainer',
        w: null,
        h: null
    };

    this.visibility = {
        name: 'visibility',
        isShow: false // by default its false;
    };

    this.statusPush = statusTypes;
    this.isInterruptible = false;
    this.getStatus = v2Options;
    this.outbound = {
        name: 'outbound',
        phoneNumber: '' // Patch number when outbound call to be Made.
    };

    this.queryAndGetTabSource = {
        name: 'queryAndGetTabSource',
        paramName: null,
        paramValue: null
    };

    this.close = false
};

function WidgetTimer(operationType) {
    var operation = operationType ? operationType : false;
    this.name = 'widgettimer';
    this.opt = operation;
    this.toWidgetContainer = {
        name: 'toWidgetContainer',
        data: {}
    };
    this.toSbwindow = {
        name: 'toSbwindow',
        data: {}
    };
    this.setHeightWidth = {
        name: 'setHeightWidth',
        data: {}
    };
};

function ClientListener(lOperation) {
    var operation = (lOperation) ? lOperation : false;
    this.name = 'clientlistener';
    this.opt = operation;
    this.count = {
        name: 'count',
        target: 'chat',
        count: undefined
    };

    this.showUpdatePopup = {
        name: 'showUpdatePopup',
        domain: location.origin,
        gitRepoName: null, // mandatory
        version: null, // mandatory, must be numerical to show version in UI
        restartBtnName: null, // optional : default - Restart
        cancelBtnName: null // optional : default - Later
    };

    this.hideUpdatePopup = {
        name: 'hideUpdatePopup',
    };

    this.restartBtnClick = {
        name: 'restartBtnClick',
    };

    this.cancelBtnClick = {
        name: 'cancelBtnClick',
    };

    this.extensions = {
        name: 'extensions',
        emittype: undefined,
        message: undefined
    };

    this.accessToken = {
        name: 'accessToken',
        token: null
    };

    this.blur = {
        name: 'blur',
        domain: location.origin
    };

    this.focus = {
        name: 'focus',
        domain: location.origin
    };

    this.badgelabel = {
        name: 'badgelabel',
        count: undefined
    };

    this.notify = {
        name: 'notify',
        title: undefined,
        body: undefined,
        sec: undefined, // milliseconds to show, default is 3sec.
        icon: undefined // url or blob.
    };

    this.show = {
        name: 'show',
        target: 'chat' // by default chat, available options - |feeds|search
    };

    this.hide = {
        name: 'hide',
        target: 'chat' // by default chat, available options - |feeds|search
    };

    this.getstate = {
        name: 'getstate'
    };

    this.requestattention = {
        name: 'requestattention',
        isContinuous: false // boolean.
    };

    this.restart = {
        name: 'restart'
    };

    this.readFromClipboard = {
        name: 'readFromClipboard'
    };

    this.loadwebsite = {
        name: 'loadwebsite',
        isFullwork: undefined,
        isBrowserLoad: undefined,
        url: undefined
    };

    this.loadaccount = {
        name: 'loadaccount',
        accountnumber: undefined
    };

    this.goclock = {
        name: 'goclock',
        isStop: undefined,
        daim: 0
    };

    this.enableOnTop = {
        name: 'enableOnTop'
    };

    this.disableOnTop = {
        name: 'disableOnTop'
    };

    this.storeinbuffer = {
        name: 'storeinbuffer',
        value: null
    };

    this.setv2status = {
        name: 'setv2status',
        status: null
    };

    this.getv2status = {
        name: 'getv2status'
    };

    this.download = {
        name: 'download',
        filename: undefined, // Mandatory, File Name of the downloadable content.
        mimetype: undefined, // Mandatory, Mime type content type of download.
        url: undefined, // Mandatory, Entire download url.
        contentlength: undefined, // content-length of the file.
        isViewable: false // Enforce file download even if format is supportable for view, ex:jpeg, by default it wil force download
    };
    this.toGuestPage = {
        name: 'toGuestPage',
        guest: {
            source: location.href,
            destination: null, // <optional> or will pick the first webview i.e., guest page
        },
        data: {} // <mandatory> array,object any valid data-type. 
    };
};

/*
  Application loading and closing communication
  medium !! between sbContainer and ChatContainer.
*/
function Application(opt) {
    this.name = "Application";
    this.apps = {
        v2: 'v2container',
        ibr: 'inbuiltrouting',
        ic: 'inbuiltchat',
        ch: 'chatclient',
        sb: 'sbcontainer',
        sp: 'statuspanel',
        afk: 'awayfromkeyboard',
        ecm: 'enablecallcenterchatmode',
        mop: 'menuoptions'
    };
    this.opt = (opt) ? opt : 'open';
    this.close = {
        name: "close",
        appname: false // v2container,inbuiltrouting, chatclient,inbuiltchat
    };
    this.hide = {
        name: "hide",
        appname: false // v2container,inbuiltrouting, chatclient,inbuiltchat
    };
    this.show = {
        name: "show",
        appname: false // v2container,inbuiltrouting, chatclient,inbuiltchat
    };
    this.open = {
        name: "open",
        appname: false // v2container,inbuiltrouting, chatclient,inbuiltchat
    };

    this.quit = {
        name: 'quit',
        callee: false
    };

    this.maximize = {
        name: 'maximize',
        callee: false
    };

    this.collectfeedback = {
        name: 'collectfeedback',
        userFeedback: null,
        isFromChatModule: false
    };

    this.clearCache = {
        name: 'clearCache'
    };

    this.checkForUpdates = {
        name: 'checkForUpdates'
    };

    this.onFocus = {
        name: 'onFocus'
    };

    this.zoomIn = {
        name: 'zoomIn'
    };

    this.zoomOut = {
        name: 'zoomOut'
    };

    this.resetZoom = {
        name: 'resetZoom'
    };

    this.menuoptions = {
        name: 'menuoptions',
        opt: undefined,
        showoption: {
            name: 'showoption',
            optionname: undefined
        },
        hideoption: {
            name: 'hideoption',
            optionname: undefined
        }
    }
}


// NB : we have to remove this once 
// all things are fixed.
function LogsAck(id) {
    this.name = 'captureLogs'; // BUG
    this.opt = 'captureLogs';
    this['captureLogs'] = {
        uniqueId: id
    }

    this['clearLogs'] = {
        name: 'clearLogs'
    }
}


function LogACK(opt) {
    this.name = 'LogACK';
    this.opt = opt;
    this['captureLogs'] = {
        name: 'captureLogs',
        uniqueId: null
    }

    this['clearLogs'] = {
        name: 'clearLogs'
    }
}

function Thinclient(lOpt, eventType, extension) {
    this.name = 'thinclient';
    this.opt = (lOpt) ? lOpt : false;
    this.state = {
        'name': 'state',
        'origin': null, // origin | domain.
        'visible': false, // frame visiblity.
        'ext': (extension) ? extension : 'chat', // plugin. may be chat/feeds/feeds_notify/directory/profile or anything.
        'etype': (eventType) ? eventType : 'click', // app,click,mouserover,mousedown etc.
        'extIsHide': false,
        'window': {
            isMinimized: false,
            isBlured: false,
            isFocused: false
        }
    };

    this.menu = {
        name: 'menuevent',
        metainfo: {
            menu: null, // parent menu label
            menuitem: null, // submenu label
            eventType: 'click'
        }
    };

    this.v2Status = {
        name: 'v2Status',
        status: null
    };

    this.readFromClipboard = {
        name: 'readFromClipboard',
        text: null,
        type: null,
        image: {
            dataUri: null,
            size: null,
            isEmpty: true
        }
    };

    this.extensions = {
        name: 'extensions',
        type: undefined,
        message: undefined
    };

    this.notify = {
        name: 'notify',
        isEvent: false
    };

    this.afk = {
        name: 'afk',
        status: 'user-away' // other options user-away|user-back
    };

    this.tabSourceQueryResult = {
        name: 'tabSourceQueryResult',
        result: {
            src: null,
            params: null
        },
        query: {
            // original query data
            // for param construction.
        }
    };

    this.networkDetection = {
        name: 'networkDetection',
        isUp: true
    };

    this.downloadFileInfo = {
        name: 'downloadFileInfo',
        originalObject: null,
        downloadedPercentage: null,
        downloadedMB: null
    };

};
module.exports = Thinclient;

//module.exports=Thinclient;