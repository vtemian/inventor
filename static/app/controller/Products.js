Ext.define('INV.controller.Products', {
    extend: 'Ext.app.Controller',

    stores: ['Products', 'ProductsList', 'ProductCategories', 'ProductUms', 'ProductIngredients'],

    models: ['Product', 'ProductCategory', 'ProductUm' , 'ProductIngredient'],

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
            'productlist button[action=copy]': {
                click: this.onCopyProductClick
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
                edit: this.editIngredient
            }
        });

        this.getProductsStore().on('load', this.onProductsStoreLoad, this);
    },

    onProductsStoreLoad: function(store){
        var view = this.getProductList().getView();

        if (store.getCount() > 0 && view.rendered) {view.select(0);}
    },

    onProductSelect: function(selModel, selection) {

        if (!Ext.isEmpty(selection)) this.loadProduct(selection[0]);
    },

    onAddProductClick: function(button){
        var store = this.getProductsStore(),
            grid = button.up('grid'),
            product = new INV.model.Product();

        while (isNaN(product.id)) {
            product = INV.model.Product.create();
        }

        store.add(product);
        grid.getView().select(product);
        //this.loadProduct(product);
    },

    onCopyProductClick: function(button){
        var store = this.getProductsStore(),
            grid = button.up('grid'),
            oldProduct = grid.getSelectionModel().getSelection()[0],
            detail = this.getProductDetail();

        if (oldProduct){

            product = oldProduct.copy();
            Ext.data.Model.id(product);
            product.set('code', '');
            store.add(product);
            grid.getView().select(product);
            //this.loadProduct(product);
            detail.switchBoundItems(detail.getForm(),true)
        } else {
            notification.msg('No selection made', 'Please select the record you want to copy!','info');
        }
    },

    onDeleteProductClick: function(button){
        var store = this.getProductsStore(),
            grid = button.up('grid'),
            product = grid.getSelectionModel().getSelection()[0];
        
        store.remove(product);
        store.sync({
            scope:this,
            success: function(batch, options){
                grid.getView().select(0);
                notification.msg('','The product was deleted.', 'success');
            },
            failure: function(){
                notification.msg('','Server error!', 'fail');
        }});
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
            //just a new empty record, remove it
            if (!Ext.isEmpty(loadedProduct) && loadedProduct.phantom) {
                grid.store.remove(loadedProduct)
            }
            detail.loadRecord(product);
        }
    },

    saveProduct: function(product,values){
        var me = this,
            isNewProduct = product.phantom,
            cat = values['category'],
            um = values['um'],
            detail = this.getProductDetail(),
            productStore = this.getProductsStore(),
            ingredientsStore = detail.down('#ingredientsgrid').store,
            categoriesStore = me.getProductCategoriesStore(),
            umsStore = me.getProductUmsStore(),
            productListStore = me.getProductsListStore();

        product.set(values);
        if (isNewProduct){
            //store.add(product);
        };
        if (!Ext.isEmpty(cat) && !Ext.isNumber(cat)){
            categoriesStore.filters.clear();
            categoriesStore.insert(0,new INV.model.ProductCategory({name:cat}));
        }
        if (!Ext.isEmpty(um) && !Ext.isNumber(um)){
            umsStore.filters.clear();
            umsStore.insert(0, new INV.model.ProductUm({abbreviation:um}));
        }

        product.save({
            success: function(product, operation){

                productListStore.load();
                notification.msg('', 'The product, '+ product.get('name') +',is saved! Yupie! ', 'success');
            },
            failure: function(product, operation){

                if (isNewProduct){
                    productStore.remove(product);
                    me.getProductList().getView().select(0);
                }
                notification.msg('', 'Server error. ', 'fail');
                console.log('ERROR:::Product->saveProduct::',operation.getError())
            }
        });
    },


    onAddIngredientClick: function(button){

        var grid = button.up('grid'),
            store = grid.store,
            maxRecords = 3,
            recordCount = store.count(),
            detail = this.getProductDetail(),
            form = detail.getForm(),
            record = form.getRecord();
        
        if (detail.getProductId() == ''){
            if (form.isValid()){
                this.saveProduct(record, form.getValues(false, true, false));
                detail.loadRecord(record);
        }}

        if (recordCount >= maxRecords) {
            Ext.MessageBox.alert('Max Records', 'You have reached max records.');
            return;
        }

        ingredient = INV.model.ProductIngredient.create({
            bom : detail.getProductId()
        });

        grid.editingPlugin.cancelEdit();
        store.insert(recordCount, ingredient);
        grid.editingPlugin.startEditByPosition({row: recordCount, column: 0});

    },

    onDeleteIngredientClick: function(view, cell, recordIndex){

        view.editingPlugin.cancelEdit();
        //view.store.getAt(recordIndex).data.id = 0; //trigger error
        view.store.removeAt(recordIndex);
        view.store.sync({
            scope:this,
            success: function(batch, options){
                notification.msg('','The '+batch.proxy.model.modelName.split('.')[2]+' was deleted.', 'success');
            },
            failure: function(){
                notification.msg('','Server error!', 'fail');
            }});
    },

    editIngredient: function(editor, e){
        var ingredient = e.record,
            data = ingredient.data;

        console.log(e.record.phantom || e.record.dirty, e.record.phantom, e.record.dirty);
        if (!ingredient.phantom && !ingredient.dirty) return;

        // commit the changes right after editing finished, if product has valid values
        if (data.ingredient!=0 && data.quantity!=0 && data.bom!=0 )
            ingredient.save({
                scope:this,
                success: function (batch){
                    notification.msg('','The '+batch.modelName.split('.')[2]+' was saved.', 'success');
                },
                failure: function (){
                    notification.msg('','Server error!', 'fail');
                }
            });
    }
});