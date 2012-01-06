Ext.define('INV.view.company.Detail', {
    extend: 'Ext.form.Panel',
    alias : 'widget.companydetail',

    autoShow: true,
    border: false,
    bodyPadding: 10,
    layout:'column',
    autoScroll:true,
    defaults: {
        layout: 'anchor',
        defaults: {
            anchor: '100%'
        }
    },
    submitEmptyText: false,

    initComponent: function() {
        var me = this;

        me.items = [{
            columnWidth:0.5,
            minWidth:300,
            border:false,
            items:[{
                xtype:'fieldset',
                title: '<p style="font-size:18px">Company</p>',
                style: {border:'none'},
                layout: 'anchor',
                defaults: {
                    anchor: '90%'
                },
                items: [{xtype:'textfield', name:'cif', fieldLabel: 'Cif', selectOnFocus:true, remoteValid:true,
                            validator:function(v){
                                console.log('validator:',this.remoteValid);
                                return this.remoteValid}},
                    {xtype:'textfield', name:'name', fieldLabel: 'Name'},
                    {xtype:'textfield', name:'regCom', fieldLabel: 'RegCOM'}
                ]
            },{
                xtype:'fieldset',
                title: '<p style="font-size:18px">Address, Contact, Bank</p>',
                style: {border:'none'},
                layout: 'anchor',
                defaults: {
                    anchor: '90%'
                },
                items: [{
                    xtype: 'fieldcontainer',
                    fieldLabel: 'Address',
                    //padding: 10,
                    width:600,
                    items: [{
                        xtype:'inlinegrid',
                        id: 'companyAddressesGrid',
                        store:'Addresses',
                        addToolTip:'Add address',
                        deleteToolTip:'Remove address',
                        maxWidth:400,
                        //height:100,
                        columns:[{dataIndex: 'street', width: 115, editor: 'textfield'},
                            {dataIndex: 'city', width: 100, editor: 'textfield'},
                            {dataIndex: 'zip', width: 80, editor: 'textfield'}
                        ]
                    }]
                },{
                    xtype: 'fieldcontainer',
                    fieldLabel: 'Contacts',
                    //padding: 10,
                    width:600,
                    items: [{
                        xtype:'inlinegrid',
                        id: 'companyContactsGrid',
                        store:'Contacts',
                        addToolTip:'Add contact',
                        maxWidth:400,
                        //height:100,
                        columns:[{dataIndex: 'name', width: 80, editor: 'textfield'},
                            {dataIndex: 'phone', width: 95, editor: 'textfield'},
                            {dataIndex: 'email', width: 120, editor: 'textfield', vtype: 'email'}
                        ]
                    }]
                },{
                    xtype: 'fieldcontainer',
                    fieldLabel: 'Bank info',
                    //padding: 10,
                    width:600,
                    items: [{
                        xtype:'inlinegrid',
                        id: 'companyBanksGrid',
                        store:'Banks',
                        addToolTip:'Add bank account',
                        maxWidth:400,
                        //height:100,
                        columns:[{dataIndex: 'name', width: 100, editor: 'textfield'},
                            {dataIndex: 'iban', width: 190, editor: 'textfield'}
                        ]
                    }]
                }]
            }]

        },{
            columnWidth:0.5,
            border:false,
            items:[{
                xtype:'fieldset',
                title: '<p style="font-size:18px">Status</p>',
                layout: 'anchor',
                defaults: {
                    anchor: '90%',
                    disabled:true
                },
                items:[
                    {xtype:'textfield', name:'created_at', fieldLabel: 'Created', anchor:'75%'},
                    {xtype:'textfield', name:'updated_at', fieldLabel: 'Updated', anchor:'75%'},
                    {xtype:'textfield', name:'status', fieldLabel: 'Status', anchor:'75%'}

                ]
            }]
        }];

        this.dockedItems = {
            dock:'bottom',
            xtype:'toolbar',
            items: [{
                text: 'Cancel',
                action:'reset',
                icon:'resources/images/cancel.png',
                handler: function() {
                    me.reset()
                }

            }, {
                text: 'Submit',
                action:'submit',
                icon:'resources/images/save.png',
                formBind: true, //only enabled once the form is valid
                disabled: true
//                                    onDisable: function(){console.log('disabled')},
//                                    onEnable: function(){console.log('enabled')}
            },{
                xtype: 'component',
                id: 'formErrorStateCompany',
                baseCls: 'form-error-state',
                flex: 1,
                validText: 'Form is valid',
                invalidText: 'Form has errors',
                tipTpl: Ext.create('Ext.XTemplate', '<ul><tpl for="."><li><span class="field-name">{name}</span>: <span class="error">{error}</span></li></tpl></ul>'),

                getTip: function() {
                    var tip = this.tip;
                    if (!tip) {
                        tip = this.tip = Ext.widget('tooltip', {
                            target: this.el,
                            title: 'Error Details:',
                            autoHide: false,
                            anchor: 'bottom',
                            mouseOffset: [-11, -2],
                            closable: true,
                            constrainPosition: false,
                            cls: 'errors-tip'
                        });
                        tip.show();
                    }
                    return tip;
                },

                setErrors: function(errors) {
                    var me = this,
                        baseCls = me.baseCls,
                        tip = me.getTip();

                    errors = Ext.Array.from(errors);

                    // Update CSS class and tooltip content
                    if (errors.length) {
                        me.addCls(baseCls + '-invalid');
                        me.removeCls(baseCls + '-valid');
                        me.update(me.invalidText);
                        tip.setDisabled(false);
                        tip.update(me.tipTpl.apply(errors));
                    } else {
                        me.addCls(baseCls + '-valid');
                        me.removeCls(baseCls + '-invalid');
                        me.update(me.validText);
                        tip.setDisabled(true);
                        tip.hide();
                    }
                }
            }]};

        me.on('dirtychange', me.onDirtyChange);
        me.on('validitychange', me.onValidityChange);

        me.on('fieldvaliditychange', me.updateErrorState);
        me.on('fielderrorchange', me.updateErrorState);

        me.callParent(arguments);

        var fields = me.getForm().getFields();
        if (fields) fields.each(function (field){
                me.mon(field, 'change', me.onFieldChange, me);
            }
        )
    },

    getCompanyId: function() {
        return this.getRecord().data['id'];
    },

    onFieldChange: function(field, newValue, oldValue, eOpts) {
        var me = this,
            form = me.getForm();
        me.onDirtyChange(form,form.isDirty(),eOpts)
    },

    onDirtyChange: function (form, dirty, eOpts){
        var sw = (form.isValid() & dirty) ? true:false;
        this.switchBoundItems(form, sw);

    },

    onValidityChange: function(form, valid, eOpts){
        var sw = (form.isDirty() & valid) ? true:false;
        this.switchBoundItems(form, sw);
    },

    switchBoundItems: function (form, sw){
        var boundItems = form.getBoundItems();

        if (boundItems) {
            boundItems.each(function(cmp) {
                //console.log('valid & dirty: ',sw,' disabled: ', cmp.disabled, 'value:', cmp.disabled === sw);
                if (cmp.disabled === sw) {
                    cmp.setDisabled(!sw);
                    //console.log('boundItems switched',cmp);
                }
            });
        }
    },

    loadRecord: function(record) {
        var me = this,
            form = me.getForm(),
            fields = form.getFields();
            addressesGrid = me.down('#companyAddressesGrid'),
            banksGrid = me.down('#companyBanksGrid'),
            contactsGrid = me.down('#companyContactsGrid');

        // temporarily suspend events on form fields before loading record to prevent the fields' change events from firing
        fields.each(function(field) {
            field.suspendEvents();
            if (field.name == 'cif') field.remoteValid = true;
        });
        form.clearInvalid();

        form.loadRecord(record);

        addressesGrid.bindStore(record.addresses());
        banksGrid.bindStore(record.banks());
        contactsGrid.bindStore(record.contacts());

        fields.each(function(field) {
            field.resumeEvents();
        });
        //me.down('textfield').focus();//onBlur of CIF field a request to OpenApi is made to fetch company data
        me.down('[formBind]').disable();
    },

    loadOpenApiCompany:function(company){
        var me = this,
            form = me.form,
            addressesGrid = me.down('#companyAddressesGrid'),
            contactsGrid = me.down('#companyContactsGrid');

        if (form.getRecord().phantom){
            console.log('fill form');
            form.findField('name').setValue(company.get('name'));
            form.findField('regCom').setValue(company.get('registration_id'));
            addressesGrid.store.add([{street:company.get('address'),city:company.get('city'), zip:company.get('zip')}]);
            contactsGrid.store.add([{phone:company.get('phone')}]);
        }
    },

    reset: function(){
        var me = this,
            form = me.getForm(),
            fields = form.getFields();

        form.clearInvalid();
        // temporarily suspend events on form fields before reseting the form to prevent the fields' change events from firing
        fields.each(function(field) {
            field.suspendEvents();
        });
        form.reset();
        this.switchBoundItems(form, false);
        fields.each(function(field) {
            field.resumeEvents();
        });
    },

    updateErrorState: function() {
        var me = this,
            errorCmp, fields, errors;

        if (me.hasBeenDirty || me.getForm().isDirty()) { //prevents showing global error when form first loads
            errorCmp = me.down('#formErrorStateCompany');
            fields = me.getForm().getFields();
            errors = [];
            fields.each(function(field) {
                Ext.Array.forEach(field.getErrors(), function(error) {
                    errors.push({name: field.getFieldLabel(), error: error});
                });
            });
            errorCmp.setErrors(errors);
            me.hasBeenDirty = true;
        }
    }
});