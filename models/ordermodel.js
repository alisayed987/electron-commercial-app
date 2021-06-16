const {model,Schema} = require('mongoose')

const orderSchema = new Schema({
    by:{type:String,require:true},
    client: String,
    address: String,
    order: Array,
    total: Number,
    discount:Number,
    afterdiscount:Number,
    in_progress:Boolean 
});
const OrderModel =  model('Order',orderSchema);

module.exports = OrderModel;