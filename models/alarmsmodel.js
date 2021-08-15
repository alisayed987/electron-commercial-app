const {model,Schema} = require('mongoose')

const runOutAlarmsSchema = new Schema({
    category: {type:String,require:true},
    item: {type:String,require:true},
    quantity_left: {type:Number,require:true},
    time_stamp : { type: Date, default: Date.now }
});
const runOutAlarmsModel =  model('RunOutAlarms',runOutAlarmsSchema);

module.exports = runOutAlarmsModel;