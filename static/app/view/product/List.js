Ext.define('INV.view.product.List' ,{
    extend: 'Ext.grid.Panel',
    alias : 'widget.productlist',

    store: 'Products',
    
    layout: 'fit',
    autoShow: true,
    sortableColumns: true,


    initComponent: function() {

        this.columns = [
             Ext.create('Ext.grid.RowNumberer'),
            {header: 'Code',  dataIndex: 'code',  flex: 0.5},
            {header: 'Product',  dataIndex: 'name',  flex: 1},
            {header: 'Description', dataIndex: 'description', flex: 1, hidden: true},
            {header: 'Category', dataIndex: 'category', flex: 1, hidden: true},
            {header: 'Notes', dataIndex: 'notes', flex: 1, hidden: true},
            {header: 'Bar code', dataIndex: 'barcode', flex: 1, hidden: true},
            {header: 'Modified', dataIndex: 'modified', flex: 1, hidden: true}
        ];
        this.dockedItems =  [{
                xtype: 'pagingtoolbar',
                store: 'Products',   // same store GridPanel is using
                dock: 'bottom',
                displayInfo: true
            },{
                xtype:'toolbar',
                dock:'top',
                items:[{
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

        this.callParent(arguments);

        this.on('viewready',this.viewReady);
        this.mon(this.getStore(), 'load', this.storeLoaded, this);
    },

    viewReady: function(){

        if (this.store.getCount() > 0 && this.rendered) this.getView().select(0);
    },

    storeLoaded: function(store) {

        if (store.getCount() > 0 && this.rendered) this.getView().select(0);
    }
});

