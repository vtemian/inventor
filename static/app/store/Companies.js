Ext.define('INV.store.Companies', {
    extend: 'Ext.data.Store',
    model: 'INV.model.Company',
    autoLoad: true,
    //autoSync:true,

    pageSize:15,
    remoteSort: true,
    sorters: [
        {
            property : 'name',
            direction: 'ASC'
        }
    ],
    proxy: {
        type: 'rest',
        url: '/companies/',
        appendId: false,
        reader: {
            type: 'json',
            root: 'data',
            successProperty: 'success',
            totalProperty:  'total'
        }
    }
});

