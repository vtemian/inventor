Ext.define('INV.model.Product', {
    extend: 'Ext.data.Model',
    fields: [
        {name:'id', type:'int', mapping:'id'},
        {name:'code', type: 'string', mapping:'code'},
        {name:'name', type: 'string', mapping:'name'},
        {name:'description', type: 'string', mapping:'description'},
        {name:'category', type: 'string', mapping: 'category.name'},
        {name:'um', type: 'string', mapping: 'um.name'},

        {name:'modified', type: 'boolean', mapping:'modified'},
        {name:'notes', type: 'string', mapping:'notes'},
        {name:'barcode', type: 'string', mapping:'barcode'}
        //{name:'properties', mapping: 'fields.properties', persist: true}
    ],
    associations:[
        {type:'belongsTo', model:'INV.model.ProductCategory', associationKey:'category', name:'category'},
        {type:'hasMany', model:'INV.model.ProductProperty', associatedKey:'properties', name:'properties'}
    ]
});
