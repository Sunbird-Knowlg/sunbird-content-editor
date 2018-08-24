/**
 * @author Santhosh Vasabhaktula <santhosh@ilimi.in>
 */
window.EkstepEditorAPI = org.ekstep.contenteditor.api
window.EkstepEditor = org.ekstep.contenteditor
EkstepEditor.iService = org.ekstep.services.iService

/* Deprecated variables */
EkstepEditorAPI.apislug = org.ekstep.contenteditor.config.apislug
EkstepEditorAPI.baseURL = org.ekstep.contenteditor.config.baseURL
EkstepEditorAPI.absURL = org.ekstep.contenteditor.config.absURL
EkstepEditorAPI.globalContext = org.ekstep.contenteditor.globalContext
EkstepEditorAPI.getPluginRepo = function () {
	return org.ekstep.contenteditor.config.pluginRepo
}
