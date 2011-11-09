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
                    layout:'column',
                    trackResetOnLoad:true,
                    items:[{
                            width: 550,
                            border:false,
                            items:[{
                                xtype:'fieldset',
                                title: '<p style="font-size:18px">Product</p>',
                                style: {border:'none'},
                                defaults:{width:350},
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
                                    {xtype:'checkbox', name:'modified', fieldLabel: 'Modified'},
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
                        },{
                            columnWidth: .5,
                            align:'right',
                            border:false,
                            items:[{
                                    xtype:'fieldset',
                                    title: '<p style="font-size:18px">Status</p>',
                                    defaults:{
                                        disabled:true
                                    },
                                    items:[
                                        {xtype:'textfield', name:'created', fieldLabel: 'Created'},
                                        {xtype:'textfield', name:'updated', fieldLabel: 'Updated'}
                                    ]
                            }]}
                    ]

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
