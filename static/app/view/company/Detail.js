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
                            border:false,
                            items: [{xtype:'textfield', name:'name', fieldLabel: 'Name'},
                                     {xtype:'textfield', name:'vat', fieldLabel: 'VAT'},
                                     {xtype:'textfield', name:'regcom', fieldLabel: 'RegCOM'}
                            ]
                        }]
                    },{
                        xtype:'fieldset',
                        title: '<p style="font-size:18px">Address, Contact, Bank</p>',
            collapsible:true,
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
                                        columns:[{dataIndex: 'street', editor: {allowBlank: false}},
                                            {dataIndex: 'city', editor: {allowBlank: false}},
                                            {dataIndex: 'zipcode', editor: {allowBlank: false}}
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
                                        columns:[{dataIndex: 'name', editor: {allowBlank: false}},
                                            {dataIndex: 'phoneNumber', editor: {allowBlank: false}},
                                            {dataIndex: 'email', editor: {allowBlank: false}}
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
                                        columns:[{dataIndex: 'name', editor: {allowBlank: false}},
                                            {dataIndex: 'iban', editor: {allowBlank: false}}
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
