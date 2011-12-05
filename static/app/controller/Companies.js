Ext.define('INV.controller.Companies', {
    extend: 'Ext.app.Controller',

    stores: ['Companies', 'Addresses', 'Banks', 'Contacts'],

    models: ['Company', 'Address', 'Bank', 'Contact'],

    views: ['company.Main','company.List','company.Detail','ux.InlineGrid'],

    refs: [
        {
            ref: 'companyDetail',
            selector: 'companydetail'
        },{
            ref: 'companyList',
            selector: 'companylist'
        }
    ],

    init: function() {

        this.control({
            'companylist': {
                selectionchange: this.onCompanySelect
            },
            'companylist button[action=add]': {
                click: this.onAddCompanyClick
            },
            'companylist button[action=delete]': {
                click: this.onAddCompanyClick
            }
        });

        this.getCompaniesStore().on('load', this.onCompaniesStoreLoad, this);

    },

    onLaunch: function() {

        console.log('companies launch');
    },

    onCompaniesStoreLoad: function(){

        console.log('companies Store Load');
    },

    onCompanySelect: function(selModel, selection) {
        var record = selection[0];

        this.getCompanyDetail().loadRecord(record);
    },

    onAddCompanyClick: function(button){

        var store = this.getCompaniesStore(),
            grid = button.up('grid');

        company = Ext.create('INV.model.Company');

        store.add(company);
        grid.getView().select(company);
    },

    onDeleteCompanyClick: function(button){

        console.log('fire event for Delete Company');
    }
});
