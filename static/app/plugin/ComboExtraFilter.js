Ext.define('INV.plugin.comboExtraFilter', {
    extend : 'Ext.AbstractPlugin',
    alias : 'plugin.comboExtraFilter',

    ids: [],

    init : function(combo) {
        this.combo = combo;
        this.combo.on('expand', this._onExpand, this);
        Ext.apply(combo, this.comboOverrides);
    },

    destroy : function(combo) {
        this.combo.un('expand', this._onExpand, this);

    },

    _onExpand : function(picker){
        var comboStore = picker.store,
            grid = picker.up('editor').editingPlugin.grid,
            gridStore = grid.store,
            product = grid.up('form').getRecord(),
            ids = new Array();
        console.log(ids);
        if (product) ids.push(product.get('id'));
        gridStore.each(function(record){
            ids.push(record.get('ingredient'));
        });
        console.log(ids);
        comboStore.filterBy(function (record) {
            var id = record.get('id'),
                pop = Ext.Array.contains(ids, id);
            return !pop
        });
    },

    comboOverrides:{
        doQuery: function(queryString, forceAll, rawQuery) {
            queryString = queryString || '';

            // store in object and pass by reference in 'beforequery'
            // so that client code can modify values.
            var me = this,
                qe = {
                    query: queryString,
                    forceAll: forceAll,
                    ids : [],
                    combo: me,
                    cancel: false
                },
                store = me.store,
                isLocalMode = me.queryMode === 'local';

            if (me.fireEvent('beforequery', qe) === false || qe.cancel) {
                return false;
            }

            // get back out possibly modified values
            queryString = qe.query;
            forceAll = qe.forceAll;
            ids = qe.ids;

            // query permitted to run
            if (forceAll || (queryString.length >= me.minChars)) {
                // expand before starting query so LoadMask can position itself correctly
                me.expand();

                // make sure they aren't querying the same thing
                if (!me.queryCaching || me.lastQuery !== queryString) {
                    me.lastQuery = queryString;

                    if (isLocalMode) {
                        // forceAll means no filtering - show whole dataset.
                        if (forceAll) {
                            store.clearFilter();
                        } else {
                            // Clear filter, but supress event so that the BoundList is not immediately updated.
                            store.clearFilter(true);
                            console.log(ids);
                            store.filter(me.displayField, queryString);
                            store.filterBy(function (record) {
                                var id = record.get('id'),
                                    pop = Ext.Array.contains(ids, id);
                                return !pop
                            });

                        }
                    } else {
                        // Set flag for onLoad handling to know how the Store was loaded
                        me.rawQuery = rawQuery;

                        // In queryMode: 'remote', we assume Store filters are added by the developer as remote filters,
                        // and these are automatically passed as params with every load call, so we do *not* call clearFilter.
                        if (me.pageSize) {
                            // if we're paging, we've changed the query so start at page 1.
                            me.loadPage(1);
                        } else {
                            store.load({
                                params: me.getParams(queryString)
                            });
                        }
                    }
                }

                // Clear current selection if it does not match the current value in the field
                if (me.getRawValue() !== me.getDisplayValue()) {
                    me.ignoreSelection++;
                    me.picker.getSelectionModel().deselectAll();
                    me.ignoreSelection--;
                }

                if (isLocalMode) {
                    me.doAutoSelect();
                }
                if (me.typeAhead) {
                    me.doTypeAhead();
                }
            }
            return true;
        }
    },

    // helper methods used by _sizeView()
    _getMaxWidth : function() { },
    _reSizeBoundList : function() { },
    _reAlignBoundList : function() { }
});
