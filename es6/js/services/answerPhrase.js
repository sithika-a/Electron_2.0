(function(R, util, $) {
    try {

        var apiHitReduction = {
            threshold: 30000, // 30 sec
            lastRecievedDAIM: 0,
            isAfk: false,
            canDoApiCall: function() {
                var isApCanRequestServer = true,
                    currentDAIM = new Date().getTime();

                /* AFK */
                if (this.isAfk) {
                    /* 
                        If user is away from keyboard
                        AnswerPhrase should not hit server
                    */
                    isApCanRequestServer = false
                }

                // if (/(test|code)/.test(FULLClient.getMode()))
                //     return (currentDAIM - this.lastRecievedDAIM) <= this.threshold ? (this.lastRecievedDAIM = currentDAIM) : false;

                return isApCanRequestServer;
            },
            afkNotifier: function(info) {
                if (info && info.status == 'User-Away')
                    this.isAfk = true;
                else{
                    this.isAfk = false;
                    answerPhrase.doImmediateUpdate();
                }
            },
            setLastInputTime: function() {
                this.lastRecievedDAIM = new Date().getTime();
                console.log('setting last input time : ' + this.lastRecievedDAIM);
                return true;
            }
        };

        var sb5AP = {
            isDemoLine: function(accountNumber) {
                return false;
            },
            content: {
                apObject: null
            },
            _immediateUpdate : function(){
                this.getRecentChangedAP();
            },
            autoUpdateApJsons: function() {
                this.updateBrandAndAp();
                setInterval(this.updateBrandAndAp.bind(this), (FULLClient.getMode() == 'test' ? 600000 : 10800000)); // 10min or 3 hr
                setInterval(this.getRecentChangedAP.bind(this), 60000); // 1 min
            },
            getRecentChangedAP: function() {
                if (!apiHitReduction.canDoApiCall()) {
                    // console.warn('Won\'t hit ajax call for getting AP');
                    return false;
                }
                else{
                    // console.debug('WILL hit server for getting AP');
                }

                $.getJSON(FULLClient.getConfig().sb5 + "/InitialAccountAction/getAnswerPhraseListSB5.do?isFetchRecents=true", function(response, text, xhr) {
                    if (xhr.status == 200) {
                        this.setAPObj(Object.merge(this.content.apObject, response));
                    }
                }.bind(this));
            },
            updateBrandAndAp: function() {
                var self = this;

                function failCallback() {
                    setTimeout(self.updateBrandAndAp.bind(self), 60000);
                }

                $.getJSON(FULLClient.getConfig().sb5 + "/InitialAccountAction/getAnswerPhraseListSB5.do", function(response, text, xhr) {
                        if (xhr.status == 200) {
                            self.setAPObj(response);
                        }
                    })
                    .fail(failCallback);

                // $.getJSON(FULLClient.getConfig().sb + "/InitialAccountAction/getCacheWithKey.do?acctNum=1110000003&key=getanswerphrasebrandlist", function(response, text, xhr) {
                //     if (xhr.status == 200) {
                //         self.setBrandObj(response);
                //         self.log("getBrandJson :: pass");
                //     }
                // })
                // .fail(failCallback);
            },
            getAPObj: function() {
                return this.content.apObject
            },
            setAPObj: function(apObj) {
                this.content.apObject = apObj;
            },
            _getParsedObj: function(objString) {
                try {
                    if (objString) {
                        return JSON.parse(objString);
                    }
                } catch (e) {
                    console.error('AP : _getParsedObj : ', e.message);
                    console.error('AP : _getParsedObj : ', e.stack);
                }
            },
            getAccountInfo: function(acctNo) {
                if (this.getAPObj && this.getAPObj() && parseInt(acctNo) && acctNo in this.getAPObj()) {
                    return this._getParsedObj(this.getAPObj()[acctNo])
                }
            },
            getAnswerPhrase: function(acctNo) {
                // unImplemented
            },
            getBrand: function(acctNo) {
                // unImplemented
            }
        };

        var sb4AP = {
            isDemoLine: function(accountNumber) {
                return answerPhrase._demoLines.indexOf(accountNumber) !== -1;
            },
            content: {
                apObject: null,
                brandObject: null
            },
            _immediateUpdate : function(){
                this.updateBrandAndAp();
            },
            autoUpdateApJsons: function() {
                // Older System
                this.updateBrandAndAp();
                setInterval(this.updateBrandAndAp.bind(this), 60000);
            },
            updateBrandAndAp: function() {

                if (!apiHitReduction.canDoApiCall()) {
                    // console.warn('Won\'t hit server for getting AP');
                    return false;
                }
                else{
                    // console.debug('WILL hit server for getting AP');
                }


                // Older System
                var self = this;
                $.getJSON(FULLClient.getConfig().sb + "/InitialAccountAction/getAnswerPhraseList.do", function(response, text, xhr) {
                    if (xhr.status == 200) {
                        self.setAPObj(response);
                    }
                })

                $.getJSON(FULLClient.getConfig().sb + "/InitialAccountAction/getCacheWithKey.do?acctNum=1110000003&key=getanswerphrasebrandlist", function(response, text, xhr) {
                    if (xhr.status == 200) {
                        self.setBrandObj(response);
                    }
                });
            },

            getAPObj: function() {
                return this.content.apObject
            },
            getBrandObj: function() {
                return this.content.brandObject
            },
            setAPObj: function(apObj) {
                this.content.apObject = apObj;
            },
            setBrandObj: function(brandObj) {
                this.content.brandObject = brandObj;
            },
            getAnswerPhrase: function(acctNo) {
                return this.getAPObj()[acctNo]
            },
            getBrand: function(acctNo) {
                return this.getBrandObj()[acctNo]
            },
            getAccountInfo: function(acctNo) {
                if (this.getAPObj && this.getAPObj() && parseInt(acctNo) && acctNo in this.getAPObj()) {
                    return {
                        answerPhrase: this.getAPObj()[acctNo],
                        brand: this.getBrandObj()[acctNo]
                    }
                }
            }
        };


        var answerPhrase = {
            name: 'AnswerPhraseModule',
            _isAPAvailable: false,
            tabIdmap: [],
            _demoLines: ["8007066511", "8004616705", "8004617310", "8004619489", "8004619578", "8008050816", "8008352647", "8004611592", "8004614207", "8004615165", "8004617420", "8007047593", "8007066572", "8004618540", "8004612449", "8004619537", "8008087316", "8004615398", "8004617493", "8007047614", "8004611676", "8006800906", "8004612458", "8004614214", "8007066573", "8004618597", "8004612596", "8007047591", "8004618658", "8008087751", "8007047635", "8004611683", "8005456981", "8004614237", "8004618497", "8004615406", "8007066604", "8004618659", "8004614259", "8007047636", "8007047643", "8004612413", "8004614359", "8005457026", "8004614250", "8004618512", "8004616486", "8008088543", "8007066609", "8004612435", "8007047641", "8004614784", "8006800797", "8004618523", "8004615502", "8004614354", "8004616508", "8006352757", "8008088612", "8007066615", "8004614425", "8004616495", "8004618524", "8004616539", "8004610376", "8006352780", "8004612497", "8004618678", "8006800904", "8007047684", "8004614706", "8007066617", "8004612597", "8004618552", "8006800910", "8004610485", "8007066618", "8007095720", "8004617250", "8008038489", "8008038490", "8008038514", "8008038516", "8008038529", "8008038532", "8008038533", "8008352608", "8008352718", "8008352909", "8008353022", "8008353430", "8008391943", "8008392012", "8008392169", "8008392197", "8008392252", "8006352720", "8004612183", "8004612417", "8773257467", "8773257468", "8773257480", "8773257488", "8773257495", "8773257496", "8773257497", "8773257498", "8773257499", "8773257763", "8773257785", "8773258200", "8773258711", "8773258981", "8773259051", "8773259052", "8773259055", "8773259056", "8773259060", "8773259063", "8773259064", "8773259065", "8773259070", "8773259073", "8773259742", "8773261118", "8773261123", "8773261142", "8773261919", "8773265164", "8773265367", "8773265371", "8773265607", "8773265961", "8773267997", "8773267998", "8773268102", "8773269238", "8773269321", "8773271035", "8773271271", "8773271601", "8773271602", "8773271606", "8773271607", "8773271750", "8773271981", "8773272107", "8773272242", "8773272246", "8773272285", "8773272483", "8773273082", "8773273292", "8773273937", "8773275427", "8773275687", "8773276074", "8773276078", "8773276079", "8773276080", "8773276081", "8773276085", "8773276270", "8773276637", "8773276966", "8773277162", "8773278001", "8773278408", "8773278409", "8773278693", "8773278842", "8773279172", "8773279682", "8773280314", "8773281194", "8773281286", "8773281357", "8773281416", "8773281886", "8773282321", "8773282399", "8773282475", "8773282826", "8773283207", "8773283285", "8773285258", "8773286354", "8773287453", "8773288576", "8773289801", "8773290433", "8773290598", "8773290615", "8773291275", "8773291279", "8773299571", "8773299576", "8773299969", "8773299970"],
            _getService: function() {
                return sb5AP;
            },
            getAccountInfo: function(no) {
                // return sb5AP.getAccountInfo( no );
                return this._getService().getAccountInfo(no);
            },
            isDemoLine: function(no) {
                // return sb5AP.isDemoLine(no);
                return this._getService().isDemoLine(no);
            },
            dom: {
                container: $("#answer_phrase_popup"),
                contentDiv: $("#answer_phrase_popup").children('.answer_phrase_content'),
                apValue: $("#answer_phrase_popup").find("#answer_phrase_val"),
                closeButton: $("#answer_phrase_popup").find(".close_btn")
            },
            log: function() {
                util.log.apply(this, arguments);
            },
            isLocalAPClosed: function(tabId) {
                return tabId && this.tabIdmap.indexOf(tabId) !== -1 ? true : false;
            },
            setLocalApClosedForTab: function(tabId) {
                if (tabId && this.tabIdmap.indexOf(tabId) == -1) {
                    this.tabIdmap.push(tabId);
                    return true;
                };
            },
            getContainer: function() {
                return this.dom.container;
            },
            getContentDiv: function() {
                return this.dom.contentDiv;
            },
            getAPValDiv: function() {
                return this.dom.apValue;
            },
            getCloseButton: function() {
                return this.dom.closeButton;
            },
            getApAvailability: function(accountNumber) {
                return accountNumber && util.isNumber(accountNumber) && this.getAccountInfo(accountNumber) && !this.isDemoLine(accountNumber) ? this.getAccountInfo(accountNumber) : false;
            },
            paintContainer: function(brand) {
                var _child, _element = this.getContainer().get(0);
                _child = this.getContentDiv().get(0);
                if (_element) {
                    _child = (_child) ? _child : _element.children[0];
                    switch (brand) {
                        case "LexReception":
                            {
                                _element.setAttribute("style", "top:30%;background: #3989b8 url(http://images.sb.a-cti.com/images/lex-greeting-badge.png) center no-repeat;background-position: center bottom;padding-bottom: 50px;");
                                (_child) ? _child.setAttribute("style", "background:#3499d5;filter:alpha(opacity = 100);-moz-opacity:1.0;opacity:1.0;border:none;padding:2px 15px;border-radius: 4px 4px 0px 0px;") : false;
                                break;
                            }
                        default:
                            {
                                _element.setAttribute("style", "top:30%;background: #474747 center no-repeat;background-position: center bottom;padding-bottom: 20px;");
                                (_child) ? _child.setAttribute("style", "background:#474747;filter:alpha(opacity = 100);-moz-opacity:1.0;opacity:1.0;border:none;padding:2px 15px;border-radius: 4px 4px 0px 0px;") : false;
                                break;
                            }
                    }
                }
            },
            rePaintBasedOnBrand: function(url) {
                var brand, local_answer_phrase, __req, acctNum, ani = false;
                var __req = util.getParameters(url);
                var acctNum = __req.acctNum || __req.accountNumber;
                var ani = __req.IncomingANI || __req.incomingANI;
                var accountInfo = this.getAccountInfo(acctNum);
                var isApFlag = __req.apavailable;

                if (isApFlag && isApFlag == 'false') {
                    this.hide();
                    return;
                }

                // DemoLine numbers should no load localAP
                if (acctNum && !this.isDemoLine(acctNum) && accountInfo) {
                    brand = accountInfo.brand;
                    brand = brand ? brand.trim() : "Voicecurve";
                    local_answer_phrase = accountInfo.answerPhrase;
                    local_answer_phrase = local_answer_phrase ? local_answer_phrase.trim() : false;

                    switch (brand) {
                        case "LexReception":
                            {
                                this.paintContainer("LexReception");
                                break;
                            }
                        case "Synclio":
                            {
                                this.paintContainer("Voicecurve");
                                if (ani && this.getAccountInfo(ani)) {
                                    local_answer_phrase = this.getAccountInfo(ani).answerPhrase;
                                }
                                break;
                            }
                        default:
                            {
                                this.paintContainer("Voicecurve");
                                break;
                            }
                    }
                    if (local_answer_phrase && !(local_answer_phrase.trim().indexOf("Message System Templates") !== -1)) {
                        this.show(local_answer_phrase);
                    } else {
                        /**
                         *
                         * Hiding AnswerPhrase, when app for that tabId is not available.
                         *
                         **/
                        this.log('AnswerPhrase not Available for Params ', __req);
                        this.hide();
                    }
                }
            },
            show: function(phrase) {
                this.getAPValDiv().html(phrase);
                this.getContainer().show();
            },
            hide: function() {
                this.getContainer().hide();
            },
            init: function() {
                this.log('init');
                // sb5AP.autoUpdateApJsons();
                this._getService().autoUpdateApJsons();
                this.getCloseButton().click($.proxy(this.apUIclose, this));
            },
            doImmediateUpdate: function(){
                this._getService()._immediateUpdate();
            },
            apUIclose: function(evt) {
                // var tabId = getActiveView();// todo
                // _answer_phrase.set_tab_state(tabId); // todo
                this.hide();
                this.setLocalApClosedForTab(util.tabs.getActiveTabId())
            },
            computeAPforTab: function(tabId) {
                if (tabId && util.isNumber(tabId) && !this.isLocalAPClosed(tabId) && util.tabs.getTabById(tabId)) {
                    this.rePaintBasedOnBrand(util.tabs.getTabById(tabId).src);
                } else {
                    /**
                     *
                     * AP should have been already closed or invalid
                     * so answerPhrase banner should hide.
                     *
                     **/
                    // this.log('Answerphrase hide block  : ', tabId);
                    this.hide();

                }
            }
        }

        /**
         * AnswerPhrase module getting started.
         */
        answerPhrase.init();

        util.subscribe('/answerphrase/compute', answerPhrase, answerPhrase.computeAPforTab);
        util.subscribe('/answerphrase/close/active/ap', answerPhrase, answerPhrase.apUIclose);

        util.subscribe('/api/hit/detection/trial/', apiHitReduction, apiHitReduction.setLastInputTime);

        util.subscribe('/module/afk/notify', apiHitReduction, apiHitReduction.afkNotifier);

        util.answerPhrase = {
            isAPavailable: function() {
                return answerPhrase.getApAvailability.apply(answerPhrase, arguments);
            }
        }
    } catch (AnswerPhraseException) {
        console.error("Exception in AnswerPhrase routine", AnswerPhraseException);
        console.error("Exception in AnswerPhrase routine", AnswerPhraseException.stack);
        // logger.error(AnswerPhraseException.stack, "Exception in AnswerPhrase routine");
    }

    module.exports.sb5AP = sb5AP;
    module.exports.answerPhrase = answerPhrase;
    module.exports.sb4AP = sb4AP;

    /* 
    Test :
    util.answerPhrase.isAPavailable(9999)
    */
})(this, util, jQuery);