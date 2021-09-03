const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const PaymentSchema = new Schema({
    order:{
        type:Schema.Types.ObjectId,
        required:true,
        req:'orders'
    },
    totalAmount:{
        type:Number,
        required:true,
    }
});
module.exports = mongoose.model('payments', PaymentSchema);