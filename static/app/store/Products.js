Ext.define('INV.store.Products', {
    extend: 'Ext.data.Store',
    model: 'INV.model.Product',
    autoLoad: true,
    //autoSync:true,

    remoteSort: true,
    sorters: [
        {
            property : 'code',
            direction: 'ASC'
        }
    ],
    proxy: {
        type: 'ajax',
        url: '/products/',
        reader: {
            type: 'json',
            root: 'data',
            successProperty: 'success',
            totalProperty:  'total'}
    }
});
