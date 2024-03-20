const mongoose= require('mongoose');
const Schema= mongoose.Schema;

const storeSchema= new Schema({
    user:{
        type: String, 
        required: true,
    },
    storeName:{
        type:String,
        required:true,
    },
    logo:{
        type:String,
        required:true,
    },
    type:{
        type:String,
    },
    location: {
        type: {
          type: String, 
          enum: ['Point'], 
        },
        coordinates: {
          type: [Number],
          required: true
        }
      }
});

storeSchema.index({ location: '2dsphere' });

module.exports= mongoose.model('storelists',storeSchema);