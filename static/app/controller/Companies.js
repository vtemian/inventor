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
                click: this.onDeleteCompanyClick
            },
            'companydetail button[action=submit]':{
                click: this.onDetailFormSubmitClick
            },
            'companydetail inlinegrid button[action=add]': {
                click: this.onAddAssociatedClick
            },
            'companydetail inlinegrid actioncolumn':{
                click: this.onDeleteAssociatedClick
            },
            'companydetail inlinegrid': {
                edit: this.editAssociatedData
            }
        });

        this.getCompaniesStore().on('load', this.onCompaniesStoreLoad, this);
    },

    onCompaniesStoreLoad: function(store){
        var view = this.getCompanyList().getView();

        if (store.getCount>0 && view.rendered){view.select(0);}
    },

    onCompanySelect: function(selModel, selection) {
        var detail = this.getCompanyDetail();

        if (!Ext.isEmpty(selection)) this.loadCompany(selection[0]);

        //set focus on the first field from the detail form
        detail.down('textfield').focus();
    },

    onAddCompanyClick: function(button){

        var store = this.getCompaniesStore(),
            grid = button.up('grid');

        company = INV.model.Company.create();
        while (isNaN(company.id)){
            company = INV.model.Company.create();
        }
        this.loadCompany(company);
    },

    loadCompany: function (company){
        var me = this,
            detail = me.getCompanyDetail(),
            grid = me.getCompanyList(),
            form = detail.getForm(),
            loadedCompany = form.getRecord(),
            values = form.getValues(false, true, false);

        //ask confirmation before loading a record if form isDirty
        if (form.isDirty()){
            Ext.MessageBox.show({
                title:'Save Changes?',
                msg: 'You have unsaved changes. <br />Would you like to save your changes?',
                buttons: Ext.MessageBox.YESNOCANCEL,
                icon: Ext.MessageBox.QUESTION,
                fn: function(btn){
                    switch (btn){
                        case 'yes':
                            //save and continue loading
                            if (form.isValid()) {
                                me.saveCompany(loadedCompany, values);
                                detail.loadRecord(company);
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
                            detail.loadRecord(company);
                            break;
                        case 'cancel':
                            //stop loading and stay on the modified record
                            grid.getView().select(loadedCompany, true, true);
                            break;
                    }
                }
            });
        } else {
            detail.loadRecord(company);
        }
    },

    saveCompany: function(company,values){
        var me = this,
            isNewCompany = company.phantom,
            store = this.getCompaniesStore();

        company.set(values);
        if (isNewCompany){
            store.add(company);
        }
        company.save({success: function(company, operation){
            //reload associated stores, etc
            notification.msg('company saved', 'The company is saved, yupie! ');
            },
            failure: function(company, operation){
                if (isNewCompany){
                    store.remove(company);
                }
                notification.msg('company save error!', 'There was a server error. ');
                console.log('ERROR:::company->savecompany::',operation.getError())
            }
        });
    },

    onDeleteCompanyClick: function(button){
        var store = this.getCompaniesStore(),
            grid = button.up('grid'),
            company = grid.getSelectionModel().getSelection()[0];

        store.remove(company);
        store.sync({success: function(batch, options){
            console.log('record deleted');

            grid.getView().select(0);
        }},this);
        console.log('fire event for Delete Company');
    },

    onDetailFormSubmitClick: function(button){
        var form = button.up('form').getForm(),
            company = form.getRecord(),
            values = form.getValues(false, true, false),
            grid = this.getCompanyList();

        // the form should be dirty & valid if we are here
        button.disable();
        this.saveCompany(company, values);
        grid.getView().select(company, true, true);
        this.getCompanyDetail().loadRecord(company);
    },

    onAddAssociatedClick: function(button){

        var grid = button.up('grid'),
            store = grid.store,
            modelName = store.model.modelName.split('.')[2],
            maxRecords = 3,
            recordCount = store.count(),
            companyDetail = this.getCompanyDetail(),
            companyId = companyDetail.getCompanyId();

        if (companyId == ''){
            Ext.MessageBox.alert('BIG NONO', 'Save company before adding associated information');
            return;
        }

        if (recordCount >= maxRecords) {
            Ext.MessageBox.alert('Max Records', 'You have reached max records.');
            return;
        }
        data = {};
        switch (modelName)
        {
            case 'Address':
                data = {company: companyId, street:'street, nr', city:'city,state', zipcode:'zipcode'};
                break;
            case 'Bank':
                data = {company: companyId, name:'bank name', iban:'iban account'};
                break;
            case 'Contact':
                data = {company: companyId, name:'contact name', phoneNumber:'phone nr', email:'email'};
                break;
            default:
                data = {company: companyId};
        }
        record = store.model.create(data);

        grid.editingPlugin.cancelEdit();

        store.insert(recordCount, record);
        grid.editingPlugin.startEditByPosition({row: recordCount, column: 0});
    },

    onDeleteAssociatedClick: function(view, cell, recordIndex, cellIndex, e){
        view.editingPlugin.cancelEdit();
        //view.store.getAt(recordIndex).data.id = 0; //trigger error
        //notification.msg('Remove', 'the record ' + view.store.getAt(recordIndex).data.name + ' was deleted!');
        view.store.removeAt(recordIndex);
        view.store.sync();
    },

    editAssociatedData: function(editor, e) {
        var me = this,
            //store = this.getProductsStore(),
            //view = this.getProductList().getView(),
            //lastSelectedId = this.getProductDetail().getProductId(),
            data = e.record.data;

        console.log(e.record.phantom || e.record.dirty, e.record.phantom, e.record.dirty);
        if (!e.record.phantom && !e.record.dirty) return;
        // commit the changes right after editing finished, if product has valid values
        if (data.street!=''){
            e.record.save({
                scope:this,
                success: function (ingredient, operation){
                    //reload Associated Store to reflect changes
//                    store.load({
//                        scope   : this,
//                        callback: function(records, operation, success){
//                            var rowIndex = store.find('id', lastSelectedId);
//                            //console.log('LOAD CALLBACK: select lastSelected:',lastSelectedId);
//                            view.select(rowIndex);
//                        }
//                    });
                }
            });
        }

    }
});
