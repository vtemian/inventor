Ext.define('INV.model.ProductCategory', {
    extend: 'Ext.data.Model',
    fields: [
        {name:'pk', type:'int', mapping: 'pk'},
        {name:'name', type: 'string', mapping:'fields.name'},
        {name:'description', type: 'string', mapping:'fields.description'},
        {name:'status', type: 'string', mapping:'fields.status'},
        {name:'product_id', type: 'int', mapping:'fields.product_id'}
    ],
    hasMany: {model:'INV.model.Product', name:'product'},
    idProperty: 'pk',
    idgen:'uuid'
});
