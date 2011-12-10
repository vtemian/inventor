Ext.define('INV.view.ux.InlineGrid' ,{
    extend: 'Ext.grid.Panel',
    alias : 'widget.inlinegrid',

    autoShow:true,
    bodyStyle:'border-style:none',
    border:false,
    hideHeaders: true,
    cls:'row-noborder',
    overCls:'overrow-border',
    viewConfig: {
        stripeRows: false,
        layout:'fit'
    },
    scroll:false,

    clicksToEdit:1,
    clicksToMoveEditor:1,

    columns:[
        ],

    addText:'',
    addToolTip:'',
    deleteToolTip:'',

    initComponent: function() {
        var me = this;

        me.columns.push({
			xtype:'actioncolumn',
            width:25,
			items: [{
				icon: 'resources/images/delete.png',
				tooltip: me.deleteToolTip
			}]
		});

        me.dockedItems = [{
                xtype: 'toolbar',
                ui: 'nocolor',
                dock: 'bottom',
                //width: 30,
                //layout: 'fit',
                items: [
                    {
                        icon: 'resources/images/add.png',
                        action:'add',
                        text:me.addText,
                        tooltip: me.addToolTip
                    }]
            }];

        me.plugins = [Ext.create('Ext.grid.plugin.CellEditing', {
            clicksToMoveEditor: 1,
            autoCancel: true,
            errorSummary: true
        })];

        me.callParent(arguments);


    }
});
