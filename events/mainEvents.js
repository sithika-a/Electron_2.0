


var eventList = ["menuActions"
,"userInfo"
,"init"
,"appQuit"
,"bounce"
,"dockHide"
,"setBadge"
,"setOverlayIcon"
,"activateNewV2"
,"activateOldV2"
,"loadWebsiteInNewWindow"
,"reloadV2"
,"open"
,"getState"
,"windowEvents"
,"crashReporter"
,"isCrashed"
,"reLogin"
,"isRestored"
];
let nativeImage;

var appEvents = {
    setBadge(count) {
        if (/^darwin/.test(process.platform)) {
            count ?
                app.dock.setBadge(count.toString()) :
                app.dock.setBadge('');
        }
    },
    setOverlayIcon(msg) {
        try {
            if (/^win32/.test(process.platform) && msg) {

                if (!nativeImage)
                    nativeImage = require('electron').nativeImage;


                if (msg.dataURL) {
                    // In 1.x we have to send it to main container,
                    // remote container is not serialized, so api
                    // change will affect implementation.
                    // check https://github.com/electron/electron/issues/4011
                    container.get('Chat')
                        .setOverlayIcon(nativeImage.createFromDataURL(msg.dataURL), "");
                    return true;
                } else
                    container.get('Chat')
                    .setOverlayIcon(null, "");

                return false;
            }
        } catch (e) {
            console.log('SetoverLay error ', e.message);
            console.log('SetoverLay error ', e.stack);
        }
    },
    hideDockIcon(count) {
        if (/^darwin/.test(process.platform)) {
            app.dock.hide();
        }
    },
    bounce(isContinuous) {
        isContinuous ? app.dock.bounce('critical') : app.dock.bounce();
        // critical,normal mac/win
    }
}