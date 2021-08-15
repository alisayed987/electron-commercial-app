const {model,Schema} = require('mongoose')

const goodsSchema = new Schema({
    category:{type:String,require:true},
    item: {type:String,require:true},
    price:{type:Number,require:true},
    quantity:{type:Number,required:true},
    in_menu:{type:Boolean,require:true},
    alarm:{type:Boolean,require:true},
    threshold:Boolean    
});
const goodsModel =  model('Goods',goodsSchema);

module.exports = goodsModel;