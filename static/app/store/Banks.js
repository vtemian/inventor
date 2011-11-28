Ext.define('INV.store.Banks', {
    extend: 'Ext.data.Store',
    model: 'INV.model.Bank',
    autoSync:true,

    proxy: {
        type: 'rest',
        url: '/bank/',
        reader: {
            type: 'json',
            root: "data",
            successProperty: "success"
        }
    }

});