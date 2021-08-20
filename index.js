const electron = require('electron');
const {app,BrowserWindow,Menu,ipcMain} = electron;
const url = require('url');
const path = require('path');
require('./database.js');
//::::::::::::::::::::::::
require('./CRUD/account');
require('./CRUD/menu')
require('./CRUD/orders')
require('./CRUD/purchases');
require('./CRUD/goods')
require('./CRUD/clients');
require('./CRUD/merchants')
require('./CRUD/alarms')
//::::::::::::::::::::::::

const UserModel = require('./models/accountsmodel');
const clientModel = require('./models/clientsmodel.js');
const OrderModel = require('./models/ordermodel.js');
const { ipcRenderer } = require('electron');


const token ={user: 'admin',state:'admin'};
let mainWindow;
let loginWindow;
let orderWindow;
let ordertableWindow;
let ordereditWindow;


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
        parent: mainWindow,
        fullscreen:true,
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
    ordertableWindow = new BrowserWindow({
        title: 'orderTable',
        parent: mainWindow,
        fullscreen:true,
        webPreferences: {nodeIntegration:true,contextIsolation:false}
    });

    ordertableWindow.loadURL(url.format({
        pathname: path.join(__dirname,'ordertable.html'),
        protocol: 'file',
        slashes: true
    }));
    
}
//-------------------------------------------------------------------------------------------------
function createEditOrderWindow(id){
    ordereditWindow = new BrowserWindow({
        title: 'orderTable',
        parent: mainWindow,
        fullscreen:true,
        webPreferences: {nodeIntegration:true,contextIsolation:false}
        
    });

    ordereditWindow.loadFile(path.join(__dirname,`editorder.html`), {query: {"id": JSON.stringify(id)}});
}

//-------------------------------------------------------------------------------------------------
//=================================================================================================
ipcMain.on('get-query-options',async(event)=>{
    
    var dataobj = {}
    await UserModel.find().distinct("user",(err,res)=>dataobj["by"]=res);
    await clientModel.find().distinct("client",(err,res)=>dataobj["client"]=res);
    await OrderModel.find().distinct("name",(err,res)=>dataobj["name"]=res);
    event.reply("send-query-data",dataobj)
})
// //=================================================================================================
// //=================================================================================================
ipcMain.on('openAccounts',(e)=>{createOrderTableWindow();})
ipcMain.on('addOrder',(e)=>{createOrderWindow();})
// //=================================================================================================
app.on('ready',async ()=>{
// createOrderTableWindow();
// createOrderWindow();
// createLoginWindow();
mainWindow = new BrowserWindow({
    title:'Main',
    fullscreen:true,
    webPreferences: {nodeIntegration: true,contextIsolation: false}
});
createMainWindow();
});