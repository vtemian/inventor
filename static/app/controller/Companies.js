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
                store.remove(company);
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
    }
});
