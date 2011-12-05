Ext.define('INV.store.Addresses', {
    extend: 'Ext.data.Store',
    model: 'INV.model.Address',
    autoSync:true,

    proxy: {
        type: 'rest',
        url: '/address/',
        reader: {
            type: 'json',
            root: "data",
            successProperty: "success"
        }
    }

});