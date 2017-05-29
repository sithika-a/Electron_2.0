;
(function(R, util, lodash) {
    try {
        var remote = FULLClient.require('electron').remote;
        var dictionary = require('spellchecker');

        var Menu = remote.Menu;
        var noop = lodash.noop;
        var defaults = lodash.defaults;
        var isEmpty = lodash.isEmpty;
        var isFunction = lodash.isFunction;
        var isArray = lodash.isArray;
        var cloneDeep = lodash.clone;

        // will be automatically placed by event;
        var source = null;
        var cEvent = null;

        var DEFAULT_NON_EDITABLE_TPL = [{
            label: 'Copy',
            click: executor.bind(null, 'copy')
        }, {
            label: 'Select All',
            click: executor.bind(null, 'selectAll')
        }];

        var DEFAULT_LINK_TPL = [{
            label: 'Open Link in New Tab',
            click: function() {
                var url = cEvent.linkURL;
                util.loadURL(url);
            }
        }, {
            label: 'Open Link in Browser',
            click: function() {
                var url = cEvent.linkURL;
                util.loadWebSiteInBrowser(url);
            }
        }, {
            label: 'Copy Link Address',
            click: function() {
                var url = cEvent.linkURL;
                util.copy(url)
            }
        }, {
            type: 'separator'
        }];

        var DEFAULT_SUGGESTIONS_TPL = [{
            label: 'No suggestions',
            click: noop
        }, {
            type: 'separator'
        }];

        /*
            ,{
                label: 'Redo',
                click: executor.bind(null, 'redo')
            }
        */
        var DEFAULT_EDITABLE_TPL = [{
            label: 'Undo',
            click: executor.bind(null, 'undo')
        }, {
            type: 'separator'
        }, {
            label: 'Cut',
            click: executor.bind(null, 'cut')
        }, {
            label: 'Copy',
            click: executor.bind(null, 'copy')
        }, {
            label: 'Paste',
            click: executor.bind(null, 'paste')
        }, {
            label: 'Paste and Match Style',
            click: executor.bind(null, 'pasteAndMatchStyle')
        }, {
            type: 'separator'
        }, {
            label: 'Select All',
            click: executor.bind(null, 'selectAll')
        }];

        function executor(action) {
            // action will be 'copy','paste','cut'
            // Remaining arguments are calulated in-case of 
            // 'replaceText' or 'replace' action's.
            // source, will be updated whenever context menu
            // event occures, containing source webview
            // element.
            var args = Array.prototype.slice.call(arguments, 1)
            if (source && action) {
                source[action].apply(null, args);
                cEvent = source = null;
            }
        }

        var contextMenu = {
            setSource: function(src) {
                if (src) {
                    return source = src
                }
            },
            setContextEventObj: function(cEve) {
                if (cEve) {
                    return cEvent = cEve
                }
            },
            getSelection: function(cEve) {
                if (cEve && cEve.misspelledWord) {
                    return {
                        isMisspelled: true,
                        spellingSuggestions: getSuggestions(cEve.misspelledWord)
                    }
                }
            },
            getSuggestions: function(word) {
                if (word && (word = word.toLowerCase())) {
                    return dictionary
                        .getCorrectionsForMisspelling(word)
                        .slice(0, 5); // get 5 suggestions.
                }
            },
            addContentEditable: function(mainTMP) {
                // In case windows we are taking out
                // paste and match style.
                if (/^win/.test(process.platform))
                    DEFAULT_EDITABLE_TPL.splice(6, 1);
                mainTMP.push.apply(mainTMP, DEFAULT_EDITABLE_TPL);
                return mainTMP;
            },
            addSuggestions: function(mainTMP, word) {
                var suggestions = this.getSuggestions(word);

                console.log('suggestions we got for word[' + word + '] : ', suggestions);
                if (!suggestions.length) {
                    mainTMP.unshift.apply(mainTMP, DEFAULT_SUGGESTIONS_TPL);
                    return mainTMP;
                }

                mainTMP.unshift.apply(mainTMP, suggestions.map(function(suggestion) {
                    return {
                        label: suggestion,
                        click: executor.bind(null, 'replaceMisspelling', suggestion)
                    };
                }).concat({
                    type: 'separator'
                }));

                return mainTMP;
            },
            addLinkOptions: function(mainTMP, url) {
                mainTMP.push.apply(mainTMP, DEFAULT_LINK_TPL);
                return mainTMP;
            },
            getTemplate: function(contextEvObj) {
                /**
                 *  contentEditable=true , enable cut,paste,undo,redo
                 *  misspelledwords should contain suggestions template and contentEditable=true
                 *  link, should contain "opening links" and should not contain suggestion or editable property
                 *  contentEditable=false , disable cut,paste,undo,redo
                 */
                var template = [];
                if (contextEvObj.isEditable) {
                    if (contextEvObj.misspelledWord) {
                        this.addSuggestions(template, contextEvObj.misspelledWord)
                    }
                    this.addContentEditable(template);
                } else if (contextEvObj.linkURL) {
                    this.addLinkOptions(template);
                    template.push.apply(template, DEFAULT_NON_EDITABLE_TPL);
                } else {
                    template.push.apply(template, DEFAULT_NON_EDITABLE_TPL);
                }

                return template
            },
            build: function(template) {
                if (template)
                    return Menu.buildFromTemplate(template);
            },
            run: function(menu) {
                if (menu) {
                    menu.popup(remote.getCurrentWindow());
                    return true;
                }
            }
        };

        util.subscribe('/context/menu/event/', function(srcEvent, contextEvent) {
            contextMenu.setSource(srcEvent.sender);
            contextMenu.setContextEventObj(contextEvent);

            var template = contextMenu.getTemplate(cEvent);
            var menu = contextMenu.build(template);

            contextMenu.run(menu);
        });

        module.exports = contextMenu;
    } catch (e) {
        console.log('Error in context-menu impl ', e.message);
        console.log('Error in context-menu impl ', e.stack);
    }

})(this, util, _);