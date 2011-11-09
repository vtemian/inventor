Ext.define('INV.model.Product', {
    extend: 'Ext.data.Model',
    idgen:'uuid',
    fields: [
        {name:'id', type:'int', mapping:'id'},
        {name:'code', type: 'string', mapping:'code'},
        {name:'name', type: 'string', mapping:'name'},
        {name:'description', type: 'string', mapping:'description'},
        {name:'category', type: 'string', mapping: 'category.name'},
        {name:'um', mapping: 'um'},
        {name:'notes', type: 'string', mapping:'notes'},
        {name:'barcode', type: 'string', mapping:'barcode'},
        {name:'created', type: 'date', mapping:'created'},
        {name:'updated', type: 'date', mapping:'updated'},
        {name:'modified', type: 'boolean', mapping:'modified', convert: function(record){return record.toLowerCase()}}

        //{name:'properties', mapping: 'fields.properties', persist: true}
    ],
    associations:[
        {type:'belongsTo', model:'INV.model.ProductCategory', associationKey:'category', name:'category'},
        {type:'hasMany', model:'INV.model.ProductUm', associatedKey:'um', name:'um'}
    ]
});
