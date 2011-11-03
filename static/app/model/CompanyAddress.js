Ext.define('INV.model.CompanyAddress', {
    extend: 'Ext.data.Model',
    fields: [
        {name:'id', type:'int'},
        {name:'street', type: 'string'},
        {name:'city', type: 'string'},
        {name:'zipcode', type: 'string'}
    ],
    associations:[
        {type:'belongsTo', model:'INV.model.Company'}
    ]
});