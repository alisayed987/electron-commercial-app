const {ipcMain} = require('electron');
const merchantModel = require('../models/merchantsmodel.js');


//save merchant -------------------------------------------------------------------------
ipcMain.on('saveMerchant',async(event,recieved)=>{
    var merchant = await merchantModel.findOne(recieved);
    if(merchant){ event.reply('merchantDuplicated','merchantDuplicated')}
    else{
        const saves = new merchantModel(recieved);
        saves.save()
        .then((d)=>event.reply('','saved successfully'))
        .catch((e)=>{event.reply('','error: couldn\'t save order')});
    }

});
//update merchant -------------------------------------------------------------------------
ipcMain.on('updateMerchant',async(event,recieved)=>{
    var merchant = await merchantModel.findByIdAndUpdate(recieved._id,
        { 
            merchant: recieved.merchant,
            address: recieved.address,
            phone: recieved.phone
        },{new : true});
    event.reply('updatedMerchant',merchant);
});
//remove merchant -------------------------------------------------------------------------
ipcMain.on('deleteMerchant',async(event,recieved)=>{
    var merchant = await merchantModel.findByIdAndRemove(recieved._id);
    event.reply('deletedMerchant',merchant);
});

//get merchants -------------------------------------------------------------------------
ipcMain.on('loadMerchants',async(event,recieved)=>{
    if(recieved){
        var merchants = await merchantModel.find();
      event.reply('loadedMerchants',merchants);
}
});
