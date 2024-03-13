const mongoose= require('mongoose');
const Schema= mongoose.Schema;

const orderSchema= new Schema({
    user:{
        type:String,
        required:true,
    },
    name:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required:true, 
    },
    createdAt: { // Adding a date field to track when the order is created
        type: Date,
        default: Date.now // Automatically set to the current date and time
    }
});

module.exports= mongoose.model('orders',orderSchema);