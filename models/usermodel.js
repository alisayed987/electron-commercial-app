const {model,Schema} = require('mongoose')

const userSchema = new Schema({
    user: {type:String,require:true},
    pass: {type:String,require:true}
});
const UserModel =  model('Accounts',userSchema);

module.exports = UserModel;