Ext.define('INV.controller.Customers', {
    extend: 'Ext.app.Controller',

    stores: ['Customers', 'CompanyAddresses', 'CompanyBanks', 'CompanyContacts'],

    models: ['Customer', 'CompanyAddress', 'CompanyBank', 'CompanyContact'],

    views: ['customer.Main','customer.List','customer.Detail','ux.InlineGrid'],

    refs: [
        {
            ref: 'customerDetail',
            selector: 'customerdetail'
        },{
            ref: 'customerList',
            selector: 'customerlist'
        }
    ],

    init: function() {

        this.control({
            'customerlist': {
                selectionchange: this.onCustomerSelect
            },
            'customerlist button[action=add]': {
                click: this.onAddCustomerClick
            },
            'customerlist button[action=delete]': {
                click: this.onAddCustomerClick
            },
            'inlinegrid button[action=add]': {
                click: this.onAddInlineItemClick
            },
            'inlinegrid actioncolumn': {
                click: this.onDeleteInlineItemClick
            }
        });

        this.getCustomersStore().on('load', this.onCustomersStoreLoad, this);

    },

    onLaunch: function() {

        console.log('customers launch');
    },

    onCustomersStoreLoad: function(){

        console.log('customers Store Load');
    },

    onCustomerSelect: function(selModel, selection) {
        var record = selection[0];

        this.getCustomerDetail().loadRecord(record);
    },

    onAddCustomerClick: function(button){

        var store = this.getCustomersStore(),
            grid = button.up('grid');

        customer = Ext.create('INV.model.Customer');

        store.add(customer);
        grid.getView().select(customer);
    },

    onDeleteCustomerClick: function(button){

        console.log('fire event for Delete Customer');
    },

    onAddInlineItemClick: function(button){

        var grid = button.up('grid'),
            store = grid.store,
            model = store.model,
            customerId = this.getCustomerDetail().getCustomerId(),
            maxRecords = 3;

        if (store.getCount() >= maxRecords) {
            Ext.MessageBox.alert('Max Records', 'You have reached max records.');
            return;
        }

        grid.editingPlugin.cancelEdit();

        newRecord =  Ext.create(model);
        console.log('onAddInlineItemClick');

        store.insert(store.getCount() + 1, newRecord);
        //store.sync({callback:function(){console.log('store SYNC CALLBACK dupa ADD');notification.msg('ADD','SYNC CALLBACK dupa ADD')}});
        grid.editingPlugin.startEdit(store.getCount()-1, 1);
    },

    onDeleteInlineItemClick: function(view, cell, recordIndex, cellIndex, e){

        view.editingPlugin.cancelEdit();

        notification.msg('Remove', 'the record ' + view.store.getAt(recordIndex).data.name + ' was deleted!');
        view.store.removeAt(recordIndex);
        //store.sync({callback:function(){console.log('store SYNC CALLBACK dupa DELETE');notification.msg('Remove','SYNC CALLBACK dupa DELETE')}});
    }
});
