Ext.define('INV.store.Addresses', {
    extend: 'Ext.data.Store',
    model: 'INV.model.Address',

    proxy: {
        type: 'rest',
        url: '/addresses/',
        appendId: false,
        reader: {
            type: 'json',
            root: "data",
            successProperty: "success"
        }
    }

});