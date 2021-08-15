const {ipcMain} = require('electron');
const orderModel = require('../models/ordermodel.js');


//save order -------------------------------------------------------------------------
ipcMain.on('saveOrder',async(event,recieved)=>{
    const saves = new orderModel(recieved);
    saves.save()
    .then((d)=>event.reply('savedOrder','saved successfully'))
    .catch((e)=>{event.reply('savedOrder','error: couldn\'t save order')});
    

});
//update order -------------------------------------------------------------------------
ipcMain.on('updateOrder',async(event,recieved)=>{
    var order = await orderModel.findByIdAndUpdate(recieved.id,recieved.data,{new : true});
    event.reply('updatedOrder',order);
});
//remove order -------------------------------------------------------------------------
ipcMain.on('deleteOrder',async(event,recieved)=>{
    var order = await orderModel.findByIdAndRemove(recieved);
    event.reply('deletedOrder',order);
});

//get orders -------------------------------------------------------------------------
ipcMain.on('loadOrders',async(event,recieved)=>{
    var order = await orderModel.find().skip((recieved.pageNum-1)*recieved.pageSize).limit(recieved.pageSize);
    event.reply('loadedOrders',JSON.stringify(order));

});
// //get 1 order (price)----------------------------------------------------------------------
// ipcMain.on('getorder',async(event,recieved)=>{
//         var order = await orderModel.find({"order":recieved.str});
//       event.reply('sentPrice',{"order":order,"index":recieved.index});

// });
