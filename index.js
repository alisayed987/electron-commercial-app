const electron = require('electron');
const {app,BrowserWindow,Menu,ipcMain} = electron;
const url = require('url');
const path = require('path');
require('./database.js');
require('./CRUD/account');
require('./CRUD/clients');
require('./CRUD/menue')
require('./CRUD/order')




const UserModel = require('./models/usermodel.js');
const { Console } = require('console');


const token ={user: 'admin',state:'admin'};
let mainWindow;
let loginWindow;


//*************************************************************************************************** */

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
//*************************************************************************************************** */


//--------------------------------------------------------------------------------------------------
ipcMain.on('user_pass',async function(event,user_pass){
    const found =await UserModel.find(user_pass)
    if(found.length != 0 ){
        console.log(found);
        createMainWindow();
        loginWindow.close();
    }else{
        event.reply('err','user_pass_err');
    }
 
});
//--------------------------------------------------------------------------------------------------
ipcMain.on('editWindow',(event,id)=>{
    createEditOrderWindow(id);
});

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
        webPreferences: {nodeIntegration: true,contextIsolation: false}
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
//-------------------------------------------------------------------------------------------------
function createOrderWindow(){
    orderWindow = new BrowserWindow({
        title: 'order',
        webPreferences: {nodeIntegration:true,contextIsolation:false}
    });

    orderWindow.loadURL(url.format({
        pathname: path.join(__dirname,'order.html'),
        protocol: 'file',
        slashes: true
    }));
    
}

//-------------------------------------------------------------------------------------------------
function createOrderTableWindow(){
    orderWindow = new BrowserWindow({
        title: 'orderTable',
        webPreferences: {nodeIntegration:true,contextIsolation:false}
    });

    orderWindow.loadURL(url.format({
        pathname: path.join(__dirname,'ordertable.html'),
        protocol: 'file',
        slashes: true
    }));
    
}
//-------------------------------------------------------------------------------------------------
function createEditOrderWindow(id){
    orderWindow = new BrowserWindow({
        title: 'orderTable',
        webPreferences: {nodeIntegration:true,contextIsolation:false}
        
    });

    orderWindow.loadFile(path.join(__dirname,`editorder.html`), {query: {"id": JSON.stringify(id)}});
}

//-------------------------------------------------------------------------------------------------


app.on('ready',async ()=>{
//    createOrderTableWindow();
//    createOrderWindow();
// createLoginWindow();
createMainWindow();
});