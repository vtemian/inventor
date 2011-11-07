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
                    trackResetOnLoad:true,
                    items:[{xtype:'fieldset',
                            title: '<p style="font-size:18px">Product</p>',
                            style: {border:'none'},
                            items: [

                                {xtype:'textfield', name:'code', fieldLabel: 'Code'},
                                {xtype:'textfield', name:'name', fieldLabel: 'Name'},
                                {xtype:'textfield', name:'description', fieldLabel: 'Description'},
                                {xtype:'textfield', name:'category', fieldLabel: 'Category'},
                                {xtype:'textfield', name:'modified', fieldLabel: 'Modified'},
                                {xtype:'textfield', name:'notes', fieldLabel: 'Notes'},
                                {xtype:'textfield', name:'barcode', fieldLabel: 'Bar code'},
                                {   xtype:'combo',
                                    name:'um',
                                    fieldLabel: 'UM',
                                    multiSelect: true,
                                    store:'ProductUms',
                                    valueField: 'id',
                                    displayField: 'name',
                                    queryMode: 'local',
                                    triggerAction: 'all'
                                }
                            ]
                        }],
                    buttons: [{
                                    text: 'Reset',
                                    handler: function() {
                                        this.up('form').getForm().reset();
                                    }
                                }, {
                                    text: 'Submit',
                                    formBind: true, //only enabled once the form is valid
                                    disabled: true,
                                    handler: function() {
                                        var form = this.up('form').getForm();
                                        if (form.isValid()) {
                                            form.submit({
                                                success: function(form, action) {
                                                   Ext.Msg.alert('Success', action.result.msg);
                                                },
                                                failure: function(form, action) {
                                                    Ext.Msg.alert('Failed', action.result.msg);
                                                }
                                            });
                                        }
                                    }
                                }]
                    },{
                    xtype:'fieldset',
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
                                    id: 'ums',
                                    store:'ProductUms',
                                    maxWidth:400,
                                    //height:100,
                                    columns:[{dataIndex: 'id', width:20},
                                        {dataIndex: 'name', editor: 'textfield'}
                                    ]
                                }]
                        }]
                    }
            ];

        this.callParent(arguments);
    },

    loadRecord: function(record) {
        this.down('form').loadRecord(record);
        //this.down('#ums').store.loadData(record.umStore.data.items, false);
    },

    getProductId: function() {
        return this.down('form').getRecord().data['id'];
    }
});
