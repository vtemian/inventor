Ext.Loader.setConfig({enabled:true,disableCaching: false});

Ext.application({
    name: 'INV',
    autoCreateViewport: true,

    controllers: ['Companies']

});