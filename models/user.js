const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    username:{
        type:String,
        required:true
    },
    displayName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
    },
    googleId:Number,
    facebookId:Number
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);