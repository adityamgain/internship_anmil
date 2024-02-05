const mongoose= require('mongoose');
const Schema= mongoose.Schema;

const productSchema= new Schema({
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
    },
    imagePath:{
        type:String
    }
});

module.exports= mongoose.model('products',productSchema);
