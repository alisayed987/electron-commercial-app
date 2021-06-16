const {ipcMain} = require('electron');
const UserModel = require('../models/usermodel.js');


//save Account -------------------------------------------------------------------------
ipcMain.on('saveAccount',async(event,recieved)=>{
    var account = await UserModel.findOne(recieved);
    if(account){ event.reply('userDuplicated','userDuplicated')}
    else{
        const saves = new UserModel(recieved);
        saves.save()
        .then((d)=>event.reply('','saved successfully'))
        .catch((e)=>{event.reply('','error: couldn\'t save order')});
    }

});
//update Account -------------------------------------------------------------------------
ipcMain.on('updateAccount',async(event,recieved)=>{
    var user = await UserModel.findByIdAndUpdate(recieved._id,
        { 
            user: recieved.user,
            pass: recieved.pass
        },{new : true});
    event.reply('updatedAccount',user);
});
//remove Account -------------------------------------------------------------------------
ipcMain.on('deleteAccount',async(event,recieved)=>{
    var user = await UserModel.findByIdAndRemove(recieved._id);
    event.reply('deletedAccount',user);
});

//get Accounts -------------------------------------------------------------------------
ipcMain.on('loadAccounts',async(event,recieved)=>{
    if(recieved){
        var accounts = await UserModel.find();
      event.reply('loadedAccounts',accounts);
}
});
