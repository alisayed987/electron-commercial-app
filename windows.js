const electron = require('electron');
const {BrowserWindow,Menu} = electron;
const url = require('url');
const path = require('path');

let mainWindow;
let loginWindow;

const mainMT =[{
    label:'file',
    submenu: [
        {label:'F1',},
        {label : 'exit',click(){app.quit();} }
    ]
},
{
    role: 'reload'
},{
    label:'div',
    click(i,f){
        f.toggleDevTools();
    }
}
]

//--------------------------------------------------------------------------------------------------
function createLoginWindow(){
    loginWindow = new BrowserWindow({
        width: 550,
        height:350,
        title:'Login',
        webPreferences: {nodeIntegration: true,contextIsolation: false}
    });

    //load the html
    loginWindow.loadURL(url.format({        //or loadfile
        pathname: path.join(__dirname,'login.html'),
        protocol:'file',
        slashes:true
    }));

    //override the default menu
    const loginMenu = Menu.buildFromTemplate([{role:'reload'},{
        label:'div',
        click(i,f){
            f.toggleDevTools();
        }}]);
    Menu.setApplicationMenu(loginMenu);
    loginWindow.on('close', function(){
        loginWindow = null;
      });
}

//-------------------------------------------------------------------------------------------------
function createMainWindow(){
    mainWindow = new BrowserWindow({
        title:'Main',
        webPreferences: {nodeIntegration: true},
        frame:false
    });

    //load the html
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname,'main_html.html'),
        protocol:'file',
        slashes:true
    }));

    //override the default menu
    const mainMenu = Menu.buildFromTemplate(mainMT);
    Menu.setApplicationMenu(mainMenu);

    mainWindow.on('close', function(){
        app.quit();
      });
    
}
module.exports ={createLoginWindow,createMainWindow};