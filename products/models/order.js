const mongoose= require('mongoose');
const Schema= mongoose.Schema;

const orderSchema= new Schema({
    name:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required:true, 
    }
});

module.exports= mongoose.model('orders',orderSchema);