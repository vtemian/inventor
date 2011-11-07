Ext.Loader.setConfig({enabled:true,disableCaching: false});
//Fix formBind
    Ext.form.Basic.override({
    //override: make the from search in the parent panel for the formBind button
    getBoundItems: function() {
        var boundItems = this._boundItems;

        if (!boundItems || boundItems.getCount() === 0) {
            boundItems = this._boundItems = new Ext.util.MixedCollection();
            boundItems.addAll(this.owner.up('panel').query('[formBind]'));
        }

        return boundItems;
    }
    });
Ext.application({
    name: 'INV',
    autoCreateViewport: true,

    controllers: ['Companies','Products']

});