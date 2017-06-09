var container = {
	 cache: {
        v2: null,
        sb: null,
        chat: null
    },
	get(title){
        if (title) {
            switch (title) {
                case "Chat":
                    {
                        title = 'AnyWhereWorks';
                        break;
                    }
                case namespace.CONTAINER_V2_SOFTPHONE:
                    {
                        title = namespace.CONTAINER_SB;
                        break;
                    }
                case namespace.CONTAINER_CHAT:
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
	set(title){
		 if (title) {
            this.cache[title] = this.getTarget({
                "title": title
            });
            return this.cache[title];
        }

	},
	remove: function(url) {
        let title;
        if (url && (title = path.basename(url, '.html'))) {
            this.cache[title] = null;
        }
    },
    getAll() {
        return typeof __BrowserWindow != 'undefined' ? __BrowserWindow.getAllWindows() : [];
    },
    getById(id) {
        return (parseInt(id) && typeof __BrowserWindow != 'undefined') ? __BrowserWindow.fromId(id) : false;
    },
    getTarget(lTarget) {
        util.log('searching for Target : ', lTarget);
        let targetArray = this.getAll();
        for (let i = targetArray.length - 1; i >= 0; i--) {
            /*
                {
                    id : <string>, 
                    title : <string>
                }
            */
            if (targetArray[i].getURL().indexOf(lTarget.title + '.html') !== -1) {
                util.log('container["' + lTarget.title + '"], available ');
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
                    if(options) WindowManager.openTimerWidget(options);
                    break;
                }
            default:
                {
                    break;
                }
        }
    }
}