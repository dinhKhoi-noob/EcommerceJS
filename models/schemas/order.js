const mongoose = require('mongoose');
const Schema = mongoose.Schema
const OrderSchema = new Schema({
    user:{
        type:Schema.Types.ObjectId,
        required:true,
        req:'users'
    }
});
module.exports = mongoose.model('orders',OrderSchema);