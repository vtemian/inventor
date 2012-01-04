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
        var detail = this.getProductDetail();

        if (!Ext.isEmpty(selection)) this.loadProduct(selection[0]);
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

    onCopyProductClick: function(button){
        var store = this.getProductsStore(),
            grid = button.up('grid'),
            oldProduct = grid.getSelectionModel().getSelection()[0],
            detail = this.getProductDetail();

        if (oldProduct){

            product = oldProduct.copy();
            Ext.data.Model.id(product);
            console.log(product);
            product.set('code', '')
            this.loadProduct(product);
            detail.switchBoundItems(detail.getForm(),true)
        } else {
            Ext.MessageBox.alert('No selection made', 'Please select the record you want to clone.');
        }
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
        var me = this,
            isNewProduct = product.phantom,
            store = this.getProductsStore();

        product.set(values);
        if (isNewProduct){
            store.add(product);
        }
        product.save({success: function(product, operation){
            //reload categories if a string/new catefory was submmited
            if (Ext.isString(values.category)) me.getProductCategoriesStore().load();
            me.getProductsListStore().load();
            },
            failure: function(product, operation){
                if (isNewProduct){
                    store.remove(product);
                }
                notification.msg('Product save error!', 'There was a server error. ');
                console.log('ERROR:::Product->saveProduct::',operation.getError())
            }
        });
    },


    onAddIngredientClick: function(button){

        var grid = button.up('grid'),
            store = grid.store,
            maxRecords = 3,
            recordCount = store.count(),
            productDetail = this.getProductDetail();
        
        if (productDetail.getProductId() == ''){
            Ext.MessageBox.alert('BIG NONO', 'Save product before adding ingredients');
            return;
        }

        if (recordCount >= maxRecords) {
            Ext.MessageBox.alert('Max Records', 'You have reached max records.');
            return;
        }

        ingredient = INV.model.ProductBomIngredient.create({
            bom : productDetail.getProductBomId(),
            product : productDetail.getProductId()
        });
        grid.editingPlugin.cancelEdit();
        
        store.insert(recordCount, ingredient);
        grid.editingPlugin.startEditByPosition({row: recordCount, column: 0});

//        store.add(ingredient);
//        grid.editingPlugin.startEdit(store.last(), 0);
    },

    onDeleteIngredientClick: function(view, cell, recordIndex, cellIndex, e){

        view.editingPlugin.cancelEdit();
        //view.store.getAt(recordIndex).data.id = 0; //trigger error
        //notification.msg('Remove', 'the record ' + view.store.getAt(recordIndex).data.name + ' was deleted!');
        view.store.removeAt(recordIndex);
        view.store.sync();
    },

    editIngredient: function(editor, e) {
        var me = this,
            store = this.getProductsStore(),
            view = this.getProductList().getView(),
            lastSelectedId = this.getProductDetail().getProductId(),
            data = e.record.data;

        console.log(e.record.phantom || e.record.dirty, e.record.phantom, e.record.dirty);
        if (!e.record.phantom && !e.record.dirty) return;
        // commit the changes right after editing finished, if product has valid values
        if (data.ingredient!=0 && data.quantity!=0 && (data.bom!=0 || data.product!=0) != 0){
            e.record.save({
                scope:this,
                success: function (ingredient, operation){
                    //reload Products Store to reflect changes
                    store.load({
                        scope   : this,
                        callback: function(records, operation, success){
                            var rowIndex = store.find('id', lastSelectedId);
                            //console.log('LOAD CALLBACK: select lastSelected:',lastSelectedId);
                            view.select(rowIndex);
                        }
                    });
                }
            });
        }

    }
});