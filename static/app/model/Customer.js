Ext.define('INV.model.Customer', {
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
        {type:'hasMany', model:'INV.model.Address', associationKey:'Addresses', name:'addresses'},
        {type:'hasMany', model:'INV.model.Bank', associationKey:'Banks', name:'banks'},
        {type:'hasMany', model:'INV.model.Contact', associationKey:'Contacts', name:'contacts'}
    ],
    idgen: 'uuid'
});
