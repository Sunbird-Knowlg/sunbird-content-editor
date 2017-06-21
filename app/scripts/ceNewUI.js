var customizeIcon = "<i class='setting icon'</i>",
    actionsIcon = "<i class='tasks icon'></i>",
    propertiesIcon = "<i class='info icon'></i>",
    customizeOption = "<i class='setting icon'></i> Customise",
    actionsOption = "<i class='tasks icon'></i> Actions",
    propertiesOption = "<i class='info icon'></i> Properties";


$(window).resize(function() {
    if (window.innerWidth < 1024) {
    }
    if (window.innerWidth < 1200) {

        document.getElementById('customizeOptionSideBar').innerHTML = customizeIcon;
        document.getElementById('actionsOptionSideBar').innerHTML = actionsIcon;
        document.getElementById('propertiesOptionSideBar').innerHTML = propertiesIcon;

    } else {
        document.getElementById('customizeOptionSideBar').innerHTML = customizeOption;
        document.getElementById('actionsOptionSideBar').innerHTML = actionsOption;
        document.getElementById('propertiesOptionSideBar').innerHTML = propertiesOption;

    }

});
