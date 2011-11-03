Ext.define('INV.store.CompanyAddresses', {
    extend: 'Ext.data.Store',
    model: 'INV.model.CompanyAddress',
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