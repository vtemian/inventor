Ext.define('INV.model.ProductProperty', {
    extend: 'Ext.data.Model',
    fields: [
        {name:'id', type:'int'},
        {name:'name', type: 'string'}
    ],
    belongsTo: {model:'INV.model.Product', name:'product'}
});
