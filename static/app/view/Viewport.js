Ext.define('INV.view.Viewport', {
    extend: 'Ext.container.Viewport',
    layout: 'fit',

    requires: [
        'INV.view.company.Main',
        'INV.view.customer.Main',
        'INV.view.product.Main',
        'INV.view.ux.Notify'
    ],

    initComponent: function() {
        this.items = {
            layout: {
                type: 'fit',
                align: 'stretch'
            },
            items: [{xtype:'tabpanel',
                    items:[{
                        xtype: 'companymain',
                        title:'Furnizori',
                        layout:'fit'
                        },{
                        xtype: 'productmain',
                        title:'Produse',
                        layout:'fit'
                        },{
                        xtype: 'customermain',
                        title:'Clienti',
                        layout:'fit'
                        }
                    ]}
            ]
        };

        this.callParent();
    }
});