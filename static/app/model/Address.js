Ext.define('INV.model.Address', {
    extend: 'Ext.data.Model',
    fields: [
        {name:'id', type:'int'},
        {name:'street', type: 'string'},
        {name:'city', type: 'string'},
        {name:'zipcode', type: 'string'}
    ]
});