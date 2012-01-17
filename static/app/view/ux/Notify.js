Ext.define('INV.view.ux.Notify',{
    alternateClassName: 'notification',
    singleton: true,
    msgCt:'',

     createBox: function (t, s){
        //return ['<div class="msg">',
        //        '<div class="x-box-tl"><div class="x-box-tr"><div class="x-box-tc"></div></div></div>',
        //        '<div class="x-box-ml"><div class="x-box-mr"><div class="x-box-mc"><h3>', t, '</h3>', s, '</div></div></div>',
        //        '<div class="x-box-bl"><div class="x-box-br"><div class="x-box-bc"></div></div></div>',
        //        '</div>'].join('');
          //return '<div class="msg"><h3>' + t + '</h3><p>' + s + '</p></div>';
          return '<div class="msg"><p>' + s + '</p></div>';
    },

    msg : function(title, format){
        if(!this.msgCt){
            this.msgCt = Ext.DomHelper.insertFirst(document.body, {id:'msg-div'}, true);
        }
        var s = Ext.String.format.apply(String, Array.prototype.slice.call(arguments, 1));
        var m = Ext.DomHelper.append(this.msgCt, this.createBox(title, s), true);
        m.hide();
        m.slideIn('t').ghost("t", { delay: 2000, remove: true});
    },

    init : function(){
    }


});