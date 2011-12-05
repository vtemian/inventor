Ext.define('INV.model.ProductBomIngredient',{
    extend:'Ext.data.Model',
    fields:[
        {name:'id', type:'int', mapping:'id'},
        {name:'bom', type:'int', mapping:'bom_id'},
        {name:'ingredient', type:'int', mapping:'ingredient'},
        {name:'quantity', type:'float', mapping:'quantity'},
        {name:'um', type:'int', mapping:'um'},
        {name:'loss', type:'float', mapping:'loss'}
    ],
    associations:[
        {type:'belongsTo', model:'INV.model.ProductBom', associationKey:'bom', name:'bom'}
    ],
    proxy: {
        type: 'rest',
        url: '/ingredients/',
        appendId: false,
        reader: {
            type: 'json',
            root: 'data',
            successProperty: 'success'
        }
    }
});
