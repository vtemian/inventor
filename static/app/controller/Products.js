Ext.define('INV.controller.Products', {
    extend: 'Ext.app.Controller',

    stores: ['Products', 'ProductCategories', 'ProductUms'],

    models: ['Product', 'ProductCategory', 'ProductUm'],

    views: ['product.Main','product.List','product.Detail','ux.InlineGrid'],

    refs: [
        {
            ref: 'productDetail',
            selector: 'productdetail'
        },{
            ref: 'productList',
            selector: 'productlist'
        }
    ],

    init: function() {

        this.control({
            'productlist': {
                selectionchange: this.onProductSelect
            },
            'productlist button[action=add]': {
                click: this.onAddProductClick
            },
            'productlist button[action=delete]': {
                click: this.onAddProductClick
            },
            'productdetail button[action=submit]':{
                click: this.onDetailFormSubmitClick
            },
            'productdetail button[action=reset]':{
                click: this.onDetailFormResetClick
            },
            'inlinegrid button[action=add]': {
                click: this.onAddCategoryClick
            },
            'inlinegrid actioncolumn': {
                click: this.onDeleteCategoryClick
            }
        });

        this.getProductsStore().on('load', this.onProductsStoreLoad, this);

        this.getProductCategoriesStore().on('add', function(){console.log('ADD');notification.msg('ADD Cat','store event')}, this);
        this.getProductCategoriesStore().on('beforesync', function(){console.log('BEFORESYNC');notification.msg('BEFORESYNC Cat','store event')}, this);
        this.getProductCategoriesStore().on('load', function(){console.log('LOAD');notification.msg('LOAD Cat','store event')}, this);
        this.getProductCategoriesStore().on('remove', function(){console.log('REMOVE');notification.msg('REMOVE Cat','store event')}, this);
        this.getProductCategoriesStore().on('update', function(){console.log('UPDATE');notification.msg('UPDATE Cat','store event')}, this);
        this.getProductCategoriesStore().on('write', function(){console.log('WRITE');notification.msg('WRITE Cat','store event')}, this);

    },

    onLaunch: function() {

        console.log('products launch');
    },

    onProductsStoreLoad: function(){

        console.log('products Store Load');
    },

    onProductSelect: function(selModel, selection) {

        if (!Ext.isEmpty(selection)) this.getProductDetail().loadRecord(selection[0]);
    },

    onAddProductClick: function(button){

        var store = this.getProductsStore(),
            grid = button.up('grid');

        product = Ext.create('INV.model.Product');
        while (Ext.isEmpty(product.id)){
            product = Ext.create('INV.model.Product');
            console.log(product.id);
        }
        console.log('dupa WHILE',product.id);

        store.add(product);
        store.sync({success: function(batch, options){
            //console.log('store SYNC success dupa ADD');
            //console.log(batch);
        }});
        grid.getView().select(product);
    },

    onDeleteProductClick: function(button){

        console.log('fire event for Delete Product');
    },

    onDetailFormSubmitClick: function(button){
        var form = button.up('panel').down('form').getForm();
        
        if (form.isValid()) {
            form.submit({
                success: function(form, action) {
                   Ext.Msg.alert('Success', action.result.msg);
                },
                failure: function(form, action) {
                    Ext.Msg.alert('Failed', action.result.msg);
                }
            });
        }
    },

    onDetailFormResetClick: function(button){
        var form = button.up('panel').down('form');

        form.getForm().reset();
    },

    onAddCategoryClick: function(button){

        var grid = button.up('grid'),
            store = this.getProductCategoriesStore();
            productId = this.getProductDetail().getProductId();
            maxRecords = 10;

        if (store.getCount() >= maxRecords) {
            Ext.MessageBox.alert('Max Records', 'You have reached max records.');
            return;
        }
        console.log('onAddCategoryClick');
        grid.editingPlugin.cancelEdit();

        category = Ext.create('INV.model.ProductCategory',{
            name: 'New category',
            description: 'New category description',
            status: 'New category status',
            product_id: productId
        });
        console.log(category);
        store.insert(store.getCount() + 1, category);
        //store.sync({callback:function(){console.log('store SYNC CALLBACK dupa ADD');notification.msg('ADD','SYNC CALLBACK dupa ADD')}});
        grid.editingPlugin.startEdit(store.getCount()-1, 1);
    },

    onDeleteCategoryClick: function(view, cell, recordIndex, cellIndex, e){//view, rowIndex, colIndex, item, e){
        var store = this.getProductCategoriesStore();

        view.editingPlugin.cancelEdit();

        notification.msg('Remove', 'the record ' + view.store.getAt(recordIndex).data.name + ' was deleted!');
        store.removeAt(recordIndex);
        //store.sync({callback:function(){console.log('store SYNC CALLBACK dupa DELETE');notification.msg('Remove','SYNC CALLBACK dupa DELETE')}});
    }
});
