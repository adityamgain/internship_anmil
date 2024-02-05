const mongoose= require('mongoose');
const Schema= mongoose.Schema;

const cartSchema= new Schema({
    name:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required:true, 
    },
    description:{
        type:String,
        required:true,
    },
    quantity:{
        type:Number,
    },
    product_type:{
        type:String,
    }
});

module.exports= mongoose.model('cartsproducts',cartSchema);
