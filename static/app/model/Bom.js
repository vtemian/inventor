Ext.define('INV.model.Bom',{
    extend:'Ext.data.Model',
    fields:[
        {name:'id', type:'int', mapping:'id'},
        {name:'product', type:'string', mapping:'product_id'},
        {name:'quantity', type:'float', mapping:'quantity'},
        {name:'um', type:'int', mapping:'um_id'},
        {name:'loss', type:'string', mapping:'loss'}
    ]


});
