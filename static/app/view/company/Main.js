Ext.define('INV.view.company.Main', {
    extend: 'Ext.panel.Panel',
    alias : 'widget.companymain',

    requires: [
        'INV.view.company.List',
        'INV.view.company.Detail'
    ],

    title:'view company main.js',
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
                        html: '<h1>html</h1>',
                        height: 30
                    },{
                         region: 'west', // this is what makes this panel into a region within the containing layout
                         layout: 'fit',
                         border: false,
                         width:350,
                         split: true,
                         items: [{
                            xtype: 'companylist'
                        }]
                    },{
                         region: 'center',
                         layout: 'border',
                         items: [{
                                    xtype: 'companydetail',
                                    region:'center'
                                },{
                                    region: 'south',
                                    minheight: 100,
                                    bodyPadding:10,
                                    items: [
                                        {xtype:'textfield', name:'code', fieldLabel: 'Code'},
                                        {xtype:'textfield', name:'name', fieldLabel: 'Name'}
                                    ]
                            }]
                    }
            ]
        };

        this.callParent(arguments);
    }
});

