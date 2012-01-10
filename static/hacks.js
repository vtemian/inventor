Ext.util.Filter.prototype.anyMatch = true;
// Attempt to fetch model from proxy on cache miss
Ext.override(Ext.data.BelongsToAssociation,{
/**
 * @private
 * Returns a getter function to be placed on the owner model's prototype. We cache the loaded instance
 * the first time it is loaded so that subsequent calls to the getter always receive the same reference.
 * @return {Function} The getter function
 */
createGetter: function() {
    var me              = this,
        associatedName  = me.associatedName,
        associatedModel = me.associatedModel,
        foreignKey      = me.foreignKey,
        primaryKey      = me.primaryKey,
        instanceName    = me.instanceName;


    return function(options, scope) {
        options = options || {};

        var model = this,
            foreignKeyId = model.get(foreignKey),
            success,
            instance,
            args;

        if ((foreignKeyId) && (options.reload === true || model[instanceName] === undefined)) {
            instance = Ext.ModelManager.create({}, associatedName);
            instance.set(primaryKey, foreignKeyId);

            if (typeof options == 'function') {
                options = {
                    callback: options,
                    scope: scope || model
                };
            }


            success = options.success;
            options.success = function(rec){
                model[instanceName] = rec;
                if (success) {
                    success.call(this, arguments);
                }
            };

            associatedModel.load(foreignKeyId, options);

            model[instanceName] = instance;
            return instance;
        } else {
            instance = model[instanceName];
            args = [instance];
            scope = scope || model;




            Ext.callback(options, scope, args);
            Ext.callback(options.success, scope, args);
            Ext.callback(options.failure, scope, args);
            Ext.callback(options.callback, scope, args);

            return instance;
        }
    };
}
});
