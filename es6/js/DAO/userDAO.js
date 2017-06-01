/**
 * User Data access Object ( userDAO )
 * Choosen Synchronous model, rather than asynchronous model for DAO layer.
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperties
 **/
(function(R) {

    var projectMap = {
        default: null,
        answerconnectId: 'YH0D44',
        adaptavantId: '91dfed2f-d29f-4302-89ee-341e9364b941'
    };

    var accessModifier = {
        "mask": {
            enumerable: false,
            writable: true,
            configurable: false
        },
        "protected": {
            enumerable: true,
            writable: false,
            configurable: false
        },
        "private": {
            enumerable: false,
            writable: false,
            configurable: false
        }
    };

    var self = userInfoObject = {
            user: {},
            loggedIn: false,
            setloggedIn: function(flag) {
                this.loggedIn = flag;
            },
            isloggedIn: function() {
                return this.loggedIn;
            },
            isUserObjectValid: function(lUserInfo) {
                lUserInfo = lUserInfo || this.user;
                return (lUserInfo && lUserInfo['success'] && lUserInfo['contact'] && lUserInfo['contact'].login) ? true : false;
            },
            /**
             * Internal Function
             **/
            getContactLocalStorage: function() {
                try {
                    return Locstor.get('userContactInfo');
                } catch (e) {
                    console.error('Exception while getting in LocalStorage, User INFO : ' + e.message);
                    console.error('Exception while getting in LocalStorage, User INFO : ', e.stack);
                    return {};
                }
            },
            /*
             * Internal Function
             */
            setContactLocalStorage: function(user) {
                try {
                    return Locstor.set('userContactInfo', user);
                } catch (e) {
                    console.error('Exception while setting in LocalStorage, User INFO : ' + e.message);
                    console.error('Exception while setting in LocalStorage, User INFO : ', e.stack);
                    return false;
                }
            },
            setV2Login: function(login) {
                var user = this.getContactLocalStorage()
                if (login && user && user.contact) {
                    user.contact.v2Login = login;
                    return this.setUser(user);
                }
            },
            getUserDcmResponse: function() {
                try {
                    if (self.isUserObjectValid(self.user) || self.isUserObjectValid(self.user = self.getContactLocalStorage()))
                        return self.user;
                } catch (userInfoException) {
                    console.error(userInfoException.message);
                    console.error(userInfoException.stack);
                }
                return false;
            },
            getAccessToken: function() {
                return this.user['accessToken'] || this.getContactLocalStorage()['accessToken'];
            },
            setAccessToken: function(token) {
                console.warn('We are trying to set Access token ', token);
                if (token && this.user) {
                    this.user['accessToken'] = token;
                    this.setUser(this.user);
                    return this.user['accessToken'];
                }
            },
            getUser: function() {
                try {
                    if (self.isUserObjectValid(self.user) || self.isUserObjectValid(self.user = self.getContactLocalStorage()))
                        return self.user.contact;
                } catch (userInfoException) {
                    console.error(userInfoException.message);
                    console.error(userInfoException.stack);
                }
                return false;
            },
            setUser: function(userObject) {
                try {
                    if (typeof userObject == 'object' && this.isUserObjectValid(userObject)) {

                        self.user = userObject;
                        /**
                         * Manipulation of adding extra property to contact object is
                         * due to email, is present as login in contact object,
                         * FullName is undefined.
                         **/
                        (self.user.contact) ? (function() {
                            self.user.contact.email = self.user.contact.login;
                            self.user.contact.fullname = self.user.contact.fullName = self.user.contact.firstName + ' ' + self.user.contact.lastName;
                        }()) : false;

                        /**
                         * Setting User Object in LocalStorage
                         **/
                        self.setContactLocalStorage(self.user);
                        // ( successCallBack && typeof successCallBack == 'function' ) ? successCallBack.apply(self, self.user) : false; // Call back is undefined.

                        return self.getUserDcmResponse();
                    } else {
                        return false;
                    }
                } catch (userInfoException) {
                    console.error('Error While Setting User Object : ' + userInfoException.message);
                    console.error('Error While Setting User Object : ', userInfoException.stack);
                    return false;
                }
            },
            getUserContactSkillSet: function() {
                try {
                    if (self.isUserObjectValid(self.user) || self.isUserObjectValid(self.user = self.getContactLocalStorage()))
                        return self.user.contactSkillSet;
                } catch (userInfoException) {
                    console.error(userInfoException.message);
                    console.error(userInfoException.stack);
                }
                return false;
            },
            getUserSkillSet: function() {
                try {
                    if (self.isUserObjectValid(self.user) || self.isUserObjectValid(self.user = self.getContactLocalStorage()))
                        return self.user.skillSet;
                } catch (userInfoException) {
                    console.error(userInfoException.message);
                    console.error(userInfoException.stack);
                }
                return false;
            },
            getSkillByType: function(type, typeValue, queryType) {

                if (!typeValue || !type || !queryType)
                    return false;

                try {
                    var tmpSkillObj, skillSetArray = this[queryType]();
                    if (skillSetArray && skillSetArray.length) {
                        for (var i = skillSetArray.length - 1; i >= 0; i--) {
                            tmpSkillObj = skillSetArray[i];
                            if (typeof tmpSkillObj == 'object' && tmpSkillObj[type] == typeValue.trim()) {
                                return tmpSkillObj;
                            }
                        };
                    }
                    return false;
                } catch (userInfoException) {
                    console.error(userInfoException.message);
                    console.error(userInfoException.stack);
                }
            },
            patch: function(skillName) {
                /*
                    a. CEA skill defines to open all three windows
                    b. FullWork skill defines to open, only chat
                    but, code relying on "FullWork"
                    skill when changing CEA all levels have to be changed
                    all places instead, we are checking ppl have FULLWork
                    skill, else use CEA as fullwork.
                */
                var skill = this.getSkillByType('title', skillName, 'getUserSkillSet')
                return skill ? this.getSkillById(skill.skillSetId) : false;
            },
            /**
             * getSkillByName('FullWork')
             * FullWork skill available return it; or return CEA
             **/
            getSkillByName: function(skillName) {
                // caching in local scope to improve speed.
                // var tmp = this.patch(skillName),
                //     cea;
                // if (skillName == 'FullWork' && !tmp && (cea = this.patch('CEA')))
                //     return cea;
                // else
                //     return tmp;

                var tmp = this.patch(skillName);
                if (skillName == 'FullWork')
                    return tmp || this.patch('CEA') || {};
                else
                    return tmp;

            },
            /**
             *
             * getSkillById('98223b25-b41c-4c7e-bb91-569003f4cc45')
             *
             **/

            getSkillById: function(id) {
                return this.getSkillByType('skillSetID', id, 'getUserContactSkillSet');
            },
            getCompanyId: function() {
                if (projectMap['default'])
                    return projectMap['default'];

                var skillObj = self.getSkillById('98223b25-b41c-4c7e-bb91-569003f4cc45');
                projectMap['default'] = (skillObj && skillObj.accountID) ? skillObj.accountID : projectMap.answerconnectId;
                return projectMap['default'];
            },
            updateUserInfoViaApi: function(email) {
                return $.ajax({
                        url: 'https://live-contactsapi.appspot.com/services/signin/v2.0/Account/authenticate_v2?apikey=SEN42',
                        type: 'POST',
                        data: '{"login":"' + (this.getEmail() || email) + '"}',
                        contentType: 'application/json'
                    })
                    .done(function(json) {
                        this.setUser(json);
                    }.bind(this));
            },
            getEmail: function() {
                var tmp = this.getUser();
                return tmp ? tmp.email : false;
            },
            getV2Login: function() {
                var tmp = this.getUser();
                return tmp ? tmp.v2Login : false;
            },
            clear: function() {
                this.user = null;
            }
        }
        /**
         * Publicly accessible object.
         **/
    R['userDAO'] = userInfoObject;
    /**
     * Adding a level of security, manupulating
     * User data is not Possible.
     * -accessModifier-, Object can be found in common.js
     **/

    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperties
    // Object.defineProperties(userDAO, {
    // "user": accessModifier.mask,
    //     "getUser": accessModifier.protected,
    //     "getUserContactSkillSet": accessModifier.protected,
    //     "setUser": accessModifier.private,
    //     "getContactLocalStorage": accessModifier.private,
    //     "setContactLocalStorage": accessModifier.private
    // });

    for (var prop in userInfoObject) {
        if (userInfoObject.hasOwnProperty(prop)) {
            if (['loggedIn', 'user'].indexOf(prop) != -1)
                Object.defineProperty(userInfoObject, prop, accessModifier.mask);
            else
                Object.defineProperty(userInfoObject, prop, accessModifier.protected);
        }
    }

    // https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty
    Object.defineProperty(R, 'userDAO', accessModifier.protected);

    util.subscribe('/user/info/update/via/api', userInfoObject, userInfoObject.updateUserInfoViaApi);
})(this);