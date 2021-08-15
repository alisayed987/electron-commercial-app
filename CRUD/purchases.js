const {ipcMain} = require('electron');
const purchaseModel = require('../models/purchacesmodel');


//save purchase -------------------------------------------------------------------------
ipcMain.on('savePurchase',async(event,recieved)=>{
    var purchase = await purchaseModel.findOne(recieved);
    if(purchase){ event.reply('purchaseDuplicated','purchaseDuplicated')}
    else{
        const saves = new purchaseModel(recieved);
        saves.save()
        .then((d)=>event.reply('','saved successfully'))
        .catch((e)=>{event.reply('','error: couldn\'t save order')});
    }

});
//update purchase -------------------------------------------------------------------------
ipcMain.on('updatePurchase',async(event,recieved)=>{
    var purchase = await purchaseModel.findByIdAndUpdate(recieved._id,
        { 
            purchase: recieved.purchase,
            address: recieved.address,
            phone: recieved.phone
        },{new : true});
    event.reply('updatedPurchase',purchase);
});
//remove purchase -------------------------------------------------------------------------
ipcMain.on('deletepurchase',async(event,recieved)=>{
    var purchase = await purchaseModel.findByIdAndRemove(recieved._id);
    event.reply('deletedPurchase',purchase);
});

//get purchases -------------------------------------------------------------------------
ipcMain.on('loadPurchases',async(event,recieved)=>{
    if(recieved){
        var purchases = await purchaseModel.find();
      event.reply('loadedPurchases',purchases);
}
});
