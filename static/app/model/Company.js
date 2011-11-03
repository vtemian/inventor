Ext.define('INV.model.Company', {
    extend: 'Ext.data.Model',
    fields: [
        {name:'id', type:'int'},
        {name:'name', type: 'string'},
        {name:'vat', type: 'string'},
        {name:'regcom', type: 'string'}
    ],
    associations:[
        {type:'hasMany', model:'INV.model.CompanyAddress', associationKey:'CompanyAddress', name:'companyaddress'},
        {type:'hasMany', model:'INV.model.CompanyBank', associationKey:'CompanyBank', name:'companybank'},
        {type:'hasMany', model:'INV.model.CompanyContact', associationKey:'CompanyContact', name:'companycontact'}
    ]
});
