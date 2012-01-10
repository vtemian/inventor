Ext.define('INV.view.ux.ComboColumn', {
    extend: 'Ext.grid.column.Column',
    alias: ['widget.combocolumn'],
    //alternateClassName: 'Ext.grid.ComboColumn',
	
    /**
     * @cfg {String} gridID
     
     * 
     */
    gridId: undefined,
	
    constructor: function(cfg) {
        this.callParent(arguments);
		
		// Detect if there is an editor and if it at least extends a combobox, otherwise just treat it as a normal column and render the value itself
        this.renderer = (this.editor && this.editor.triggerAction) ? this.ComboBoxRenderer(this.editor,this.gridId) : function(value) {return value;};
    },
	
	ComboBoxRenderer: function(combo, gridId) {
		/* Get the displayfield from the store or return the value itself if the record cannot be found */
		var getValue = function(value) {
			var idx = combo.store.find(combo.valueField, value);
			var rec = combo.store.getAt(idx);
			if (rec) {
				return rec.get(combo.displayField);
			}
			return value;
		};
	 
		return function(value) {
			/* If we are trying to load the displayField from a store that is not loaded, add a single listener to the combo store's load event to refresh the grid view */
			//console.log(combo.store);
			if (combo.store.count() == 0 && gridId) {
				combo.store.on(
					'load',
					function() {
						var grid = Ext.getCmp(gridId);
						if (grid) {
							grid.getView().refresh();
						}
					},
					{
						single: true
					}
				);
				return value;
			}

			return getValue(value);
		};
	}
});
