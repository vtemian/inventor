Ext.define('INV.model.CompanyBank', {
    extend: 'Ext.data.Model',
    fields: [
        {name:'id', type:'int'},
        {name:'name', type: 'string'},
        {name:'iban', type: 'string'}
    ],
    associations:[
        {type:'belongsTo', model:'INV.model.Company'}
    ]
});