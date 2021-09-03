const mongoose = require('mongoose');
const Schema = mongoose.Schema
const FoodSchema = new Schema({
    title:{
        type:String,
        required:true,
    },
    category:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:'category'
    },
    description:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required:true,
    },
    onSale:{
        type:Boolean,
        required:true,
    },
    salePercent:{
        type:Number
    }
});
module.exports = mongoose.model('foods',FoodSchema);