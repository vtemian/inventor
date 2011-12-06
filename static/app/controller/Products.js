Ext.define('INV.controller.Products', {
    extend: 'Ext.app.Controller',

    stores: ['Products', 'ProductsList', 'ProductCategories', 'ProductUms', 'ProductBomIngredients'],

    models: ['Product', 'ProductCategory', 'ProductUm' , 'ProductBom', 'ProductBomIngredient'],

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
            'productdetail inlinegrid button[action=add]': {
                click: this.onAddIngredientClick
            },
            'productdetail inlinegrid actioncolumn': {
                click: this.onDeleteIngredientClick
            },
            'productdetail inlinegrid': {
                edit: this.editInlineGrid
            }
        });

        this.getProductsStore().on('load', this.onProductsStoreLoad, this);
    },

    onLaunch: function() {console.log('products launch');},

    onProductsStoreLoad: function(){console.log('products Store Load');},

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

    onDeleteProductClick: function(button){
        var store = this.getProductsStore(),
            grid = button.up('grid'),
            product = grid.getSelectionModel().getSelection()[0];
        
        store.remove(product);
        store.sync({success: function(batch, options){
            console.log('record deleted');

            grid.getView().select(0);
        }},this);
    },

    onDetailFormSubmitClick: function(button){
        var form = button.up('form').getForm(),
            product = form.getRecord(),
            values = form.getValues(false, true, false),
            grid = this.getProductList();

        // the form should be dirty & valid if we are here
        button.disable();
        this.saveProduct(product, values);
        grid.getView().select(product, true, true);
        this.getProductDetail().loadRecord(product);
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
                            //save and continue loading
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
                            //continue loading
                            detail.loadRecord(product);
                            break;
                        case 'cancel':
                            //stop loading and stay on the modified record
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
            store = this.getProductsStore();

        console.log(product);
        product.set(values);
        if (isNewProduct) {
            store.add(product);
        }
        console.log(product);
        product.save({success: function(prod, operation){

            //reload categories if a string/new catefory was submmited
            if (Ext.isString(values.category)) categories.load();
        }},{
            failure: function(prod, operation){
                //NEVER GETS CALLED!!!!!!!!!!!!!!
                console.log('onDetailFormSubmitClick::ProductsStore.sync FAIL!');
                notification.msg('Product save error!', 'There was a server error: ' + Ext.JSON.decode(operation.response.responseText));
            }
        });
    },


    onAddIngredientClick: function(button){

        var grid = button.up('grid'),
            store = grid.store,
            maxRecords = 3,
            bomId = this.getProductDetail().getProductBomId();
        
        if (this.getProductDetail().getProductId() == ''){
            Ext.MessageBox.alert('BIG NONO', 'Save product before adding ingredients');
            return;
        }

        if (store.getCount() >= maxRecords) {
            Ext.MessageBox.alert('Max Records', 'You have reached max records.');
            return;
        }

        ingredient = INV.model.ProductBomIngredient.create();
        grid.editingPlugin.cancelEdit();
        ingredient.data.bom = this.getProductDetail().getProductBomId();

        store.add(ingredient);
//        store.sync({callback:function(){
//            console.log('store SYNC CALLBACK dupa ADD');
//            notification.msg('ADD','SYNC CALLBACK dupa ADD');
//        }});
        console.log(bomId);
        grid.editingPlugin.startEdit(store.last(), 0);
    },

    onDeleteIngredientClick: function(view, cell, recordIndex, cellIndex, e){

        view.editingPlugin.cancelEdit();

        //notification.msg('Remove', 'the record ' + view.store.getAt(recordIndex).data.name + ' was deleted!');
        view.store.removeAt(recordIndex);
        view.store.sync({callback:function(){
            console.log('store SYNC CALLBACK dupa DELETE');
            notification.msg('Remove','SYNC CALLBACK dupa DELETE');
        }});
    },

    editInlineGrid: function(editor, e) {
        // commit the changes right after editing finished
        console.log('onEdit editor inlinegrid ', e.record);
        e.record.save();

    }
});