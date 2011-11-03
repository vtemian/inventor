Ext.define('INV.model.ProductProperty', {
    extend: 'Ext.data.Model',
    fields: [
        {name:'pk', type:'int', mapping: 'pk'},
        {name:'name', type: 'string', mapping:'fields.name'}
    ],
    belongsTo: {model:'INV.model.Product', name:'product'},
    idProperty: 'pk',
    idgen:'uuid',
    proxy: {
        api: {
            read: "data/productsRead"
        },
        type: "ajax",
        reader: {
            root: "data",
            successProperty: "success",
            getAssociatedDataRoot: function(data, associationName) {
                return data.fields[associationName]
            }
        }
    }
});
