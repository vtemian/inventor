Ext.define('INV.controller.Companies', {
    extend: 'Ext.app.Controller',

    stores: ['Companies', 'CompanyAddresses', 'CompanyBanks', 'CompanyContacts'],

    models: ['Company', 'CompanyAddress', 'CompanyBank', 'CompanyContact'],

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
            },
            'inlinegrid button[action=add]': {
                click: this.onAddAddressClick
            },
            'inlinegrid actioncolumn': {
                click: this.onDeleteAddressClick
            }
        });

        this.getCompaniesStore().on('load', this.onCompaniesStoreLoad, this);

    },

    onLaunch: function() {
        console.log('app launch');

    },

    onCompaniesStoreLoad: function(){
        notification.msg('LOAD Companies','store event');
        console.log(this.getCompaniesStore());
        this.getCompanyList().getSelectionModel().select(0);
    },

    onCompanySelect: function(selModel, selection) {

        this.getCompanyDetail().loadRecord(selection[0]);
    },

    onAddCompanyClick: function(button){
        console.log('fire event for New Company');
    },

    onDeleteCompanyClick: function(button){
        console.log('fire event for Delete Company');
    },

    onAddAddressClick: function(button){

        var grid = button.up('grid'),
            store = this.getCompanyAddressesStore();
            companyId = this.getCompanyDetail().getCompanyId();
            maxRecords = 3;

        if (store.getCount() >= maxRecords) {
            Ext.MessageBox.alert('Max Records', 'You have reached max records.');
            return;
        }

        grid.editingPlugin.cancelEdit();

        address = Ext.create('INV.model.CompanyAddress',{
            address: 'Street, no, ap',
            city: 'City, State',
            zipcode: 'zipcode',
            company_id: companyId
        });
        //console.log(address);
        store.insert(store.getCount() + 1, address);
        //store.sync({callback:function(){console.log('store SYNC CALLBACK dupa ADD');notification.msg('ADD','SYNC CALLBACK dupa ADD')}});
        grid.editingPlugin.startEdit(store.getCount()-1, 1);
    },

    onDeleteAddressClick: function(view, cell, recordIndex, cellIndex, e){//view, rowIndex, colIndex, item, e){
        var store = this.getCompanyAddressesStore();

        view.editingPlugin.cancelEdit();

        notification.msg('Remove', 'the record ' + view.store.getAt(recordIndex).data.name + ' was deleted!');
        store.removeAt(recordIndex);
        //store.sync({callback:function(){console.log('store SYNC CALLBACK dupa DELETE');notification.msg('Remove','SYNC CALLBACK dupa DELETE')}});
    }
});
