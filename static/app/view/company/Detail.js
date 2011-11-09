Ext.define('INV.view.company.Detail', {
    extend: 'Ext.panel.Panel',
    alias : 'widget.companydetail',

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
                            title: '<p style="font-size:18px">Company</p>',
                            style: {border:'none'},
                            width: 600,
                            items: [{xtype:'textfield', name:'name', fieldLabel: 'Name'},
                                     {xtype:'textfield', name:'vat', fieldLabel: 'VAT'},
                                     {xtype:'textfield', name:'regcom', fieldLabel: 'RegCOM'}
                            ]
                        }]
                    },{
                        xtype:'fieldset',
                        title: '<p style="font-size:18px">Address, Contact, Bank</p>',
                        style: {border:'none'},
                        border:false,
                        items: [{
                                xtype: 'fieldcontainer',
                                fieldLabel: 'Address',
                                //padding: 10,
                                width:600,
                                items: [{
                                        xtype:'inlinegrid',
                                        id: 'address',
                                        store:'CompanyAddresses',
                                        maxWidth:400,
                                        //height:100,
                                        columns:[{dataIndex: 'street', width: 100, editor: 'textfield'},
                                            {dataIndex: 'city', width: 100, editor: 'textfield'},
                                            {dataIndex: 'zipcode', width: 80, editor: 'textfield'}
                                        ]
                                    }]
                            },{
                                xtype: 'fieldcontainer',
                                fieldLabel: 'Contacts',
                                //padding: 10,
                                width:600,
                                items: [{
                                        xtype:'inlinegrid',
                                        id: 'contact',
                                        store:'CompanyContacts',
                                        maxWidth:400,
                                        //height:100,
                                        columns:[{dataIndex: 'name', width: 60, editor: 'textfield'},
                                            {dataIndex: 'phoneNumber', width: 70, editor: 'textfield'},
                                            {dataIndex: 'email', width: 120, editor: 'textfield'}
                                        ]
                                    }]
                            },{
                                xtype: 'fieldcontainer',
                                fieldLabel: 'Bank info',
                                //padding: 10,
                                width:600,
                                items: [{
                                        xtype:'inlinegrid',
                                        id: 'bank',
                                        store:'CompanyBanks',
                                        maxWidth:400,
                                        //height:100,
                                        columns:[{dataIndex: 'name', width: 100, editor: 'textfield'},
                                            {dataIndex: 'iban', width: 100, editor: 'textfield'}
                                        ]
                                    }]
                            }]}


            ];
        this.callParent(arguments);
    },

    loadRecord: function(record) {
        this.down('form').loadRecord(record);
        this.down('#address').store.loadData(record.companyaddressStore.data.items, false);
        this.down('#bank').store.loadData(record.companybankStore.data.items, false);
        this.down('#contact').store.loadData(record.companycontactStore.data.items, false);
    },

    getCompanyId: function() {
        return this.down('form').getRecord().data['id'];
    }
});