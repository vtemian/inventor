Ext.define('INV.model.Product', {
    extend: 'Ext.data.Model',
    idgen:'uuid',
    fields: [
        {name:'id', type:'int', mapping:'id'},
        {name:'code', type: 'string', mapping:'code'},
        {name:'name', type: 'string', mapping:'name'},
        {name:'price_endetail', type: 'float', mapping:'price_endetail'},
        {name:'price_engros', type: 'float', mapping:'price_engros'},
        {name:'category', type: 'int', mapping: 'category', convert: function(v){return v == 'None'? '': v}},
        {name:'um', mapping: 'um', convert: function(v){return v == 'None'? '': v}},
        {name:'barCode', type: 'string', mapping:'barCode'},
        {name:'description', type: 'string', mapping:'description'},
        {name:'modified', type: 'boolean', mapping:'modified'},
        {name:'notes', type: 'string', mapping:'notes'},
        {name:'created_at', type: 'date', mapping:'created_at'},
        {name:'updated_at', type: 'date', mapping:'updated_at'}

        //{name:'properties', mapping: 'fields.properties', persist: true}
    ],
    associations:[
        {type:'belongsTo', model:'INV.model.ProductCategory', associationKey:'category', name:'category'},
        {type:'hasMany', model:'INV.model.ProductUm', associatedKey:'um', name:'um'}
    ],
    proxy: {
        type: 'rest',
        url: '/products/',
        appendId: false,
        reader: {
            type: 'json',
            root: 'data',
            successProperty: 'success'
        }
    }
});
