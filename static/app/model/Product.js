Ext.define('INV.model.Product', {
    extend: 'Ext.data.Model',
    idgen: 'uuid',
    fields: [
        {name:'id', type:'int', mapping:'id'},
        {name:'code', type: 'string', mapping:'code'},
        {name:'name', type: 'string', mapping:'name'},
        {name:'price_endetail', type: 'float', mapping:'price_endetail'},
        {name:'price_engros', type: 'float', mapping:'price_engros'},
        {name:'category', type: 'int', mapping: 'category', convert: function(v){return v == 'None'? '': v}},
        {name:'um_id', mapping:function(obj){ return Ext.isObject(obj.um) ? obj.um.id : ''}},
        {name:'umName',mapping:function(obj){ return Ext.isObject(obj.um) ? obj.um.abbreviation + "  " + obj.name : ''}},
        {name:'barCode', type: 'string', mapping:'barCode'},
        {name:'description', type: 'string', mapping:'description'},
        //{name:'modified', type: 'boolean', mapping:'modified'},
        {name:'created_at', type: 'date', mapping:'created_at'},
        {name:'updated_at', type: 'date', mapping:'updated_at'},
        {name:'bom_id', mapping:function(obj){ return Ext.isObject(obj.bom) ? obj.bom.id : ''}},
        //{name:'bom', mapping:function(obj){ return Ext.isObject(obj.bom) ? obj.bom.name : ''}},
        {name:'scrap_percentage', type: 'float', mapping:function(obj){return Ext.isObject(obj.bom) ? obj.bom.scrap_percentage : '' }},
        {name:'labour_cost', type: 'float', mapping:function(obj){return Ext.isObject(obj.bom) ? obj.bom.labour_cost : ''}}

        //{name:'properties', mapping: 'fields.properties', persist: true}
    ],
    associations:[
        {type:'belongsTo', model:'INV.model.ProductCategory', associationKey:'category', name:'category'},
        {type:'belongsTo', model:'INV.model.ProductBom', associationKey:'bom', name:'bom'},
        {type:'hasMany', model:'INV.model.ProductUm', associatedKey:'um', name:'um'}
    ],
    proxy: {
        type: 'rest',
        url: '/products/',
        appendId: false,
        reader: {
            type: 'json',
            root: 'data',
            successProperty: 'success',
            messageProperty: 'msg'
        }
    }
});
