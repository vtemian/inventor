Ext.define('INV.view.product.Main', {
    extend: 'Ext.panel.Panel',
    alias : 'widget.productmain',

    requires: [
        'INV.view.product.List',
        'INV.view.product.Detail'
    ],

    title:'view product main.js',
    layout: 'fit',
    autoShow: true,

    initComponent: function() {
        this.items = {
            layout: {
                type: 'border',
                align: 'stretch'
            },
            items: [{
                        xtype: 'box',
                        region: 'north',
                        html: '<h1>submeniu</h1>',
                        height: 30
                    },{
                         region: 'west', // this is what makes this panel into a region within the containing layout
                         layout: 'fit',
                         border: false,
                         split: true,
                         width:350,
                         items: [{
                            xtype: 'productlist'
                        }]
                    },{
                         region: 'center',
                         layout: 'border',
                         items: [{
                                    xtype: 'productdetail',
                                    region:'center',
                                    trackResetOnLoad:true
                                },{
                                    region: 'south',
                                    xtype:'tabpanel',
                                    tabPosition:'bottom',
                                    height: 150,
                                    bodyPadding:10,
                                    items: [{
                                        title:'Fisa de magazie',
                                        xtype:'panel'
                                    },{
                                        title:'Stocuri detaliate',
                                        xtype:'panel'
                                    },{
                                        title:'Grafic preturi de achizitie'
                                    },{
                                        title:'Altceva'

                                    }

                                    ]

                            }]
                    }
            ]
        };

        this.callParent(arguments);
    }
});
