Ext.define('INV.store.Products', {
    extend: 'Ext.data.Store',
    model: 'INV.model.Product',
    autoLoad: true,
    //autoSync:true,

    pageSize:15,
    remoteSort: true,
    sorters: [
        {
            property : 'code',
            direction: 'ASC'
        }
    ],
    proxy: {
        type: 'rest',
        url: '/products/',
        appendId: false,
        reader: {
            type: 'json',
            root: 'data',
            successProperty: 'success'
        }
    }
});
