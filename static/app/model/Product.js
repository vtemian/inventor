Ext.define('INV.model.Product', {
    extend: 'Ext.data.Model',
    fields: [
        {name:'pk', type:'ínt', mapping: 'pk'},
        {name:'code', type: 'string', mapping: 'fields.code'},
        {name:'name', type: 'string', mapping: 'fields.name'},
        {name:'description', type: 'string', mapping: 'fields.description'},
        {name:'category', type: 'string', mapping: 'fields.category.fields.name'},
        {name:'modified', type: 'boolean', mapping: 'fields.modified'},
        {name:'notes', type: 'string', mapping: 'fields.notes'},
        {name:'barcode', type: 'string', mapping: 'fields.barcode'}
        //{name:'properties', mapping: 'fields.properties', persist: true}
    ],
    associations:[
        {type:'belongsTo', model:'INV.model.ProductCategory', associationKey:'category', name:'category'},
        {type:'hasMany', model:'INV.model.ProductProperty', associatedKey:'properties', name:'properties'}],
    idProperty: 'pk'
});
