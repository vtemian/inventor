Ext.define('INV.view.company.List' ,{
    extend: 'Ext.grid.Panel',
    alias : 'widget.companylist',

    store: 'Companies',

    layout: 'fit',
    autoShow: true,
    width: 350,

    sortableColumns: true,



    initComponent: function() {

        this.columns = [
             Ext.create('Ext.grid.RowNumberer'),
            {header: 'Company',  dataIndex: 'name',  flex: 1},
            {header: 'VAT', dataIndex: 'vat', flex: 1, hidden: true}
        ];
        
        this.dockedItems = [{
            xtype: 'pagingtoolbar',
            store: 'Companies',   // same store GridPanel is using
            dock: 'bottom',
            displayInfo: true
        },{
            xtype: 'toolbar',
            dock: 'top',
            items: [{
                    text:"Add",
                    icon:'resources/images/add.png',
                    action: "add",
                    scope: this
                },{
                    text:"Delete",
                    icon:'resources/images/delete.png',
                    action: "delete",
                    scope: this
                }]

        }];

        this.on('viewready',function(){
            console.log('nr de inregistrari: ',this.store.getCount());
            if (this.store.getCount()) this.getView().select(0);
        });

        this.callParent(arguments);
    }
});


