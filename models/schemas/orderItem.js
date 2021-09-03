const mongoose = require('mongoose');
const Schema = mongoose.Schema
const OrderItemSchema = new Schema({
    order:{
        type:Schema.Types.ObjectId,
        required:true,
        req:'orders'
    },
    food:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:'foods'
    },
    quantity:{
        type:Number,
        required:true,
    }
});
module.exports = mongoose.model('orderItems',OrderItemSchema);