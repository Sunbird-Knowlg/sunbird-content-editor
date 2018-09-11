/**
 *
 * Simple plugin to create geometrical shapes
 * @class shape
 * @extends EkstepEditor.basePlugin
 *
 * @author Harishkumar G <harishg@ilimi.in>
 * @fires object:modified
 */
EkstepEditor.basePlugin.extend({
	type: 'test',
	shapeType: undefined,
	initialize: function () {},
	/**
     *
     *   invoked by framework when instantiating plugin instance.
     *   Creates following shapes: Circle, Rectangle, Round Rectangle
     *   @memberof shape
     *
     */
	newInstance: function () {
		var props = this.convertToFabric(this.attributes)
		this.shapeType = 'rect'
		this.editorObj = new fabric.Rect(props)
	},
	/**
     *
     *   update editorObj properties on config change
     *   @memberof shape
     *
     *
     */
	onConfigChange: function (key, value) {
		switch (key) {
		case 'color':
			this.editorObj.setFill(value)
			this.attributes.fill = value
			break
		case 'radius':
			if (this.attributes.type === 'ellipse') {
				this.editorObj.set({
					'w': value * 2
				})
				this.editorObj.set({
					'h': value * 2
				})
				this.attributes.w = value * 2
				this.attributes.h = value * 2
			}
			this.editorObj.set({
				'rx': value
			})
			this.editorObj.set({
				'ry': value
			})
			this.attributes.radius = value
			break
		}
		EkstepEditorAPI.render()
		EkstepEditorAPI.dispatchEvent('object:modified', {
			target: EkstepEditorAPI.getEditorObject()
		})
	}
})
// # sourceURL=shapeplugin.js
