Ext.define('INV.store.Banks', {
    extend: 'Ext.data.Store',
    model: 'INV.model.Bank',

    proxy: {
        type: 'rest',
        url: '/banks/',
        appendId: false,
        reader: {
            type: 'json',
            root: "data",
            successProperty: "success"
        }
    }

});