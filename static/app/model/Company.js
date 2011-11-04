Ext.define('INV.model.Company', {
    extend: 'Ext.data.Model',
    fields: [
        {name:'id', type:'int', mapping: 'id'},
        {name:'name', type: 'string', mapping:'name'},
        {name:'vat', type: 'string', mapping:'vat'},
        {name:'regcom', type: 'string', mapping:'regCom'}
    ],
    associations:[
        {type:'hasMany', model:'INV.model.CompanyAddress', associationKey:'CompanyAddress', name:'companyaddress'},
        {type:'hasMany', model:'INV.model.CompanyBank', associationKey:'CompanyBank', name:'companybank'},
        {type:'hasMany', model:'INV.model.CompanyContact', associationKey:'CompanyContact', name:'companycontact'}
    ]
});
