Ext.define('INV.model.Company', {
    extend: 'Ext.data.Model',
    idgen: 'uuid',
    fields: [
        {name:'id', type:'int', mapping: 'id'},
        {name:'name', type: 'string', mapping:'name'},
        {name:'cif', type: 'string', mapping:'cif'},
        {name:'regCom', type: 'string', mapping:'regCom'},
        {name:'created_at', type: 'date', mapping:'created_at'},
        {name:'updated_at', type: 'date', mapping:'updated_at'}
    ],
    associations:[
        {type:'hasMany', model:'INV.model.Address', associationKey:'Addresses', name:'addresses', gridId:'companyAddressesGrid'},
        {type:'hasMany', model:'INV.model.Bank', associationKey:'BankAccounts', name:'banks', gridId:'companyBanksGrid'},
        {type:'hasMany', model:'INV.model.Contact', associationKey:'Contacts', name:'contacts', gridId:'companyContactsGrid'}
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
