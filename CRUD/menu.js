const {ipcMain} = require('electron');
const menueModel = require('../models/menuemodel.js');


//save Item -------------------------------------------------------------------------
ipcMain.on('saveItem',async(event,recieved)=>{
    var Item = await menueModel.findOne(recieved);
    if(Item){ event.reply('ItemDuplicated','ItemDuplicated')}
    else{
        const saves = new menueModel(recieved);
        saves.save()
        .then((d)=>event.reply('','saved successfully'))
        .catch((e)=>{event.reply('','error: couldn\'t save order')});
    }

});
//update Item -------------------------------------------------------------------------
ipcMain.on('updateItem',async(event,recieved)=>{
    var Item = await menueModel.findByIdAndUpdate(recieved._id,
        { 
            Item: recieved.Item,
            quantity: recieved.quantity,
            price: recieved.price
        },{new : true});
    event.reply('updatedItem',Item);
});
//remove Item -------------------------------------------------------------------------
ipcMain.on('deleteItem',async(event,recieved)=>{
    var Item = await menueModel.findByIdAndRemove(recieved._id);
    event.reply('deletedItem',Item);
});

//get Items -------------------------------------------------------------------------
ipcMain.on('loadItems',async(event,recieved)=>{
    if(recieved){
        var menue = await menueModel.find();
      event.reply('loadedItems',menue);
}
});
//get 1 item (price)----------------------------------------------------------------------
ipcMain.on('getItem',async(event,recieved)=>{
        var item = await menueModel.find({"item":recieved.str});
      event.reply('sentPrice',{"item":item,"index":recieved.index});

});

