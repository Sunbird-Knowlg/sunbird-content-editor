//NOTE: only DEV config url 
//TODO: Config URL for QA and prod
EkstepEditor.serviceConfig = {
	"baseServiceURL": "https://dev.ekstep.in",
    "learningServiceBaseUrl": EkstepEditor.configService.baseServiceURL + "/api/learning/",
    "languageServiceBaseUrl": EkstepEditor.configService.baseServiceURL + "/api/language/",
    "assetReverseProxyUrl": EkstepEditor.configService.baseServiceURL + "/assets/public/",
    "previewReverseProxyUrl": "preview/preview.html?webview=true",
    "searchServiceBaseUrl": EkstepEditor.configService.baseServiceURL + "/api/search/",
    "configServiceBaseUrl": EkstepEditor.configService.baseServiceURL + "/api/config/"
};
