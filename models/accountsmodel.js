const {model,Schema} = require('mongoose')

const userSchema = new Schema({
    user: {type:String,require:true},
    password: {type:String,require:true},
    state: {type:String,require:true},
    created_time: { type: Date, default: Date.now }
});
const userModel =  model('Accounts',userSchema);

module.exports = userModel;