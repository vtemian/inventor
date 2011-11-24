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
                click: this.onDeleteProductClick
            },
            'productdetail button[action=submit]':{
                click: this.onDetailFormSubmitClick
            },
            'productdetail button[action=reset]':{
                click: this.onDetailFormResetClick
            }
        });

        this.getProductsStore().on('load', this.onProductsStoreLoad, this);
    },

    onLaunch: function() {

        console.log('products launch');
    },

    onProductsStoreLoad: function(){

        console.log('products Store Load');
    },

    onProductSelect: function(selModel, selection) {
        var detail = this.getProductDetail();

        if (!Ext.isEmpty(selection)) this.loadProduct(selection[0]);

        //set focus on the first field from the detail form
        detail.down('textfield').focus();
    },

    onAddProductClick: function(button){
        var store = this.getProductsStore(),
            grid = button.up('grid');

        product = INV.model.Product.create();
        while (isNaN(product.id)) {
            product = INV.model.Product.create();
        }
        this.loadProduct(product);
    },

    onDetailFormSubmitClick: function(button){
        var form = button.up('form').getForm(),
            product = form.getRecord(),
            values = form.getValues(false, true, false),
            detail = this.getProductDetail();

        // the form should be dirty & valid if we are here
        button.disable();
        if (this.saveProduct(product, values)) {
            detail.loadRecord(product);
        }

    },

    onDeleteProductClick: function(button){
        var store = this.getProductsStore(),
            grid = button.up('grid');

        record = grid.getSelectionModel().getSelection()[0];
        store.remove(record);
        store.sync({success: function(batch, options){
            console.log('record deleted');

            grid.getView().select(0);
        }},this);
    },

    onDetailFormResetClick: function(button){
        var form = button.up('form').getForm(),
            grid = this.getProductList(),
            store = this.getProductsStore(),
            record = form.getRecord();
        console.log(record);
        
        if (record.dataSave){
            store.remove(record)
            store.sync({success: function(batch, options){
                console.log('new record deleted');

                grid.getView().select(0);
            }},this);
        }
        else {
            form.reset();
        }

    },

    loadProduct: function (product){
        var me = this,
            detail = me.getProductDetail(),
            grid = me.getProductList(),
            form = detail.getForm(),
            loadedProduct = form.getRecord(),
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
                            console.log('save and continue loading ');
                            if (form.isValid()) {
                                me.saveProduct(loadedProduct, values);
                                detail.loadRecord(product);
                            } else {
                                Ext.MessageBox.show({
                                    title:'Invalid fields!',
                                    msg: 'There are invalid fields! <br /> Please correct the invalid inputs and save again',
                                    buttons: Ext.MessageBox.OK
                                });
                            }
                            break;
                        case 'no':
                            console.log('continue loading ');
                            detail.loadRecord(product);
                            break;
                        case 'cancel':
                            console.log('stop loading and stay on the modified record');
                            grid.getView().select(loadedProduct, true, true);
                            break;
                    }
                }
            });
        } else {
            detail.loadRecord(product);
        }
    },

    saveProduct: function(product,values){
        var isNewProduct = product.phantom,
            categories = this.getProductCategoriesStore(),
            store = this.getProductsStore(),
            success = false;

        product.set(values);
        if (isNewProduct) {
            store.add(product);
        }
        product.save({success: function(prod, operation){
            if (isNewProduct){ //switch ext generated id with real database pk
                product = store.last();
                product.beginEdit();
                product.set('id', Ext.JSON.decode(operation.response.responseText).data.pk);
                product.commit(true);
                success = true;
            }
            if (Ext.isString(values.category)) categories.load();
        }},{
            failure: function(){console.log('onDetailFormSubmitClick::ProductsStore.sync FAIL!');}
        });
        return success;
    }
});