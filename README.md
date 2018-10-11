[![Build Status](https://travis-ci.org/project-sunbird/sunbird-content-editor.svg?branch=master)](https://travis-ci.org/project-sunbird/sunbird-content-editor)
[![npm version](https://badge.fury.io/js/%40project-sunbird%2Fcontent-editor.svg)](https://badge.fury.io/js/%40project-sunbird%2Fcontent-editor)

# Content Editor
	
Content Editor is tool. Which allows you to create ECML(Ekstep content markup language) type content.
## How to configure
 Download content editor 

>Run npm i @project-sunbird/content-editor

**Required configuration**
	
```js
	
window.context = {
{
  "user": {
    "id": " ",
    "name": "Admin",
    "orgIds": [  ],
    "organisations": {}
  },
  "sid": "xxx",
  "contentId": "do_xxx",
  "pdata": {
    "id": "",
    "ver": "1.11.0",
    "pid": ""
  },
  "tags": [],
  "channel": "xxx",
  "framework": "NCFCOPY",
  "ownershipType": [
    "createdBy",
    "createdFor"
  ],
  "uid": "xxx",
  "etags": {
    "app": [],
    "partner": [],
    "dims": []
  }
};
```
```js
window.config = {
  "baseURL": "",
  "apislug": "/action",
  "build_number": "1.11.0.1bb2ae8",
  "pluginRepo": "/content-plugins",
  "aws_s3_urls": [],
  "plugins": [
    {
      "id": "org.ekstep.sunbirdcommonheader",
      "ver": "1.6",
      "type": "plugin"
    }
  ],
  "corePluginsPackaged": true,
  "dispatcher": "local",
  "localDispatcherEndpoint": "",
  "previewURL": "/content/preview/preview.html",
  "modalId": "contentEditor",
  "alertOnUnload": true,
  "headerLogo": "https://dev.open-sunbird.org/assets/images/sunbird_logo.png",
  "showHelp": false,
  "previewConfig": {},
  "pluginsRepoUrl": " ",
  "enableTelemetryValidation": false
}
```
| Property Name | Description | Default Value   |
| --- | --- | --- |
| `user` | It is a `object`, Which should contain the user details(userId, name)  | NA  |
| `sid` | It is a `string`, Session identifier  | NA  |
| `contentId ` | It is a `string`,  content identifier | NA  |
| `pdata ` | It is a `object`,  producer information.It can have producer version, producer Id | NA  |
| `tags ` | It is a `array`,  Encrypted dimension tags passed by respective channels| NA  |
| `channel ` | It is a `string`,  Channel which has produced the event| NA  |
| `framework ` | It is a `string`, example:NCF, NCERT| NA  |
| `baseURL ` | It is a `string`, host url| NA  |
| `corePluginsPackaged ` | It is a `boolean`, Which enables the content-editor to load the plugins from packaged script rather than individual  | true  |
| `pluginRepo ` | It is a `string`, From which location plugins should load  | /plugins  |
| `dispatcher ` | It is a `string`,Where the telemetry should log ex(console, piwik, library) | console |
| `keywordsLimit ` | It is a `number`, Max response keyword size| 500 |
| `plugins ` | It is a `array`, Array of plugins ex:`[{id:"org.sunbird.header",ver:"1.0",type:"plugin"}]`| NA |
| `previewURL ` | It is a `string`, path of the content player preview | NA |
| `showHelp ` | It is a `boolean`, to show the help icon in the editor | false |
| `previewConfig ` | It is a `object`, configurations related to content player preview for more details refer [here](https://github.com/project-sunbird/sunbird-content-player) | false |
| `enableTelemetryValidation ` | It is a `boolean`, To validate the telemetry events which is being generated in editors | false |
| `aws_s3_urls ` | It is a `array`, if the content assets are referring any of aws s3 urls which is denfined in the `aws_s3_urls` then editor will replace those path with `baseURL + assetReverseProxyUrl` | NA |






```js

  openContentEditor() {
    jQuery.fn.iziModal = iziModal;
    jQuery('#content-editor').iziModal({
      title: '',
      iframe: true,
      iframeURL: 'url', // content-editor node_moduels index.html path
      navigateArrows: false,
      fullscreen: false,
      openFullscreen: true,
      closeOnEscape: false,
      overlayClose: false,
      overlay: false,
      overlayColor: '',
      history: false,
      onClosing: () => {
        this._zone.run(() => {
          this.closeModal();
        });
      }
    });
```
	

## How to setup sunbird-content-editor in local
1. Clone the sunbird-content-editor repo from [here](https://github.com/project-sunbird/sunbird-content-editor)
2. Clone the sunbird-content-plugins repo from [here](https://github.com/project-sunbird/sunbird-content-plugins) 
3. Go to the root directory sunbird-content-editor.
4. Run `npm install` to install node moduels.
3. `cd app` and run `bower install` to install bower components
5. Create a symlink to 'sunbird-content-plugins' (`ln -s ../sunbird-content-plugins plugins`)(Linx, mac)
for windows: use `mklink`
6. Run `node app`
7. Open Chrome and visit this link: http://localhost:3000/app/


## ChangeLogs
   For changes logs please refer [here](https://github.com/project-sunbird/sunbird-content-editor/releases) 

  
 >For sunbird-content-editor demo please visit [here](https://staging.open-sunbird.org/workspace/content/create)   


