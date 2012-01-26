Ext.define('INV.model.ProductIngredient',{
    extend:'Ext.data.Model',
    fields:[
        {name:'id', type:'int', mapping:'id'},
        {name:'bom', type:'int', mapping:'bom'},
//        {name:'product', type:'int', mapping:'product_id', persist: true},
        {name:'ingredient', type:'int', mapping:'ingredient'},
        {name:'quantity', type:'float', mapping:'quantity'}
    ],
    associations:[
        {type:'belongsTo', model:'INV.model.Product', associationKey:'bom', name:'bom', getterName:'getBom', setterName:'setBom'}
    ],
    proxy: {
        type: 'rest',
        url: '/ingredients/',
        appendId: false,
        reader: {
            type: 'json',
            root: 'data',
            successProperty: 'success',
            messageProperty: 'msg'
        }
    }
});
