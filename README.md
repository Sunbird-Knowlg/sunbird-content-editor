# Content-Editor

System requirements:  
Node 6.3.1 or above (LTS) (Download from https://nodejs.org/en/)  
Chrome latest  

Setup instructions

    1. Clone Content-Editor and Content-Plugins repo in the same directory
    2. Change to Content-Editor directory (`cd Content-Editor`)
    3. Create a symlink to 'Content-plugins' (`ln -s ../Content-Plugins plugins`)
    3. Run NPM (`npm install`)
    4. Change to app directory and run bower install (`cd app && bower install`)
    5. Start node app from Content-Editor root directory (`node app.js`)  
    6. Open [http://localhost:3000/app/](http://localhost:3000/app/) in Chrome  


Check the chrome console to make sure there are no errors and you are ready!!

Take a look inside plugins(symbolic link) and review couple of existing plugins files and structure of each.
Hint: You can start with Shape plugin.
