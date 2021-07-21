const mongoose = require('mongoose');
const Review=require('./review');
const User=require('./user');
const Schema=mongoose.Schema;


const ImageSchema=new Schema({
    url:String,
    filename:String
});

ImageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload','/upload/w_200');
})

const RecipeSchema=new Schema({
    title:{
        type:String,
        required:true
    },
    authorName:{
        type:String,
        required:true
    },
    images:[ImageSchema],
    description:{
        type:String,
        required:true
    },
    author:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    cookingTips:{
        type:String,
        required:true
    },
    date:String,
    reviews:[{
        type:Schema.Types.ObjectId,
        ref:'Review'
    }],
    category:{
        type:String,
        required:true
    }
});

RecipeSchema.post('findOneAndDelete',async function(doc){
    if(doc){
        await Review.deleteMany({
            _id:{
                $in:doc.reviews
            }
        })
    }
});

module.exports=mongoose.model('Recipe',RecipeSchema);
