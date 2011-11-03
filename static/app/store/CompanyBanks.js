Ext.define('INV.store.CompanyBanks', {
    extend: 'Ext.data.Store',
    model: 'INV.model.CompanyBank',
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