const {model,Schema} = require('mongoose')

const clientSchema = new Schema({
    client: {type:String,require:true},
    address: {type:String,require:true},
    phone: {type:String,require:true}
});
const clientModel =  model('Clients',clientSchema);

module.exports = clientModel;