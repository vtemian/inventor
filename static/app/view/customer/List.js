Ext.define('INV.view.customer.List' ,{
    extend: 'Ext.grid.Panel',
    alias : 'widget.customerlist',

    store: 'Customers',

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
            store: 'Customers',   // same store GridPanel is using
            dock: 'bottom',
            displayInfo: true
        },{
            xtype: 'toolbar',
            dock: 'top',
            items: [		{

                        text:'Search',
                        xtype:'textfield',
                        emptyText:'search',
                        width:100,
                        scope: this
                },{xtype:'tbfill'},{
                    text:"Add",
                    icon:'resources/images/add.png',
                    action: "add",
                    scope: this
                },{
                        text:'Copy',
                        icon:'resources/images/copy.png',
                        action: "copy",
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