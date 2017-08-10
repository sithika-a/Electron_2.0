const {BrowserWindow} = require('electron');

let path = require('path');
let util = require('./mainUtils.js');
let WindowManager = require('./windowManager.js');
let windowAccess = {
    name: 'WindowAccess',
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
                case "Chat":
                    {
                        title = 'AnyWhereWorks';
                        break;
                    }
                case util.namespace.CONTAINER_V2_SOFTPHONE:
                    {
                        title = namespace.CONTAINER_SB;
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
    open(options) {
        switch (title) {
            case "V2":
                {
                    WindowManager.openV2Container();
                    break;
                }
            case "FULL":
                {
                    WindowManager.openWebContainer();
                    break;
                }
            case "Chat":
                {
                    WindowManager.openChatContainer();
                    break;
                }
            case "sbMocha":
                {
                    WindowManager.openSBMochaRunner();
                    break;
                }
            case "sbJasmineRunner":
                {
                    WindowManager.openSBJasmineRunner();
                    break;
                }
            case "v2Mocha":
                {
                    WindowManager.openV2MochaRunner();
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
module.exports = windowAccess;
