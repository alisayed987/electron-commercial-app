const {model,Schema} = require('mongoose')

const merchantSchema = new Schema({
    merchant: {type:String,require:true},
    balance: {type:Number,require:true}
    
});
const merchantModel =  model('Merchants',merchantSchema);

module.exports = merchantModel;