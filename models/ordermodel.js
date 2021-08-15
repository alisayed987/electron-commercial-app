const {model,Schema} = require('mongoose')


const orderArraySchema = new Schema({
    category:{type:String,require:true},
    item:{type:String,require:true},
    quantity:{type:Number,require:true},
    price:{type:Number,require:true},
    total:{type:Number,require:true}

},{ _id : false });

const orderSchema = new Schema({
    by:{type:String,require:true},
    name: String,
    client: String,
    address: String,
    order: [orderArraySchema],
    total: {type:Number,require:true},
    discount:Number,
    afterdiscount:Number,
    in_progress:{type:Boolean,require:true},
    paid:{type:Boolean,require:true},
    time_stamp: { type: Date, default: Date.now } 
});
const OrderModel =  model('Order',orderSchema);

module.exports = OrderModel;