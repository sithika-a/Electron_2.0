const {BrowserWindow} = require('electron');
console.log('caching ,,,,calllled.. ')
let channel = require('../comm/channel.js');
let path = require('path');
let util = require('./mainUtils.js');
let WindowManager = require('./windowManager.js');
let windowCache = {
    name: 'windowCache',
    cache: {
        V2: null,
        sb: null,
        chat: null
    },
    log(...args) {
        // let tmp = [].slice.call(arguments);
        // tmp.splice(0, 0, '[' + this.name + '] : ');
        console.log.apply(console, [this.name, args]);
    },
    get(title) {
        if (title) {
            switch (title) {
                case util.namespace.CONTAINER_CHAT_ALIAS:
                    {
                        title = 'AnyWhereWorks';
                        break;
                    }
                case util.namespace.CONTAINER_V2_SOFTPHONE:
                    {
                        title = util.namespace.CONTAINER_SB;
                        break;
                    }
                case util.namespace.CONTAINER_CHAT:
                    {
                        title = 'AnyWhereWorks';
                        break;
                    }

                default:
                    {
                        break;
                    }
            }
            return this.cache[title] || this.set(title);
        }

    },
    set(title) {
        if (title) {
            this.cache[title] = this.getTarget({
                "title": title
            });
            return this.cache[title];
        }

    },
    remove(url) {
        let title;
        if (url && (title = path.basename(url, '.html'))) {
            this.cache[title] = null;
        }
    },
    getAll() {
        return typeof BrowserWindow != 'undefined' ? BrowserWindow.getAllWindows() : [];
    },
    getById(id) {
        return (parseInt(id) && typeof BrowserWindow != 'undefined') ? BrowserWindow.fromId(id) : false;
    },
    getTarget(lTarget) {
        let targetArray = this.getAll();
        for (let i = targetArray.length - 1; i >= 0; i--) {
            /*
                {
                    id : <string>, 
                    title : <string>
                }
            */
            if (targetArray[i].getURL().indexOf(lTarget.title + '.html') !== -1) {
                this.log('container["' + lTarget.title + '"], available ');
                return targetArray[i];
            }
        };
    },
    open(title) {
        console.log('Opening !!!!! ',title)
        // if (!this.get(title)){
        //     console.log('open container name : ',`open${title}`)
        //             WindowManager[`open${title}`]();
        //             }
        switch (title) {
            case "V2":
                {
                    if (!this.get(title)){
                    WindowManager[`open${title}Container`]()
                    }
                    break;
                }
            case "HiddenWindow":
                {
                    if (this.get(title)){
                    WindowManager.openHiddenContainer();
                    }
                    break;
                }
            case "FULL":
                {
                    if (!this.get(title)){
                    WindowManager.openWebContainer();
                    }
                    break;
                }
            case "Chat":
                {
                    if (!this.get(channel.CONTAINER_CHAT)) {
                        WindowManager.openChatContainer();
                    }
                    break;
                }
            case "Timer":
                {
                    if (options) WindowManager.openTimerWidget(options);
                    break;
                }
            default:
                {
                    break;
                }
        }
    }
}
module.exports = windowCache;