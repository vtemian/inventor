Ext.define('INV.view.Viewport', {
    extend: 'Ext.container.Viewport',
    layout: 'fit',

    requires: [
        'INV.view.product.Main',
        'INV.view.ux.Notify'
    ],

    initComponent: function() {
        this.items = {
            layout: {
                type: 'fit',
                align: 'stretch'
            },
            items: [{
                xtype: 'productmain',
                layout:'fit'
            }]
        };

        this.callParent();
    }
});
