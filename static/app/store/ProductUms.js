Ext.define('INV.store.ProductUms', {
    extend: 'Ext.data.Store',
    model: 'INV.model.ProductUm',
    autoSync:true,

    proxy: {
        type: 'rest',
        url: '/product/ums',
        reader: {
            type: 'json',
            root: "data",
            successProperty: "success"
        }
    }

});