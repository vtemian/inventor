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
                                {
                                    xtype:'combo',
                                    name:'category',
                                    fieldLabel: 'Category',
                                    store:'ProductCategories',
                                    valueField:'id',
                                    displayField:'name'
                                },
                                {xtype:'textfield', name:'modified', fieldLabel: 'Modified'},
                                {xtype:'textfield', name:'notes', fieldLabel: 'Notes'},
                                {xtype:'textfield', name:'barcode', fieldLabel: 'Bar code'},
                                {
                                    xtype:'combo',
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
                        }]

                    }
            ];

        this.dockedItems = {
                        dock:'bottom',
                        xtype:'toolbar',
                        items: [{
                                    text: 'Reset',
                                    action:'reset'
                                }, {
                                    text: 'Submit',
                                    action:'submit',
                                    formBind: true, //only enabled once the form is valid
                                    disabled: true
                                }]};

        this.callParent(arguments);
    },



    loadRecord: function(record) {
        this.down('form').loadRecord(record);
    },

    getProductId: function() {
        return this.down('form').getRecord().data['id'];
    }
});
