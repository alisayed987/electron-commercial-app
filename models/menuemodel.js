const {model,Schema} = require('mongoose')

const menueSchema = new Schema({
    category:{type:String,require:true},
    item: {type:String,require:true,unique: true},
    price:{type:Number,require:true},
    quantity:{type:Number,required:true}    
});
const menueModel =  model('Menu',menueSchema);

module.exports = menueModel;