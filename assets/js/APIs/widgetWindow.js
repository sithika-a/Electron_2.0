/**
 
  Few API Usages
  
  Show container : 
    var showContainer = new ClientListener('show');
    container.push(showContainer);
 
  focus container : 
    var focusContainer = new ClientListener('focus');
    container.push(focusContainer);
 
  Notification : 
    var notify = new ClientListener('notify');
    notify[notify.opt].title = 'TestTitle'
    notify[notify.opt].body = 'Test Message Body'
    notify[notify.opt].icon = '<http://imageorico url>'
    container.push(notify);

  Badge Label:
    var badge = new ClientListener('badgelabel');
    badge[badge.opt].count = 2
    container.push(badge);

 Communication : 
    var guest = new ClientListener('toGuestPage');
    guest[guest.opt].data = {testData : 'Hello Test'};
    container.push(guest);

  
**/
(function(R, undefined) {
    console.log('App js, API for electron');
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

    // function ClientListener(lOperation) {
    //     var operation = (lOperation) ? lOperation : false;
    //     this.name = 'clientlistener';
    //     this.opt = operation;
    //     this.setSize = {
    //         name: "setSize",
    //         width: null,
    //         height: null
    //     };
    //     this.focus = {
    //         name: 'focus',
    //         domain: location.origin
    //     };
    //     this.badgelabel = {
    //         name: 'badgelabel',
    //         count: undefined
    //     };
    //     this.notify = {
    //         name: 'notify',
    //         title: undefined,
    //         body: undefined,
    //         sec: undefined, // milliseconds to show, default is 3sec.
    //         icon: undefined // url or blob.
    //     };
    //     this.show = {
    //         name: 'show'
    //     };
    //     this.hide = {
    //         name: 'hide'
    //     };
    //     this.requestattention = {
    //         name: 'requestattention',
    //         isContinuous: false // boolean.
    //     };
    //     this.restart = {
    //         name: 'restart'
    //     };
    //     this.loadwebsite = {
    //         name: 'loadwebsite',
    //         isBrowserLoad: undefined,
    //         url: undefined
    //     };
    //     this.enableOnTop = {
    //         name: 'enableOnTop'
    //     };
    //     this.disableOnTop = {
    //         name: 'disableOnTop'
    //     };
    //     this.setv2status = {
    //         name: 'setv2status',
    //         status: null
    //     };
    //     this.toGuestPage = {
    //         name: 'toGuestPage',
    //         guest: {
    //             source: location.href,
    //             destination: null, // <optional> or will pick the first webview i.e., guest page
    //         },
    //         data: {} // <mandatory> array,object any valid data-type. 
    //     };
    // };
    var namespace = {
        CONTAINER_CHAT: 'AnyWhereWorks',
        CONTAINER_SB: 'FULL',
        CONTAINER_V2: 'V2'
    }
    var eventsHandler = {
        getWindowId: function() {
            return FULLClient.require('remote').getCurrentWindow().id;
        },
        postToBackGround: function(msg) {
            var info = msg[msg.opt];
            FULLClient.ipc.send({
                eType: 'windowEvents',
                opt: msg.opt,
                paramObj: info,
                id: this.getWindowId()
            });
        },
        postToRenderer: function(msg, title) {
            switch (title) {
                case "AnyWhereWorks":
                    {
                        FULLClient.ipc.sendToChat(msg);
                        break;
                    }
                case "FULL":
                    {
                        FULLClient.ipc.sendToSB(msg);
                        break;
                    }
                case "V2":
                    {
                        FULLClient.ipc.sendToV2(msg);
                        break;
                    }
                default:
                    {
                        console.log('Default Sequence in App.js :: posting To Renderer ')

                    }
            }

        },
        reload: function() {
            var show = new ClientListener('show')
            this.postToBackGround(show);
            location.reload();
        },
        check: function(msg, title) {
            switch (msg.opt) {
                case "toGuestPage":
                    {
                        this.postToRenderer(msg, title);
                        break;
                    }
                case "badgelabel":
                    {
                        FULLClient.ipc.send({
                            eType: 'setBadge',
                            count: msg[msg.opt].count
                        });
                        break;
                    }
                case "requestattention":
                    {
                        FULLClient.ipc.send({
                            eType: 'bounce',
                            opt: msg[msg.opt].isContinuous
                        });
                        break;
                    }
                case "notify":
                    {
                        this.postToRenderer(msg, title);
                        break;
                    }
                case "loadwebsite":
                    {
                        this.postToRenderer(msg, title);
                        break;
                    }
                case "restart":
                    {
                        this.reload();
                        break;
                    }
                default:
                    {
                        this.postToBackGround(msg)
                        break;
                    }
            }

        }
    }
    var app = {
        _isValid: function(obj) {
            if (obj instanceof ClientListener)
                return true;
            throw new Error('Argument1 is not ClientListener object.');
        },
        push: function(obj) {
            /* 
             * push Message to Main Container that is Chat from any Source
             */
            if (this._isValid(obj)) {
                eventsHandler.check(obj, namespace.CONTAINER_CHAT);
                return true;
            }
        },
        pushToSB: function(obj) {
            /* 
             * push Message to Main Container that is Chat from any Source
             */
            if (this._isValid(obj)) {
                eventsHandler.check(obj, namespace.CONTAINER_SB);
                return true;
            }
        },
        pushToV2: function(obj) {
            /* 
             * push Message to Main Container that is Chat from any Source
             */
            if (this._isValid(obj)) {
                eventsHandler.check(obj, namespace.CONTAINER_V2);
                return true;
            }
        }
    }

    R['ClientListener'] = ClientListener;
    R['container'] = app;
    Object.defineProperty(R, 'container', accessModifier.protected);
    Object.defineProperty(R, 'ClientListener', accessModifier.protected);

    Object.defineProperties(container, {
        '_isValid': accessModifier.protected,
        'push': accessModifier.protected,
        'pushToSB': accessModifier.protected,
        'pushToV2': accessModifier.protected
    });
})(window);