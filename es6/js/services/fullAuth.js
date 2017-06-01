;
(function(util) {
    var fullAuth = {
        isValid: function(obj) {
            if (obj && typeof obj == "object" && obj.contact)
                return true;
            throw new Error('Object is not valid user contact');
        },
        getAccessToken: function(exchangeCode) {
            if (exchangeCode) {
                return $.ajax({
                    type: 'POST',
                    url: FULLClient.getConfig().auth.tokenUrl,
                    data: {
                        code: exchangeCode.replace(/#/,''),
                        client_id: FULLClient.getConfig().auth.clientId,
                        client_secret: FULLClient.getConfig().auth.secret,
                        grant_type: 'authorization_code',
                        redirect_uri: FULLClient.getConfig().auth.redirect
                    }
                })
            }
            throw new Error('Invalid exchange code key' + exchangeCode);
        },
        getContact: function(accessToken) {
            if (accessToken) {
                return $.ajax({
                    type: 'GET',
                    url: FULLClient.getConfig().dcmApi.contact,
                    headers: {
                        Authorization: 'Bearer ' + accessToken
                    }
                })
            }
            throw new Error('Invalid accessToken ' + accessToken);
        },
        getContactSkillSetAndSkillSet: function(contact) {
            if (contact && contact.id && contact.accountID) {
                return $.ajax({
                    type: 'GET',
                    url: FULLClient.getConfig().dcmApi.skillSets + '?apikey=' + contact.accountID + '&contactID=' + contact.id
                });
            }
            throw new Error('Invalid accessToken ' + contact);
        },
        aggregate: function(exchangeCode , callback ) {
            var user = {};
        	console.log('Access Code ' ,exchangeCode,callback );
            return $.when(this.getAccessToken(exchangeCode))
                
                .then(function(tokenObj) {
                	console.log('stage 1 : ',tokenObj );
                    user.accessToken = tokenObj.access_token;
                    return this.getContact(tokenObj.access_token)
                }.bind(this))
                
                .then(function(contactResp) {
                    user.contact = contactResp.data;
                    console.log('stage 2 : ',user);
                    return this.getContactSkillSetAndSkillSet(user.contact);
                }.bind(this))

                .then(function(res) {
                    var resp;
                    user.contactSkillSet = res.contactSkillSet;
                    user.skillSet = res.skillSet;
                    user.success = true;

                    resp = fullAuth.isValid(user) ? user : {
                        success : false
                    };

                	console.log('stage 3 : ',resp ,callback);
                    if( callback && typeof callback == 'function'){
                        callback.call(null,resp)
                    };

                    return resp;
                })
                
                .fail(function(r) {
                    console.error('ERROR : ',r);
                    callback.call(null,r);
                });
        }
    };

    util.subscribe('/services/fullauth/get/user',fullAuth,fullAuth.aggregate);
    module.exports = fullAuth;
})(util);