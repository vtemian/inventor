Ext.define('INV.model.OpenApiCompany', {
    extend: 'Ext.data.Model',
    fields: [
        {name:'id', type:'int'},
        {name:'name', type: 'string'},
        {name:'cif', type: 'string'},
        {name:'registration_id', type: 'string'},
        {name:'address', type: 'string'},
        {name:'city', type: 'string'},
        {name:'state', type: 'string'},
        {name:'zip', type: 'string'},
        {name:'phone', type: 'string'},
        {name:'fax', type: 'string'},
        {name:'vat', type: 'string'},
        {name:'authorization_number', type: 'string'},
        {name:'created_at', type: 'date'},
        {name:'updated_at', type: 'date'}
    ],
    proxy: {
        type: 'parameterproxy',
        url: 'http://openapi.ro/api/companies/{cif}.json',
        pageParam: undefined,
        timeout:3000,
        reader: {
            type: 'json'
        }
    }
});
