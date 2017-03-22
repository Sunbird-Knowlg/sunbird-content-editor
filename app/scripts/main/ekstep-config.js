EkstepEditor.config = {
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
    plugins: {
        "org.ekstep.developer":"1.0",
    },
    corePluginsPackaged: true,
    dispatcher: "local",
    useProxyForURL: true
}