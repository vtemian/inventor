Ext.define('INV.model.ProductBomIngredient',{
    extend:'Ext.data.Model',
    fields:[
        {name:'id', type:'int', mapping:'id'},
        {name:'ingredient', type:'int', mapping:'product_id'},
        {name:'quantity', type:'float', mapping:'quantity'},
        {name:'um', type:'int', mapping:'um_id'},
        {name:'loss', type:'float', mapping:'loss'}
    ],
    associations:[
        {type:'belongsTo', model:'INV.model.ProductBom', associationKey:'bom', name:'bom'}
    ]
});
