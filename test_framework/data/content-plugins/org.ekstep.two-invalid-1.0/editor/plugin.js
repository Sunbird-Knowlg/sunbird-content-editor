// invalid plugin

basePlugin.extend({
	type: 'org.ekstep.two-invalid',
	initialize: function () {},
	newInstance: function () {
		var props = this.convertToFabric(this.attributes)
		this.shapeType = 'rect'
		this.editorObj = new fabric.Rect(props)
		/* istanbul ignore else */
		if (this.editorObj) this.editorObj.setFill(props.fill)
	}
})
