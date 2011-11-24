Ext.define('INV.view.product.Detail', {
    extend: 'Ext.form.Panel',
    alias : 'widget.productdetail',

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

    initComponent: function() {
        var me = this;

        me.items = [{
            columnWidth:0.5,
            minWidth:300,
            border:false,
            items:[{
                xtype:'fieldset',
                title: '<p style="font-size:18px">Produs</p>',
                style: {border:'none'},
                layout: 'anchor',
                defaults: {
                    anchor: '90%'
                },
                items: [
                    {xtype:'textfield', name:'code', fieldLabel: 'Code'},
                    {xtype:'textfield', name:'name', fieldLabel: 'Name'},
                    {xtype:'fieldcontainer', layout:'hbox',
                        items: [{
                            xtype: 'textfield',
                            name: 'price_endetail',
                            fieldLabel: 'Price',
                            flex: 1
                        },{
                            xtype: 'textfield',
                            name: 'price_engros',
                            fieldLabel: 'engros',
                            labelAlign: 'right',
                            labelWidth: 50,
                            flex: 0.9
                        }]
                    },{
                        xtype:'fieldcontainer', layout:'hbox',
                            items: [{
                                xtype:'combo',
                                name:'category',
                                fieldLabel: 'Category',
                                flex: 1,
                                store:'ProductCategories',
                                valueField:'id',
                                displayField:'name',
                                emptyText:'select',
                                queryMode: 'local'
                            },
                            {
                                xtype:'combo',
                                name:'um',
                                fieldLabel: 'UM',
                                labelAlign: 'right',
                                labelWidth: 50,
                                flex: 0.9,
                                multiSelect: true,
                                store:'ProductUms',
                                valueField: 'id',
                                displayField: 'abbreviation',
                                emptyText:'select',
                                queryMode: 'local',
                                triggerAction: 'all'
                            }]
                    },
                    {xtype:'displayfield'},
                    {xtype:'textfield', name:'barCode', fieldLabel: 'Bar code'},
                    {xtype:'textfield', name:'description', fieldLabel: 'Description'},
                    {xtype:'checkbox', name:'modified', fieldLabel: 'Modified', inputValue:'true', uncheckedValue:'false'},
                    {xtype:'textfield', name:'notes', fieldLabel: 'Notes', allowBlank:false}
                ]
                },{
                xtype:'fieldset',
                title: '<p style="font-size:18px">Stocuri</p>',
                style: {border:'none'},
                layout: 'anchor',
                defaults: {
                    anchor: '90%'
                },
                items: [{
                    xtype:'grid',
                    height:90,
                    columns: [
                        { header: 'Gestiune',  dataIndex: 'name', width: 130 },
                        { header: 'Cantitate', dataIndex: 'cant', width: 75 },
                        { header: 'Pret achizitie', dataIndex: 'preta', width: 75 },
                        { header: 'Pret vanzare', dataIndex: 'pretv', width: 75 }
                    ],
                    store: Ext.create('Ext.data.Store', {
                                fields: ['name', 'cant', 'preta', 'pretv'],
                                data : [
                                    {"name":'depozit 1', "cant":'130 m2', "preta":'9.4', "pretv":'-'},
                                    {"name":'magazin 2', "cant":'99 cutii', "preta":'9.5', "pretv":'11.5'},
                                    {"name":'depozit 2', "cant":'15 m2', "preta":'9.4', "pretv":'-'},
                                    {"name":'magazin 1', "cant":'929 cutii', "preta":'9.5', "pretv":'11.5'},
                                    {"name":'magazin 3', "cant":'23 cutii', "preta":'9.5', "pretv":'12'}
                                    //...
                                ]
                    })
                }]}]

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
                    {xtype:'combo', name:'version', fieldLabel: 'Versiune',
                        disabled: false,
                        emptyText:'ultima',
                        displayField: 'name',
                        valueField: 'abbr',
                        store: Ext.create('Ext.data.Store', {
                                fields: ['abbr', 'name'],
                                data : [
                                    {"abbr":1, "name":"ver 1, 13.09.11 16:05 - Alin"},
                                    {"abbr":2, "name":"ver 2, 22.10.11 10:33 - Vlad"},
                                    {"abbr":2, "name":"ver 3, 06.11.11 14:45 - Caius"}
                                ]
                    })},
                    {xtype:'textfield', name:'created_at', fieldLabel: 'Created', anchor:'75%'},
                    {xtype:'textfield', name:'updated_at', fieldLabel: 'Updated', anchor:'75%'},
                    {xtype:'textfield', name:'status', fieldLabel: 'Status', anchor:'75%'}

                ]
            },{
                xtype:'fieldset',
                title: '<p style="font-size:18px">Norma consum</p>',
                collapsible:true,
                style: {border:'none'},
                layout: 'anchor',
                defaults: {
                    anchor: '90%'
                },
                items:[]
                }]
        }],



        me.dockedItems = {

                        dock:'bottom',
                        xtype:'toolbar',
                        items: [{
                                    text: 'Cancel',
                                    action:'reset',
                                    icon:'resources/images/cancel.png'
                                }, {
                                    text: 'Submit',
                                    action:'submit',
                                    icon:'resources/images/save.png',
                                    formBind: true, //only enabled once the form is valid
                                    disabled: true,
                                    onDisable: function(){console.log('disabled')},
                                    onEnable: function(){console.log('enabled')}
                                }]};


        me.on('dirtychange', me.onDirtyChange);
        me.on('validitychange', me.onValidityChange);

        me.callParent(arguments);

        var fields = me.getForm().getFields();
        if (fields) fields.each(function (field){
                me.mon(field, 'change', me.onFieldChange, me);
                me.mon(field, 'blur', me.onFieldBlur, me);
            }
        )

    },

    getProductId: function() {
        return this.down('form').getRecord().data['id'];
    },

    onFieldChange: function(field, newValue, oldValue, eOpts) {
        var me = this,
            form = me.getForm();
        me.onDirtyChange(form,form.isDirty(),eOpts)
        console.log('onFieldChange ::: FORM Dirty: ', form.isDirty(),'FIELD Dirty: ' , field.name, field.isDirty());
    },

    onDirtyChange: function (form, dirty, eOpts){
        var sw = (form.isValid() & dirty) ? true:false;
        console.log('onDirtyChange ::: FORM Dirty: ', form.isDirty(),'FORM Valid: ' , form.isValid());
        this.switchBoundItems(form, sw);

    },

    onValidityChange: function(form, valid, eOpts){
        var sw = (form.isDirty() & valid) ? true:false;
        console.log('onValidityChange ::: FORM Dirty: ', form.isDirty(),'FORM Valid: ' , valid);
        this.switchBoundItems(form, sw);
    },
    
    onFieldBlur: function(field){
        var me = this,
            form = me.getForm();

        //console.log(form.isDirty(), field.isDirty(), field.name);
        if (form.isDirty()) {
            //set the new values should behave like load
            //form.setValues(form.getValues());
            //save the record

            console.log(' SETVALUES + SAVE ::::  FORM isDirty? @ onBlur: ', form.isDirty(), field.name);
        }
    },

    switchBoundItems: function (form, sw){
        var boundItems = form.getBoundItems();

        if (boundItems) {
            boundItems.each(function(cmp) {
                console.log('valid & dirty: ',sw,' disabled: ', cmp.disabled, 'value:', cmp.disabled === sw);
                if (cmp.disabled === sw) {
                    cmp.setDisabled(!sw);
                    console.log('boundItems switch');
                }
            });
        }
    },

    loadRecord: function(record) {
        var me = this,
            form = me.getForm(),
            fields = form.getFields();

        // temporarily suspend events on form fields before loading record to prevent the fields' change events from firing
        fields.each(function(field) {
            field.suspendEvents();
        });
        form.loadRecord(record);
        fields.each(function(field) {
            field.resumeEvents();
        });
        me.down('[formBind]').disable();
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
        fields.each(function(field) {
            field.resumeEvents();
        });
    }
});
