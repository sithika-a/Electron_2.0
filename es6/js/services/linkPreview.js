/*
	Link or Resource preview in bottom left corner
	of call window.
*/

;
(function(util) {
    /*
            
        wv.addEventListener('', function() {
            //console.check(' - ',arguments)
        });

        */

    var updateTargetUrlDOM = $('.update-target-url');
    var weakMap = new WeakMap();

    function didGetResponseDetails(e, s, nu, ou, code, meth, ref, headers, rType) {
        //console.check('did-get-response-details - [' + e.resourceType + '] = ', e.newURL, e.oldURL, e.httpResponseCode, e.requestMethod);
        displayDomainOnly(e.newURL);
    }

    function getDomain(str) {
        var urlWithProtocol = str.match(/(https?:\/\/)([a-z\-.]*)/g);
        return trimProtocolInURL(urlWithProtocol ? urlWithProtocol[0] : "");
    }

    function displayDomainOnly(content) {
        trimContentAndDisplay(getDomain(content));
    }

    function trimContentAndDisplay(content, length) {
        var lContent = content ? content.trim() : content;
        if (lContent) {
            displayPreview('Waiting for ' + lContent.substr(0, length ? length : 45) + '...');
        }
    }

    function displayPreview(content) {

        var data = trimProtocolInURL(content);

        if (!updateTargetUrlDOM.is(':visible')) {
            updateTargetUrlDOM.show();
        }

        updateTargetUrlDOM
            .text(data);

    }

    function trimProtocolInURL(url) {
        var lURL = url ? url.trim() : url;
        return lURL = lURL.includes('http') ? lURL.replace(/(https?:\/\/)/, '') : lURL;
    }

    function LinkPreview(webview) {
        this.wv = webview;
        this.previewOn();
        displayPreview('Connecting...');
        this.addListener();
        weakMap.set(webview, this);
    }

    LinkPreview.prototype.previewOn = function(content) {
        updateTargetUrlDOM
            .show();
    }

    LinkPreview.prototype.previewOff = function() {
        updateTargetUrlDOM
            .hide();
    }

    LinkPreview.prototype.removeListener = function() {
        this.wv.removeEventListener('did-get-response-details', didGetResponseDetails);
    };

    LinkPreview.prototype.dispose = function() {
    	//console.check('Disposing LINKPreview Object src=['+this.wv.src+']');
        this.wv = null;
    };

    LinkPreview.prototype.setUpdateURL = function() {
        this.wv.addEventListener('update-target-url', function(e) {
            var url = e.url;
            if (url && url.trim()) {
                trimContentAndDisplay(url, 150);
            } else {
                updateTargetUrlDOM.hide();
            }
        });
    }

    LinkPreview.prototype.addListener = function() {
        this.wv.addEventListener('did-get-response-details', didGetResponseDetails);

        this.wv.addEventListener('will-navigate', function(e) {
            //console.check('will-navigate - ', e.url)
            displayDomainOnly(e.url);
            this.removeListener();
            this.wv.addEventListener('did-get-response-details', didGetResponseDetails);
        }.bind(this));

        this.wv.addEventListener('did-finish-load', function() {
            //console.check(' ******************* did-finish-load ******************* ')
            this.removeListener();
            this.setUpdateURL();
            this.previewOff();
        }.bind(this));

        this.wv.addEventListener('did-navigate', function(e) {
            //console.check('did-navigate - ', e.url)
            displayDomainOnly(e.url);
        });

        this.wv.addEventListener('did-get-redirect-request', function(e) {
            //console.check('did-get-redirect-request - [' + e.resourceType + '] = ', e.newURL, e.oldURL, e.httpResponseCode, e.requestMethod)
            displayDomainOnly(e.newURL);
        });

        // this.wv.addEventListener('did-navigate-in-page', function(e) {
        //     //console.check('did-navigate-in-page - ', e.url, e.isMainFrame)
        //     displayDomainOnly(e.url);
        // });

        // this.wv.addEventListener('load-commit', function(e) {
        //     //console.check('load-commit - ', e.isMainFrame, e.url)
        //     displayDomainOnly(e.url);
        // });
    }

    util.subscribe('/link/preview/load/webview', function(webview) {
        new LinkPreview(webview)
    });

    util.subscribe('/link/preview/dispose/webview', function(webview) {
        //console.check('Webview src = ['+webview.src+']');
        if (weakMap.has(webview)) {
            //console.check('Webview is available in weakmap ');
            var linkpreview = weakMap.get(webview);
            linkpreview.dispose();
            weakMap.delete(webview);
            //console.check('Dispose successful', !weakMap.has(webview));
        }
    });

})(util);