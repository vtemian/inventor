Ext.define('INV.model.Product', {
    extend: 'Ext.data.Model',
    fields: [
        {name:'id', type:'int'},
        {name:'code', type: 'string'},
        {name:'name', type: 'string'},
        {name:'description', type: 'string'},
        {name:'category', type: 'string'},
        {name:'modified', type: 'boolean'},
        {name:'notes', type: 'string'},
        {name:'barcode', type: 'string'}
        //{name:'properties', mapping: 'fields.properties', persist: true}
    ],
    associations:[
        {type:'belongsTo', model:'INV.model.ProductCategory', associationKey:'category', name:'category'},
        {type:'hasMany', model:'INV.model.ProductProperty', associatedKey:'properties', name:'properties'}
    ]
});
