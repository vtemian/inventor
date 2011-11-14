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
                    {xtype:'textfield', name:'description', fieldLabel: 'Description'},
                    {
                        xtype:'combo',
                        name:'category',
                        fieldLabel: 'Category',
                        store:'ProductCategories',
                        valueField:'id',
                        displayField:'name'
                    },
                    {xtype:'checkbox', name:'modified', fieldLabel: 'Modified'},
                    {xtype:'textfield', name:'notes', fieldLabel: 'Notes', allowBlank:false},
                    {xtype:'textfield', name:'barcode', fieldLabel: 'Bar code'},
                    {
                        xtype:'combo',
                        name:'um',
                        fieldLabel: 'UM',
                        multiSelect: true,
                        store:'ProductUms',
                        valueField: 'id',
                        displayField: 'name',
                        queryMode: 'local',
                        triggerAction: 'all'
                    }]
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
                    {xtype:'textfield', name:'created', fieldLabel: 'Created', anchor:'75%'},
                    {xtype:'textfield', name:'updated', fieldLabel: 'Updated', anchor:'75%'},
                    {xtype:'textfield', name:'status', fieldLabel: 'Status', anchor:'75%'}

                ]
            },{
                xtype:'fieldset',
                title: '<p style="font-size:18px">Pret vanzare</p>',
                collapsible:true,
                style: {border:'none'},
                layout: 'anchor',
                defaults: {
                    anchor: '90%'
                },
                items:[
                    {xtype:'fieldcontainer', fieldLabel: 'Pret en-detail', layout:'hbox',
                        items: [{
                            xtype: 'textfield',
                            flex: 1
                        }, {
                            xtype: 'displayfield',
                            value: ' lei, '
                        }, {
                            xtype: 'textfield',
                            flex: 1
                        }, {
                            xtype: 'displayfield',
                            value: ' % adaos'
                        }]},
                    {xtype:'fieldcontainer', fieldLabel: 'Pret en-gros', layout:'hbox',
                        items: [{
                            xtype: 'textfield',
                            flex: 1
                        }, {
                            xtype: 'displayfield',
                            value: ' lei, '
                        }, {
                            xtype: 'textfield',
                            flex: 1
                        }, {
                            xtype: 'displayfield',
                            value: ' % adaos'
                        }]}
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
                                    disabled: true
                                }]};


        me.on('dirtychange', me.onDirtyChange);

        me.callParent(arguments);

        var fields = me.getForm().getFields();
        if (fields) fields.each(function (field){
                me.mon(field, 'change', me.onFieldChange, me);
                me.mon(field, 'blur', me.onFieldBlur, me);
            }
        )

    },

    onDirtyChange: function (){
            console.log('ON dirty change');
    },



    getProductId: function() {
        return this.down('form').getRecord().data['id'];
    },

    onFieldChange: function(field, newValue, oldValue, eOpts) {
        var me = this,
            form = me.getForm(),
            valid = form.isValid(),
            boundItems = form.getBoundItems();

        if (boundItems) {
            boundItems.each(function(item) {item.setDisabled(!valid)})
        }
        console.log('tre sa SALVEZ ?', form.isDirty(), field.isDirty());
        console.log('din cauza lu : ', field.value);
        //me.isValid = valid;
    },

    onFieldBlur: function(field){
        var me = this,
            form = me.getForm();
        console.log(form.isDirty(), field.isDirty());
        if (form.isDirty()) console.log('asta SALVEZ: ', field.value)
    }
});