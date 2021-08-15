const {ipcMain} = require('electron');
const alarmModel = require('../models/alarmsmodel');


//save alarm -------------------------------------------------------------------------
ipcMain.on('saveAlarm',async(event,recieved)=>{
    var alarm = await alarmModel.findOne(recieved);
    if(alarm){ event.reply('alarmDuplicated','alarmDuplicated')}
    else{
        const saves = new alarmModel(recieved);
        saves.save()
        .then((d)=>event.reply('','saved successfully'))
        .catch((e)=>{event.reply('','error: couldn\'t save order')});
    }

});
//update alarm -------------------------------------------------------------------------
ipcMain.on('updateAlarm',async(event,recieved)=>{
    var alarm = await alarmModel.findByIdAndUpdate(recieved._id,
        { 
            alarm: recieved.alarm,
            address: recieved.address,
            phone: recieved.phone
        },{new : true});
    event.reply('updatedAlarm',alarm);
});
//remove alarm -------------------------------------------------------------------------
ipcMain.on('deleteAlarm',async(event,recieved)=>{
    var alarm = await alarmModel.findByIdAndRemove(recieved._id);
    event.reply('deletedAlarm',alarm);
});

//get alarms -------------------------------------------------------------------------
ipcMain.on('loadAlarm',async(event,recieved)=>{
    if(recieved){
        var alarms = await alarmModel.find();
      event.reply('loadedAlarms',alarms);
}
});