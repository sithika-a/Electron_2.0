var namespace = {
            SB: `msg-to-FULL`, // SB container
            CHAT: `msg-to-Chat`, // AnyWhereWorks container
            V2: `msg-to-V2`, // v2 container
            Mediator : `msg-to-Mediator`, // hidden Renderer
            Main: `msg-to-Main` // BackGround
        };
// const messenger = require('electron').remote.require(`${__dirname}/comm/messenger.js`);
function Services(opt) {
        this.opt = opt;
        this.afkUserAway = {
            name: 'afk',
            status: 'user-away', // other options user-away|user-back
            source: 'hiddenWindow'
        };
        this.afkUserBack = {
            name: 'afk',
            status: 'user-away', // other options user-away|user-back
            source: 'hiddenWindow'
        };
        this.pushToAnalytics = {
            name: 'pushToAnalytics',
            accountnumber: '',
            eventAction: '',
            dimension1: '',
            dimension4: ''
        };
        this.modules = {
            afk: 'awayFromKeyBoard',
            analytics: 'googleAnalytics',
            writePermission: 'writePermissionChecker',
            yoco: 'goClock'
        };

    }
