const {ipcMain} = require('electron');
const clientModel = require('../models/clientmodel.js');


//save client -------------------------------------------------------------------------
ipcMain.on('saveClient',async(event,recieved)=>{
    var client = await clientModel.findOne(recieved);
    if(client){ event.reply('clientDuplicated','clientDuplicated')}
    else{
        const saves = new clientModel(recieved);
        saves.save()
        .then((d)=>event.reply('','saved successfully'))
        .catch((e)=>{event.reply('','error: couldn\'t save order')});
    }

});
//update client -------------------------------------------------------------------------
ipcMain.on('updateClient',async(event,recieved)=>{
    var client = await clientModel.findByIdAndUpdate(recieved._id,
        { 
            client: recieved.client,
            address: recieved.address,
            phone: recieved.phone
        },{new : true});
    event.reply('updatedclient',client);
});
//remove client -------------------------------------------------------------------------
ipcMain.on('deleteClient',async(event,recieved)=>{
    var client = await clientModel.findByIdAndRemove(recieved._id);
    event.reply('deletedClient',client);
});

//get clients -------------------------------------------------------------------------
ipcMain.on('loadClients',async(event,recieved)=>{
    if(recieved){
        var clients = await clientModel.find();
      event.reply('loadedClients',clients);
}
});
