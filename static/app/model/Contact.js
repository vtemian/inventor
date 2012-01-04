Ext.define('INV.model.Contact', {
    extend: 'Ext.data.Model',
    fields: [
        {name:'id', type:'int'},
        {name:'name', type: 'string'},
        {name:'phoneNumber', type: 'string'},
        {name:'email', type: 'email'},
        {name:'company', type:'int'}
    ],

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