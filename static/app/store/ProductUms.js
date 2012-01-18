Ext.define('INV.store.ProductUms', {
    extend: 'Ext.data.Store',
    model: 'INV.model.ProductUm',
    //autoSync:true,
    autoLoad:true,

    proxy: {
        type: 'rest',
        url: '/ums/',
        reader: {
            type: 'json',
            root: "data",
            successProperty: "success"
        }
    }

});