((R, util) => {

    let chatUtils = {
        postToWebview(obj) {
            console.log('Posting to webview ... ', obj)
            var dom = this.getView();
            if (dom && obj) {
                dom.send('webapp-msg', obj);
            }
        },
        getView() {
            return document.querySelector('webview#chat_webview')
        },
        reloadchat() {
            this.postToBackground(namespace.channel.CONTAINER_CHAT, 'windowEvents', 'show');
            var chatView = this.getView()
            if (chatView) chatView.reload();
        },
        postToBackground(title, actionType, opt, count) {
            var commObj = {
                title: title ? title : namespace.channel.CONTAINER_CHAT,
                actionType: actionType ? actionType : false,
                opt: opt ? opt : false,
                count: count ? count : 0
            };
            if (commObj && commObj.actionType) {
                FULLClient.emitter.sendToMain(commObj);
            }
        },
        postToBack(message) {
            if (message && message.actionType) {
                util.subscribe(`/util/sendMessage/to/main`, message);
            }
        },
        setBadge(count) {
            if (util.platform.isWin()) {
                msg[msg.opt].count ? util.showBadgeLabel(msg[msg.opt].count.toString()) : util.showBadgeLabel('');
            } else {
                this.postToBack({
                    moduleName: namespace.moduleName.chatUtils,
                    title: namespace.channel.CONTAINER_CHAT,
                    actionType: `setBadge`,
                    opt: null,
                    count: count || 0
                })
            }
        },
        bounce(isContinuous) {
            this.postToBack({
                moduleName: namespace.moduleName.chatUtils,
                title: namespace.channel.CONTAINER_CHAT,
                actionType: `windowEvents`,
                opt: `bounce`,
                paramObj: {
                    isContinuous: isContinuous,
                    platform: util.platform.isMac() ? `darwin` : `win`
                }
            })
        }
    }
    util.subscribe(`chatUtils/postToWebview`, chatUtils, chatUtils.postToWebview)
    util.subscribe(`chatUtils/postToBackground`, chatUtils, chatUtils.postToBackground);
    util.subscribe(`chatUtils/setBadge`, chatUtils, chatUtils.setBadge);
    util.subscribe(`chatUtils/bounce`, chatUtils, chatUtils.setBadge);

})(this, util)