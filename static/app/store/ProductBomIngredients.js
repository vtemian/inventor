Ext.define('INV.store.ProductBomIngredients',{
    extend: 'Ext.data.Store',
    model: 'INV.model.ProductBomIngredient',

    //autoSync: true,

    proxy: {
        type: 'rest',
        url: '/ingredients/',
        appendId: false,
        reader: {
            type: 'json',
            root: 'data',
            successProperty: 'success'
        }
    }

});
