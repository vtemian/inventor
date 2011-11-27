Ext.define('INV.model.ProductBom',{
    extend:'Ext.data.Model',
    fields:[
        {name:'id', type:'int', mapping:'id'},
        {name:'name', type:'string', mapping:'name'},
        {name:'scrap_percentage', type:'float', mapping:'scrap_percentage'},
        {name:'labour_cost', type:'float', mapping:'labour_cost'}
    ],
    associations:[
        {type:'hasMany', model:'INV.model.ProductBomIngredient', associatedKey:'ingredients', name:'ingredients'}
    ]

});
