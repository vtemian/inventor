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
                                me.saveProduct(loadedCompany, values);
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


    onDeleteCompanyClick: function(button){

        console.log('fire event for Delete Company');
    }
});
