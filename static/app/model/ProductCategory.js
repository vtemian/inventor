Ext.define('INV.model.ProductCategory', {
    extend: 'Ext.data.Model',
    fields: [
        {name:'id', type:'int'},
        {name:'name', type: 'string'},
        {name:'description', type: 'string'}
    ],
    hasMany: {model:'INV.model.Product', name:'product'}
});
