Ext.define('INV.view.product.Detail', {
    extend: 'Ext.form.Panel',
    alias : 'widget.productdetail',

    requires: ['INV.plugin.comboExtraFilter'],

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
                    {xtype:'textfield', name:'code', fieldLabel: 'Code', maxLength: 10, selectOnFocus:true},
                    {xtype:'textfield', name:'name', fieldLabel: 'Name', minLength: 3, maxLength: 50},
                    {xtype:'fieldcontainer', layout:'hbox',
                        items: [{
                            xtype: 'numberfield',
                            hideTrigger: true,
                            name: 'price_endetail',
                            fieldLabel: 'Sale Price',
                            flex: 1
                        },{
                            xtype: 'numberfield',
                            hideTrigger: true,
                            name: 'price_engros',
                            fieldLabel: 'engros',
                            labelAlign: 'right',
                            labelWidth: 50,
                            margin: '0 1 0 0 ',
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
                                margin: '0 1 0 0 ',
                                flex: 0.9,
                                multiSelect: false,
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
                    {xtype:'textfield', name:'description', fieldLabel: 'Description'}
                    //{xtype:'checkbox', name:'modified', fieldLabel: 'Modified', inputValue:'true', uncheckedValue:'false'},

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
                items:[
                    {xtype:'numberfield', hideTrigger: true, name:'scrap_percentage', fieldLabel: 'Scrap', anchor:'75%'},
                    {xtype:'numberfield', hideTrigger: true, name:'labour_cost', fieldLabel: 'Labor', anchor:'75%'},
                    {    xtype: 'fieldcontainer',
                        fieldLabel: 'Ingredients',
                        //padding: 10,
                        //width:600,
                        items:[{
                            xtype:'inlinegrid',
                            id: 'ingredientsgrid',
                            store:'ProductBomIngredients',
                            addToolTip:'Add ingredient',
                            deleteToolTip:'Delete ingredient',
                            maxWidth:400,
                            //height:100,
                            columns:[
                                {dataIndex: 'quantity', align: 'center', width: 40, editor:{type:'numberfield', selectOnFocus: true, hideTrigger:true}},
                                {dataIndex: 'ingredient', width: 160 ,
                                    editor: {
                                        xtype: 'combobox',
                                        plugins:'comboExtraFilter',
                                        store: 'ProductsList',
                                        queryMode:'local',
                                        displayField:'umName',
                                        valueField:'id',
                                        lastQuery : '',
                                        forceSelection: true,
                                        typeAhead: true,//Uncaught TypeError: Cannot call method 'addCls' of null
                                        typeAheadDelay: 1000,
                                        triggerAction: 'all',
                                        selectOnFocus:true,
                                        selectOnTab: true,
                                        multiSelect: false,
                                        emptyText:'select',
                                        listeners:{
                                            select: function(combo, record){
                                                //here the filter should contain ids of ingredients already in the grid
                                                //we clear the filters so the displayValue still gets found in the store
                                                combo.store.clearFilter();
                                                //if the ingredient is the first one and bom is new and not loaded before there is no bom_id and no product_id on the ingredient records
                                                combo.up('editor').editingPlugin.activeRecord.set('product', me.getProductId());
                                            },
                                            beforequery:function(qe){
                                                var combo = qe.combo,
                                                    comboStore = combo.store,
                                                    grid = combo.up('editor').editingPlugin.grid,
                                                    gridStore = grid.store,
                                                    product = grid.up('form').getRecord(),
                                                    ids = new Array();

                                                if (product) ids.push(product.get('id'));
                                                gridStore.each(function(record){
                                                    ids.push(record.get('ingredient'));
                                                });

                                                qe.ids = ids;
                                            }
                                        }
                                    },
                                    renderer: function(value) {
                                        var store = Ext.StoreMgr.get("ProductsList");

                                        store.clearFilter();
                                        rec = store.getAt(store.find('id',value));

                                        return rec ? rec.get('umName') : 'select'
                                        }
                                }
                            ]}
                        ]}
                ]
            }]
        }],



        me.dockedItems = {

                        dock:'bottom',
                        xtype:'toolbar',
                        items: [{
                                    text: 'Cancel',
                                    action:'reset',
                                    icon:'resources/images/cancel.png',
                                    handler: function() {
                                        me.reset()
                                    },
                                    tooltip:'Cancel changes'
                                }, {
                                    text: 'Submit',
                                    action:'submit',
                                    icon:'resources/images/save.png',
                                    formBind: true, //only enabled once the form is valid
                                    disabled: true,
                                    tooltip:'Save changes'
                                },{
                                    xtype: 'component',
                                    id: 'formErrorStateProduct',
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
        );
    },

    getProductId: function() {
        var record = this.getRecord();
        if (record.phantom){
            return ''
        }
        return record.data['id'];
    },

    getProductBomId: function() {
        var record = this.getRecord();
        if (record.phantom){
            return ''
        }
        return record.data['bom'];
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
                if (cmp.disabled === sw) {
                    cmp.setDisabled(!sw);
                }
            });
        }
    },

    loadRecord: function(record) {
        var me = this,
            form = me.getForm(),
            fields = form.getFields(),
            ingredientsGrid = me.down('#ingredientsgrid');

        // temporarily suspend events on form fields before loading record to prevent the fields' change events from firing
        fields.each(function(field) {
            field.suspendEvents();
        });
        me.updateErrorState();

        form.loadRecord(record);
        ass = record.getAssociatedData();
        if (record.phantom || record.getBom()==undefined)
            ingredientsGrid.reconfigure(Ext.StoreManager.lookup('ProductBomIngredients'));
        else
            ingredientsGrid.bindStore(record.getBom().ingredients());

        fields.each(function(field) {
            field.resumeEvents();
        });

        me.down('textfield').focus();
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
        this.switchBoundItems(form, false);
        fields.each(function(field) {
            field.resumeEvents();
        });
    },

    updateErrorState: function() {
        var me = this,
            errorCmp, fields, errors;

        if (me.hasBeenDirty || me.getForm().isDirty()) { //prevents showing global error when form first loads
            errorCmp = me.down('#formErrorStateProduct');
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
