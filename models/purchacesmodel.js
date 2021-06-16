const {model,Schema} = require('mongoose')

const purchaseSchema = new Schema({
    type: {type:String,require:true},
    price: {type:String,require:true},
    merchant: {type:Schema.Types.ObjectId,ref:'merchants'}
});
const purchaseModel =  model('Purchases',purchaseSchema);

module.exports = purchaseModel;