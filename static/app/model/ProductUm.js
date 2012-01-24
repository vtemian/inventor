Ext.define('INV.model.ProductUm', {
    extend: 'Ext.data.Model',
    fields: [
        {name:'id', type:'int', mapping:'id'},
        {name:'name', type: 'string', mapping:'name'},
        {name:'abbreviation', type: 'string', mapping:'abbreviation'}
    ],
    hasMany: {model:'INV.model.Product', name:'product'}

});
