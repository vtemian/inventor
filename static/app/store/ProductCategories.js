Ext.define('INV.store.ProductCategories', {
    extend: 'Ext.data.Store',
    model: 'INV.model.ProductCategory',
    //autoSync:true,
    autoLoad:true,
    proxy: {
        type: 'rest',
        //batchActions: false,
        url: '/categories/',
        reader: {
            type: 'json',
            root: "data",
            successProperty: "success"
        }
    }

});
