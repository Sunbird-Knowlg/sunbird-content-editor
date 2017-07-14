org.ekstep.contenteditor.config = {
    baseURL: 'https://dev.ekstep.in',
    apislug: '/api',
    defaultSettings: 'config/editorSettings.json',
    build_number: 'BUILDNUMBER',
    pluginRepo: '/plugins',
    aws_s3_urls: ["https://s3.ap-south-1.amazonaws.com/ekstep-public-dev/", "https://ekstep-public-dev.s3-ap-south-1.amazonaws.com/"],
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
    baseConfigManifest: "config/baseConfigManifest.json",
    plugins: [
        { "id": "org.ekstep.developer", "ver": "1.0", "type": "plugin" },
        { "id": "org.ekstep.ceheader", "ver": "1.0", "type": "plugin" },
        { "id": "org.ekstep.whatsnew", "ver": "1.0", "type": "plugin" }
    ],
    corePluginsPackaged: true,
    dispatcher: "local",
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