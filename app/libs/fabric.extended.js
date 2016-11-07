/**
  FabricJs Custom Objects
**/

fabric.LabeledRect = fabric.util.createClass(fabric.Rect, {

  type: 'labeledRect',

  initialize: function(options) {
    options || (options = { });

    this.callSuper('initialize', options);
    this.set('label', options.label || '');
  },

  toObject: function() {
    return fabric.util.object.extend(this.callSuper('toObject'), {
      label: this.get('label')
    });
  },

  _render: function(ctx) {
    this.callSuper('_render', ctx);

    ctx.font = '20px Helvetica';
    ctx.fillStyle = '#663300';
    ctx.fillText(this.label, -this.width/2, -this.height/2 + 20);
  }
});


fabric.LabeledRect.fromObject = function (object, callback) {
    var _enlivenedObjects;
    fabric.util.enlivenObjects(object.objects, function (enlivenedObjects) {
        delete object.objects;
        _enlivenedObjects = enlivenedObjects;
    });
    return new fabric.LabeledRect(_enlivenedObjects, object);
};

fabric.LabeledRect.async = true;
