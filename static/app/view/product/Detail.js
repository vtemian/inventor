Ext.define('INV.view.product.Detail', {
    extend: 'Ext.panel.Panel',
    alias : 'widget.productdetail',

    layout: 'auto',
    autoShow: true,
    autoScroll:true,
    border: false,
    bodyPadding: 10,


    initComponent: function() {
        this.items = [{
                    xtype:'form',
                    border:false,
                    items:[{xtype:'fieldset',
                            title: '<p style="font-size:18px">Product</p>',
                            style: {border:'none'},
                            border:false,
                            items: [

                                {xtype:'textfield', name:'code', fieldLabel: 'Code'},
                                {xtype:'textfield', name:'name', fieldLabel: 'Name'},
                                {xtype:'textfield', name:'description', fieldLabel: 'Description'},
                                {xtype:'textfield', name:'category', fieldLabel: 'Category'},
                                {xtype:'textfield', name:'modified', fieldLabel: 'Modified'},
                                {xtype:'textfield', name:'notes', fieldLabel: 'Notes'},
                                {xtype:'textfield', name:'barcode', fieldLabel: 'Bar code'}
                            ]}
                    ]
                },{xtype:'fieldset',
                            title: '<p style="font-size:18px">Properties</p>',
                            style: {border:'none'},
                            border:false,
                            items: [{
                                    xtype: 'fieldcontainer',
                                    fieldLabel: 'Variety',
                                    //padding: 10,
                                    width:600,
                                    items: [{
                                            xtype:'inlinegrid',
                                            //id: 'properties',
                                            store:'CompanyBanks',
                                            maxWidth:400,
                                            //height:100,
                                            columns:[{dataIndex: 'id', width:20},
                                                {dataIndex: 'name', editor: {allowBlank: false}}
                                            ]
                                        }]
                                }]
                }
            ];
        this.callParent(arguments);
    },

    loadRecord: function(record) {
        this.down('form').loadRecord(record);
        //this.down('#properties').store.loadData(record.propertiesStore.data.items, false);
    },

    getProductId: function() {
        //return this.down('form').getRecord().data['id'];
    }
});
