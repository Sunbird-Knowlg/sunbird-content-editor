org.ekstep.contenteditor.config = {
    baseURL: 'https://dev.ekstep.in',
    apislug: '/api',
    build_number: 'BUILDNUMBER',
    pluginRepo: '/plugins',
    aws_s3_urls: ["https://s3.ap-south-1.amazonaws.com/ekstep-public-dev/", "https://ekstep-public-dev.s3-ap-south-1.amazonaws.com/"],
    plugins: [
        { "id": "org.ekstep.developer", "ver": "1.0", "type": "plugin" },
        { "id": "org.ekstep.ceheader", "ver": "1.0", "type": "plugin" },
        { "id": "org.ekstep.whatsnew", "ver": "1.0", "type": "plugin" },
        { "id": "org.ekstep.todo", "ver": "1.0", "type": "plugin" },
        { "id": "org.ekstep.review", "ver": "1.0", "type": "plugin" },
        { "id": "org.ekstep.telemetry", "ver": "1.0", "type": "plugin" },
        { "id": "org.ekstep.config", "ver": "1.0", "type": "plugin" },
        { "id": "org.ekstep.stage", "ver": "1.0", "type": "plugin" },
        { "id": "org.ekstep.text", "ver": "1.0", "type": "plugin" },
        { "id": "org.ekstep.shape", "ver": "1.0", "type": "plugin" },
        { "id": "org.ekstep.image", "ver": "1.0", "type": "plugin" },
        { "id": "org.ekstep.audio", "ver": "1.0", "type": "plugin" },
        { "id": "org.ekstep.hotspot", "ver": "1.0", "type": "plugin" },
        { "id": "org.ekstep.scribblepad", "ver": "1.0", "type": "plugin" },
        { "id": "org.ekstep.quiz", "ver": "1.0", "type": "plugin" },
        { "id": "org.ekstep.preview", "ver": "1.0", "type": "plugin" },
        { "id": "org.ekstep.assetbrowser", "ver": "1.0", "type": "plugin" },
        { "id": "org.ekstep.colorpicker", "ver": "1.0", "type": "plugin" },
        { "id": "org.ekstep.todo", "ver": "1.0", "type": "plugin" },
        { "id": "org.ekstep.stageconfig", "ver": "1.0", "type": "plugin" },
        { "id": "org.ekstep.unsupported", "ver": "1.0", "type": "plugin" },
        { "id": "org.ekstep.viewecml", "ver": "1.0", "type": "plugin" },
        { "id": "org.ekstep.activitybrowser", "ver": "1.0", "type": "plugin" },
        { "id": "org.ekstep.download", "ver": "1.0", "type": "plugin" },
        { "id": "org.ekstep.collaborator", "ver": "1.0", "type": "plugin" },
        { "id": "org.ekstep.readalongbrowser", "ver": "1.0", "type": "plugin" },
        { "id": "org.ekstep.assessmentbrowser", "ver": "1.0", "type": "plugin" },
        { "id": "org.ekstep.wordinfobrowser", "ver": "1.0", "type": "plugin" },
        { "id": "org.ekstep.utils", "ver": "1.0", "type": "plugin" },
        { "id": "org.ekstep.help", "ver": "1.0", "type": "plugin" },
        { "id": "org.ekstep.editorstate", "ver": "1.0", "type": "plugin" },
        { "id": "org.ekstep.developer", "ver": "1.0", "type": "plugin" }
    ],
    corePluginsPackaged: false,
    dispatcher: "local",
    localDispatcherEndpoint: "/app/telemetry",
    previewURL: "/preview/preview.html"
}

org.ekstep.contenteditor.extendedConfig = {
    corePlugins: ["text", "audio", "div", "hotspot", "image", "shape", "scribble", "htext"],
    corePluginMapping: {
        "text": "org.ekstep.text", 
        "image": "org.ekstep.image", 
        "shape": "org.ekstep.shape",
        "stage": "org.ekstep.stage",
        "hotspot": "org.ekstep.hotspot",
        "scribble": "org.ekstep.scribblepad",
        "htext": "org.ekstep.text",
        "audio": "org.ekstep.audio"
    },
    useProxyForURL: false
}

org.ekstep.contenteditor.baseConfigManifest = [{
    "propertyName": "autoplay",
    "title": "Auto play",
    "description": "Set the element's playability",
    "dataType": "boolean",
    "required": true,
    "defaultValue": false
}, {
    "propertyName": "visible",
    "title": "Visible",
    "description": "Set the element's Visibility",
    "dataType": "boolean",
    "required": true,
    "defaultValue": true
}, {
    "propertyName": "stroke",
    "title": "Border Color",
    "description": "Set the border color for element",
    "dataType": "colorpicker",
    "required": true,
    "defaultValue": "rgba(255, 255, 255, 0)"
}]