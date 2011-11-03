Ext.define('INV.store.ProductProperties', {
    extend: 'Ext.data.Store',
    model: 'INV.model.ProductProperty',
    autoSync:true,
    //autoLoad:true,
    proxy: {
        type: 'rest',
        //batchActions: false,
        url: '/properties/',
        reader: {
            type: 'json',
            root: "data",
            successProperty: "success"
        }
    }

});