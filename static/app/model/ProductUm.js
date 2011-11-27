Ext.define('INV.model.ProductUm', {
    extend: 'Ext.data.Model',
    fields: [
        {name:'id', type:'int', mapping:'id'},
        {name:'name', type: 'string', mapping:'name'},
        {name:'abbreviation', type: 'string', mapping:'abbreviation'},
        {name:'measures', type: 'string', mapping:'measures'},
        {name:'conversionFactor', type: 'float', mapping:'conversionFactor'},
        {name:'conversionUnit', type: 'string', mapping:'conversionUnit'}
    ],
    associations:[
        {type:'belongsTo', model:'INV.model.Product', associatedKey:'product', name:'product'}
    ]
});
