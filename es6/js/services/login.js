/**
 *
 * Login Module.
 *
 **/
(function(R, M) {
    var loginModule = {
        name: 'loginModule',
        userLoginInfo: null,
        log: function() {
            util.log.apply(this, arguments);
        },
        getBaseURL: function() {
            return FULLClient.getConfig().login;
        },
        getServiceId: function() {
            return this.isNewFullAuth() ? FULLClient.getConfig().auth.clientId : FULLClient.getConfig().serviceId;
        },
        isNewFullAuth: function() {
            return /fullcreative.fullauth/.test(FULLClient.getConfig().login)
        },
        getLoginURL: function() {
            return this.isNewFullAuth() ?
                /*
                    Service From
                    http://fullcreative.github.io/FullAuthModules/

                    live : http://fullauth.com/console
                    staging : http://staging-fullcreative.fullauth.com/console
                    
                 */
                this.getBaseURL() +
                '/o/oauth2/auth?' +
                'state=oAuth' +
                '&client_id=' + this.getServiceId() +
                '&redirect_uri=' + this.getRedirectURL() +
                '&scope=contacts-api.full_access awapis.fullaccess' +
                '&response_type=code&approval_prompt=force&expiry_type=LONG'
                // Old FULLAuth Services.
                :this.getBaseURL() +
                '/oauth/2/authentication/fullOauthService?' +
                'serviceAccountId=' + this.getServiceId() +
                '&redirectUrl=' + this.getRedirectURL() +
                '&isTc=true' +
                '&errorUrl=' + this.getRedirectURL() +
                '&allowExternalUser=true';

        },
        getRedirectURL: function() {
            return this.isNewFullAuth() ? 
                        FULLClient.getConfig().auth.redirect
                        : this.getBaseURL() + '/login.jsp';
        },
        onload: function(evt) {
            loginModule.log('Recieved login page onload !!! ', evt);
            util.publish('/app/loginModule/onload/recieved');
            evt.target.send('webapp-init', {
                name: 'init',
                source: 'FULL',
                contact: {}
            });
        },
        embedWebviewDom: function() {
            this.log('Embedding webview login dom ');
            var login = new WebviewProxy('LoginModule', this.getLoginURL(), 'persist:FULLClient:tab');
            login.setContentloaded(this.onload);
            $('#chatContainer').append(login.getView());

            /**
             * Codes were removed because we need to show the
             * login window once after the clear cache is 
             * done properly.
             */
            
        },
        getMainProcessUserInfo: function() {
            var tmp = userDAO.getUser();
            tmp.isFullWork = userDAO.getSkillByName('FullWork') ? true : false;
            tmp.isCEA = userDAO.getSkillByName('CEA') ? true : false;
            tmp['crashInfo'] = this.userLoginInfo ? this.userLoginInfo : null;
            return tmp;
        },
        getUserInfoFromUserLoginRegisterModule : function(){
            util.publish('/userInfo/getSpecDetails/', function(res) {
                if(res){
                    this.userLoginInfo = res;
                 }
            }.bind(this));
        },
        sendUserInfoToMainProcess: function() {
            console.log('sendUserInfoToMainProcess ...')
            FULLClient.emitter.sendToMain({
                "eType": "userInfo",
                "userObj": this.getMainProcessUserInfo()
            });
        },
        getLocalStorageUserData: function() {
            if (userDAO.getUser()) {
                this.log('USER Data available in storage !!!');
                util.publish('module/controller/login', {
                    source: 'login',
                    data: 'localStorage'
                });

                this.sendUserInfoToMainProcess();
                return true;
            } else {
                this.embedLoginTab();
                return false;
            }
        },
        embedLoginTab: function() {
            this.removedEmbeddedView();
            this.embedWebviewDom();
        },
        removedEmbeddedView: function() {
            $('#LoginModule').remove();
        },
        saveUser: function(contact) {
            var dcm = contact;
            if (dcm && dcm['success'] && dcm['contact'] && dcm['contact'].login) {
                this.removedEmbeddedView();
                this.log("FullOauth has contact,skillset and success param so persisting in localStorage ");
                /**
                 * Obtaining the DCM data from CDN needs to be updated in the localStorage
                 * DCM/user object, and registered with UserDAO
                 **/
                userDAO.setUser(dcm);
                /**
                 *
                 * TODO : Resolve the LoginDFD Deferred
                 * Giving control to the moduleController to
                 * do loading.
                 **/
                util.publish('module/controller/login', {
                    source: 'login'
                });

                this.sendUserInfoToMainProcess();

                // During first time login, chat container will
                // show up, we have to hide when it is in 
                // 'FULL' app id
                if (!userDAO.getSkillByName('FullWork')) {
                    util.publish('/util/window/events/hide', namespace.CONTAINER_CHAT);
                }

                // Make the chat window quit flag to 
                // false so that, even if they close the window
                // next clear cache will go back to login
                // page or else it will quit the app
                // util.publish('/chat/quit/flag', false);
            } else {
                this.log('DCM data is NULL, so we are going to login page again !!!! ')
                    /*
                            Todo: Talk to vali shah regarding this, and make it work !!!
                            He has to give you back the data...
                            */
                util.cookies.clear();
                this.log('Application Cookies are cleared !!!');
            }
        },
        msgHandler: function(msg) {
            if (msg) {
                this.saveUser(msg.contact);
            }
        },
        init: function() {
            /**
             *
             * SHOW login screen and commence login
             *
             **/
            this.log(this.getLoginURL());
            this.getUserInfoFromUserLoginRegisterModule();
            this.getLocalStorageUserData();
        }
    };

    M.subscribe('/app/loginModule/start', loginModule, loginModule.init);
    M.subscribe('/app/loginModule/msg/recieved', loginModule, loginModule.msgHandler);
    R['loginModule'] = loginModule;
})(this, amplify, util);