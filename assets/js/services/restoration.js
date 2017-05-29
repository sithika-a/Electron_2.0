;
(function(util, ls) {
    var restore = {
        set: function(module, newData) {
            var tmpData;
            if (module && newData) {
                if (tmpData = this._get(module)) {
                    tmpData.push(newData)
                } else
                    tmpData = [newData];
                ls.set(module, JSON.stringify(tmpData));
            }
        },
        _get: function(module, cb) {
            if (module) {
                return ls.get(module);
            }
        },
        get: function(module, cb) {
            if (module && typeof cb == 'function') {
                setTimeout(function() {
                    cb.call(null, ls.get(module));
                }, 0);
            }
        },
        remove: function(module, key) {
            var oldData;
            if (module && key) {
                oldData = this._get(module);
                if (oldData) {
                    for (var i = 0; i < oldData.length; i++) {
                        if (oldData[i].key == key) {
                            oldData.splice(i, 1);
                            break;
                        }
                    };
                    ls.set(module, JSON.stringify(oldData));
                    return true;
                }
            }
        },
        removeAll: function(module) {
            if (module) {
                ls.remove(module);
                return true;
            }
        },
        publish : function(){
            util.publish('/tab/restore/check');
        }
    };

    util.subscribe('/app/restore/check', restore, restore.publish);
    util.subscribe('/app/restore/set', restore, restore.set);
    util.subscribe('/app/restore/get', restore, restore.get);
    util.subscribe('/app/restore/remove', restore, restore.remove);
    util.subscribe('/app/restore/removeAll', restore, restore.removeAll);
    module.exports = restore;

}(util, Locstor));