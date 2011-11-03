Ext.define('INV.model.CompanyContact', {
    extend: 'Ext.data.Model',
    fields: [
        {name:'id', type:'int'},
        {name:'name', type: 'string'},
        {name:'phoneNumber', type: 'string'},
        {name:'email', type: 'email'}
    ],
    associations:[
        {type:'belongsTo', model:'INV.model.Company'}
    ]
});