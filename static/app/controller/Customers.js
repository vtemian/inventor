Ext.define('INV.controller.Customers', {
    extend: 'Ext.app.Controller',

    stores: ['Customers', 'Addresses', 'Banks', 'Contacts'],

    models: ['Customer', 'Address', 'Bank', 'Contact'],

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
                click: this.onDeleteCustomerClick
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

    onLaunch: function() {console.log('customers launch');},

    onCustomersStoreLoad: function(){console.log('customers Store Load');},

    onCustomerSelect: function(selModel, selection) {
        var detail = this.getCustomerDetail();

        if (!Ext.isEmpty(selection)) this.loadCustomer(selection[0]);

        //set focus on the first field from the detail form
        detail.down('textfield').focus();
    },

    onAddCustomerClick: function(button){
        var store = this.getCustomersStore(),
            grid = button.up('grid');

        customer = INV.model.Customer.create();
        while(isNan(customer.id)){
            customer = INV.model.Customer.create();
        }
        this.loadCustomer(customer);
    },

    onDeleteCustomerClick: function(button){
        var store = this.getCustomersStore(),
            grid = button.up('grid'),
            customer = grid.getSelectionModel().getSelection()[0];

        store.remove(customer);
        store.sync({success: function(batch, options){
            console.log('record deleted');

            grid.getView().select(0);
        }},this);
    },

    loadCustomer: function (customer){
        var me = this,
            detail = me.getCustomerDetail(),
            grid = me.getCustomerList(),
            form = detail.getForm(),
            loadedCustomer = form.getRecord(),
            values = form.getValues(false, true, false);

        //ask confirmation before loading a record if form isDirty
        if (form.isDirty()){
            Ext.MessageBox.show({
                title:'Save Changes?',
                msg: 'You have unsaved changes. <br />Would you like to save your changes?',
                buttons: Ext.MessageBox.YESNOCANCEL,
                icon: Ext.MessageBox.QUESTION,
                fn: function(btn){
                    console.log(btn);
                    switch (btn){
                        case 'yes':
                           //save and continue loading
                            if (form.isValid()) {
                                me.saveProduct(loadedCustomer, values);
                                detail.loadRecord(customer);
                            } else {
                                Ext.MessageBox.show({
                                    title:'Invalid fields!',
                                    msg: 'There are invalid fields! <br /> Please correct the invalid inputs and save again',
                                    buttons: Ext.MessageBox.OK
                                });
                            }
                            break;
                        case 'no':
                            //continue loading
                            detail.loadRecord(customer);
                            break;
                        case 'cancel':
                            //stop loading and stay on the modified record
                            grid.getView().select(loadedCustomer, true, true);
                            break;
                    }
                }
            });
        } else {
            detail.loadRecord(customer);
        }
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
