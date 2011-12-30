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
                    activeTab:0,
                    items:[{
                        xtype: 'companymain',
                        title:'Furnizori',
                        layout:'fit'
                        },{
                        xtype: 'panel',
                        title:'Intrari',
                        layout:'fit'
                        },{
                        xtype: 'productmain',
                        title:'Produse',
                        layout:'fit'
                        },{
                        xtype: 'panel',
                        title:'Iesiri',
                        layout:'fit'
                        }
                    ]}
            ]
        };

        this.callParent();
    }
});