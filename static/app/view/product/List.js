Ext.define('INV.view.product.List' ,{
    extend: 'Ext.grid.Panel',
    alias : 'widget.productlist',

    store: 'Products',
    
    layout: 'fit',
    autoShow: true,
    width: 350,

    sortableColumns: true,
    columns: [
         Ext.create('Ext.grid.RowNumberer'),
        {header: 'Code',  dataIndex: 'code',  flex: 0.5},
        {header: 'Name',  dataIndex: 'name',  flex: 1},
        {header: 'Description', dataIndex: 'description', flex: 1, hidden: true},
        {header: 'Category', dataIndex: 'category', flex: 1, hidden: true},
        {header: 'Notes', dataIndex: 'notes', flex: 1, hidden: true},
        {header: 'Bar code', dataIndex: 'barcode', flex: 1, hidden: true},
        {header: 'Modified', dataIndex: 'modified', flex: 1, hidden: true}
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
        store: 'Products',   // same store GridPanel is using
        dock: 'bottom',
        displayInfo: true
    }],

    initComponent: function() {
        this.callParent(arguments);
    }
});

