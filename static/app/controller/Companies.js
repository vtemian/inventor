Ext.define('INV.controller.Companies', {
    extend: 'Ext.app.Controller',

    stores: ['Companies', 'Addresses', 'Banks', 'Contacts'],

    models: ['Company', 'OpenApiCompany', 'Address', 'Bank', 'Contact'],

    views: ['company.Main','company.List','company.Detail','ux.InlineGrid'],

    requires: ['INV.view.ux.ParameterProxy'],

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
            'companydetail textfield[name=cif]':{
                blur: this.onCifChange
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
    },

    onAddCompanyClick: function(button){

        var store = this.getCompaniesStore(),
            grid = button.up('grid');

        company = Ext.create('INV.model.Company');
        while (isNaN(company.id)){
            company =  Ext.create('INV.model.Company');
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
            store = this.getCompaniesStore(),
            detail = this.getCompanyDetail(),
            addressesStore = detail.down('#companyAddressesGrid').store,
            banksStore = detail.down('#companyBanksGrid').store,
            contactsStore = detail.down('#companyContactsGrid').store;

        company.set(values);

        if (isNewCompany){
            store.add(company);
        }
        company.save({scope:this, success: function(company, operation){
            if (isNewCompany){
                addressesStore.each(function(record){record.set('company', company.get('id'))});
                banksStore.each(function(record){record.set('company', company.get('id'))});
                contactsStore.each(function(record){record.set('company', company.get('id'))});

                addressesStore.sync();
                banksStore.sync();
                contactsStore.sync();
            }
            //reload associated stores, etc
            notification.msg('', 'The company is saved, yupie! ');
            },
            failure: function(company, operation){
                if (isNewCompany){
                    store.remove(company);
                }
                notification.msg('', 'Server error!');
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
            notification.msg('','The company was deleted.');
            grid.getView().select(0);
        },failure: function(batch, options){
            notification.msg('','Server error!');
        }},this);
        console.log('fire event for Delete Company');
    },

    onCifChange:function(field, event, eOpts){

        if (field.isDirty()){
            var store = this.getCompaniesStore(),
                idExisting = store.findExact('cif',field.value);

            //check if CIF is unique in our records
            if (idExisting > -1){
                //field.remoteValid = 'Cif is not unique, it already exists'
                field.markInvalid('Cif is not unique, it already exists');
            }
            else  {
                //query OpenApi to check if the CIF is valid
                this.queryOpenApi(field);
            }

            task = new Ext.util.DelayedTask(function(){
                field.validate();
            }, this);
            task.delay(3000);
        }

    },
    queryOpenApi:function(field){
        var me = this,
            companyStore = Ext.create('Ext.data.Store', {
                model: 'INV.model.OpenApiCompany'
            }),
            mask = new Ext.LoadMask(field, {store:companyStore});

//        companyStore.loadData([{"name":"CUBUS ARTS SRL","cif":"13548146","address":"BLD. MIHAI VITEAZU Nr. 7,Ap. 18","city":"SIBIU","created_at":"2011-03-16T12:54:36+00:00","zip":"550350","updated_at":"2011-11-13T21:15:43+00:00","registration_id":"J32/508/2000","authorization_number":"","phone":"0269232192","fax":"","vat":"1","state":"Sibiu"}]);
//        me.loadOpenApiCompany(companyStore.getAt(0));

        mask.show();
        companyStore.load({
            cif:field.value,
            scope   : me,
            callback: function(records, operation, success) {
                console.log(records, operation, success);
                //mask.destroy();
                if (Ext.isDefined(records)){
                    field.clearInvalid();
                    field.remoteValid = true;
                    me.getCompanyDetail().loadOpenApiCompany(records[0]);
                }
                else
                    //field.remoteValid = 'CIF invalid';
                    field.markInvalid('CIF invalid');
            }
        });

    },

    onDetailFormSubmitClick: function(button){
        var form = button.up('form').getForm(),
            company = form.getRecord(),
            values = form.getValues(false, true, false),
            detail = this.getCompanyDetail(),
            grid = this.getCompanyList();

        // the form should be dirty & valid if we are here
        button.disable();
        this.saveCompany(company, values);

        grid.getView().select(company, true, true);
        detail.loadRecord(company);
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
        view.store.removeAt(recordIndex);
        view.store.sync();
    },

    editAssociatedData: function(editor, e) {

        console.log(e.record.phantom || e.record.dirty, e.record.phantom, e.record.dirty);
        if (!e.record.phantom && !e.record.dirty) return;
        // commit the changes right after editing finished, if product has valid values
        //if (data.street!=''){
        e.record.save({
            scope:this,
            success: function (assoc, operation){}
        });
        //}

    }
});
