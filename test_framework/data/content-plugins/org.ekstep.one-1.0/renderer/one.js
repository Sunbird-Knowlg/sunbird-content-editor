Plugin.extend({
    _type: 'one',
    initPlugin: function(data) {

        var instance = this;
        this._self = new createjs.Container();

        console.log('one plugin');
    }

});