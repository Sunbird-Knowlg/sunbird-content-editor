Plugin.extend({
    _type: 'two',
    initPlugin: function(data) {

        var instance = this;
        this._self = new createjs.Container();

        console.log('two plugin');
    }

});