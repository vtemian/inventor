Ext.define('INV.store.ProductBomIngredients',{
    extend: 'Ext.data.Store',
    model: 'INV.model.ProductBomIngredient',

    //autoSync: true,

    proxy: {
        type: 'rest',
        url: '/ingredients/',
        appendId: false,
        batchActions: false, 
        reader: {
            type: 'json',
            root: 'data',
            successProperty: 'success'
        },
        writer:{
            type: 'json',
            writeAllFields:true
        },
        afterRequest: function(request, success){
            if (!success) {
                notification.msg('Server error!', 'There was a server error. Please report ...');
                console.log('ERROR:::Product->Ingredient::', request, success)
            }
        }
    }

});
