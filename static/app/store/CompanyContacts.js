Ext.define('INV.store.CompanyContacts', {
    extend: 'Ext.data.Store',
    model: 'INV.model.CompanyContact',
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