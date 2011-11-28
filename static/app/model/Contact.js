Ext.define('INV.model.Contact', {
    extend: 'Ext.data.Model',
    fields: [
        {name:'id', type:'int'},
        {name:'name', type: 'string'},
        {name:'phoneNumber', type: 'string'},
        {name:'email', type: 'email'}
    ]
});