Ext.define('INV.model.Company', {
    extend: 'Ext.data.Model',
    fields: [
        {name:'id', type:'int', mapping: 'id'},
        {name:'name', type: 'string', mapping:'name'},
        {name:'vat', type: 'string', mapping:'vat'},
        {name:'regcom', type: 'string', mapping:'regCom'},
        {name:'created_at', type: 'date', mapping:'created_at'},
        {name:'updated_at', type: 'date', mapping:'updated_at'}
    ],
    associations:[
        {type:'hasMany', model:'INV.model.Address', associationKey:'Addresses', name:'addresses', gridId:'companyAddressesGrid'},
        {type:'hasMany', model:'INV.model.Bank', associationKey:'Banks', name:'banks', gridId:'companyBanksGrid'},
        {type:'hasMany', model:'INV.model.Contact', associationKey:'Contacts', name:'contacts', gridId:'companyContactsGrid'}
    ],
    idgen: 'uuid'
});
