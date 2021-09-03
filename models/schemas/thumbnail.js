const mongoose = require('mongoose');
const Schema = mongoose.Schema
const ThumbnailSchema = new Schema({
    url:{
        type:String,
        required:true,
    },
    food:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:'foods'
    }
});
module.exports = mongoose.model('thumbnails',ThumbnailSchema);