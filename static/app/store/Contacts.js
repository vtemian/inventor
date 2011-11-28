Ext.define('INV.store.Contacts', {
    extend: 'Ext.data.Store',
    model: 'INV.model.Contact',
    autoSync:true,

    proxy: {
        type: 'rest',
        url: '/contact/',
        reader: {
            type: 'json',
            root: "data",
            successProperty: "success"
        }
    }

});