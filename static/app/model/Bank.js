Ext.define('INV.model.Bank', {
    extend: 'Ext.data.Model',
    fields: [
        {name:'id', type:'int'},
        {name:'name', type: 'string'},
        {name:'iban', type: 'string'},
        {name:'company', type:'int'}
    ],

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