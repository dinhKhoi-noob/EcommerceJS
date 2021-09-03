const mongoose = require('mongoose');
const Schema = mongoose.Schema
const UserSchema = new Schema({
    username:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true,
    },
    balance:{
        type:Number,
        default:0
    },
    totalSaving:{
        type:Number,
        default:0
    }
});
module.exports = mongoose.model('users',UserSchema);