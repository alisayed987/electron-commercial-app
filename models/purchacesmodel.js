const {model,Schema} = require('mongoose')

const purchaseArraySchema = new Schema({
    category:{type:String,require:true},
    item:{type:String,require:true},
    quantity:{type:Number,require:true},
    price:{type:Number,require:true},
    total:{type:Number,require:true}

},{ _id : false });

const purchaseSchema = new Schema({
    by:{type:String,require:true},
    name: String,
    merchant: String,
    list: [purchaseArraySchema],
    total: {type:Number,require:true},
    paid:{type:Boolean,require:true},
    time_stamp: { type: Date, default: Date.now }
    
});
const purchaseModel =  model('Purchases',purchaseSchema);

module.exports = purchaseModel;