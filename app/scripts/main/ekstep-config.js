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
        "htext": "org.ekstep.htext",
        "audio": "org.ekstep.audio"
    },
    baseConfigManifest: "config/baseConfigManifest.json",
    plugins: {
        "org.ekstep.telemetry": "1.0",
        "org.ekstep.config": "1.0",
        "org.ekstep.stage": "1.0",
        "org.ekstep.text": "1.0",
        "org.ekstep.shape": "1.0",
        "org.ekstep.image": "1.0",
        "org.ekstep.audio": "1.0",
        "org.ekstep.hotspot": "1.0",
        "org.ekstep.scribblepad": "1.0",
        "org.ekstep.htext": "1.0",
        "org.ekstep.quiz": "1.0",
        "org.ekstep.delete": "1.0",
        "org.ekstep.reorder": "1.0",
        "org.ekstep.copypaste": "1.0",
        "org.ekstep.atpreview": "1.0",
        "org.ekstep.assetbrowser": "1.0",
        "org.ekstep.spectrum": "1.0",
        "org.ekstep.todo": "1.0",
        "org.ekstep.stageconfig": "1.0",
        "org.ekstep.unsupported": "1.0",
        "org.ekstep.viewecml": "1.0",
        "org.ekstep.activitybrowser": "1.0",
        "org.ekstep.download":"1.0",
        "org.ekstep.collaborator":"1.0"
        ,"org.ekstep.developer": "1.0"

    },
    dispatcher: "local"
}