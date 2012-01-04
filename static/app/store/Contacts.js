Ext.define('INV.store.Contacts', {
    extend: 'Ext.data.Store',
    model: 'INV.model.Contact',

    proxy: {
        type: 'rest',
        url: '/contacts/',
        appendId: false,
        reader: {
            type: 'json',
            root: "data",
            successProperty: "success"
        }
    }

});