const mongoose= require('mongoose');
const Schema= mongoose.Schema;

const biddingSchema= new Schema({
    user:{
        type: String, 
        required: true,
    },
    name:{
        type:String,
        required:true,
    },
    bidding:{
        type:Number,
        required:true, 
    },
},
    { timestamps: true }
);

module.exports= mongoose.model('biddingproducts',biddingSchema);