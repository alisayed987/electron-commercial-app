const  Mongoose  = require("mongoose");

Mongoose.connect('mongodb://localhost:27017/TradeApp',{ useNewUrlParser: true , useUnifiedTopology: true })               //change
.then(()=>console.log('connected'))
.catch((e)=>console.log('could not connect:',e)); 