Ext.define('INV.store.ProductsList', {
    extend: 'Ext.data.Store',
    model: 'INV.model.Product',
    autoLoad: true,

    remoteSort: true,
    sorters: [
        {
            property : 'name',
            direction: 'DESC'
        },
        {
            property : 'code',
            direction: 'ASC'
        }
    ],
    proxy: {
        type: 'ajax',
        url: '/products/list/',
        appendId: false,
        reader: {
            type: 'json',
            root: 'data',
            successProperty: 'success'
        }
    }
});

