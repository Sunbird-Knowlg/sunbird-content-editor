# Content-Editor

[![Build Status](https://travis-ci.org/project-sunbird/sunbird-content-editor.svg?branch=master)](https://travis-ci.org/project-sunbird/sunbird-content-editor)

## Quick links

**Bugs**

- **[User Issues](https://github.com/ekstep/Content-Editor/issues?q=is%3Aopen+is%3Aissue+label%3A%22user+issues%22)**

| P1 to P4  | Severity 1 to 4  |
| --------- | --------- |
| [P1 bugs](https://github.com/ekstep/Content-Editor/issues?utf8=%E2%9C%93&q=is%3Aopen%20is%3Aissue%20label%3Abug%20label%3AP1%20)  | [severity 1 bugs](https://github.com/ekstep/Content-Editor/issues?utf8=%E2%9C%93&q=is%3Aopen%20is%3Aissue%20label%3Abug%20label%3A%22S1%22%20)  |
| [P2 bugs](https://github.com/ekstep/Content-Editor/issues?utf8=%E2%9C%93&q=is%3Aopen%20is%3Aissue%20label%3Abug%20label%3AP2%20)  | [severity 2  bugs](https://github.com/ekstep/Content-Editor/issues?utf8=%E2%9C%93&q=is%3Aopen%20is%3Aissue%20label%3Abug%20label%3A%22S2%22%20)  |
| [P3 bugs](https://github.com/ekstep/Content-Editor/issues?utf8=%E2%9C%93&q=is%3Aopen%20is%3Aissue%20label%3Abug%20label%3AP3%20)  | [severity 3  bugs](https://github.com/ekstep/Content-Editor/issues?utf8=%E2%9C%93&q=is%3Aopen%20is%3Aissue%20label%3Abug%20label%3A%22S3%22%20)  |
| [P4 bugs](https://github.com/ekstep/Content-Editor/issues?utf8=%E2%9C%93&q=is%3Aopen%20is%3Aissue%20label%3Abug%20label%3AP4%20)  | [severity 4  bugs](https://github.com/ekstep/Content-Editor/issues?utf8=%E2%9C%93&q=is%3Aopen%20is%3Aissue%20label%3Abug%20label%3A%22S4%22%20)  |
|[**All bugs**](https://github.com/ekstep/Content-Editor/issues?utf8=%E2%9C%93&q=is%3Aissue%20is%3Aopen%20label%3Abug)|[**Unclassified bugs**](https://github.com/ekstep/Content-Editor/issues?utf8=%E2%9C%93&q=is%3Aissue%20is%3Aopen%20label%3ABug%20-label%3AP1%20-label%3AP2%20-label%3AP3%20-label%3AP4)|

## Setup Instruction

System requirements:  
Node 6.3.1 or above (LTS) (Install via nvm http://www.hostingadvice.com/how-to/install-nodejs-ubuntu-14-04/)  
Chrome latest  

Setup instructions

    1. Clone Content-Editor and Content-Plugins repo in the same directory
    2. Change to Content-Editor directory (`cd Content-Editor`)
    3. Create a symlink to 'Content-plugins' (`ln -s ../Content-Plugins plugins`)
    3. Run NPM (`npm install`)
    4. Change to app directory and run bower install (`cd app && bower install`)
    5. Start node app from Content-Editor root directory (`node app.js`)  

Note: If you are on Windows, step 3 will not work. Use the command below:

```
F:\Ekstep\Content-Editor>mklink /d plugins ..\Content-Plugins
symbolic link created for plugins <<===>> ..\Content-Plugins
```

Open Chrome and visit this link: http://localhost:3000/app/  

Check the chrome console to make sure there are no errors and you are ready!!
Take a look inside plugins(symbolic link) and review couple of existing plugins files and structure of each. 

Hint: You can start with Shape plugin.
