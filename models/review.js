const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User=require('../models/user')

const reviewSchema = new Schema({
    body: String,
    rating: Number,
    authorName:{
        type:String,
        required:true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model("Review", reviewSchema);