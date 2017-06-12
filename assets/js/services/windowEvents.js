var windowEventsController = {
    eventHandler: function(container, eType, paramsObj) {
        console.log('container  :',container)
        if (container)
            switch (eType.toLowerCase()) {
                case "enableontop":
                    {
                        container.setAlwaysOnTop(true);!container.isFocused() ? container.show() : false;
                    }
                case "show":
                    {
                        container.show();
                        break;
                    }
                case "focus":
                    {
                        container.focus();
                        break;
                    }
                case "hide":
                    {
                        if (!container.isFullScreen())
                            container.hide();
                        break;
                    }
                case "setPosition":
                    {
                        container.setPosition(paramsObj.x, paramsObj.y);
                        break;
                    }
                case "disableontop":
                    {
                        container.setAlwaysOnTop(false);
                        break;
                    }
                case "restore":
                    {
                        container.restore();
                        break;
                    }
                case "minimize":
                    {
                        container.minimize();
                        break;
                    }
                case "maximize":
                    {
                        container.maximize();
                        break;
                    }
                case "setsize":
                    {
                        var specs = container.getSize();
                        var width = paramsObj.width ? paramsObj.width : specs[0];
                        var height = paramsObj.height ? paramsObj.height : specs[1];
                        container.setSize(width, height);
                    }
                case "blur":
                    {
                        container.blur();
                        break;
                    }
                case "showinactive":
                    {
                        container.showInactive();
                        break;
                    }
                case "bounce":
                    {
                        if(paramsObj.platform == `darwin`){
                            paramsObj.isContinuous ? app.dock.bounce(`critical`) : app.dock.bounce();
                        }else {
                            container.flashFrame(true);
                        }
                    }
                default:
                    {
                        console.log('Default event in windows Events handler')
                        break;
                    }
            }
    }
};