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
        {name:'um', type: 'int', mapping:'um', convert: function(v){return v == 'None'? '': v}}, //mapping:function(obj){ return Ext.isObject(obj.um) ? obj.um.id : obj.um}},
//        {name:'umName',mapping:function(obj){ return Ext.isObject(obj.um) ? obj.um.abbreviation + "  " + obj.name : obj.name}},
        {name:'barCode', type: 'string', mapping:'bar_code'},
        {name:'description', type: 'string', mapping:'description'},
        {name:'scrap_percentage', type: 'float', mapping:'scrap_percentage'},//mapping:function(obj){return Ext.isObject(obj.bom) ? obj.bom.scrap_percentage : '' }},
        {name:'labour_cost', type: 'float', mapping:'labour_cost'},//mapping:function(obj){return Ext.isObject(obj.bom) ? obj.bom.labour_cost : ''}}
        {name:'created_at', type: 'date', mapping:'created_at'},
        {name:'updated_at', type: 'date', mapping:'updated_at'}
    ],
    associations:[
        {type:'belongsTo', model:'INV.model.ProductUm', associationKey:'um', name:'um'},
        {type:'belongsTo', model:'INV.model.ProductCategory', associationKey:'category', name:'category'},
        {type:'hasMany', model:'INV.model.ProductIngredient', associationKey:'ingredients', name:'ingredients'}//, getterName:'getBom', setterName:'setBom'}
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
