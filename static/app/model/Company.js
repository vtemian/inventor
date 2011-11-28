Ext.define('INV.model.Company', {
    extend: 'Ext.data.Model',
    fields: [
        {name:'id', type:'int', mapping: 'id'},
        {name:'name', type: 'string', mapping:'name'},
        {name:'vat', type: 'string', mapping:'vat'},
        {name:'regcom', type: 'string', mapping:'regCom'}
    ],
    associations:[
        {type:'hasMany', model:'INV.model.Address', associationKey:'Address', name:'address'},
        {type:'hasMany', model:'INV.model.Bank', associationKey:'Bank', name:'bank'},
        {type:'hasMany', model:'INV.model.Contact', associationKey:'Contact', name:'contact'}
    ],
    idgen: 'uuid'
});
