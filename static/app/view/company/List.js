Ext.define('INV.view.company.List' ,{
    extend: 'Ext.grid.Panel',
    alias : 'widget.companylist',

    store: 'Companies',

    layout: 'fit',
    autoShow: true,
    width: 350,

    sortableColumns: true,
    columns: [
         Ext.create('Ext.grid.RowNumberer'),
        {header: 'Name',  dataIndex: 'name',  flex: 1},
        {header: 'VAT', dataIndex: 'vat', flex: 1, hidden: true}
    ],
    tbar: [{
                    text:"Add",
                    icon:'resources/images/add.png',
                    action: "add",
                    scope: this
            },{
                    text:"Delete",
                    icon:'resources/images/delete.png',
                    action: "delete",
                    scope: this
            }],
    dockedItems: [{
        xtype: 'pagingtoolbar',
        store: 'Companies',   // same store GridPanel is using
        dock: 'bottom',
        displayInfo: true
    }],

    initComponent: function() {
        this.callParent(arguments);
    }
});


