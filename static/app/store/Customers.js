Ext.define('INV.store.Customers', {
    extend: 'Ext.data.Store',
    model: 'INV.model.Customer',
    //autoLoad: true,
    //autoSync:true,

    remoteSort: true,
    sorters: [
        {
            property : 'name',
            direction: 'ASC'
        }
    ],
    proxy: {
        type: 'rest',
        url: '/customers/',
        reader: {
            type: 'json',
            root: 'data',
            successProperty: 'success',
            totalProperty:  'total'
        }
    }
});

